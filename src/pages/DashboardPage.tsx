import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Database,
  Users,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react';
import modelArtifacts from '../ml/model_artifacts.json';
import { useAuth } from '../context/AuthContext.tsx';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dataset' | 'user' | 'evaluation'>('dataset');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, isAuthenticated]);

  // EMSCAD Class Distribution Pie Data
  const datasetPieData = [
    { name: 'Legitimate Postings', value: modelArtifacts.dataset.legitimateRecords, color: '#10b981' },
    { name: 'Fraudulent Postings', value: modelArtifacts.dataset.fraudulentRecords, color: '#f43f5e' }
  ];

  // Vulnerability comparison
  const vulnerabilityData = [
    { category: 'Telecommuting (Remote)', fraudRate: 18.2, benchmark: 4.84 },
    { category: 'On-Site Only', fraudRate: 3.1, benchmark: 4.84 },
    { category: 'Missing Logo', fraudRate: 12.8, benchmark: 4.84 },
    { category: 'Verified Logo Present', fraudRate: 1.9, benchmark: 4.84 },
    { category: 'No Screening Questions', fraudRate: 8.4, benchmark: 4.84 },
    { category: 'Screening Questions Used', fraudRate: 2.1, benchmark: 4.84 }
  ];

  const live = dashboardData?.liveSubmissions;
  const userCatData = live ? [
    { name: 'Low Risk', count: live.riskCategoryCounts?.low || 0, fill: '#10b981' },
    { name: 'Moderate Risk', count: live.riskCategoryCounts?.moderate || 0, fill: '#f59e0b' },
    { name: 'High Risk', count: live.riskCategoryCounts?.high || 0, fill: '#f97316' },
    { name: 'Very High Risk', count: live.riskCategoryCounts?.very_high || 0, fill: '#f43f5e' }
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Data Science Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical statistics from the EMSCAD research dataset, test-set metrics, and live user analysis history.
          </p>
        </div>

        {/* Tab Toggle - Strictly Distinguishing Categories */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'dataset'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Training Dataset (EMSCAD)
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'user'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. User History ({live?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'evaluation'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Model Evaluation
          </button>
          <button
            onClick={fetchDashboardData}
            title="Refresh statistics"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-850 transition-colors ml-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* TAB 1: Training Dataset Analytics */}
      {activeTab === 'dataset' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
              <span className="text-[11px] text-slate-400 block">Total Dataset Postings</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">17,880</div>
              <span className="text-[10px] text-slate-500">University of the Aegean</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
              <span className="text-[11px] text-slate-400 block">Fraudulent Class</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">866 (4.84%)</div>
              <span className="text-[10px] text-slate-500">Positive minority class</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
              <span className="text-[11px] text-slate-400 block">Legitimate Class</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">17,014 (95.16%)</div>
              <span className="text-[10px] text-slate-500">Majority authentic jobs</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5">
              <span className="text-[11px] text-slate-400 block">Remote Fraud Rate</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">18.2%</div>
              <span className="text-[10px] text-slate-500">vs 3.1% for On-Site jobs</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-semibold text-slate-200">
                EMSCAD Class Imbalance Distribution (19.6 : 1 Ratio)
              </h3>
              <p className="text-[11px] text-slate-400">
                Fraudulent records account for under 5% of total postings, necessitating class-balanced loss weights.
              </p>
              <div className="h-52 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datasetPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${(name || '').split(' ')[0]} (${((percent || 0) * 100).toFixed(1)}%)`}
                    >
                      {datasetPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vulnerability Bar Chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-semibold text-slate-200">
                Structural Fraud Vulnerability Comparison (%)
              </h3>
              <p className="text-[11px] text-slate-400">
                Correlation between posting attributes and recruitment fraud probability.
              </p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vulnerabilityData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" domain={[0, 22]} stroke="#64748b" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="category" type="category" width={140} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                      formatter={(val: any) => [`${val}%`, 'Fraud Rate']}
                    />
                    <Bar dataKey="fraudRate" fill="#f43f5e" radius={[0, 3, 3, 0]} name="Fraud Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Salary Distribution by Class */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-200">
              Advertised Salary Range Distribution by Class
            </h3>
            <p className="text-[11px] text-slate-400">
              Frequency of postings stating specified compensation brackets in the EMSCAD corpus.
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelArtifacts.salaryDistribution}>
                  <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="legitimate" fill="#10b981" name="Legitimate Jobs" />
                  <Bar dataKey="fraudulent" fill="#f43f5e" name="Fraudulent Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Real User Analysis History */}
      {activeTab === 'user' && (
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Real User Analyses Saved: <strong>{live?.total || 0} postings</strong></span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Source: Account Security Records</span>
          </div>

          {live && live.total > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Risk Distribution */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
                <h3 className="text-xs font-semibold text-slate-200">
                  User Postings Risk Category Distribution
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userCatData}>
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                      />
                      <Bar dataKey="count" name="Analyses Count" radius={[3, 3, 0, 0]}>
                        {userCatData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Warning Signs */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
                <h3 className="text-xs font-semibold text-slate-200">
                  Most Frequent Indicators in User Submissions
                </h3>
                <div className="space-y-2 pt-1">
                  {live.liveWarningFrequencies && live.liveWarningFrequencies.length > 0 ? (
                    live.liveWarningFrequencies.slice(0, 5).map((w: any, idx: number) => (
                      <div key={idx} className="bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-300 truncate max-w-xs">{w.name}</span>
                        <span className="font-mono text-cyan-400 font-bold">{w.count} times ({w.percentage}%)</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      No warning indicators logged yet in user submissions.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-2">
              <FileText className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="font-medium text-slate-300">No user submissions recorded yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                User metrics are derived strictly from your real local history. Scan a job posting in the Job Analyzer to populate this section.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Test-Set Evaluation & Confusion Matrix */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-200">
                  Test Split Evaluation Metrics (N = 3,576 Held-Out Records)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Evaluated on 20% stratified test split using TF-IDF + Class-Balanced Logistic Regression.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ROC-AUC: 0.963
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-sans block">Accuracy</span>
                <span className="text-base font-bold text-white">98.1%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-sans block">Precision (Fraud)</span>
                <span className="text-base font-bold text-emerald-400">88.4%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-sans block">Recall (Fraud)</span>
                <span className="text-base font-bold text-cyan-400">76.2%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-sans block">F1-Score (Fraud)</span>
                <span className="text-base font-bold text-purple-300">81.8%</span>
              </div>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-200">
              Held-Out Test Set Confusion Matrix (N = 3,576)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">True Positives (TP)</span>
                <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                  {modelArtifacts.confusionMatrix.truePositive}
                </div>
                <span className="text-[10px] text-slate-400">Scams correctly flagged</span>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">False Positives (FP)</span>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                  {modelArtifacts.confusionMatrix.falsePositive}
                </div>
                <span className="text-[10px] text-slate-400">Legitimate flagged as scam (0.5% rate)</span>
              </div>

              <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">False Negatives (FN)</span>
                <div className="text-2xl font-bold font-mono text-rose-300 mt-1">
                  {modelArtifacts.confusionMatrix.falseNegative}
                </div>
                <span className="text-[10px] text-slate-400">Scams missed by model (23.8% of scams)</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">True Negatives (TN)</span>
                <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
                  {modelArtifacts.confusionMatrix.trueNegative.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400">Legitimate verified (99.5% rate)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
