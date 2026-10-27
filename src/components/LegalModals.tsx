import React from 'react';
import { X, Shield, Lock, FileText, Mail, CheckCircle2, User as UserIcon, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Privacy Policy</h3>
              <p className="text-xs text-slate-400">Last updated: October 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">1. Commitment to Candidate Confidentiality</h4>
            <p>
              JobShield AI is engineered to empower job seekers without compromising their personal security. We do not sell, rent, or monetize your job submissions, search queries, or account credentials.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">2. Data We Process</h4>
            <p>
              When analyzing a job posting, our NLP engine extracts linguistic tokens (n-grams) and structured compensation indicators. We explicitly advise users <strong>never to enter Social Security Numbers, banking passwords, or personal photo IDs</strong> into the analyzer form.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">3. Account & History Isolation</h4>
            <p>
              Each registered user’s analysis history is strictly isolated on the server using cryptographically salted identifiers. Another user cannot query, view, or delete your archived reports.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">4. Data Deletion</h4>
            <p>
              You have the right to purge individual analysis records or your entire analysis history at any time through the History interface. Deleted records are permanently purged from active storage.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Terms of Use & Disclaimer</h3>
              <p className="text-xs text-slate-400">Please review before using JobShield AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <strong>Critical Decision-Support Notice:</strong> JobShield AI produces probabilistic risk estimates based on statistical NLP features and empirical scam indicators. It does not provide legal counsel, formal fraud certification, or guarantees of employer legitimacy.
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">1. Nature of the Risk Index</h4>
            <p>
              A score of 0–29 indicates low statistical correlation with known fraudulent patterns in the EMSCAD corpus; it does <strong>not guarantee</strong> that an employer is legitimate. Conversely, a high risk score (80–100) reflects linguistic and heuristic markers typical of recruitment scams, but does not constitute judicial proof of criminal activity.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">2. Candidate Diligence Duty</h4>
            <p>
              Users agree to conduct independent verification before sending identification records or accepting offers. Candidates must independently verify the company's official website, confirm that the recruiter's email matches the verified corporate domain, and never transfer money or cash third-party cashier checks.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">3. Limitation of Liability</h4>
            <p>
              JobShield AI and its authors are not liable for any financial losses, employment decisions, or third-party interactions arising from the use of this service.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Contact & Inquiries</h3>
              <p className="text-xs text-slate-400">Security feedback & scam reports</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Inquiry Received</h4>
            <p className="text-xs text-slate-400">Thank you for helping keep the job-seeking community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Subject</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500">
                <option>Report a New Scam Technique</option>
                <option>False Positive / Classification Feedback</option>
                <option>Academic & Research Inquiry</option>
                <option>General Support</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Describe the issue or share relevant job posting details..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-sm"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  if (!isOpen || !user) return null;

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Account Settings</h3>
              <p className="text-xs text-slate-400">Personal workspace & data privacy</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>Joined {formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-slate-300">
            <span className="font-semibold text-cyan-400 block">Private Workspace Guarantee</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Your job analysis history is isolated to your account ID on the server. No other user has access to your submitted jobs.
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Sign Out of Account
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
