import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Database,
  Layers,
  BrainCircuit,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { AnalysisResult, JobSubmission } from '../types/jobshield.ts';
import { SAMPLE_JOB_POSTINGS } from '../data/sample_postings.ts';

interface DashboardOverviewPageProps {
  onStartAnalysis: (sample?: JobSubmission) => void;
  onSelectReport: (analysis: AnalysisResult) => void;
  onNavigate: (page: string) => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  onStartAnalysis,
  onSelectReport,
  onNavigate
}) => {
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [userHistory, setUserHistory] = useState<AnalysisResult[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchDashboard = fetch('/api/dashboard', { headers: getAuthHeaders() });
        const fetchHist = isAuthenticated
          ? fetch('/api/history', { headers: getAuthHeaders() })
          : Promise.resolve(null);

        const [dashRes, histRes] = await Promise.all([fetchDashboard, fetchHist]);

        if (dashRes && dashRes.ok) {
          const dash = await dashRes.json();
          setDashboardSummary(dash);
        }
        if (histRes && histRes.ok) {
          const hist = await histRes.json();
          if (Array.isArray(hist)) setUserHistory(hist);
        } else {
          setUserHistory([]);
        }
      } catch (err) {
        console.error('Failed to load dashboard overview data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated]);

  // Compute metrics for the current user
  const totalUserScans = userHistory.length;
  const highRiskScans = userHistory.filter(h => h.riskScore >= 60).length;
  const safeScans = userHistory.filter(h => h.riskScore < 30).length;
  const avgRisk = totalUserScans > 0
    ? Math.round(userHistory.reduce((acc, curr) => acc + curr.riskScore, 0) / totalUserScans)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Workspace Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60">
            <Shield className="w-3.5 h-3.5" />
            <span>Workspace Intelligence Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isAuthenticated && user ? `Welcome back, ${user.name}` : 'Job Safety Risk Intelligence Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            {isAuthenticated
              ? 'Your private scan history is active. Verify incoming job postings or explore recurrent fraudulent patterns.'
              : 'Analyze job descriptions with calibrated ML risk assessment and explainable feature attribution.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onStartAnalysis()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>Analyze New Posting</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isAuthenticated ? 'My Total Scans' : 'Session Scans'}</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalUserScans}
          </div>
          <div className="text-[11px] text-slate-500">
            {totalUserScans > 0 ? 'Archived in private workspace' : 'Ready for initial submission'}
          </div>
        </div>

        {/* High Risk Flags */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High Risk Warnings</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {highRiskScans}
          </div>
          <div className="text-[11px] text-slate-500">
            Postings scoring ≥ 60 risk index
          </div>
        </div>

        {/* Clean Verifications */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Low Risk Postings</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {safeScans}
          </div>
          <div className="text-[11px] text-slate-500">
            Postings scoring &lt; 30 risk index
          </div>
        </div>

        {/* Average Risk Index */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Risk Index</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {avgRisk} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Across your analyzed postings
          </div>
        </div>
      </div>

      {/* Main Grid: Fast Testing Box + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fast Test Benchmarks & Short-cuts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Benchmark Archetypes */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Test Benchmark Archetypes</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">EMSCAD</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Run instant tests using calibrated real-world examples from legitimate corporate postings to syndicated check scams.
            </p>

            <div className="space-y-2.5">
              {SAMPLE_JOB_POSTINGS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => onStartAnalysis(sample.submission)}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {sample.submission.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        sample.submission.requiresPayment
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {sample.submission.requiresPayment ? 'Scam Demo' : 'Legit Demo'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {sample.submission.company} • {sample.submission.workArrangement}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav Tools */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('patterns')}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors text-left space-y-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <div className="text-xs font-bold text-white">Scam Patterns</div>
              <div className="text-[11px] text-slate-400">Explore recurring fraud clusters</div>
            </button>

            <button
              onClick={() => onNavigate('model-insights')}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors text-left space-y-1.5 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <div className="text-xs font-bold text-white">Model Insights</div>
              <div className="text-[11px] text-slate-400">Weights, confusion matrix & metrics</div>
            </button>
          </div>
        </div>

        {/* Right Column: Recent Scans in Workspace */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Recent Job Verifications</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAuthenticated
                    ? 'Isolated records stored in your personal account database.'
                    : 'Sign in to access your private job verification audit log.'}
                </p>
              </div>

              {isAuthenticated && userHistory.length > 0 && (
                <button
                  onClick={() => onNavigate('history')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({userHistory.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List of Recent Items */}
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <span className="inline-block w-5 h-5 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2" />
                <div>Loading workspace scans...</div>
              </div>
            ) : !isAuthenticated ? (
              <div className="py-10 text-center space-y-3 bg-slate-950/60 rounded-xl border border-slate-800 p-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Account History Protected</h4>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
                    Sign in to JobShield AI to save scan results, track employer legitimacy over time, and protect your private audit records.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('history')}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Sign In to View History
                </button>
              </div>
            ) : userHistory.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 p-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">No Job Postings Analyzed Yet</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                    Paste any job advertisement in the analyzer to inspect scam signals, salary plausibility, and recruiter credentials.
                  </p>
                </div>
                <button
                  onClick={() => onStartAnalysis()}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Run Your First Scan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectReport(item)}
                    className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {item.submission.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.submission.company} • {item.submission.location || 'Location unlisted'}
                      </div>
                    </div>

                    {/* Risk Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                          item.riskScore >= 80
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : item.riskScore >= 60
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : item.riskScore >= 30
                            ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <span>Risk {item.riskScore}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
