import { JobSubmission } from '../types/jobshield.ts';

export const SAMPLE_JOB_POSTINGS: {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  expectedCategory: string;
  submission: JobSubmission;
}[] = [
  {
    id: 'sample-1',
    name: 'Data Entry Typist - ₹45,000/pm & Telegram Interview',
    badge: 'Critical Scam',
    badgeColor: 'rose',
    expectedCategory: 'Very High Risk (85-98)',
    submission: {
      id: 'sample-post-001',
      title: 'Remote Data Entry Clerk & Back-Office Typist',
      company: 'Apex Logistics Solutions India Pvt Ltd',
      description: `Urgently hiring for immediate start across India! We are looking for motivated remote data entry operators. No previous experience or degree required. You will be entering basic customer invoices, courier receipts, and shipping bills into our online portal.

Work from home anywhere in India with high earning potential. Flexible timings: 2 to 4 hours per day.

Eligibility:
- Must possess an Android/iOS smartphone or laptop.
- Basic English typing skills.
- Age 18 years and above.

Interview process: Due to heavy candidate volume, no formal video interview is needed. Immediate verification is conducted via Telegram text messenger with our Senior HR Manager (@ApexRecruitmentDirector).

Mandatory Onboarding Notice: Selected candidates must deposit a refundable equipment and software license security fee of ₹8,500 via UPI (Google Pay / PhonePe / Paytm) prior to dispatch of company workstation kit.`,
      salary: '₹45,000 / month (Paid weekly ₹11,250)',
      location: 'Remote, India (Pan-India)',
      workArrangement: 'remote',
      employerWebsite: 'https://apexlogistics-fakedemo.in',
      contactEmail: 'apex.recruitment.desk@gmail.com',
      contactPhone: '+91 98765 43210',
      contactOther: 'Telegram: @ApexRecruitmentDirector',
      requiresPayment: true,
      paymentDetails: 'Candidate must pay ₹8,500 refundable security kit deposit via UPI (Google Pay/PhonePe) prior to joining'
    }
  },
  {
    id: 'sample-2',
    name: 'Lead Cloud Security Architect at Razorpay',
    badge: 'Legitimate Corporate',
    badgeColor: 'emerald',
    expectedCategory: 'Low Risk (5-18)',
    submission: {
      id: 'sample-post-002',
      title: 'Lead Cloud Infrastructure & Security Architect',
      company: 'Razorpay Software Pvt Ltd',
      description: `Razorpay is India's leading fintech payments and banking platform for businesses. We are looking for a seasoned Lead Cloud Infrastructure & Security Architect to design, harden, and scale our core Kubernetes clusters and multi-region AWS payment pipelines.

Responsibilities:
- Architect zero-trust IAM policies, cryptographic token vaults, and automated container vulnerability inspection.
- Collaborate with engineering squads in Bengaluru to ensure ISO 27001, SOC2, and RBI payment data localization compliance.
- Lead security incident drills, red-team simulations, and CI/CD security gating.

Requirements:
- B.Tech / M.Tech in Computer Science, Information Security, or equivalent practical industry experience.
- 7+ years of experience engineering high-scale distributed systems in Go, Python, or Java.
- Deep hands-on proficiency with AWS, Kubernetes, Terraform, Vault, and automated vulnerability scanners.
- Solid track record of cross-functional technical leadership and stakeholder communication.

Compensation & Benefits:
- Competitive CTC package: ₹38,00,000 - ₹50,00,000 per annum (38 - 50 LPA) + Employee Stock Options (ESOPs).
- Comprehensive medical insurance (family cover up to ₹10,00,000), parental leave, and gratuity.
- Generous annual learning budget, home office allowance, and wellness reimbursements.
- Equal opportunity employer.`,
      salary: '₹38,00,000 - ₹50,00,000 / year (38-50 LPA) + ESOPs',
      location: 'Bengaluru, Karnataka / Hybrid',
      workArrangement: 'hybrid',
      employerWebsite: 'https://razorpay.com/jobs',
      contactEmail: 'careers@razorpay.com',
      contactPhone: '+91 80 6711 0000',
      requiresPayment: false
    }
  },
  {
    id: 'sample-3',
    name: 'Syndicate Clone: Form Filling Operator (Reused Pattern)',
    badge: 'Syndicate Clone',
    badgeColor: 'purple',
    expectedCategory: 'Very High Risk (Identical Pattern)',
    submission: {
      id: 'sample-post-003',
      title: 'Virtual Form Filling Typist & Back-Office Assistant',
      company: 'Summit Horizon Infotech Ltd',
      description: `Urgently hiring for immediate start across India! We are looking for motivated remote data entry operators. No previous experience or degree required. You will be entering basic customer invoices, courier receipts, and shipping bills into our online portal.

Work from home anywhere in India with high earning potential. Flexible timings: 2 to 4 hours per day.

Eligibility:
- Must possess an Android/iOS smartphone or laptop.
- Basic English typing skills.

Interview process: Immediate verification is conducted via Telegram text messenger with our Senior HR Team (@SummitRecruitmentTeam).

Selected applicants must transfer ₹8,500 refundable security deposit for onboarding access via UPI to our vendor account.`,
      salary: '₹45,000 / month',
      location: 'Remote, India',
      workArrangement: 'remote',
      employerWebsite: '',
      contactEmail: 'apex.recruitment.desk@gmail.com',
      contactOther: 'Telegram: @SummitRecruitmentTeam',
      requiresPayment: true,
      paymentDetails: '₹8,500 onboarding kit deposit via UPI'
    }
  },
  {
    id: 'sample-4',
    name: 'Telegram Daily Task / Review Rating Scheme',
    badge: 'Task Scam',
    badgeColor: 'amber',
    expectedCategory: 'High Risk (75-92)',
    submission: {
      id: 'sample-post-004',
      title: 'Part-Time Hotel Review & App Rating Assistant',
      company: 'Digital Consumer Insights Media',
      description: `Earn high daily income by reviewing luxury travel properties, liking YouTube videos, and submitting merchant ratings.

Guaranteed earnings: ₹2,500 - ₹5,000 per day deposited directly to your bank account or UPI wallet.

Tasks:
- Receive 25 daily task links on Telegram.
- Submit 5-star ratings and send screenshots to our Telegram audit coordinator.
- After completing level-1 tasks, recharge your merchant task wallet with ₹5,000 to unlock VIP commission payouts of ₹18,000.
- Immediate daily payouts via IMPS / UPI.

No resume or formal experience required. Immediate start today.`,
      salary: '₹3,000 - ₹5,000 / day (up to ₹1,20,000/month)',
      location: 'Anywhere in India',
      workArrangement: 'remote',
      contactEmail: 'task.rewards.india@yahoo.com',
      contactOther: 'Telegram: @DailyTaskDisbursalBot',
      requiresPayment: false
    }
  },
  {
    id: 'sample-5',
    name: 'Freelance Technical Content Writer',
    badge: 'Moderate Risk',
    badgeColor: 'sky',
    expectedCategory: 'Moderate Risk (30-48)',
    submission: {
      id: 'sample-post-005',
      title: 'Freelance Technical Writer - AI & Cyber Safety',
      company: 'ByteCraft Media Works',
      description: `We are looking for an independent freelance writer to write 2 to 3 informative articles each week covering AI breakthroughs, machine learning concepts, and fraud prevention in Indian banking.

Requirements:
- Clear, grammatically sound English writing skills.
- Ability to research and summarize technical security developments.
- Submit two published writing samples or personal blog links.

Remuneration: ₹3,500 per 1,500-word article, paid bi-weekly via direct NEFT/IMPS bank transfer or Razorpay invoice. Please send your portfolio and resume.`,
      salary: '₹3,500 per article (~₹30,000 - ₹40,000/month)',
      location: 'Remote (India)',
      workArrangement: 'remote',
      contactEmail: 'editor.bytecraft@gmail.com',
      requiresPayment: false
    }
  }
];
