import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  Briefcase,
  Lock,
  Shield,
  ShieldAlert,
  AlertTriangle,
  X,
  LogIn,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { AnalysisResult, RiskCategory } from '../types/jobshield.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  getLocalHistory,
  saveLocalHistory,
  deleteLocalHistoryItem,
  clearLocalHistory,
  seedSampleHistory
} from '../utils/historyStorage.ts';

interface HistoryPageProps {
  onSelectReport: (analysis: AnalysisResult) => void;
  onNavigateToAnalyze: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectReport,
  onNavigateToAnalyze,
  onOpenAuth
}) => {
  const { user, isAuthenticated, isLoading: authLoading, getAuthHeaders } = useAuth();
  const [historyList, setHistoryList] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Destructive Action Modal States (replacing window.confirm)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AnalysisResult | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  const userKey = user?.email || user?.id || 'guest';

  const fetchHistory = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      setHistoryList([]);
      return;
    }

    // 1. Immediately populate from local cache to prevent empty screen or loading delays
    const localRecords = getLocalHistory(userKey);
    if (localRecords.length > 0) {
      setHistoryList(localRecords);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetch('/api/history', {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData)) {
          // Merge server records with local records deduplicated by id
          const serverIds = new Set(serverData.map((d: AnalysisResult) => d.id));
          const localOnly = localRecords.filter(r => !serverIds.has(r.id));
          const merged = [...serverData, ...localOnly].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          saveLocalHistory(userKey, merged);
          setHistoryList(merged);
        }
      } else if (res.status === 401) {
        // If server reports unauthorized, retain verified local records if available
        if (localRecords.length === 0) {
          setHistoryList([]);
        }
      } else {
        // Server returned non-200 (e.g. serverless cold start): fallback to local records cleanly
        if (localRecords.length === 0) {
          setHistoryList([]);
        }
      }
    } catch (err) {
      console.warn('Network issue fetching server history, using local cache:', err);
      if (localRecords.length === 0) {
        setHistoryList([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchHistory();
    }
  }, [user, isAuthenticated, authLoading]);

  // Seed sample demonstration scans
  const handleSeedSamples = () => {
    const seeded = seedSampleHistory(userKey);
    setHistoryList(seeded);
    setFeedbackMsg({ type: 'success', text: 'Loaded 3 benchmark verification records into your personal history.' });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Handle single item deletion with ownership confirmation
  const handleConfirmDeleteSingle = async () => {
    if (!itemToDelete) return;
    setIsDeletingSingle(true);

    // Immediately remove from local storage and UI
    deleteLocalHistoryItem(userKey, itemToDelete.id);
    setHistoryList(prev => prev.filter(item => item.id !== itemToDelete.id));

    try {
      await fetch(`/api/history/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => null);

      setFeedbackMsg({ type: 'success', text: `Record for "${itemToDelete.submission?.title}" deleted successfully.` });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch {
      // Local deletion was already completed
    } finally {
      setIsDeletingSingle(false);
      setItemToDelete(null);
    }
  };

  // Handle clearing all personal history with ownership confirmation
  const handleConfirmClearAll = async () => {
    setIsDeletingAll(true);

    // Immediately clear local storage and UI
    clearLocalHistory(userKey);
    setHistoryList([]);
    setIsClearModalOpen(false);

    try {
      await fetch('/api/history', {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => null);

      setFeedbackMsg({ type: 'success', text: 'Your personal analysis history was cleared successfully.' });
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch {
      // Local clear already succeeded
    } finally {
      setIsDeletingAll(false);
    }
  };

  const filteredHistory = historyList.filter(item => {
    const title = item.submission?.title || '';
    const company = item.submission?.company || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.riskCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat: RiskCategory) => {
    switch (cat) {
      case 'very_high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">Very High</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">High</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Moderate</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Low</span>;
    }
  };

  // 1. Unauthenticated Security Shield Gate
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-950/40">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-800/60">
            <Shield className="w-3.5 h-3.5" />
            <span>PROTECTED USER WORKSPACE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your job scam scan records and forensic risk reports are privately stored and isolated to your verified account. Please sign in or create an account to view your audit history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onOpenAuth && (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Log In to View History</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Create Free Account</span>
              </button>
            </>
          )}
        </div>

        <div className="pt-6 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-500/60" />
          <span>Strict server-side isolation: other users never see your scans</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <span>Analysis History</span>
            </h1>
            {user && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Isolated Account
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Personal security audit log for <span className="text-slate-200 font-medium">{user?.email || 'your account'}</span> • Server-enforced isolation.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2.5 border animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="very_high">Very High (80-100)</option>
            <option value="high">High (60-79)</option>
            <option value="moderate">Moderate (30-59)</option>
            <option value="low">Low (0-29)</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
          <span className="inline-block w-6 h-6 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-1" />
          <div>Retrieving your secure history records...</div>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-2.5">
          {filteredHistory.map((item) => {
            const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                onClick={() => onSelectReport(item)}
                className="group bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-cyan-950/20"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-400">{formattedDate}</span>
                    {getCategoryBadge(item.riskCategory)}
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-200">
                      Score: {item.riskScore}/100
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                    {item.submission?.title}
                  </h3>

                  <p className="text-xs text-purple-300 font-medium">
                    {item.submission?.company} • <span className="text-slate-400">{item.submission?.workArrangement || 'Not specified'}</span>
                  </p>

                  {item.warningSigns && item.warningSigns.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {item.warningSigns.slice(0, 2).map((w, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 truncate max-w-xs">
                          {w.title}
                        </span>
                      ))}
                      {item.warningSigns.length > 2 && (
                        <span className="text-[10px] text-slate-500">
                          +{item.warningSigns.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-medium text-cyan-400 flex items-center gap-1 group-hover:underline">
                    <span>View Report</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete(item);
                    }}
                    title="Delete record from your account"
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">No Analysis Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {searchQuery || categoryFilter !== 'all'
              ? 'No history records match your search filter criteria.'
              : 'You have not scanned any job postings under this account yet. Jobs you analyze will be stored securely here.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={onNavigateToAnalyze}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              Scan a Job Posting
            </button>
            <button
              onClick={handleSeedSamples}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Sample Scans</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear All History */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-400">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Clear Analysis History?</h3>
              </div>
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Are you sure you want to permanently clear your personal analysis history?
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>• Total records to delete: <strong className="text-white">{historyList.length} scans</strong></div>
                <div>• Account: <strong className="text-cyan-400">{user?.email}</strong></div>
                <div>• This action is irreversible and permanently removes your audit log.</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                disabled={isDeletingAll}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                disabled={isDeletingAll}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingAll ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Clear History</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Single Item */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-400">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Delete Job Scan Record?</h3>
              </div>
              <button
                onClick={() => setItemToDelete(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Delete the analysis report for <strong className="text-white">"{itemToDelete.submission?.title}"</strong> at <strong className="text-purple-300">{itemToDelete.submission?.company}</strong>?
              </p>
              <p className="text-[11px] text-slate-500">
                This record will be permanently deleted from your personal history.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeletingSingle}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                disabled={isDeletingSingle}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingSingle ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
