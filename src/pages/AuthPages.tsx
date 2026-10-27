import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Search,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

interface AuthPagesProps {
  initialMode?: AuthMode;
  onAuthSuccess: () => void;
  onCancel: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onCancel,
  onOpenTerms,
  onOpenPrivacy
}) => {
  const { login, signup, forgotPassword, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatedTokenPreview, setGeneratedTokenPreview] = useState<string | null>(null);

  // Password strength heuristics
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const passwordScore = [hasMinLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password, rememberMe);
        if (result.success) {
          onAuthSuccess();
        } else {
          setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else if (mode === 'signup') {
        if (!agreedToTerms) {
          setErrorMessage('Please accept the Terms of Use and Privacy Policy to proceed.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (passwordScore < 2) {
          setErrorMessage('Please choose a stronger password (minimum 8 characters with letters and numbers).');
          setLoading(false);
          return;
        }

        const result = await signup(name, email, password);
        if (result.success) {
          onAuthSuccess();
        } else {
          setErrorMessage(result.error || 'Failed to create account. Please check your information.');
        }
      } else if (mode === 'forgot') {
        const result = await forgotPassword(email);
        if (result.success) {
          setSuccessMessage(result.message || 'Password reset instructions have been generated.');
          if (result.resetToken) {
            setGeneratedTokenPreview(result.resetToken);
            setResetToken(result.resetToken);
          }
        } else {
          setErrorMessage(result.error || 'Unable to process reset request.');
        }
      } else if (mode === 'reset') {
        if (password !== confirmPassword) {
          setErrorMessage('New passwords do not match.');
          setLoading(false);
          return;
        }
        const result = await resetPassword(resetToken, password);
        if (result.success) {
          setSuccessMessage('Password successfully updated! You can now sign in.');
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setConfirmPassword('');
          }, 1500);
        } else {
          setErrorMessage(result.error || 'Failed to reset password. The token may be expired or invalid.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Col: Brand & Value Proposition (Cybersecurity Aesthetics) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white">
                  JobShield<span className="text-cyan-400"> AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">Workspace Authentication</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Private Job Safety Intelligence</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Detect deceptive job offers before applying.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in to maintain your private scan history, review recurrent fraud clusters, and save explainable risk reports across sessions.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Strict Isolation:</strong> Your scanned records are stored privately and tied to your account ID.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <Database className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">EMSCAD Benchmark:</strong> Calibrated with 17,880 verified job postings.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <Search className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">5-Dimension Attribution:</strong> Detailed breakdown of linguistic and heuristic indicators.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Security: SHA-256 + Scrypt</span>
            <span>v1.2 SaaS Engine</span>
          </div>
        </div>

        {/* Right Col: Interactive Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-slate-900/90 flex flex-col justify-center">
          {/* Header Switcher */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                {mode === 'login' && 'Sign in to JobShield AI'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Reset your password'}
                {mode === 'reset' && 'Set a new password'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'login' && 'Enter your credentials to access your protected workspace.'}
                {mode === 'signup' && 'Start analyzing job postings with private history tracking.'}
                {mode === 'forgot' && 'Enter your email to receive a secure recovery token.'}
                {mode === 'reset' && 'Provide your reset token and select a new password.'}
              </p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <span>{successMessage}</span>
                {generatedTokenPreview && (
                  <div className="mt-2 p-2 bg-slate-950 rounded border border-emerald-500/20 font-mono text-[11px] text-emerald-200 break-all select-all">
                    Reset Token: <strong>{generatedTokenPreview}</strong>
                    <div className="mt-1 text-[10px] text-slate-400 font-sans">
                      (Copied to input below. Click "Proceed to Set New Password".)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name for Signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Reset Token for Reset mode */}
            {mode === 'reset' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Recovery Token</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter 64-char token or paste from instructions"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password input */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter password'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength indicator on signup */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-colors ${
                            passwordScore >= step
                              ? passwordScore <= 2
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Strength: {passwordScore <= 1 ? 'Weak' : passwordScore <= 3 ? 'Good' : 'Strong'}</span>
                      <span>8+ chars with letters & numbers</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password input for signup and reset */}
            {(mode === 'signup' || mode === 'reset') && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me for Login */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>
            )}

            {/* Terms checkbox for Signup */}
            {mode === 'signup' && (
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none text-slate-300 text-[11px] leading-tight">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTerms();
                      }}
                      className="text-cyan-400 underline hover:text-cyan-300 cursor-pointer"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPrivacy();
                      }}
                      className="text-cyan-400 underline hover:text-cyan-300 cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Token'}
                      {mode === 'reset' && 'Update Password'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Alternative helper if in forgot mode and token preview is present */}
            {mode === 'forgot' && generatedTokenPreview && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium transition-colors"
                >
                  Proceed to Set New Password →
                </button>
              </div>
            )}
          </form>

          {/* Mode Switcher Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              {mode === 'login' ? (
                <span className="text-slate-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span className="text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-300 transition-colors text-[11px] cursor-pointer"
            >
              Continue without signing in →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
