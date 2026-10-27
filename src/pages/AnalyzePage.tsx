import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Zap,
  Clock,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Flame,
  Radio
} from 'lucide-react';
import { JobSubmission, AnalysisResult } from '../types/jobshield.ts';
import { analyzeJobPosting } from '../ml/engine.ts';
import { SAMPLE_JOB_POSTINGS } from '../data/sample_postings.ts';
import { RiskReportPage } from './RiskReportPage.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { addLocalHistoryItem } from '../utils/historyStorage.ts';

interface AnalyzePageProps {
  initialSubmission?: JobSubmission;
  activeAnalysisResult?: AnalysisResult | null;
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onClearActiveAnalysis: () => void;
  onNavigateToHistory: () => void;
  onNavigate: (page: any) => void;
}

const EMPTY_FORM: JobSubmission = {
  title: '',
  company: '',
  description: '',
  salary: '',
  location: '',
  workArrangement: 'remote',
  employerWebsite: '',
  contactEmail: '',
  contactPhone: '',
  contactOther: '',
  requiresPayment: false,
  paymentDetails: '',
  jobUrl: ''
};

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  initialSubmission,
  activeAnalysisResult,
  onAnalysisSuccess,
  onClearActiveAnalysis,
  onNavigateToHistory,
  onNavigate
}) => {
  const { user, getAuthHeaders } = useAuth();
  
  // Always initialize with empty inputs by default
  const [formData, setFormData] = useState<JobSubmission>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [urlNotice, setUrlNotice] = useState<string | null>(null);
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(false);

  // If user explicitly triggers an external sample via navigation, only apply if specifically provided
  useEffect(() => {
    if (initialSubmission && Object.values(initialSubmission).some(v => typeof v === 'string' && v.trim() !== '')) {
      setFormData(initialSubmission);
    }
  }, [initialSubmission]);

  // Live heuristic telemetry detection as user inputs data
  const fullText = `${formData.title} ${formData.company} ${formData.description} ${formData.salary || ''} ${formData.paymentDetails || ''} ${formData.contactOther || ''}`.toLowerCase();
  
  const hasFreeEmail = formData.contactEmail ? /gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|protonmail\.com/i.test(formData.contactEmail) : false;
  const hasTelegramChat = /telegram|whatsapp|signal/i.test(fullText) || (formData.contactOther && /telegram|whatsapp|signal/i.test(formData.contactOther));
  const hasUpiOrDeposit = formData.requiresPayment || /upi|gpay|google pay|phonepe|paytm|imps|deposit|registration fee|starter kit|laptop fee|security deposit|kit fee/i.test(fullText);
  const hasInflatedSalary = (/(?:₹|rs\.?|inr)\s*([3-9]\d{4,})\s*(?:\/|\s*per\s*)month/i.test(formData.salary || '') ||
    /(?:₹|rs\.?|inr)\s*([2-9]\d{3,})\s*(?:\/|\s*per\s*)day/i.test(formData.salary || '') ||
    /([1-9]\d?)\s*lpa/i.test(formData.salary || '')) &&
    (/no experience|entry level|data entry|typist|form filling|simple typing/i.test(fullText));

  const descWordCount = formData.description.trim() ? formData.description.trim().split(/\s+/).length : 0;

  const handleClearForm = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setUrlNotice(null);
  };

  const handleSelectPreset = (sampleId: string) => {
    const found = SAMPLE_JOB_POSTINGS.find(s => s.id === sampleId);
    if (found) {
      setFormData({ ...found.submission });
      setErrors({});
      setUrlNotice(null);
      setShowBenchmarks(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, jobUrl: val }));
    if (val.trim()) {
      setUrlNotice(
        'Notice: Third-party career portal security protocols block direct automated DOM scraping. Please copy and paste the job description text directly below for full text extraction.'
      );
    } else {
      setUrlNotice(null);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Job title is required.';
    }
    if (!formData.company.trim()) {
      errs.company = 'Company name is required.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Job description is required for ML text & n-gram extraction.';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Description must be at least 15 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const scanSteps = [
    'Tokenizing vocabulary & sublinear TF-IDF n-gram vectors...',
    'Cross-referencing corporate domain & free-provider spoofing indicators...',
    'Inspecting UPI, GPay, advance security deposit & Telegram vector signatures...',
    'Executing calibrated logistic regression & computing XAI feature attribution...'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setScanStepIndex(0);
    setScanProgress(15);
    setErrors({});

    // Start simulated animated progression for high-tech HUD experience
    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev < scanSteps.length - 1) return prev + 1;
        return prev;
      });
      setScanProgress(prev => Math.min(prev + 26, 94));
    }, 380);

    try {
      const [res] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        }).catch(() => null),
        new Promise(resolve => setTimeout(resolve, 1200)) // Ensure smooth presentation of scanning HUD
      ]);

      clearInterval(stepInterval);
      setScanProgress(100);

      let result: AnalysisResult | null = null;
      if (res && res.ok) {
        try {
          result = await res.json();
        } catch {
          result = null;
        }
      }

      // If server returned valid analysis, use it; otherwise compute via local ML engine seamlessly:
      if (!result) {
        result = analyzeJobPosting(formData);
      }

      // Associate analysis with authenticated user
      result.userId = user ? user.id : 'guest';
      (result as any).userEmail = user ? user.email : undefined;

      // Always save to isolated local history immediately
      addLocalHistoryItem(user?.email || user?.id, result);

      // Background sync to server history storage
      fetch('/api/history', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(result)
      }).catch(err => console.warn('Background history sync to server skipped:', err));

      setTimeout(() => {
        setIsLoading(false);
        onAnalysisSuccess(result!);
      }, 300);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.warn('Network issue during analysis; running client-side ML engine fallback:', err);
      const fallbackResult = analyzeJobPosting(formData);
      fallbackResult.userId = user ? user.id : 'guest';
      (fallbackResult as any).userEmail = user ? user.email : undefined;

      // Always save to isolated local history immediately
      addLocalHistoryItem(user?.email || user?.id, fallbackResult);

      fetch('/api/history', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fallbackResult)
      }).catch(() => {});

      setScanProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        onAnalysisSuccess(fallbackResult);
      }, 300);
    }
  };

  // If there is an active report, render the Risk Report directly
  if (activeAnalysisResult) {
    return (
      <RiskReportPage
        analysis={activeAnalysisResult}
        onReanalyze={onClearActiveAnalysis}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* High-Tech Animated Radar Overlay during Submission */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#070b14]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b1222] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 relative overflow-hidden">
            {/* Animated Laser Scanline running across the modal */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-scan pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-5">
              {/* Radar Circle HUD */}
              <div className="relative w-28 h-28 rounded-full border border-cyan-500/30 bg-slate-950/80 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Concentric distance rings */}
                <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-6 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-10 rounded-full border border-cyan-500/20" />

                {/* Radar Rotating Sweep Hand */}
                <div className="absolute inset-0 origin-center animate-radar-spin">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 to-transparent rounded-tl-full" />
                </div>

                {/* Pulsing center node */}
                <div className="relative z-10 w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/80" />
              </div>

              {/* Status Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-700/60">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>FORENSIC SCAN IN PROGRESS</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight pt-1">
                  Evaluating Recruitment Risk Signature
                </h3>
              </div>

              {/* Dynamic Step Diagnostics */}
              <div className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400">Step {scanStepIndex + 1} of 4</span>
                  <span className="text-slate-400">{scanProgress}% Completed</span>
                </div>
                <p className="text-xs text-slate-200 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="truncate">{scanSteps[scanStepIndex]}</span>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                Model: EMSCAD-LogReg-TFIDF-v1.2 (ROC-AUC 0.963)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Forensic Risk Analyzer · Ready for Ingestion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Search className="w-6 h-6 text-cyan-400" />
            <span>Job Posting Risk Scanner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Submit any job posting details below. All fields start blank for your raw input. Get an immediate calibrated risk score (0–100), transparent evidence flags, and safety guidance.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            title="Reset and clear all input fields"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Fields</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBenchmarks(!showBenchmarks)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/60 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Benchmark Cases (Optional)</span>
            {showBenchmarks ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Optional Benchmark Cases Drawer (Does not auto-fill; only fills on explicit user click) */}
      {showBenchmarks && (
        <div className="p-4 bg-[#0a0f1d] border border-purple-500/30 rounded-xl space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Select a Benchmark Case to Inspect Simulated Risk Profiles:</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Indian Market Archetypes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectPreset('sample-1')}
              className="p-3 rounded-lg text-left bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/30 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-rose-400 font-bold">Advance UPI Fee</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">85-98 Risk</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">Remote Data Entry (₹45k/pm)</p>
              <p className="text-[11px] text-slate-400 truncate">Demands ₹8,500 UPI kit deposit</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('sample-2')}
              className="p-3 rounded-lg text-left bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/30 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">Legitimate Tech Role</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">5-18 Risk</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">Lead Security Architect (Razorpay)</p>
              <p className="text-[11px] text-slate-400 truncate">₹38-50 LPA, verified corporate domain</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('sample-4')}
              className="p-3 rounded-lg text-left bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/30 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">Telegram Task Scam</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">75-92 Risk</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">Hotel Rating Assistant</p>
              <p className="text-[11px] text-slate-400 truncate">₹3k-5k daily payout, Telegram bot</p>
            </button>
          </div>
        </div>
      )}

      {errors.form && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Main Grid: Left Column (Form) & Right Column (Live Radar Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-5">
          {/* Section 1: Core Job & Organization Details */}
          <div className="bg-[#0b1222]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>1. Core Job & Organization Information</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Job Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote Data Entry Operator, Senior Software Engineer"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full bg-[#070b14] border ${errors.title ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all`}
                />
                {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Company / Organization Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Razorpay Software, Infosys, Apex Logistics"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full bg-[#070b14] border ${errors.company ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all`}
                />
                {errors.company && <p className="text-[11px] text-rose-400 mt-1">{errors.company}</p>}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Job Description & Responsibilities <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      descWordCount === 0
                        ? 'text-slate-500 bg-slate-900'
                        : descWordCount < 35
                        ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                        : 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                    }`}
                  >
                    {descWordCount} words {descWordCount > 0 && descWordCount < 35 ? '(Brief)' : ''}
                  </span>
                </div>
              </div>
              <textarea
                rows={6}
                placeholder="Paste the complete job advertisement, responsibilities, interview guidelines, and candidate requirements..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={`w-full bg-[#070b14] border ${errors.description ? 'border-rose-500' : 'border-slate-800'} rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono leading-relaxed`}
              />
              {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Section 2: Compensation & Work Arrangement (INR / ₹) */}
          <div className="bg-[#0b1222]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                <span>2. Compensation & Work Arrangement (Indian Rupee ₹)</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">INR / CTC Benchmarks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Advertised Salary / Package</span>
                  <span className="text-[10px] text-cyan-400 font-mono">₹ INR / LPA</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-sm">₹</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. ₹45,000 / month, ₹18 LPA, or ₹3,000 / day"
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Job Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Gurugram, Mumbai, or Remote (India)"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Work Arrangement Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Work Arrangement (EMSCAD Telecommuting Factor)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'remote', label: 'Remote / Work from Home', detail: '18.2% baseline risk in dataset' },
                  { value: 'hybrid', label: 'Hybrid Office', detail: 'Standard corporate distribution' },
                  { value: 'on_site', label: 'On-Site / Physical', detail: '3.1% baseline risk in dataset' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, workArrangement: opt.value as any })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.workArrangement === opt.value
                        ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-sm shadow-cyan-950/50'
                        : 'bg-[#070b14] border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold block">{opt.label}</span>
                      {formData.workArrangement === opt.value && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{opt.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Contact Channels & Verification Details */}
          <div className="bg-[#0b1222]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>3. Verification & Communication Channels</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Domain & Messaging Check</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Recruiter Contact Email</span>
                  {hasFreeEmail && (
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      ⚠ Free Provider Detected
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="e.g. hr@company.com or recruiter@gmail.com"
                    value={formData.contactEmail}
                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                    className={`w-full bg-[#070b14] border ${hasFreeEmail ? 'border-amber-500/80' : 'border-slate-800'} rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Official Company Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://company.com or https://careers.company.com"
                    value={formData.employerWebsite}
                    onChange={e => setFormData({ ...formData, employerWebsite: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Interview App / Handle</span>
                  {hasTelegramChat && (
                    <span className="text-[10px] font-mono text-rose-400 font-bold">
                      ⚠ Chat-Only Flag
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Telegram: @RecruiterDesk or WhatsApp interview"
                    value={formData.contactOther}
                    onChange={e => setFormData({ ...formData, contactOther: e.target.value })}
                    className={`w-full bg-[#070b14] border ${hasTelegramChat ? 'border-rose-500/80' : 'border-slate-800'} rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210 or 080 6711 0000"
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Optional URL input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Original Job Posting URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/jobs/view/... or https://naukri.com/job-listings/..."
                value={formData.jobUrl}
                onChange={handleUrlChange}
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
              {urlNotice && (
                <div className="mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-amber-300 flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{urlNotice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Upfront Payment & Security Deposit Flag */}
          <div className={`rounded-2xl p-5 sm:p-6 space-y-3 border transition-all ${
            formData.requiresPayment
              ? 'bg-rose-950/20 border-rose-500/60'
              : 'bg-[#0b1222]/90 border-slate-800'
          }`}>
            <div className="flex items-start gap-3.5">
              <input
                type="checkbox"
                id="requiresPayment"
                checked={formData.requiresPayment}
                onChange={e => setFormData({ ...formData, requiresPayment: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-800 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="requiresPayment" className="cursor-pointer select-none">
                <span className="text-xs sm:text-sm font-bold text-white block">
                  Does the employer demand any upfront candidate payment, UPI transfer, or security deposit?
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">
                  Includes laptop/equipment security deposit, registration charges, courier delivery fee, or training kit payments via UPI, Google Pay, PhonePe, or wire transfer.
                </span>
              </label>
            </div>

            {formData.requiresPayment && (
              <div className="pt-2 pl-7 space-y-1.5">
                <label className="block text-xs font-semibold text-rose-300">
                  Payment / Deposit Specifics (Amount & Channel):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Must transfer ₹8,500 security deposit via Google Pay/PhonePe prior to kit dispatch"
                  value={formData.paymentDetails || ''}
                  onChange={e => setFormData({ ...formData, paymentDetails: e.target.value })}
                  className="w-full bg-[#070b14] border border-rose-500/60 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-xl shadow-cyan-950/60 cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Run Machine Learning Risk Analysis</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </form>

        {/* Right Column: Live Pre-Flight Telemetry HUD */}
        <div className="lg:col-span-4 space-y-4">
          {/* Real-Time Radar Scanner Card */}
          <div className="bg-[#0b1222]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Pre-Flight Radar
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                LIVE INPUT TELEMETRY
              </span>
            </div>

            {/* Live Indicator Pills */}
            <div className="space-y-2.5">
              <span className="text-[11px] text-slate-400 block font-mono">
                Pattern Signatures Detected in Form:
              </span>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                hasUpiOrDeposit
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                  : 'bg-[#070b14] border-slate-800/80 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${hasUpiOrDeposit ? 'bg-rose-400 animate-ping' : 'bg-slate-600'}`} />
                  <span>Upfront Fee / UPI Rail</span>
                </div>
                <span className="text-[10px] font-mono font-bold">
                  {hasUpiOrDeposit ? 'FLAGGED' : 'CLEAR'}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                hasTelegramChat
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                  : 'bg-[#070b14] border-slate-800/80 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${hasTelegramChat ? 'bg-rose-400 animate-ping' : 'bg-slate-600'}`} />
                  <span>Telegram / WhatsApp Interview</span>
                </div>
                <span className="text-[10px] font-mono font-bold">
                  {hasTelegramChat ? 'FLAGGED' : 'CLEAR'}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                hasFreeEmail
                  ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                  : 'bg-[#070b14] border-slate-800/80 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${hasFreeEmail ? 'bg-amber-400' : 'bg-slate-600'}`} />
                  <span>Personal Email (@gmail/@yahoo)</span>
                </div>
                <span className="text-[10px] font-mono font-bold">
                  {hasFreeEmail ? 'FLAGGED' : 'CLEAR'}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                hasInflatedSalary
                  ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                  : 'bg-[#070b14] border-slate-800/80 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${hasInflatedSalary ? 'bg-amber-400' : 'bg-slate-600'}`} />
                  <span>Outsized ₹ Pay for Typing Role</span>
                </div>
                <span className="text-[10px] font-mono font-bold">
                  {hasInflatedSalary ? 'FLAGGED' : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* Model Architecture Specs */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Trained Base Corpus:</span>
                <span className="text-white font-bold">17,880 Postings</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Balanced Test AUC:</span>
                <span className="text-cyan-400 font-bold">0.963</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Currency Grounding:</span>
                <span className="text-purple-400 font-bold">Indian Rupee (₹ / INR)</span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Card */}
          <div className="bg-[#0b1222]/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Job Seeker Safety Rules (India)</span>
            </h4>
            <ul className="space-y-2 text-slate-300 leading-relaxed text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Legitimate recruiters in India <strong>never</strong> ask for UPI payments or security deposits for laptops or training.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Official communications always originate from verified corporate email domains, not @gmail.com or Telegram.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Cross-check corporate entity status on MCA21 (Ministry of Corporate Affairs) before signing agreements.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
