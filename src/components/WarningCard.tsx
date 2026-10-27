import React, { useState } from 'react';
import { WarningSign } from '../types/jobshield.ts';
import {
  AlertCircle,
  DollarSign,
  Mail,
  FileText,
  Clock,
  Key,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface WarningCardProps {
  sign: WarningSign;
  index: number;
}

export const WarningCard: React.FC<WarningCardProps> = ({ sign, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Icon selector based on category
  const getCategoryIcon = (category: WarningSign['category']) => {
    switch (category) {
      case 'payment':
        return <DollarSign className="w-5 h-5 text-rose-400" />;
      case 'contact':
        return <Mail className="w-5 h-5 text-amber-400" />;
      case 'salary':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'vague_text':
        return <FileText className="w-5 h-5 text-sky-400" />;
      case 'urgency':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'sensitive_info':
        return <Key className="w-5 h-5 text-rose-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-purple-400" />;
    }
  };

  const getSeverityBadge = (severity: WarningSign['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Critical Flag
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            High Severity
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Moderate Severity
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            Notice
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-200 shadow-md">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-slate-900/40 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
            {getCategoryIcon(sign.category)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400 font-semibold">FLAG #{index + 1}</span>
              <h4 className="text-sm md:text-base font-bold text-slate-100">{sign.title}</h4>
              {getSeverityBadge(sign.severity)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            +{sign.contributionScore} Risk Pts
          </span>
          <button className="text-slate-400 hover:text-slate-200 p-1">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content with 5 mandated explainability dimensions */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs md:text-sm">
          {/* Dimension 1 & 2: Evidence */}
          <div className="bg-slate-950/60 rounded-lg p-3.5 border border-slate-800/90">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Extracted Posting Evidence
            </div>
            <p className="text-slate-300 font-mono text-xs leading-relaxed italic bg-slate-900/50 p-2.5 rounded border border-slate-800">
              "{sign.evidence}"
            </p>
          </div>

          {/* Dimension 3 & 4: Explanation & Model Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 bg-slate-950/40 rounded-lg p-3 border border-slate-800/60">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Forensic Explanation
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {sign.explanation}
              </p>
            </div>

            <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/60 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                  Model Weight Contribution
                </div>
                <div className="text-xl font-bold font-mono text-purple-300 mt-1">
                  +{sign.contributionScore} <span className="text-xs font-normal text-slate-400">to composite score</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Empirically validated on EMSCAD fraudulent benchmarks.
              </div>
            </div>
          </div>

          {/* Dimension 5: Practical Recommendation */}
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3.5 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                Recommended Candidate Action
              </span>
              <p className="text-emerald-200/90 text-xs leading-relaxed">
                {sign.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
