import React, { useState } from 'react';
import { AnalysisResult } from '../types/jobshield.ts';
import { RiskGauge } from '../components/RiskGauge.tsx';
import { WarningCard } from '../components/WarningCard.tsx';
import { FeatureAttributionChart } from '../components/FeatureAttributionChart.tsx';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
  Info,
  Calendar,
  Building,
  Briefcase,
  ArrowLeft
} from 'lucide-react';

interface RiskReportPageProps {
  analysis: AnalysisResult;
  onReanalyze: () => void;
  onNavigate: (page: any) => void;
}

export const RiskReportPage: React.FC<RiskReportPageProps> = ({
  analysis,
  onReanalyze,
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `JobShield AI Forensic Risk Report:
Job Title: ${analysis.submission.title}
Company: ${analysis.submission.company}
Risk Score: ${analysis.riskScore}/100 (${analysis.riskCategory.toUpperCase()})
Verdict: ${analysis.summaryVerdict}
Detected Warnings: ${analysis.warningSigns.length}
Key Flags: ${analysis.warningSigns.map(w => w.title).join('; ')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(analysis.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onReanalyze}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-medium mb-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Analyze another job posting</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Job Posting Risk & Explainability Report
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
            <span className="font-semibold text-slate-200">{analysis.submission.title}</span>
            <span>•</span>
            <span className="text-purple-300">{analysis.submission.company}</span>
            <span>•</span>
            <span className="font-mono text-slate-500">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopySummary}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={onReanalyze}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Primary Score & Verdict Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Gauge Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center text-center">
          <RiskGauge score={analysis.riskScore} category={analysis.riskCategory} size={180} />
          
          <div className="w-full mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-left">
            <div className="bg-slate-950 p-2 rounded border border-slate-800/70">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Model Probability</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {(analysis.modelProbability * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-slate-500 block">TF-IDF Log-Odds</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800/70">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Heuristic Flags</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {analysis.warningSigns.length} detected
              </span>
              <span className="text-[9px] text-slate-500 block">Rule Evidence</span>
            </div>
          </div>
        </div>

        {/* Executive Verdict & Parameters */}
        <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
          <div className={`p-4 rounded-lg border ${
            analysis.riskCategory === 'very_high' ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' :
            analysis.riskCategory === 'high' ? 'bg-orange-950/20 border-orange-500/30 text-orange-200' :
            analysis.riskCategory === 'moderate' ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' :
            'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          }`}>
            <div className="flex items-start gap-2.5">
              {analysis.riskCategory === 'very_high' || analysis.riskCategory === 'high' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : analysis.riskCategory === 'moderate' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="text-sm font-bold mb-1">
                  {analysis.summaryVerdict}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {analysis.riskCategory === 'very_high' || analysis.riskCategory === 'high'
                    ? 'The model identified strong linguistic patterns and heuristic flags associated with fraudulent postings. Exercise caution before exchanging personal documents or communicating via unverified platforms.'
                    : analysis.riskCategory === 'moderate'
                    ? 'Certain aspects of this posting (such as personal email domains or vague scope) warrant caution. Verify the company identity on official platforms.'
                    : 'The posting exhibits standard professional recruitment language, reasonable compensation, and verified employment conditions.'}
                </p>
              </div>
            </div>
          </div>

          {/* Submission Parameters Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Work Arrangement</span>
              <span className="font-semibold text-slate-200 capitalize">{analysis.submission.workArrangement}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Advertised Salary</span>
              <span className="font-semibold text-slate-200">{analysis.submission.salary || 'Unspecified'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Contact Channel</span>
              <span className="font-semibold text-slate-200 truncate block">
                {analysis.submission.contactEmail || analysis.submission.contactOther || 'Unspecified'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Candidate Fee</span>
              <span className={`font-semibold ${analysis.submission.requiresPayment ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysis.submission.requiresPayment ? 'Payment Requested' : 'None Declared'}
              </span>
            </div>
          </div>

          {/* Cross-Posting Alert Notice if Matches Exist */}
          {analysis.similarPostings && analysis.similarPostings.length > 0 && (
            <div className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-purple-300">
                  <strong>Pattern Match:</strong> Correlated with {analysis.similarPostings.length} other posting(s) in repository.
                </span>
              </div>
              <button
                onClick={() => onNavigate('patterns')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer shrink-0"
              >
                Inspect Syndicates →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Warning Signs Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Detected Warning Signs ({analysis.warningSigns.length})</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            5-Dimension Evidence Breakdown
          </span>
        </div>

        {analysis.warningSigns.length > 0 ? (
          <div className="space-y-3">
            {analysis.warningSigns.map((sign, idx) => (
              <WarningCard key={sign.id || idx} sign={sign} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-900/40 rounded-lg border border-slate-800 text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
            <p className="font-semibold text-slate-200">No Critical Warning Flags Detected</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No advance fee demands, UPI deposit requests, or suspicious off-platform chat channels were triggered.
            </p>
          </div>
        )}
      </div>

      {/* Feature Attribution (XAI) */}
      <div>
        <FeatureAttributionChart contributions={analysis.featureContributions} />
      </div>

      {/* Recommendations Checklist */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tailored Candidate Safety Recommendations</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-950/60 p-3 rounded border border-slate-800/80 flex items-start gap-2.5 text-xs">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                {idx + 1}
              </span>
              <p className="text-slate-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model & Data Science Limitation Disclaimer */}
      <div className="p-3.5 bg-slate-900/40 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Academic & Ethical Disclaimer:</strong> This risk score is a statistical model estimate combining Scikit-learn TF-IDF log-odds with verified scam heuristic indicators. A high-risk score does not establish criminal fraud, and a low-risk score does not guarantee legitimacy. Feature attribution describes model sensitivity, not causal proof.
        </p>
      </div>
    </div>
  );
};
