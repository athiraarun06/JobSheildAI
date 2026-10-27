import React, { useState } from 'react';
import {
  Search,
  Database,
  ArrowRight,
  ShieldAlert,
  FileText,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { SAMPLE_JOB_POSTINGS } from '../data/sample_postings.ts';
import { JobSubmission } from '../types/jobshield.ts';

interface HomePageProps {
  onStartAnalysis: (sample?: JobSubmission) => void;
  onNavigate: (page: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAnalysis, onNavigate }) => {
  const [previewSampleId, setPreviewSampleId] = useState<string>('sample-1');
  const activeSample = SAMPLE_JOB_POSTINGS.find(s => s.id === previewSampleId) || SAMPLE_JOB_POSTINGS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Check a job before you apply.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Analyze job postings, uncover potential scam indicators, and understand the risks.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onStartAnalysis()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-sm cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Analyze a Job</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Database className="w-4 h-4 text-purple-400" />
            <span>Explore Dataset</span>
          </button>
        </div>
      </div>

      {/* Input Preview & Interactive Sample Tester */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Job Posting Analysis Preview</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a benchmark sample below or paste any job advertisement directly in the analyzer.
            </p>
          </div>

          {/* Sample Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SAMPLE_JOB_POSTINGS.slice(0, 3).map((sample) => (
              <button
                key={sample.id}
                onClick={() => setPreviewSampleId(sample.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  previewSampleId === sample.id
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {sample.name.split('-')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Content Box */}
        <div className="bg-slate-950/80 rounded-lg p-4 border border-slate-800/70 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">{activeSample.submission.title}</span>
            <span className="text-slate-400 font-mono">{activeSample.submission.company}</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
            "{activeSample.submission.description}"
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400">
              Salary: {activeSample.submission.salary || 'Unspecified'} • {activeSample.submission.workArrangement}
            </span>
            <button
              onClick={() => onStartAnalysis(activeSample.submission)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <span>Load this posting into Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* How It Works — 3 Clean Steps */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          How JobShield AI Evaluates Job Postings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <div className="w-7 h-7 rounded bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">
              1
            </div>
            <h3 className="text-sm font-semibold text-white">Input Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the job description along with compensation, contact channel, and work arrangement details.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <div className="w-7 h-7 rounded bg-slate-800 text-purple-400 flex items-center justify-center text-xs font-mono font-bold">
              2
            </div>
            <h3 className="text-sm font-semibold text-white">Feature Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The model extracts linguistic n-grams and flags structured heuristics like upfront fees and non-corporate email domains.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <div className="w-7 h-7 rounded bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
              3
            </div>
            <h3 className="text-sm font-semibold text-white">Explainable Risk Report</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive a 0–100 risk score, extracted textual evidence, model token contributions, and practical verification steps.
            </p>
          </div>
        </div>
      </div>

      {/* Honest Model Status Banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            <strong>Model Status:</strong> Pre-trained EMSCAD Artifacts Loaded (TF-IDF + Logistic Regression).
          </span>
        </div>
        <button
          onClick={() => onNavigate('model-insights')}
          className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View evaluation metrics & limitations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
