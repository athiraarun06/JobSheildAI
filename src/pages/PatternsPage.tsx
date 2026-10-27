import React, { useState, useEffect } from 'react';
import {
  Layers,
  RefreshCw,
  Search,
  CheckCircle2,
  Info,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { PatternClusterCard } from '../components/PatternClusterCard.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface PatternsPageProps {
  onSelectPosting: (id: string) => void;
  onNavigateToAnalyze: () => void;
}

export const PatternsPage: React.FC<PatternsPageProps> = ({
  onSelectPosting,
  onNavigateToAnalyze
}) => {
  const { user, getAuthHeaders } = useAuth();
  const [patternData, setPatternData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [includeDemo, setIncludeDemo] = useState<boolean>(true);

  const fetchPatterns = async (withDemo = includeDemo) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/patterns', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ includeDemo: withDemo })
      });
      if (res.ok) {
        const data = await res.json();
        setPatternData(data);
      }
    } catch (err) {
      console.error('Failed to fetch patterns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns(includeDemo);
  }, [includeDemo, user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Scam Pattern & Syndicate Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detects recurring scam patterns by analyzing TF-IDF cosine similarity and reused contact handles across postings.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIncludeDemo(!includeDemo)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-md cursor-pointer"
            title="Toggle inclusion of benchmark demo samples for pattern comparison"
          >
            {includeDemo ? (
              <ToggleRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-slate-500" />
            )}
            <span>Benchmark Archetypes</span>
          </button>

          <button
            onClick={() => fetchPatterns(includeDemo)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title="Refresh clusters"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
          <span className="text-[11px] text-slate-400 block">Total Postings Correlated</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
            {patternData?.totalHistoryAnalyzed || 0}
          </div>
          <span className="text-[10px] text-slate-500">
            {patternData?.userPostingsCount || 0} user records {includeDemo ? '+ 5 benchmark samples' : ''}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
          <span className="text-[11px] text-slate-400 block">Detected Pattern Clusters</span>
          <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
            {patternData?.clustersDetected || 0}
          </div>
          <span className="text-[10px] text-slate-500">
            {patternData?.clustersDetected ? 'Cross-listing matches identified' : 'No clusters detected yet'}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
          <span className="text-[11px] text-slate-400 block">Similarity Method</span>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">
            TF-IDF Cosine Similarity
          </div>
          <span className="text-[10px] text-slate-500">
            Threshold: &ge; 55% lexical cosine match
          </span>
        </div>
      </div>

      {/* Pattern Clusters List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-slate-900/40 rounded-lg border border-slate-800">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
            Computing TF-IDF cosine similarity matrix across job postings...
          </div>
        ) : patternData?.clusters && patternData.clusters.length > 0 ? (
          <div className="space-y-3">
            {patternData.clusters.map((cluster: any, idx: number) => (
              <PatternClusterCard
                key={idx}
                cluster={cluster}
                onSelectPosting={onSelectPosting}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/40 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-3">
            <p>
              {patternData?.message ||
                'No coordinated scam patterns detected across current postings. At least 2 job postings with high text overlap or repeated contact details are required.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setIncludeDemo(true)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
              >
                Enable Benchmark Archetypes
              </button>
              <button
                onClick={onNavigateToAnalyze}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Scan a Job Posting
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scientific Notice */}
      <div className="p-3.5 bg-slate-900/40 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Scientific Methodology Notice:</strong> JobShield AI identifies statistical text overlap and shared contact markers. Similarities are presented as <em>potential template connections requiring independent human verification</em>, rather than definitive legal proof of unified criminal operations.
        </p>
      </div>
    </div>
  );
};
