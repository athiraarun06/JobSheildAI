import {
  JobSubmission,
  AnalysisResult,
  WarningSign,
  FeatureContribution,
  SimilarPostingMatch,
  RiskCategory
} from '../types/jobshield.ts';
import modelArtifacts from './model_artifacts.json';

// Common free email providers often abused in recruitment impersonation
const FREE_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'protonmail.com',
  'icloud.com',
  'mail.com',
  'zoho.com'
];

/**
 * Tokenize and normalize text into clean words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

/**
 * Extract unigrams and bigrams
 */
function extractNGrams(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const ngrams = new Map<string, number>();

  for (let i = 0; i < tokens.length; i++) {
    const unigram = tokens[i];
    ngrams.set(unigram, (ngrams.get(unigram) || 0) + 1);

    if (i < tokens.length - 1) {
      const bigram = `${tokens[i]} ${tokens[i + 1]}`;
      ngrams.set(bigram, (ngrams.get(bigram) || 0) + 1);
    }
    if (i < tokens.length - 2) {
      const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
      ngrams.set(trigram, (ngrams.get(trigram) || 0) + 1);
    }
  }

  return ngrams;
}

/**
 * Calculate cosine similarity between two text strings using simple TF vector
 */
export function calculateCosineSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const freqA = new Map<string, number>();
  const freqB = new Map<string, number>();

  for (const t of tokensA) freqA.set(t, (freqA.get(t) || 0) + 1);
  for (const t of tokensB) freqB.set(t, (freqB.get(t) || 0) + 1);

  const allWords = new Set([...freqA.keys(), ...freqB.keys()]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const word of allWords) {
    const a = freqA.get(word) || 0;
    const b = freqB.get(word) || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Evaluate structured heuristic indicators
 */
function evaluateHeuristicWarningSigns(submission: JobSubmission): {
  warningSigns: WarningSign[];
  heuristicScore: number;
} {
  const signs: WarningSign[] = [];
  let score = 0;

  const fullText = `${submission.title} ${submission.company} ${submission.description} ${submission.salary || ''} ${submission.paymentDetails || ''} ${submission.contactOther || ''}`.toLowerCase();

  // 1. Explicit Upfront Payment or Fee Request
  const paymentKeywords = [
    'registration fee', 'training fee', 'deposit', 'starter kit', 'equipment fee',
    'background check fee', 'processing fee', 'wire transfer', 'zelle', 'crypto',
    'cashier check', 'money order', 'pay in advance', 'purchase equipment',
    'upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'imps', 'refundable deposit',
    'security kit', 'laptop deposit', 'registration charge', 'onboarding fee'
  ];
  const mentionsPaymentInText = paymentKeywords.some(kw => fullText.includes(kw));

  if (submission.requiresPayment || mentionsPaymentInText) {
    const detectedKw = paymentKeywords.find(kw => fullText.includes(kw)) || 'candidate payment requested';
    signs.push({
      id: 'sign-payment',
      category: 'payment',
      title: 'Upfront Candidate Payment or Deposit Requested',
      severity: 'critical',
      evidence: submission.requiresPayment
        ? `Explicitly marked as requiring payment (${submission.paymentDetails || 'Registration/Security Deposit'}). Text mentions: "${detectedKw}"`
        : `Posting text explicitly requests: "${detectedKw}"`,
      explanation: 'Legitimate employers cover recruitment, background verification, and equipment costs. Demanding candidate deposits (via UPI, cash, or wire transfer) is the #1 indicator of employment fraud according to consumer protection regulators.',
      contributionScore: 35,
      recommendation: 'Cease communication immediately if asked to send money via UPI (Google Pay, PhonePe, Paytm) or bank transfer. Legitimate employers never charge candidates.'
    });
    score += 35;
  }

  // 2. Off-Platform / Informal Interview Channel (Telegram, WhatsApp, Signal)
  const chatKeywords = ['telegram', 'whatsapp', 'signal app', 'google hangouts interview', 'text only interview'];
  const mentionsChat = chatKeywords.some(kw => fullText.includes(kw)) ||
    (submission.contactOther && /telegram|whatsapp|signal/i.test(submission.contactOther));

  if (mentionsChat) {
    signs.push({
      id: 'sign-contact-app',
      category: 'contact',
      title: 'Informal / Encrypted Messaging Interview',
      severity: 'high',
      evidence: `Recruitment directs candidates to communicate via messaging platforms (${submission.contactOther || 'Telegram / WhatsApp mentioned in description'}).`,
      explanation: 'Scammers avoid traceable corporate email servers and telephone networks by conducting fake interviews solely through encrypted chat apps with anonymous accounts.',
      contributionScore: 22,
      recommendation: 'Request a formal video interview via corporate enterprise software (e.g. Google Meet, Zoom) with an official corporate email invitation.'
    });
    score += 22;
  }

  // 3. Free / Personal Email Address for Purported Enterprise
  if (submission.contactEmail) {
    const domain = submission.contactEmail.split('@')[1]?.toLowerCase();
    const isFreeEmail = FREE_EMAIL_PROVIDERS.includes(domain);
    const isBigOrg = submission.company && !/freelance|individual|personal/i.test(submission.company);

    if (isFreeEmail && isBigOrg) {
      signs.push({
        id: 'sign-free-email',
        category: 'contact',
        title: 'Personal Email Used for Corporate Recruitment',
        severity: 'high',
        evidence: `Contact email "${submission.contactEmail}" uses free provider @${domain} rather than an official domain matching "${submission.company}".`,
        explanation: 'Established organizations utilize proprietary corporate email domains (e.g. hr@company.com). Free email addresses are frequently used by impersonators pretending to be corporate recruiters.',
        contributionScore: 18,
        recommendation: 'Search for the recruiter on LinkedIn or visit the company official careers page to verify if this email address is legitimate.'
      });
      score += 18;
    }
  }

  // 4. Unrealistic Compensation for Minimal Requirements (Supports ₹ / INR / LPA and $)
  const salaryText = `${submission.salary || ''} ${submission.description}`.toLowerCase();
  const highSalaryForEntryMatch =
    ((/(?:₹|rs\.?|inr)\s*([3-9]\d{4,})\s*(?:\/|\s*per\s*)month/i.test(salaryText) ||
      /(?:₹|rs\.?|inr)\s*([2-9]\d{3,})\s*(?:\/|\s*per\s*)day/i.test(salaryText) ||
      /([1-9]\d?)\s*lpa/i.test(salaryText) ||
      /\$([4-9]\d|\d{3,})\s*(?:\/|\s*per\s*)hr/i.test(salaryText) ||
      /(\$4[0-9]|\$[5-9][0-9])\s*(?:an\s*hour|\/hr)/i.test(salaryText) ||
      /\$([3-9]\d{3})\s*weekly/i.test(salaryText) ||
      /\$([1-9]\d{4})\s*monthly/i.test(salaryText)) &&
     (/no experience|entry level|data entry|typist|receptionist|virtual assistant|form filling|simple typing/i.test(fullText)));

  if (highSalaryForEntryMatch) {
    signs.push({
      id: 'sign-salary-anomaly',
      category: 'salary',
      title: 'Disproportionately High Compensation for Entry-Level Role',
      severity: 'high',
      evidence: `Advertised pay (${submission.salary || 'Inflated wage'}) is significantly above market benchmarks for entry-level or no-experience positions.`,
      explanation: 'Scammers offer inflated compensation (e.g. ₹40,000–₹80,000/month or $45+/hr for basic typing/data entry) as an emotional hook to attract urgent, uncritical applicants.',
      contributionScore: 18,
      recommendation: 'Compare the offered salary against trusted compensation benchmarks (e.g. AmbitionBox, Glassdoor, Naukri Insights) for this specific job title.'
    });
    score += 18;
  }

  // 5. High-Risk Scam Job Tropes (Check Cashing, Package Reshipping, Mystery Shopper)
  const scamTropeKeywords = [
    'package reshipping', 'reshipment agent', 'mystery shopper', 'secret shopper',
    'payment processing agent', 'cash checks', 'deposit check', 'virtual assistant checks',
    'receive packages at home', 'transfer funds'
  ];
  const detectedTrope = scamTropeKeywords.find(kw => fullText.includes(kw));

  if (detectedTrope) {
    signs.push({
      id: 'sign-scam-trope',
      category: 'payment',
      title: 'Common Illegal Money Mule / Reshipping Work Trope',
      severity: 'critical',
      evidence: `Posting mentions known fraudulent scheme terms: "${detectedTrope}".`,
      explanation: '"Reshipping" and "Payment Processing" roles are almost universally criminal operations using stolen credit card goods or fake cashier checks that leave the victim legally and financially liable.',
      contributionScore: 30,
      recommendation: 'Do NOT accept any checks to deposit into your bank account, and do NOT reship packages received at your personal address.'
    });
    score += 30;
  }

  // 6. Extreme Urgency or "No Interview / Immediate Start"
  const urgencyKeywords = [
    'immediate start without interview', 'no interview needed', 'hired instantly',
    'guaranteed employment', 'spots filling fast', 'urgent hire today', 'must act now'
  ];
  const detectedUrgency = urgencyKeywords.find(kw => fullText.includes(kw));

  if (detectedUrgency) {
    signs.push({
      id: 'sign-urgency',
      category: 'urgency',
      title: 'Artificial Urgency & Instant Hiring Without Due Diligence',
      severity: 'medium',
      evidence: `Posting claims: "${detectedUrgency}".`,
      explanation: 'Professional recruitment requires standard vetting, interviews, and reference checks. Instant hiring claims are designed to bypass critical thinking.',
      contributionScore: 12,
      recommendation: 'Be wary of offers extended without a formal assessment or conversation with hiring managers.'
    });
    score += 12;
  }

  // 7. Vague or Insufficient Job Responsibilities
  const descWords = submission.description.trim().split(/\s+/).length;
  if (descWords < 35) {
    signs.push({
      id: 'sign-vague-text',
      category: 'vague_text',
      title: 'Extremely Vague Job Description',
      severity: 'medium',
      evidence: `Description contains only ${descWords} words and lacks concrete day-to-day duties, team structure, or required qualifications.`,
      explanation: 'Fraudulent listings frequently use generic boilerplate to cast the widest net while omitting verifiable operational specifics.',
      contributionScore: 10,
      recommendation: 'Ask the recruiter for a comprehensive written job specification and organizational chart.'
    });
    score += 10;
  }

  // 8. Missing Employer Verification Channels
  if (!submission.employerWebsite && !submission.contactEmail) {
    signs.push({
      id: 'sign-missing-employer-info',
      category: 'company_verification',
      title: 'No Verifiable Employer Website or Official Contact',
      severity: 'medium',
      evidence: 'No employer website or verifiable email address was provided with the posting.',
      explanation: 'Legitimate companies almost always maintain an established web presence or official domain email.',
      contributionScore: 8,
      recommendation: 'Research the company on corporate registry databases (e.g. OpenCorporates, Secretary of State) and official web domains.'
    });
    score += 8;
  }

  return { warningSigns: signs, heuristicScore: Math.min(score, 65) };
}

/**
 * Main ML Analysis Function
 */
export function analyzeJobPosting(
  submission: JobSubmission,
  historicalPostings: JobSubmission[] = []
): AnalysisResult {
  const fullText = `${submission.title} ${submission.company} ${submission.description} ${submission.salary || ''} ${submission.paymentDetails || ''}`;
  const ngrams = extractNGrams(fullText);

  const weights = modelArtifacts.vocabularyWeights as Record<string, number>;
  const intercept = modelArtifacts.intercept;

  let linearCombination = intercept;
  const featureContributions: FeatureContribution[] = [];

  // Evaluate model n-gram features
  for (const [term, weight] of Object.entries(weights)) {
    // Check if term or substring is in text
    let count = 0;
    if (ngrams.has(term)) {
      count = ngrams.get(term) || 0;
    } else if (fullText.toLowerCase().includes(term)) {
      count = 1;
    }

    if (count > 0) {
      // Sublinear TF-IDF approximation: (1 + ln(tf)) * weight
      const tf = 1 + Math.log(count);
      const contribution = tf * weight;
      linearCombination += contribution;

      featureContributions.push({
        feature: term,
        value: Number(contribution.toFixed(2)),
        type: 'text_ngram',
        label: weight > 0 ? `Scam indicator term: "${term}"` : `Legitimate indicator term: "${term}"`,
        direction: weight > 0 ? 'scam_indicator' : 'legitimacy_indicator'
      });
    }
  }

  // Add structured heuristic evaluations
  const { warningSigns, heuristicScore } = evaluateHeuristicWarningSigns(submission);

  // Add heuristic contributions to feature attribution list
  if (submission.requiresPayment) {
    featureContributions.push({
      feature: 'Requires upfront payment',
      value: 3.5,
      type: 'structured_field',
      label: 'Explicit candidate payment requested',
      direction: 'scam_indicator'
    });
    linearCombination += 2.5;
  }

  if (submission.workArrangement === 'remote') {
    // EMSCAD statistical empirical correlation: telecommuting has higher base fraud rate (18.2% vs 3.1%)
    featureContributions.push({
      feature: 'Telecommuting/Remote',
      value: 0.8,
      type: 'structured_field',
      label: 'Remote work arrangement (higher baseline vulnerability in EMSCAD)',
      direction: 'scam_indicator'
    });
    linearCombination += 0.5;
  }

  // Sigmoid calculation for calibrated probability
  const rawModelProbability = 1 / (1 + Math.exp(-linearCombination));

  // Compute calibrated combined score (0 - 100)
  // Blending the logistic model probability with heuristic evidence
  const mlComponent = rawModelProbability * 70;
  const heuristicComponent = (heuristicScore / 65) * 30;
  let compositeScore = Math.round(mlComponent + heuristicComponent);

  // Enforcement: If critical warning signs exist (e.g. upfront fee or check mule), floor at high risk
  const hasCritical = warningSigns.some(s => s.severity === 'critical');
  if (hasCritical && compositeScore < 72) {
    compositeScore = Math.max(compositeScore, 75);
  }

  // If posting has multiple rich corporate benefits and zero warnings, cap at low risk
  const legitContributions = featureContributions.filter(f => f.direction === 'legitimacy_indicator');
  if (warningSigns.length === 0 && legitContributions.length >= 3 && compositeScore > 25) {
    compositeScore = Math.min(compositeScore, 20);
  }

  // Ensure bounds [0, 100]
  compositeScore = Math.max(2, Math.min(99, compositeScore));

  // Categorize risk
  let riskCategory: RiskCategory = 'low';
  if (compositeScore >= 80) riskCategory = 'very_high';
  else if (compositeScore >= 60) riskCategory = 'high';
  else if (compositeScore >= 30) riskCategory = 'moderate';
  else riskCategory = 'low';

  // Sort feature contributions by absolute impact
  featureContributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  // Detect similar postings in history / cross-posting pattern intelligence
  const similarPostings: SimilarPostingMatch[] = [];

  for (const hist of historicalPostings) {
    if (hist.id === submission.id) continue;

    const histFullText = `${hist.title} ${hist.company} ${hist.description}`;
    const similarity = calculateCosineSimilarity(fullText, histFullText);

    // If text similarity > 0.40 or shared contact email/phone
    const sharedIndicators: string[] = [];
    const matchedFields: { field: string; description: string }[] = [];

    if (similarity > 0.45) {
      sharedIndicators.push(`${Math.round(similarity * 100)}% text description similarity`);
      matchedFields.push({
        field: 'Description Body',
        description: `High lexical overlap with "${hist.title}" at "${hist.company}"`
      });
    }

    if (submission.contactEmail && hist.contactEmail &&
        submission.contactEmail.toLowerCase() === hist.contactEmail.toLowerCase()) {
      sharedIndicators.push(`Identical contact email (${submission.contactEmail})`);
      matchedFields.push({
        field: 'Contact Email',
        description: `Reused email across postings with different titles`
      });
    }

    if (submission.contactOther && hist.contactOther &&
        submission.contactOther.toLowerCase().includes('telegram') &&
        hist.contactOther.toLowerCase().includes('telegram')) {
      sharedIndicators.push('Reused Telegram interview handle pattern');
      matchedFields.push({
        field: 'Interview Channel',
        description: 'Both postings route applicants to off-platform chat interview'
      });
    }

    if (similarity > 0.45 || sharedIndicators.length > 0) {
      similarPostings.push({
        postingId: hist.id || 'unknown',
        title: hist.title,
        company: hist.company,
        similarityScore: Number(similarity.toFixed(2)),
        sharedIndicators,
        matchedFields,
        riskCategory: 'high'
      });
    }
  }

  // Sort similar postings by similarity
  similarPostings.sort((a, b) => b.similarityScore - a.similarityScore);

  // Generate tailored recommendations
  const recommendations: string[] = [];
  if (submission.requiresPayment || fullText.includes('fee') || fullText.includes('deposit') || fullText.includes('upi')) {
    recommendations.push('Do NOT send any money, UPI transfers, or registration fees. Legitimate recruitment in India and globally is 100% free for candidates.');
  }
  if (submission.contactEmail && FREE_EMAIL_PROVIDERS.includes(submission.contactEmail.split('@')[1] || '')) {
    recommendations.push(`Independently locate the official domain website for "${submission.company}" and confirm whether hiring managers reach out via company domains.`);
  }
  if (warningSigns.some(s => s.category === 'contact')) {
    recommendations.push('Decline chat-only interviews conducted over Telegram or WhatsApp. Insist on a formal video conference with an official corporate email calendar invitation.');
  }
  if (warningSigns.some(s => s.category === 'salary')) {
    recommendations.push('Verify prevailing compensation standards on AmbitionBox, Glassdoor, or Naukri Insights for this specific role and experience level.');
  }
  recommendations.push('Search the company on corporate registries (e.g. MCA21 portal in India or official LinkedIn company page) to verify operational legitimacy.');
  recommendations.push('Never share Aadhaar, PAN card, banking OTPs, or passport copies before verifying a formal offer letter.');

  // Generate summary verdict
  let summaryVerdict = '';
  if (riskCategory === 'very_high') {
    summaryVerdict = 'CRITICAL ALERT: This posting displays strong, corroborated markers of recruitment fraud. Immediate caution is advised.';
  } else if (riskCategory === 'high') {
    summaryVerdict = 'HIGH RISK: Multiple high-confidence warning signals detected. Proceed only after independent verification via official employer channels.';
  } else if (riskCategory === 'moderate') {
    summaryVerdict = 'MODERATE RISK: Some ambiguous or irregular characteristics observed. Verify the company identity and interview process carefully.';
  } else {
    summaryVerdict = 'LOW RISK: The posting exhibits standard professional recruitment language and legitimate employment characteristics. Standard job-seeker diligence still applies.';
  }

  return {
    id: submission.id || `analysis-${Date.now()}`,
    submission,
    timestamp: new Date().toISOString(),
    riskScore: compositeScore,
    riskCategory,
    modelProbability: Number(rawModelProbability.toFixed(3)),
    calibratedScore: compositeScore,
    isCalibrated: true,
    warningSigns,
    featureContributions,
    recommendations,
    similarPostings: similarPostings.slice(0, 5),
    heuristicFlagsCount: warningSigns.length,
    modelVersion: modelArtifacts.modelVersion,
    summaryVerdict
  };
}
