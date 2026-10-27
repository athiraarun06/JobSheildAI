import React, { useState } from 'react';
import {
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  BrainCircuit,
  Lock,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  FileText
} from 'lucide-react';
import { SAMPLE_JOB_POSTINGS } from '../data/sample_postings.ts';
import { JobSubmission } from '../types/jobshield.ts';

interface LandingPageProps {
  onStartAnalysis: (sample?: JobSubmission) => void;
  onNavigate: (page: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onNavigate,
  onOpenAuth,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact
}) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const activeSample = SAMPLE_JOB_POSTINGS[selectedSampleIndex];

  return (
    <div className="space-y-20 pb-16 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden border-b border-slate-900">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-purple-500/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-800/60 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="tracking-wide uppercase font-mono text-[11px]">
                  AI-POWERED JOB SAFETY INTELLIGENCE
                </span>
              </div>

              {/* Exact required headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Check a job before <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                  you trust it.
                </span>
              </h1>

              {/* Exact required subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                AI-powered job scam detection that helps you evaluate suspicious job postings, understand potential risks, and make safer career decisions.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onStartAnalysis()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-950/50 hover:shadow-cyan-500/20 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Analyze a Job Now</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>View EMSCAD Benchmarks</span>
                </button>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">17,880</div>
                  <div className="text-[11px] text-slate-400">Trained EMSCAD Postings</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">0.963</div>
                  <div className="text-[11px] text-slate-400">Test AUC Benchmark</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400">0–100</div>
                  <div className="text-[11px] text-slate-400">Calibrated Risk Scale</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Sample Scanner Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-hidden">
                {/* Simulated Scanner Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">jobshield-scanner-preview</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                    LIVE PREVIEW
                  </span>
                </div>

                {/* Simulated Posting Content */}
                <div className="py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {activeSample.submission.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {activeSample.submission.company} • {activeSample.submission.location || 'Remote'}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider shrink-0 ${
                        activeSample.submission.requiresPayment
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {activeSample.submission.requiresPayment ? 'Flagged Sample' : 'Legitimate Sample'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono line-clamp-3 leading-relaxed">
                    "{activeSample.submission.description}"
                  </div>

                  {/* Simulated Risk Meter Bar */}
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Scam Risk Assessment</span>
                      <span className="font-mono font-bold text-cyan-300">
                        {activeSample.submission.requiresPayment ? '87 / 100 (Very High)' : '14 / 100 (Low)'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          activeSample.submission.requiresPayment
                            ? 'w-[87%] bg-gradient-to-r from-amber-500 to-rose-500'
                            : 'w-[14%] bg-gradient-to-r from-emerald-500 to-cyan-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Identified Indicator Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeSample.submission.requiresPayment ? (
                      <>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          Upfront Equipment Payment
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Free Public Email Domain
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                          Outsized Salary Promise
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Verified Corporate Domain
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Zero Upfront Fees
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                          Standard Compensation
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom switcher & CTA inside preview card */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {SAMPLE_JOB_POSTINGS.slice(0, 3).map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSampleIndex(idx)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          selectedSampleIndex === idx
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Sample #{idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onStartAnalysis()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <span>Open Job Analyzer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3-Step Visual Workflow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How JobShield AI Analyzes Job Postings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            A transparent data science pipeline combining natural language processing, benchmark feature extraction, and explainable AI attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Input Posting Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the job text, title, company, salary offer, work arrangement, contact email, and fee requests into our guided analyzer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Machine Learning Inspection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our trained EMSCAD logistic model scans n-gram text signals, cross-checks salary norms, examines domain legitimacy, and verifies payment policies.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Explainable Risk Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive a calibrated 0–100 risk score, a 5-dimension feature attribution breakdown, recurring scam cluster matches, and safety steps.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE CAPABILITIES (5 Main Features) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Enterprise-Grade Risk Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Defense Against Recruitment Fraud
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Traditional filters only check basic blacklists. JobShield AI utilizes empirical data science and structural feature analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-cyan-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Calibrated ML Risk Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Produces a calibrated 0–100 scam risk score mapped across 4 intuitive security bands: Low (0–29), Moderate (30–59), High (60–79), and Very High (80–100).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">5-Dimension Explainable AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent SHAP-inspired feature attribution detailing how Linguistic Signals, Compensation Norms, Company Presence, Payment Requests, and Contact Channels impacted the score.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Cross-Posting Scam Clusters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies syndicated scam rings using TF-IDF cosine vector similarity across known phishing templates, counterfeit check schemes, and fake reshipping scams.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Personalized Safety Playbook</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailors safety directives based on detected flags—such as how to safely verify business registrar records, test recruiter email MX records, and avoid counterfeit check traps.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-cyan-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Private User Workspace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete full-stack authentication with cryptographic scrypt password hashing and server-side private history isolation to preserve and compare your past assessments.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Public Dataset Transparency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect model confusion matrix, precision-recall curve, class imbalances, and top vocabulary coefficients directly in the Model Insights suite.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PROJECT TEAM & RESEARCH CONTRIBUTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Project Contributors & Research Team
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built by Researchers & Engineers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            JobShield AI was developed as a comprehensive data science and intelligent system project with defined role allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member 1: Athira Arun */}
          <div className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 space-y-4 transition-all relative overflow-hidden group">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                AA
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Athira Arun</h3>
                <span className="text-xs font-semibold text-cyan-400">
                  ML Development & System Lead
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
              ML model development, NLP-based scam detection, risk scoring, system integration, and overall project implementation.
            </p>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                ML Pipeline
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                NLP Detection
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Risk Engine
              </span>
            </div>
          </div>

          {/* Member 2: Shradha Krishna */}
          <div className="bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-4 transition-all relative overflow-hidden group">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                SK
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Shradha Krishna</h3>
                <span className="text-xs font-semibold text-purple-400">
                  Data Science & Pattern Analysis
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
              Dataset collection, preprocessing, exploratory data analysis, and scam-pattern analysis.
            </p>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40">
                Dataset Collection
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Preprocessing
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                EDA Research
              </span>
            </div>
          </div>

          {/* Member 3: Shamini S */}
          <div className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 space-y-4 transition-all relative overflow-hidden group">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                SS
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Shamini S</h3>
                <span className="text-xs font-semibold text-emerald-400">
                  UI/UX & Documentation Lead
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
              Website UI development, dashboard visualizations, testing, and project documentation.
            </p>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                UI Development
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Visualizations
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Testing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST & TRANSPARENCY SECTION (Academic Grounding & Disclaimer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono font-medium text-purple-300 bg-purple-950/60 border border-purple-800/60">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Academic Dataset & Model Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Grounded in the University of the Aegean EMSCAD Benchmark
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                JobShield AI was trained and validated on the <em>Employment Scam Aegean Dataset (EMSCAD)</em>, consisting of 17,880 real-world job advertisements (866 confirmed fraudulent cases and 17,014 legitimate corporate postings).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Test AUC</div>
                  <div className="text-base font-bold font-mono text-cyan-400">0.963</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Precision</div>
                  <div className="text-base font-bold font-mono text-purple-400">0.892</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Recall</div>
                  <div className="text-base font-bold font-mono text-emerald-400">0.841</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">F1 Score</div>
                  <div className="text-base font-bold font-mono text-white">0.866</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 bg-slate-950/90 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Responsible AI & Probabilistic Decision Notice</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Important:</strong> A high-risk prediction indicates strong statistical alignment with known scam characteristics, but does not prove intentional fraud. Conversely, a low-risk prediction indicates absence of common scam markers, but does not guarantee employer legitimacy.
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Always verify official domains, conduct independent company diligence, and never transfer money or provide confidential banking credentials during interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Protect your career search today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Scan any suspicious job description in seconds, inspect verified indicators, and save your private analysis history.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onStartAnalysis()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg cursor-pointer"
            >
              Analyze a Job Now (Free)
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER WITH CREDITS & LEGAL LINKS */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 space-y-4 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">JobShield AI</span>
            <span>•</span>
            <span>Recruitment Scam Detection & Risk Intelligence</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={onOpenTerms} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button onClick={onOpenContact} className="hover:text-slate-300 transition-colors cursor-pointer">
              Contact & Support
            </button>
          </div>
        </div>

        {/* Project Authors Attribution Bar */}
        <div className="pt-3 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            Project developed by{' '}
            <span className="text-cyan-300 font-medium">Athira Arun</span>,{' '}
            <span className="text-purple-300 font-medium">Shradha Krishna</span>, and{' '}
            <span className="text-emerald-300 font-medium">Shamini S</span>
          </div>
          <button
            onClick={() => onNavigate('about')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
          >
            View Project Architecture & Team Roles →
          </button>
        </div>
      </footer>
    </div>
  );
};
