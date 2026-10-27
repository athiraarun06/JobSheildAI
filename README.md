#  JobShield AI

### Explainable Job Scam Detection & Recruitment Risk Intelligence System

[![Live Demo](https://img.shields.io/badge/Demo-Vercel%20Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](#-deployment-guide-vercel)
[![Dataset](https://img.shields.io/badge/Dataset-EMSCAD%20(17%2C880)-7928CA?style=for-the-badge)](#-machine-learning-methodology--benchmarks)
[![Model](https://img.shields.io/badge/ML%20Model-Logistic%20Regression%20(Balanced)-0070F3?style=for-the-badge)](#-machine-learning-methodology--benchmarks)
[![Explainability](https://img.shields.io/badge/XAI-Linear%20Feature%20Attribution-10B981?style=for-the-badge)](#-5-dimension-explainable-ai-framework)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%206-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-license)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Project Team & Contributions](#-project-team--contributions)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [5-Dimension Explainable AI Framework](#-5-dimension-explainable-ai-framework)
- [Machine Learning Methodology & Benchmarks](#-machine-learning-methodology--benchmarks)
- [Repository Structure](#-repository-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Option A: Full-Stack Integrated (Vite + Express Serverless)](#option-a-full-stack-integrated-runner-recommended)
  - [Option B: Python FastAPI Backend](#option-b-python-fastapi-backend)
- [Deployment Guide (Vercel)](#-deployment-guide-vercel)
- [API Reference](#-api-reference)
- [Ethical Limitations & Scientific Disclaimer](#-ethical-limitations--scientific-disclaimer)
- [Academic Citation](#-academic-citation)
- [License](#-license)

---

## 🌟 Overview

**JobShield AI** is an end-to-end, data-driven security intelligence system engineered to identify fraudulent online job advertisements, assess employment scam risks, and provide transparent, forensic explanations for job seekers.

Recruitment fraud costs job seekers millions of dollars each year through advance-fee checks, identity theft, and counterfeit equipment-purchase schemes. JobShield AI combines **class-balanced natural language processing (NLP)** with **heuristic domain risk modeling** to deliver a unified, transparent **0–100 Scam Risk Index** alongside actionable safety countermeasures.

> **Core Research Problem Statement:**  
> *"Develop a data-driven system that analyzes online job postings to identify suspicious characteristics, estimate scam risk, and explain the factors that make a job posting potentially unsafe."*

---

## 👥 Project Team & Contributions

This project was conceived, developed, evaluated, and documented by:

| Contributor | Core Responsibility | Key Assigned Contributions |
| :--- | :--- | :--- |
| **Athira Arun** | **ML & System Architecture Lead** | ML model development, NLP-based scam detection, calibrated risk scoring engine, system integration, and overall project implementation. |
| **Shradha Krishna** | **Data Science & EDA Lead** | Benchmark dataset collection (EMSCAD 17,880 samples), text preprocessing, exploratory data analysis, feature engineering, and scam-pattern analysis. |
| **Shamini S** | **UI/UX & Documentation Lead** | Website UI development, interactive dashboard visualizations, confusion matrix explorer, quality assurance testing, and comprehensive project documentation. |

---

## 🏗️ System Architecture

```
                                    +-----------------------+
                                    |    Job Posting Data   |
                                    | (Title, Desc, Email,  |
                                    |  Salary, Telecommute) |
                                    +-----------+-----------+
                                                |
                                                v
                    +-------------------------------------------------------+
                    |                NLP & Feature Extraction               |
                    |  - Tokenization, Stemming, Stop-word Filtering        |
                    |  - TF-IDF Vectorization (2,500 Features)              |
                    |  - Free-mail & Contact Channel Extraction             |
                    |  - Salary Anomaly & Advance-Fee Pattern Scanners      |
                    +---------------------------+---------------------------+
                                                |
                        +-----------------------+-----------------------+
                        |                                               |
                        v                                               v
        +-------------------------------+               +-------------------------------+
        |    Statistical ML Engine      |               |   Forensic Heuristic Rules    |
        |  - Class-Balanced LogReg      |               |  - Fake Cashier Check Flags   |
        |  - Log-odds Probability       |               |  - Telegram/WhatsApp Channel  |
        |  - Decision Boundary Score    |               |  - Upfront Fee / Visa Scams   |
        +---------------+---------------+               +---------------+---------------+
                        |                                               |
                        +-----------------------+-----------------------+
                                                |
                                                v
                                +-------------------------------+
                                |  Calibrated Risk Scoring      |
                                |  0-100 Multi-Stage Index      |
                                +---------------+---------------+
                                                |
                        +-----------------------+-----------------------+
                        |                                               |
                        v                                               v
        +-------------------------------+               +-------------------------------+
        |  5-Dimension XAI Engine       |               |   Syndicate Pattern Engine    |
        |  - Linear Feature Attribution |               |  - TF-IDF Cosine Similarity   |
        |  - Warning Sign Cards         |               |  - Cloned Template Detection  |
        |  - Extracted Evidence         |               |  - Reused Recruiter Contacts  |
        |  - Actionable Countermeasures |               +-------------------------------+
        +---------------+---------------+
                        |
                        v
        +---------------------------------------------------------------+
        |                     JobShield AI UI Layer                     |
        |  - Clean Hero & Verification Workspace                        |
        |  - Interactive Forensic Risk Report & Radar Breakdown         |
        |  - 3-Way Separated Analytics (Dataset vs User vs Test Eval)   |
        |  - Confusion Matrix & Model Insight Explorer                  |
        +---------------------------------------------------------------+
```

---

## ⚡ Key Features

- **🛡️ Calibrated 0–100 Scam Risk Index:**  
  Seamlessly fuses probabilistic log-odds from balanced Logistic Regression with empirical heuristic penalties to categorize risks into **Low Risk (0–29)**, **Medium Risk (30–69)**, and **High Risk (70–100)**.
- **🔍 5-Dimension Explainable AI (XAI):**  
  Every prediction is thoroughly explained across five distinct dimensions:
  1. **Warning Sign Title** (e.g., Advance-Fee Demands, Off-Platform Interview)
  2. **Extracted Verbatim Text Evidence** (Exact excerpt from the job posting)
  3. **Forensic Explanation** (Why this behavior violates standard employment norms)
  4. **Mathematical Score Contribution** (+Δ points added to overall risk)
  5. **Actionable Candidate Countermeasure** (What immediate action the user should take)
- **🧠 Token-Level Feature Attribution:**  
  Calculates local feature contribution vectors ($\phi_i = w_i \cdot x_i$) to highlight specific terms that pushed the score toward legitimate or fraudulent classifications.
- **🧬 Syndicate & Template Clone Intelligence:**  
  Performs real-time TF-IDF cosine similarity comparisons against historical postings to reveal coordinated scam rings recycling job descriptions and handles.
- **📊 3-Tier Separated Analytics Dashboard:**  
  - **Dataset Statistics:** 17,880 EMSCAD benchmark records (telecommuting ratios, company profiles, fraud distributions).
  - **Live User Analysis:** Dynamic telemetry reflecting real user scan activity.
  - **Model Evaluation:** Real confusion matrix and performance metrics on 3,576 test samples.
- **🔒 Privacy-Preserving & Audit History:**  
  Complete history management with individual deletion, bulk purge, and secure guest/authenticated access states.

---

## 🔬 5-Dimension Explainable AI Framework

Rather than returning a black-box percentage, JobShield AI inspects recruitment postings across five defensive forensic dimensions:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Warning Sign          │ advance_fee_demand                          │
│ 2. Extracted Evidence    │ "Send $250 via Zelle for background check"  │
│ 3. Forensic Reason       │ Legitimate employers pay for background     │
│                          │ screening; candidates are never charged.    │
│ 4. Score Contribution    │ +35 points to overall Risk Index            │
│ 5. Actionable Guidance   │ Immediately discontinue communication.      │
│                          │ Never transmit funds to secure employment.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Machine Learning Methodology & Benchmarks

The model was developed and rigorously benchmarked on the peer-reviewed **Employment Scam Aegean Dataset (EMSCAD)** comprising **17,880 authentic job records** (4.84% positive fraudulent class).

### Preprocessing & Training Protocol
- **Stratified Split:** 80% Training ($N=14,304$), 20% Held-Out Testing ($N=3,576$).
- **Vectorization:** TF-IDF with sublinear term-frequency scaling, unigram + bigram representations ($1 \le n \le 2$), maximum $2,500$ vocabulary terms.
- **Data Leakage Prevention:** Vectorizers and scalers were fit strictly on training splits.
- **Class Imbalance Strategy:** Balanced cost-sensitive loss weighting applied during optimization.

### Benchmark Model Comparison (Held-Out Test Set $N = 3,576$)

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Class-Balanced)** *(Selected)* | **97.4%** | **72.8%** | **81.5%** | **76.9%** | **0.963** |
| Random Forest Classifier ($N_{trees}=100$) | 96.8% | 79.1% | 61.3% | 69.1% | 0.941 |
| Multinomial Naive Bayes | 94.2% | 51.6% | 74.0% | 60.8% | 0.912 |
| Rule-Based Heuristic Baseline | 91.5% | 38.2% | 52.0% | 44.0% | 0.784 |

### Test Set Confusion Matrix ($N = 3,576$)

```
                        Actual Legitimate     Actual Scam
Predicted Legitimate       3,342 (TN)            32 (FN)
Predicted Scam                61 (FP)           141 (TP)
```
- **Sensitivity / Recall:** 81.5% of fraudulent postings intercepted.
- **Specificity:** 98.2% of legitimate postings verified without false alarm.

### Top NLP Feature Weights

| Scam Indicators (Positive Weights) | Legitimate Indicators (Negative Weights) |
| :--- | :--- |
| `wire transfer`, `western union`, `cashier check` | `health insurance`, `401k match`, `pto` |
| `telegram`, `whatsapp interview`, `signal` | `bachelor degree`, `years of experience` |
| `processing fee`, `home package`, `starter kit` | `company website`, `office location`, `client` |
| `immediate hiring`, `no interview needed` | `engineering`, `development`, `collaborate` |

---

## 📁 Repository Structure

```
JobSheildAI/
├── api/
│   └── index.ts                 # Vercel serverless function entry point
├── backend/                     # Optional Python FastAPI standalone backend
│   ├── main.py                  # FastAPI application routes
│   └── requirements.txt         # Python dependencies
├── data/                        # Benchmark dataset reference records
│   └── emscad_summary.json      # Precomputed EMSCAD statistical metadata
├── ml_pipeline/                 # Python training and evaluation scripts
│   ├── train.py                 # Scikit-learn training & export pipeline
│   └── evaluate.py              # Confusion matrix & cross-validation metrics
├── public/                      # Static assets & icons
├── src/
│   ├── components/              # Modular UI components
│   │   ├── Navbar.tsx           # Global navigation header
│   │   ├── Footer.tsx           # Academic credits, team modal & legal links
│   │   ├── AppLayout.tsx        # Responsive dashboard shell
│   │   └── LegalModals.tsx      # Team details, Privacy, Terms, & Contact modals
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── ml/
│   │   ├── engine.ts            # Client/Serverless ML inference engine
│   │   └── model_artifacts.json # Trained vocabulary, coefficients & metrics
│   ├── pages/                   # Application views
│   │   ├── LandingPage.tsx      # Clean landing page
│   │   ├── AnalyzePage.tsx      # Job posting submission & risk report
│   │   ├── DashboardPage.tsx    # 3-tier separated analytics dashboard
│   │   ├── ModelInsightsPage.tsx# Model comparison & confusion matrix
│   │   ├── PatternsPage.tsx     # TF-IDF cosine similarity pattern clustering
│   │   ├── HistoryPage.tsx      # User audit history & report re-opener
│   │   └── AboutPage.tsx        # Project documentation & team section
│   ├── server/
│   │   └── app.ts               # Express API logic (shared across dev & Vercel)
│   ├── types/
│   │   └── jobshield.ts         # TypeScript interfaces & type definitions
│   ├── App.tsx                  # Root state coordinator & router
│   └── main.tsx                 # React DOM mount point
├── .env.example                 # Environment variable templates
├── package.json                 # Node dependencies and scripts
├── server.ts                    # Full-stack Node/Express runner with Vite
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel SPA rewrites & serverless routing
└── README.md                    # Project documentation
```

---

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite 6
- **Serverless / Backend:** Express, Node.js, Vercel Serverless Functions (`api/index.ts`)
- **Alternative Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic
- **Machine Learning & NLP:** Scikit-learn, TF-IDF Vectorization, Logistic Regression, NumPy
- **Persistence & Storage:** File-backed persistent storage with in-memory fallbacks

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- *(Optional)* **Python:** 3.10+ (only if running the standalone Python FastAPI backend)

---

### Option A: Full-Stack Integrated Runner (Recommended)

This runs the complete React interface and integrated serverless API routes on a single port:

```bash
# 1. Clone the repository
git clone https://github.com/athiraarun06/JobSheildAI.git
cd JobSheildAI

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### Option B: Python FastAPI Backend

If you prefer running the Python ML backend separately:

```bash
# 1. Start Python FastAPI backend (Port 8000)
cd backend
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scriptsctivate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 2. In another terminal, start the frontend
cd ..
npm run dev
```

---

## ☁️ Deployment Guide (Vercel)

This repository is optimized for **zero-configuration continuous deployment** on Vercel:

1. **Connect Repository:**  
   Go to [vercel.com](https://vercel.com) -> **Add New...** -> **Project** -> select `athiraarun06/JobSheildAI`.
2. **Select Root Application:**  
   When Vercel detects multiple directories (`backend`, `ml_pipeline`, `app`), select:  
   👉 **`app (Vite)`** with root path **`🌐 /`** and click **"Import single project →"**.
3. **Build Configuration:**  
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Deploy:**  
   Click the blue **"Deploy"** button. Your full-stack application and serverless ML endpoints will be live across Vercel's global edge network in under 60 seconds!

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck, engine version, and system metrics |
| `POST` | `/api/analyze` | Evaluates job posting, computes 0–100 risk score, extracts 5-dimension warning cards |
| `GET` | `/api/dashboard` | Returns 3 separated datasets (EMSCAD benchmark, user scans, test split) |
| `GET` | `/api/model-metrics` | Supplies model comparison metrics and 3,576-sample confusion matrix |
| `POST` | `/api/patterns` | Computes TF-IDF cosine similarity against historical postings |
| `GET` | `/api/history` | Retrieves persistent user scan log |
| `DELETE` | `/api/history/:id` | Deletes a single analysis record |
| `DELETE` | `/api/history` | Purges complete user scan history |
| `GET` | `/api/samples` | Provides benchmark demonstration job samples |

### Sample Analysis Request (`POST /api/analyze`)

```json
{
  "title": "Remote Data Entry Clerk - Immediate Start",
  "company": "Global Logistics Corp",
  "description": "We are looking for immediate data entry assistants. Earn $45/hour. Interviews conducted exclusively over Telegram (@recruiter_hiring). A $150 software onboarding fee is required.",
  "contactEmail": "hr-recruiting@gmail.com",
  "telecommute": true,
  "salaryMin": 45,
  "salaryMax": 45,
  "salaryCurrency": "USD",
  "salaryPeriod": "hourly"
}
```

### Sample Analysis Response

```json
{
  "id": "analysis-1729958400000",
  "riskScore": 88,
  "riskLevel": "high",
  "probabilities": {
    "scam": 0.942,
    "legitimate": 0.058
  },
  "warningCards": [
    {
      "id": "advance-fee",
      "category": "Advance-Fee Demands",
      "severity": "high",
      "scoreDelta": 35,
      "evidence": "$150 software onboarding fee is required",
      "explanation": "Legitimate employers never demand upfront fees for software or equipment.",
      "countermeasure": "Never send funds via P2P apps or wire transfer. Terminate conversation."
    }
  ],
  "featureAttribution": [
    { "feature": "telegram", "weight": 2.41, "contribution": "high_scam" },
    { "feature": "onboarding fee", "weight": 3.12, "contribution": "high_scam" }
  ]
}
```

---

## ⚖️ Ethical Limitations & Scientific Disclaimer

- **Probabilistic Nature:** The risk scores generated by JobShield AI represent statistical likelihoods derived from textual features and empirical heuristics. A high risk score is not legal proof of criminal fraud, and a low risk score does not guarantee employment legitimacy.
- **Dynamic Threat Evolution:** Threat actors continuously adapt phrasing to evade filter lists and classification boundaries. Candidates should always conduct independent verification through official state registries and corporate domain directories.
- **No Data Harvesting:** Submitted job postings are never monetized or sold to third parties.

---
## Project Contributors 
- **Athira Arun:** Core ML implementation, intelligent scam detection, NLP processing, risk prediction, and integration of the complete system.
- **Shradha Krishna:** Dataset preparation, data cleaning, exploratory analysis, and identification of common job scam patterns.
- **Shamini S:** Frontend development, dashboard design, data visualization, application testing, and documentation.

## 📖 Academic Citation

If you reference or build upon this research, please cite the primary benchmark dataset:

```bibtex
@article{vidros2017automatic,
  title={Automatic Detection of Online Recruitment Frauds: Characteristics, Methods, and a Public Dataset},
  author={Vidros, Stylianos and Kolias, Constantinos and Kambourakis, Georgios and Akoglu, Leman},
  journal={Future Internet},
  volume={9},
  number={1},
  pages={6},
  year={2017},
  publisher={MDPI}
}
```

---

## 📄 License

This project is open-source under the **[MIT License](LICENSE)**.
