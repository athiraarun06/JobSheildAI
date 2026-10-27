import React from 'react';
import { Share2, ArrowRight } from 'lucide-react';

interface PatternClusterCardProps {
  cluster: {
    patternType: string;
    description: string;
    confidence: string;
    matchedPostings: Array<{ id: string; title: string; company: string; riskScore: number; isDemo?: boolean }>;
    evidence: string;
  };
  onSelectPosting?: (id: string) => void;
}

export const PatternClusterCard: React.FC<PatternClusterCardProps> = ({
  cluster,
  onSelectPosting
}) => {
  const getBadgeColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'critical':
      case 'very high':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{cluster.patternType}</h3>
            <p className="text-xs text-slate-400">{cluster.description}</p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getBadgeColor(cluster.confidence)} self-start sm:self-auto`}>
          {cluster.confidence} Confidence
        </span>
      </div>

      <div className="bg-slate-950/70 p-3 rounded border border-slate-800/80 text-xs text-slate-300 font-mono">
        <span className="text-purple-400 font-semibold block mb-0.5">Forensic Pattern Evidence:</span>
        "{cluster.evidence}"
      </div>

      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Correlated Postings ({cluster.matchedPostings.length}):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cluster.matchedPostings.map((p, idx) => (
            <div
              key={idx}
              onClick={() => onSelectPosting && onSelectPosting(p.id)}
              className="bg-slate-950/50 p-2 rounded border border-slate-800 flex items-center justify-between hover:border-slate-700 hover:bg-slate-850 transition-colors cursor-pointer group"
            >
              <div className="overflow-hidden pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-200 truncate group-hover:text-cyan-300">
                    {p.title}
                  </span>
                  {p.isDemo && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Demo
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {p.company}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                  p.riskScore >= 70 ? 'bg-rose-500/15 text-rose-400' :
                  p.riskScore >= 40 ? 'bg-amber-500/15 text-amber-400' :
                  'bg-emerald-500/15 text-emerald-400'
                }`}>
                  {p.riskScore}/100
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
