import React, { useState } from 'react';
import {
  Shield,
  Search,
  BarChart3,
  Layers,
  BrainCircuit,
  History,
  Info,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { MainNavPage } from './Navbar.tsx';

interface AppLayoutProps {
  activePage: MainNavPage | 'landing' | 'auth';
  onNavigate: (page: MainNavPage | 'landing' | 'auth') => void;
  historyCount: number;
  onOpenProfile: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onStartNewAnalysis: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activePage,
  onNavigate,
  historyCount,
  onOpenProfile,
  onOpenAuth,
  children
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // The 7 original navigation items
  const navItems: { id: MainNavPage; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'analyze', label: 'Analyze Job', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'patterns', label: 'Scam Patterns', icon: Layers },
    { id: 'model-insights', label: 'Model Insights', icon: BrainCircuit },
    { id: 'history', label: 'History', icon: History, badge: historyCount },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleNavClick = (id: MainNavPage | 'landing') => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Bar - Original Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Brand Identity */}
            <div
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  JobShield<span className="text-cyan-400"> AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  EMSCAD v1.2
                </span>
              </div>
            </div>

            {/* Desktop Main Navigation - 7 Items */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold border border-slate-700/80'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: User Authentication Controls */}
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-xs cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline font-medium text-slate-200 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 text-xs z-50 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <div className="font-semibold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('history');
                        }}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Scans ({historyCount})</span>
                      </button>

                      <div className="border-t border-slate-800 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile dropdown navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-800/80 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-cyan-400 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Mobile Auth actions */}
              <div className="border-t border-slate-800/80 pt-2 mt-2">
                {isAuthenticated && user ? (
                  <div className="px-3 py-1 flex items-center justify-between">
                    <span className="text-xs text-slate-400 truncate">{user.email}</span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 px-3 pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('login');
                      }}
                      className="flex-1 py-1.5 text-center text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signup');
                      }}
                      className="flex-1 py-1.5 text-center text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Global Project Contributor Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-400 py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Shield className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-300">JobShield AI</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">Academic & Research Project</span>
          </div>

          {/* Quick Team Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <span className="text-slate-500 font-medium">Developed by:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-cyan-800/40 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <strong className="text-cyan-300 font-semibold">Athira Arun</strong>
              <span className="text-slate-500 hidden sm:inline">(ML & System Lead)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-purple-800/40 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <strong className="text-purple-300 font-semibold">Shradha Krishna</strong>
              <span className="text-slate-500 hidden sm:inline">(Data Science & EDA)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-800/40 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <strong className="text-emerald-300 font-semibold">Shamini S</strong>
              <span className="text-slate-500 hidden sm:inline">(UI/UX & Documentation)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('about')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline text-[11px] cursor-pointer"
            >
              View Full Team & Roles
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
