import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { AppLayout } from './components/AppLayout.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { AuthPages, AuthMode } from './pages/AuthPages.tsx';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage.tsx';
import { AnalyzePage } from './pages/AnalyzePage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ModelInsightsPage } from './pages/ModelInsightsPage.tsx';
import { PatternsPage } from './pages/PatternsPage.tsx';
import { HistoryPage } from './pages/HistoryPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { PrivacyModal, TermsModal, ContactModal, ProfileModal } from './components/LegalModals.tsx';
import { JobSubmission, AnalysisResult } from './types/jobshield.ts';
import { MainNavPage } from './components/Navbar.tsx';
import { getLocalHistory } from './utils/historyStorage.ts';

function MainAppContent() {
  const { user, isAuthenticated, isLoading: authLoading, getAuthHeaders } = useAuth();
  
  // Navigation states
  const [currentPage, setCurrentPage] = useState<MainNavPage | 'landing' | 'auth'>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Analysis workflow states
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [prefillSubmission, setPrefillSubmission] = useState<JobSubmission | undefined>(undefined);
  const [historyCount, setHistoryCount] = useState<number>(0);

  // Modals state
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const refreshHistoryCount = () => {
    if (!isAuthenticated) {
      setHistoryCount(0);
      return;
    }
    const local = getLocalHistory(user?.email || user?.id);
    if (local.length > 0) {
      setHistoryCount(local.length);
    }
    fetch('/api/history', {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setHistoryCount(Math.max(data.length, local.length));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshHistoryCount();
  }, [user, isAuthenticated]);

  // Route protection: redirect to login if private history is accessed directly while unauthenticated
  useEffect(() => {
    if (currentPage === 'history' && !isAuthenticated && !authLoading) {
      setAuthMode('login');
      setCurrentPage('auth');
    }
  }, [currentPage, isAuthenticated, authLoading]);

  const handleStartAnalysis = (sample?: JobSubmission) => {
    setCurrentAnalysis(null);
    setPrefillSubmission(sample);
    setCurrentPage('analyze');
  };

  const handleAnalysisSuccess = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
    if (isAuthenticated) {
      setHistoryCount(prev => prev + 1);
    }
    setCurrentPage('analyze');
  };

  const handleSelectReportFromHistory = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
    setCurrentPage('analyze');
  };

  const handleSelectPostingFromPatterns = (id: string) => {
    if (!isAuthenticated) {
      handleOpenAuth('login');
      return;
    }
    fetch(`/api/history/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: AnalysisResult | null) => {
        if (data) {
          setCurrentAnalysis(data);
          setCurrentPage('analyze');
        }
      })
      .catch(err => console.error('Error selecting posting:', err));
  };

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleOpenProfile = () => {
    if (!isAuthenticated) {
      handleOpenAuth('login');
    } else {
      setProfileModalOpen(true);
    }
  };

  const handleNavigate = (page: MainNavPage | 'landing' | 'auth') => {
    // Intercept private routes
    if (page === 'history' && !isAuthenticated && !authLoading) {
      handleOpenAuth('login');
      return;
    }
    if (page === 'analyze') {
      setCurrentAnalysis(null);
      setPrefillSubmission(undefined);
    }
    setCurrentPage(page);
  };

  return (
    <>
      {/* 1. Public Landing Page */}
      {currentPage === 'landing' && (
        <AppLayout
          activePage="landing"
          onNavigate={handleNavigate}
          historyCount={historyCount}
          onOpenProfile={handleOpenProfile}
          onOpenAuth={handleOpenAuth}
          onStartNewAnalysis={() => handleStartAnalysis()}
        >
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            onNavigate={(page) => handleNavigate(page as MainNavPage)}
            onOpenAuth={handleOpenAuth}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
            onOpenTerms={() => setTermsModalOpen(true)}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </AppLayout>
      )}

      {/* 2. Authentication View (Login, Signup, Forgot, Reset) */}
      {currentPage === 'auth' && (
        <AppLayout
          activePage="auth"
          onNavigate={handleNavigate}
          historyCount={historyCount}
          onOpenProfile={handleOpenProfile}
          onOpenAuth={handleOpenAuth}
          onStartNewAnalysis={() => handleStartAnalysis()}
        >
          <AuthPages
            initialMode={authMode}
            onAuthSuccess={() => {
              refreshHistoryCount();
              setCurrentPage('overview');
            }}
            onCancel={() => setCurrentPage('overview')}
            onOpenTerms={() => setTermsModalOpen(true)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
          />
        </AppLayout>
      )}

      {/* 3. SaaS App Workspace (Overview, Analyze, Dashboard, Patterns, Model Insights, History, About) */}
      {currentPage !== 'landing' && currentPage !== 'auth' && (
        <AppLayout
          activePage={currentPage}
          onNavigate={handleNavigate}
          historyCount={historyCount}
          onOpenProfile={handleOpenProfile}
          onOpenAuth={handleOpenAuth}
          onStartNewAnalysis={() => {
            setCurrentAnalysis(null);
            setPrefillSubmission(undefined);
            setCurrentPage('analyze');
          }}
        >
          {currentPage === 'overview' && (
            <DashboardOverviewPage
              onStartAnalysis={handleStartAnalysis}
              onSelectReport={handleSelectReportFromHistory}
              onNavigate={(page) => handleNavigate(page as MainNavPage)}
            />
          )}

          {currentPage === 'analyze' && (
            <AnalyzePage
              initialSubmission={prefillSubmission}
              activeAnalysisResult={currentAnalysis}
              onAnalysisSuccess={handleAnalysisSuccess}
              onClearActiveAnalysis={() => {
                setCurrentAnalysis(null);
                setPrefillSubmission(undefined);
              }}
              onNavigateToHistory={() => handleNavigate('history')}
              onNavigate={(page) => handleNavigate(page as MainNavPage)}
            />
          )}

          {currentPage === 'dashboard' && <DashboardPage />}

          {currentPage === 'patterns' && (
            <PatternsPage
              onSelectPosting={handleSelectPostingFromPatterns}
              onNavigateToAnalyze={() => {
                setCurrentAnalysis(null);
                setCurrentPage('analyze');
              }}
            />
          )}

          {currentPage === 'model-insights' && <ModelInsightsPage />}

          {currentPage === 'history' && (
            <HistoryPage
              onSelectReport={handleSelectReportFromHistory}
              onNavigateToAnalyze={() => {
                setCurrentAnalysis(null);
                setCurrentPage('analyze');
              }}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentPage === 'about' && <AboutPage />}
        </AppLayout>
      )}

      {/* Legal & Profile Modals */}
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
