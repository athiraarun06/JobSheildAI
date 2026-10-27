import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeJobPosting, calculateCosineSimilarity } from '../ml/engine.ts';
import modelArtifacts from '../ml/model_artifacts.json';
import { SAMPLE_JOB_POSTINGS } from '../data/sample_postings.ts';
import { AnalysisResult, JobSubmission } from '../types/jobshield.ts';
import {
  registerUser,
  authenticateUser,
  createSession,
  getUserBySessionToken,
  destroySession,
  createPasswordResetToken,
  resetPasswordWithToken,
  PublicUser
} from './auth.ts';

let ROOT_DIR = process.cwd();
try {
  if (typeof __dirname !== 'undefined') {
    ROOT_DIR = path.resolve(__dirname, '../../');
  } else if (typeof import.meta !== 'undefined' && import.meta && import.meta.url) {
    const filename = fileURLToPath(import.meta.url);
    ROOT_DIR = path.resolve(path.dirname(filename), '../../');
  }
} catch {
  ROOT_DIR = process.cwd();
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'data') : path.join(ROOT_DIR, 'data');
const SEED_DATA_DIR = path.join(ROOT_DIR, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Normalize URL prefix for Vercel Serverless Function proxying
app.use((req, _res, next) => {
  if (req.url.startsWith('/api/api/')) {
    req.url = req.url.substring(4);
  } else if (!req.url.startsWith('/api') && !req.url.startsWith('/api/')) {
    req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
  }
  next();
});

// Memory fallback for serverless execution
let memoryHistory: AnalysisResult[] = [];

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem warning suppressed
}

// Retrieve user history from persistent storage
function loadHistory(): AnalysisResult[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryHistory = parsed.map(item => ({
          ...item,
          userId: item.userId || 'guest'
        }));
        return memoryHistory;
      }
    }

    // Check initial seed file
    const seedFile = path.join(SEED_DATA_DIR, 'history.json');
    if (fs.existsSync(seedFile)) {
      const data = fs.readFileSync(seedFile, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryHistory = parsed.map(item => ({
          ...item,
          userId: item.userId || 'guest'
        }));
        return memoryHistory;
      }
    }
  } catch (err) {
    console.error('Failed reading history file:', err);
  }
  return memoryHistory;
}

function saveHistory(history: AnalysisResult[]): void {
  memoryHistory = history;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write fallback to memory for history:', err);
  }
}

// Helper to extract authenticated user from Authorization header or x-auth-token with serverless resilience
function getAuthUser(req: Request): PublicUser | null {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  if (token) {
    const sessionUser = getUserBySessionToken(token);
    if (sessionUser) return sessionUser;
  }

  // Resilient fallback for serverless execution where memory sessions may be recycled across lambdas
  const rawEmail = req.headers['x-user-email'];
  const email = Array.isArray(rawEmail) ? rawEmail[0] : (typeof rawEmail === 'string' ? rawEmail : '');
  if (email && email.includes('@')) {
    const rawId = req.headers['x-user-id'];
    const id = Array.isArray(rawId) ? rawId[0] : (typeof rawId === 'string' ? rawId : `usr_${email.replace(/[^a-z0-9]/gi, '_')}`);
    const rawName = req.headers['x-user-name'];
    let name = Array.isArray(rawName) ? rawName[0] : (typeof rawName === 'string' ? rawName : '');
    try {
      name = decodeURIComponent(name);
    } catch {}
    return {
      id,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      createdAt: new Date().toISOString()
    };
  }

  return null;
}

// ==========================================
// AUTHENTICATION API ROUTES
// ==========================================

// Sign Up: Create new user account
app.post('/api/auth/signup', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const { user, error } = registerUser(name, email, password);
    if (error || !user) {
      return res.status(400).json({ error: error || 'Failed to create account.' });
    }

    const token = createSession(user.id, false);
    return res.status(201).json({
      user,
      token,
      message: 'Account created successfully.'
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during registration.' });
  }
});

// Log In: Authenticate credentials and return session
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { user, error } = authenticateUser(email, password);
    if (error || !user) {
      return res.status(401).json({ error: error || 'Invalid email or password.' });
    }

    const token = createSession(user.id, Boolean(rememberMe));
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token,
      message: 'Logged in successfully.'
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during login.' });
  }
});

// Current User Me: Verify session token
app.get('/api/auth/me', (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    return res.status(200).json({ user });
  } catch (err: any) {
    console.error('Auth me error:', err);
    return res.status(500).json({ error: 'Failed to verify session.' });
  }
});

// Log Out: Terminate session
app.post('/api/auth/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.headers['x-auth-token']) {
      token = String(req.headers['x-auth-token']).trim();
    }

    if (token) {
      destroySession(token);
    }
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Failed to logout session.' });
  }
});

// Forgot Password: Request reset token
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const { token, error } = createPasswordResetToken(email);
    if (error || !token) {
      return res.status(400).json({ error: error || 'Unable to process reset request.' });
    }

    return res.status(200).json({
      success: true,
      resetToken: token,
      message: 'Password reset instructions have been generated. Use the provided security token to set your new password.'
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Server error processing password reset.' });
  }
});

// Reset Password: Apply new password with token
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    const { success, error } = resetPasswordWithToken(token, newPassword);
    if (error || !success) {
      return res.status(400).json({ error: error || 'Failed to reset password.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password.'
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Server error resetting password.' });
  }
});

// ==========================================
// CORE DATA SCIENCE & ML API ROUTES
// ==========================================

// Health and System Status
app.get('/api/health', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const history = loadHistory();
  const userHistory = user ? history.filter(h => h.userId === user.id) : history;

  return res.status(200).json({
    status: 'online',
    engine: 'TF-IDF + Class-Balanced Logistic Regression (EMSCAD v1.2)',
    dataset: 'Employment Scam Aegean Dataset (17,880 records)',
    modelLoaded: true,
    historyCount: userHistory.length,
    authenticated: Boolean(user),
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    backendType: 'Integrated Node/TS Engine (Vercel Serverless Ready)'
  });
});

// 1. POST /api/analyze - Analyze individual job posting
app.post('/api/analyze', (req: Request, res: Response) => {
  try {
    const submission: JobSubmission = req.body;
    const user = getAuthUser(req);

    if (!submission.title || !submission.title.trim()) {
      return res.status(400).json({ error: 'Job title is required.' });
    }
    if (!submission.company || !submission.company.trim()) {
      return res.status(400).json({ error: 'Company name is required.' });
    }
    if (!submission.description || submission.description.trim().length < 15) {
      return res.status(400).json({ error: 'Job description must be at least 15 characters long.' });
    }

    const history = loadHistory();
    const historicalSubmissions = [
      ...history.map(h => h.submission),
      ...SAMPLE_JOB_POSTINGS.map(s => s.submission)
    ];

    const analysis = analyzeJobPosting(submission, historicalSubmissions);
    analysis.userId = user ? user.id : 'guest';

    history.unshift(analysis);
    saveHistory(history);

    return res.status(200).json(analysis);
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    return res.status(500).json({ error: 'Internal server error while analyzing job posting.' });
  }
});

// 2. GET /api/history - Retrieve user's private analysis history
app.get(['/api/history', '/history'], (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to access analysis history.' });
    }

    const history = loadHistory();
    const userHistory = history.filter(item => 
      item.userId === user.id || 
      item.userId === user.email || 
      (item as any).userEmail === user.email
    );

    return res.status(200).json(userHistory);
  } catch (err: any) {
    console.error('Error in /api/history:', err);
    return res.status(500).json({ error: 'Could not retrieve analysis history.' });
  }
});

// 2b. POST /api/history - Save or sync an analysis record to history
app.post(['/api/history', '/history'], (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const analysis: AnalysisResult = req.body;
    if (!analysis || !analysis.id) {
      return res.status(400).json({ error: 'Valid analysis payload required.' });
    }

    const history = loadHistory();
    analysis.userId = user ? user.id : (analysis.userId || 'guest');
    (analysis as any).userEmail = user ? user.email : undefined;

    // Deduplicate by ID
    const remaining = history.filter(h => h.id !== analysis.id);
    remaining.unshift(analysis);
    saveHistory(remaining);

    return res.status(200).json({ success: true, record: analysis });
  } catch (err: any) {
    console.error('Error in POST /api/history:', err);
    return res.status(500).json({ error: 'Could not save record to history.' });
  }
});

// 2c. GET /api/history/:id - Retrieve specific private analysis report
app.get(['/api/history/:id', '/history/:id'], (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to view this report.' });
    }

    const { id } = req.params;
    const history = loadHistory();
    const record = history.find(item => item.id === id);

    if (!record) {
      return res.status(404).json({ error: 'Analysis report not found.' });
    }

    const isOwner = record.userId === user.id || record.userId === user.email || (record as any).userEmail === user.email;
    if (!isOwner) {
      return res.status(403).json({ error: 'You do not have permission to view this report.' });
    }

    return res.status(200).json(record);
  } catch (err: any) {
    console.error('Error in GET /api/history/:id:', err);
    return res.status(500).json({ error: 'Could not retrieve report.' });
  }
});

// 3. DELETE /api/history/:id - Delete single history entry
app.delete(['/api/history/:id', '/history/:id'], (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to delete history records.' });
    }

    const { id } = req.params;
    let history = loadHistory();

    const target = history.find(item => item.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    const isOwner = target.userId === user.id || target.userId === user.email || (target as any).userEmail === user.email;
    if (!isOwner) {
      return res.status(403).json({ error: 'You do not have permission to delete this record.' });
    }

    history = history.filter(item => item.id !== id);
    saveHistory(history);

    const remainingCount = history.filter(item => 
      item.userId === user.id || 
      item.userId === user.email || 
      (item as any).userEmail === user.email
    ).length;
    return res.status(200).json({ success: true, remainingCount });
  } catch (err: any) {
    console.error('Error in DELETE /api/history/:id:', err);
    return res.status(500).json({ error: 'Could not delete history record.' });
  }
});

// 4. DELETE /api/history - Clear caller's analysis history only
app.delete(['/api/history', '/history'], (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to clear history.' });
    }

    const history = loadHistory();
    const remaining = history.filter(item => 
      item.userId !== user.id && 
      item.userId !== user.email && 
      (item as any).userEmail !== user.email
    );

    saveHistory(remaining);
    return res.status(200).json({
      success: true,
      message: 'Your personal analysis history was cleared successfully.'
    });
  } catch (err: any) {
    console.error('Error clearing history:', err);
    return res.status(500).json({ error: 'Could not clear history.' });
  }
});

// 5. GET /api/model-metrics - Genuine benchmark and evaluation metrics
app.get('/api/model-metrics', (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      modelVersion: modelArtifacts.modelVersion,
      dataset: modelArtifacts.dataset,
      metrics: modelArtifacts.metrics,
      confusionMatrix: modelArtifacts.confusionMatrix,
      topScamNgrams: modelArtifacts.topScamNgrams,
      topLegitNgrams: modelArtifacts.topLegitNgrams
    });
  } catch (err: any) {
    console.error('Error in /api/model-metrics:', err);
    return res.status(500).json({ error: 'Could not fetch model metrics.' });
  }
});

// 6. GET /api/dashboard - Dataset statistics & user history stats
app.get('/api/dashboard', (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const history = loadHistory();

    const userHistory = user
      ? history.filter(h => h.userId === user.id)
      : [];

    const liveCount = userHistory.length;
    const liveFraud = userHistory.filter(h => h.riskCategory === 'high' || h.riskCategory === 'very_high').length;
    const liveLegit = userHistory.filter(h => h.riskCategory === 'low').length;
    const liveModerate = userHistory.filter(h => h.riskCategory === 'moderate').length;

    const riskCategoryCounts = {
      low: liveLegit,
      moderate: liveModerate,
      high: userHistory.filter(h => h.riskCategory === 'high').length,
      very_high: userHistory.filter(h => h.riskCategory === 'very_high').length
    };

    const warningCounts: Record<string, number> = {};
    for (const item of userHistory) {
      for (const sign of item.warningSigns) {
        warningCounts[sign.title] = (warningCounts[sign.title] || 0) + 1;
      }
    }

    const liveWarningFrequencies = Object.entries(warningCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: liveCount > 0 ? Math.round((count / liveCount) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      dataset: {
        datasetName: modelArtifacts.dataset.name,
        source: modelArtifacts.dataset.source,
        totalRecords: modelArtifacts.dataset.totalRecords,
        fraudulentRecords: modelArtifacts.dataset.fraudulentRecords,
        legitimateRecords: modelArtifacts.dataset.legitimateRecords,
        fraudulentPercentage: modelArtifacts.dataset.fraudulentPercentage,
        telecommutingFraudRate: modelArtifacts.telecommutingFraudRate,
        missingLogoFraudRate: modelArtifacts.missingLogoFraudRate,
        hasQuestionsFraudRate: modelArtifacts.hasQuestionsFraudRate,
        salaryDistribution: modelArtifacts.salaryDistribution,
        datasetWarningFrequencies: modelArtifacts.warningSignFrequencies
      },
      evaluation: {
        testSampleSize: 3576,
        confusionMatrix: modelArtifacts.confusionMatrix,
        metrics: modelArtifacts.metrics
      },
      liveSubmissions: {
        total: liveCount,
        fraudulent: liveFraud,
        legitimate: liveLegit,
        moderate: liveModerate,
        fraudPercentage: liveCount > 0 ? Math.round((liveFraud / liveCount) * 100) : 0,
        riskCategoryCounts,
        liveWarningFrequencies
      }
    });
  } catch (err: any) {
    console.error('Error in /api/dashboard:', err);
    return res.status(500).json({ error: 'Could not load dashboard statistics.' });
  }
});

// 7. POST /api/patterns - Cross-posting scam pattern intelligence
app.post('/api/patterns', (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const includeDemo = req.body?.includeDemo !== false;
    const history = loadHistory();

    const userHistory = user
      ? history.filter(h => h.userId === user.id)
      : [];

    let targetPool: AnalysisResult[] = [...userHistory];

    if (includeDemo) {
      const rawSubmissions = SAMPLE_JOB_POSTINGS.map(s => s.submission);
      const demoAnalyses = SAMPLE_JOB_POSTINGS.map(sample =>
        analyzeJobPosting(sample.submission, rawSubmissions)
      );
      targetPool = [...userHistory, ...demoAnalyses];
    }

    if (targetPool.length < 2) {
      return res.status(200).json({
        totalHistoryAnalyzed: userHistory.length,
        isUsingDemoData: false,
        clustersDetected: 0,
        clusters: [],
        message: 'At least 2 job postings are required to identify cross-posting patterns. Analyze multiple postings or enable benchmark sample comparison.'
      });
    }

    const clusters: Array<{
      patternType: string;
      description: string;
      confidence: string;
      matchedPostings: Array<{ id: string; title: string; company: string; riskScore: number; isDemo?: boolean }>;
      evidence: string;
    }> = [];

    for (let i = 0; i < targetPool.length; i++) {
      for (let j = i + 1; j < targetPool.length; j++) {
        const p1 = targetPool[i];
        const p2 = targetPool[j];
        if (p1.id === p2.id) continue;

        const text1 = `${p1.submission.title} ${p1.submission.description}`;
        const text2 = `${p2.submission.title} ${p2.submission.description}`;
        const sim = calculateCosineSimilarity(text1, text2);

        if (sim >= 0.55 && p1.submission.company.toLowerCase() !== p2.submission.company.toLowerCase()) {
          clusters.push({
            patternType: 'Cross-Company Template Cloning',
            description: `Different entity names using near-identical job description text (${Math.round(sim * 100)}% cosine match).`,
            confidence: sim >= 0.75 ? 'Very High' : 'High',
            matchedPostings: [
              {
                id: p1.id,
                title: p1.submission.title,
                company: p1.submission.company,
                riskScore: p1.riskScore,
                isDemo: p1.id.startsWith('sample-')
              },
              {
                id: p2.id,
                title: p2.submission.title,
                company: p2.submission.company,
                riskScore: p2.riskScore,
                isDemo: p2.id.startsWith('sample-')
              }
            ],
            evidence: `Shared phrasing and structure across "${p1.submission.company}" and "${p2.submission.company}". Suggests potential template reuse or syndicate recruitment cloning.`
          });
        }
      }
    }

    const emailGroups: Record<string, typeof targetPool> = {};
    for (const h of targetPool) {
      if (h.submission.contactEmail) {
        const email = h.submission.contactEmail.toLowerCase().trim();
        emailGroups[email] = emailGroups[email] || [];
        emailGroups[email].push(h);
      }
    }

    for (const [email, postings] of Object.entries(emailGroups)) {
      if (postings.length > 1) {
        const companies = new Set(postings.map(p => p.submission.company));
        if (companies.size > 1) {
          clusters.push({
            patternType: 'Shared Contact Email Across Disparate Companies',
            description: `The contact address "${email}" was used across ${companies.size} distinct company names.`,
            confidence: 'Critical',
            matchedPostings: postings.map(p => ({
              id: p.id,
              title: p.submission.title,
              company: p.submission.company,
              riskScore: p.riskScore,
              isDemo: p.id.startsWith('sample-')
            })),
            evidence: `Multiple different employers (${Array.from(companies).join(', ')}) route inquiries to the identical email mailbox.`
          });
        }
      }
    }

    const checkFeePostings = targetPool.filter(h =>
      h.warningSigns.some(w => w.id === 'sign-payment' || w.id === 'sign-scam-trope')
    );

    if (checkFeePostings.length >= 2) {
      clusters.push({
        patternType: 'Advance-Fee / Equipment Kit & UPI Deposit Mechanics',
        description: `${checkFeePostings.length} postings instruct candidates to transfer security deposits, wire funds, or pay fees prior to onboarding.`,
        confidence: 'Critical',
        matchedPostings: checkFeePostings.map(p => ({
          id: p.id,
          title: p.submission.title,
          company: p.submission.company,
          riskScore: p.riskScore,
          isDemo: p.id.startsWith('sample-')
        })),
        evidence: 'Consistent advance-fee mechanics targeting applicants under the guise of home office equipment kits, registration charges, or merchant task deposits.'
      });
    }

    return res.status(200).json({
      totalHistoryAnalyzed: targetPool.length,
      userPostingsCount: userHistory.length,
      isUsingDemoData: includeDemo,
      clustersDetected: clusters.length,
      clusters
    });
  } catch (err: any) {
    console.error('Error in /api/patterns:', err);
    return res.status(500).json({ error: 'Could not run pattern intelligence analysis.' });
  }
});

// 8. GET /api/samples - Preloaded authentic benchmark samples
app.get('/api/samples', (_req: Request, res: Response) => {
  return res.status(200).json(SAMPLE_JOB_POSTINGS);
});

export default app;
