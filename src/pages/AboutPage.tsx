import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  Code2,
  Server,
  BrainCircuit,
  Database,
  FileCode,
  Terminal,
  Info
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>About JobShield AI</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Project architecture, data science methodology, technology stack, and academic citations.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 sm:p-5 space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Problem Statement & Objective</span>
        </h2>
        <p className="text-xs text-sm text-slate-300 leading-relaxed">
          Online recruitment scams exploit job seekers through advance-fee demands, fake cashier check deposits, and identity theft. Traditional black-box classifiers that output a simple binary "fake" label fail to provide candidates with the evidence needed to verify suspicious claims.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>JobShield AI</strong> develops a data-driven system that analyzes job postings, estimates risk on a calibrated 0–100 index, provides 5-dimension evidence explanations, and detects cross-posting template reuse across shell companies.
        </p>
      </div>

      {/* Project Team & Contributors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Project Team & Research Contributors</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual role allocation and contributions to the JobShield AI system.
            </p>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded text-[11px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
            3 Core Contributors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Member 1: Athira Arun */}
          <div className="bg-slate-900/80 border border-cyan-800/50 hover:border-cyan-500/60 rounded-xl p-5 space-y-3.5 transition-all shadow-lg shadow-cyan-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md">
                AA
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Athira Arun</h3>
                <span className="inline-block text-[11px] font-semibold text-cyan-400">
                  ML Development & System Lead
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Assigned Contributions:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                ML model development, NLP-based scam detection, risk scoring, system integration, and overall project implementation.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                ML Pipeline
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                NLP Detection
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                Risk Scoring
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                System Integration
              </span>
            </div>
          </div>

          {/* Member 2: Shradha Krishna */}
          <div className="bg-slate-900/80 border border-purple-800/50 hover:border-purple-500/60 rounded-xl p-5 space-y-3.5 transition-all shadow-lg shadow-purple-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                SK
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Shradha Krishna</h3>
                <span className="inline-block text-[11px] font-semibold text-purple-400">
                  Data Science & Pattern Analysis
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Assigned Contributions:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dataset collection, preprocessing, exploratory data analysis, and scam-pattern analysis.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/60 text-purple-300 border border-purple-800/40">
                Dataset Collection
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                Preprocessing
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                EDA Research
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                Pattern Analysis
              </span>
            </div>
          </div>

          {/* Member 3: Shamini S */}
          <div className="bg-slate-900/80 border border-emerald-800/50 hover:border-emerald-500/60 rounded-xl p-5 space-y-3.5 transition-all shadow-lg shadow-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md">
                SS
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Shamini S</h3>
                <span className="inline-block text-[11px] font-semibold text-emerald-400">
                  UI/UX & Documentation Lead
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Assigned Contributions:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Website UI development, dashboard visualizations, testing, and project documentation.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                UI Development
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                Visualizations
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                System Testing
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                Documentation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Stack Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
            <Code2 className="w-4 h-4" />
            <span>Frontend (React 19)</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>React 19 & TypeScript</li>
            <li>Tailwind CSS v4 (Restrained Dark Navy)</li>
            <li>Recharts interactive charting</li>
            <li>Custom SVG vector risk gauge</li>
            <li>Zero external mock dependencies</li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-xs">
            <Server className="w-4 h-4" />
            <span>Backend Services</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>FastAPI Python backend (<code>backend/</code>)</li>
            <li>Integrated Node/TS Express runner</li>
            <li>SQLite history database (<code>data/jobshield.db</code>)</li>
            <li>TF-IDF Cosine Similarity Matrix</li>
            <li>Input validation & REST endpoints</li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <BrainCircuit className="w-4 h-4" />
            <span>Machine Learning</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>EMSCAD Dataset (17,880 records)</li>
            <li>Sublinear TF-IDF (1 + ln(tf))</li>
            <li>Class-Balanced Logistic Regression</li>
            <li>Linear Feature Attribution (phi_i = w_i * x_i)</li>
            <li>Random Forest & Naive Bayes evaluation</li>
          </ul>
        </div>
      </div>

      {/* Execution Instructions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3 font-mono text-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-sans flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Local Execution Commands</span>
        </h2>

        <div className="space-y-2 text-slate-300">
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1 font-semibold">
              Option A: Full-Stack Integrated Runner (Port 3000)
            </span>
            <code>npm run dev</code>
          </div>

          <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1 font-semibold">
              Option B: Python FastAPI Backend (Port 8000)
            </span>
            <code>cd backend && pip install -r requirements.txt && uvicorn main:app --port 8000</code>
          </div>
        </div>
      </div>

      {/* Academic Citation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>Academic Dataset Citation</span>
        </h2>
        <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed">
          Vidros, S., Kolias, C., Kambourakis, G., & Akoglu, L. (2017). Automatic Detection of Online Recruitment Frauds: Characteristics, Methods, and a Public Dataset. Future Internet, 9(1), 6.
          <br /><br />
          Laboratory of Information & Communication Systems Security (Info-Sec-Lab), University of the Aegean, Samos, Greece.
        </div>
      </div>
    </div>
  );
};
