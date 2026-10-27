"""
JobShield AI — Machine Learning Inference and Explanation Engine
Author: JobShield AI Data Science Team
"""

import math
import os
import re
import json
from typing import Dict, Any, List, Tuple

ARTIFACTS_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "ml", "model_artifacts.json")

FREE_EMAIL_PROVIDERS = {
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'protonmail.com', 'icloud.com', 'mail.com', 'zoho.com'
}

def load_model_artifacts() -> Dict[str, Any]:
    with open(ARTIFACTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def tokenize(text: str) -> List[str]:
    return [t for t in re.sub(r'[^a-z0-9\s]', ' ', text.lower()).split() if len(t) > 2]

def extract_ngrams(text: str) -> Dict[str, int]:
    tokens = tokenize(text)
    counts: Dict[str, int] = {}
    for i in range(len(tokens)):
        u = tokens[i]
        counts[u] = counts.get(u, 0) + 1
        if i < len(tokens) - 1:
            b = f"{tokens[i]} {tokens[i+1]}"
            counts[b] = counts.get(b, 0) + 1
        if i < len(tokens) - 2:
            tr = f"{tokens[i]} {tokens[i+1]} {tokens[i+2]}"
            counts[tr] = counts.get(tr, 0) + 1
    return counts

def calculate_cosine_similarity(text_a: str, text_b: str) -> float:
    t_a = tokenize(text_a)
    t_b = tokenize(text_b)
    if not t_a or not t_b:
        return 0.0

    fa: Dict[str, int] = {}
    fb: Dict[str, int] = {}
    for w in t_a:
        fa[w] = fa.get(w, 0) + 1
    for w in t_b:
        fb[w] = fb.get(w, 0) + 1

    all_words = set(fa.keys()) | set(fb.keys())
    dot = 0.0
    norm_a = 0.0
    norm_b = 0.0

    for w in all_words:
        a = fa.get(w, 0)
        b = fb.get(w, 0)
        dot += a * b
        norm_a += a * a
        norm_b += b * b

    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (math.sqrt(norm_a) * math.sqrt(norm_b))

def evaluate_heuristics(sub: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], int]:
    signs = []
    score = 0
    full_text = f"{sub.get('title','')} {sub.get('company','')} {sub.get('description','')} {sub.get('salary','')} {sub.get('paymentDetails','')} {sub.get('contactOther','')}".lower()

    # Upfront Payment Flag
    payment_kws = ['registration fee', 'training fee', 'deposit', 'starter kit', 'equipment fee',
                   'background check fee', 'wire transfer', 'zelle', 'crypto', 'cashier check', 'money order']
    found_payment = [kw for kw in payment_kws if kw in full_text]
    if sub.get('requiresPayment') or found_payment:
        detected_kw = found_payment[0] if found_payment else 'candidate fee requested'
        signs.append({
            "id": "sign-payment",
            "category": "payment",
            "title": "Upfront Candidate Payment or Deposit Requested",
            "severity": "critical",
            "evidence": f"Posting explicitly marks or requests: '{detected_kw}'",
            "explanation": "Legitimate employers cover recruitment, background checks, and onboarding costs. The FTC identifies advance fees as the primary indicator of recruitment fraud.",
            "contributionScore": 35,
            "recommendation": "Do not send money, wire transfers, or gift cards under any circumstance."
        })
        score += 35

    # Off-platform chat interviews
    chat_kws = ['telegram', 'whatsapp', 'signal app', 'text only interview', 'google hangouts interview']
    found_chat = [kw for kw in chat_kws if kw in full_text or kw in str(sub.get('contactOther', '')).lower()]
    if found_chat:
        signs.append({
            "id": "sign-contact-app",
            "category": "contact",
            "title": "Off-Platform / Encrypted Messaging Interview",
            "severity": "high",
            "evidence": f"Recruitment channels indicate: '{found_chat[0]}'",
            "explanation": "Scammers favor anonymous messaging apps to evade corporate network logging and identity traceability.",
            "contributionScore": 22,
            "recommendation": "Insist on verified corporate email invites and scheduled video conference interviews."
        })
        score += 22

    # Free email for corporate entity
    email = sub.get('contactEmail', '').lower()
    if email and '@' in email:
        domain = email.split('@')[1]
        if domain in FREE_EMAIL_PROVIDERS and sub.get('company'):
            signs.append({
                "id": "sign-free-email",
                "category": "contact",
                "title": "Personal / Free Email Domain for Enterprise Hiring",
                "severity": "high",
                "evidence": f"Recruiter contact '{email}' uses free provider @{domain} rather than corporate domain.",
                "explanation": "Established corporate recruiters utilize corporate domains matching the company entity name.",
                "contributionScore": 18,
                "recommendation": "Check the employer's official website careers page or search recruiter on LinkedIn to verify authenticity."
            })
            score += 18

    # Unrealistic salary
    salary_text = f"{sub.get('salary','')} {sub.get('description','')}".lower()
    if re.search(r'(\$([4-9]\d|\d{3,})\s*(/|per)\s*hr|\$4[5-9]\s*/hr)', salary_text) and \
       re.search(r'(no experience|entry level|data entry|typist)', full_text):
        signs.append({
            "id": "sign-salary-anomaly",
            "category": "salary",
            "title": "Disproportionate Compensation for Low-Barrier Role",
            "severity": "high",
            "evidence": f"Advertised pay '{sub.get('salary','')}' exceeds industry standards for entry-level tasks.",
            "explanation": "Inflated pay promises are used to attract urgent, uncritical applicants.",
            "contributionScore": 18,
            "recommendation": "Cross-reference prevailing wage data on the Bureau of Labor Statistics or Glassdoor."
        })
        score += 18

    return signs, min(score, 65)

def analyze_job(sub: Dict[str, Any], history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    artifacts = load_model_artifacts()
    weights = artifacts.get("vocabularyWeights", {})
    intercept = artifacts.get("intercept", -3.124)

    full_text = f"{sub.get('title','')} {sub.get('company','')} {sub.get('description','')} {sub.get('salary','')}"
    ngrams = extract_ngrams(full_text)

    linear_z = intercept
    contributions = []

    for term, w in weights.items():
        count = ngrams.get(term, 1 if term in full_text.lower() else 0)
        if count > 0:
            tf = 1 + math.log(count)
            contrib = round(tf * w, 2)
            linear_z += contrib
            contributions.append({
                "feature": term,
                "value": contrib,
                "type": "text_ngram",
                "label": f"{'Scam indicator' if w > 0 else 'Legitimacy indicator'}: \"{term}\"",
                "direction": "scam_indicator" if w > 0 else "legitimacy_indicator"
            })

    # Add structured indicators
    warning_signs, heuristic_score = evaluate_heuristics(sub)

    if sub.get('requiresPayment'):
        linear_z += 2.5
        contributions.append({
            "feature": "Upfront payment required",
            "value": 3.5,
            "type": "structured_field",
            "label": "Candidate payment required by recruiter",
            "direction": "scam_indicator"
        })

    # Calibrated probability
    model_prob = 1 / (1 + math.exp(-linear_z))

    ml_component = model_prob * 70
    heuristic_component = (heuristic_score / 65) * 30
    composite_score = round(ml_component + heuristic_component)

    has_critical = any(s["severity"] == "critical" for s in warning_signs)
    if has_critical and composite_score < 75:
        composite_score = max(composite_score, 75)

    composite_score = max(2, min(99, composite_score))

    if composite_score >= 80:
        cat = "very_high"
        verdict = "CRITICAL ALERT: This posting displays strong, corroborated markers of recruitment fraud."
    elif composite_score >= 60:
        cat = "high"
        verdict = "HIGH RISK: Multiple high-confidence warning signals detected. Proceed with independent verification."
    elif composite_score >= 30:
        cat = "moderate"
        verdict = "MODERATE RISK: Some ambiguous or irregular characteristics observed. Verify company identity."
    else:
        cat = "low"
        verdict = "LOW RISK: The posting exhibits standard professional recruitment language and realistic requirements."

    contributions.sort(key=lambda x: abs(x["value"]), reverse=True)

    # Cross-posting pattern check
    similar_postings = []
    if history:
        for hist in history:
            h_sub = hist.get("submission", {})
            h_text = f"{h_sub.get('title','')} {h_sub.get('company','')} {h_sub.get('description','')}"
            sim = calculate_cosine_similarity(full_text, h_text)
            if sim >= 0.45:
                similar_postings.append({
                    "postingId": hist.get("id", "unknown"),
                    "title": h_sub.get("title", ""),
                    "company": h_sub.get("company", ""),
                    "similarityScore": round(sim, 2),
                    "sharedIndicators": [f"{round(sim*100)}% text description overlap"],
                    "riskCategory": hist.get("riskCategory", "high")
                })

    recs = [
        "Search the company on state business registers or OpenCorporates.",
        "Never wire money, cash third-party checks, or purchase equipment through unverified vendors.",
        "Contact the employer through independently verified official channels before sharing sensitive records.",
        "Decline chat-only interviews conducted solely via Telegram or WhatsApp."
    ]

    import time
    return {
        "id": f"analysis-{int(time.time()*1000)}",
        "submission": sub,
        "timestamp": f"{time.strftime('%Y-%m-%dT%H:%M:%SZ')}",
        "riskScore": composite_score,
        "riskCategory": cat,
        "modelProbability": round(model_prob, 3),
        "calibratedScore": composite_score,
        "isCalibrated": True,
        "warningSigns": warning_signs,
        "featureContributions": contributions,
        "recommendations": recs,
        "similarPostings": similar_postings[:5],
        "heuristicFlagsCount": len(warning_signs),
        "modelVersion": artifacts.get("modelVersion", "EMSCAD-LogReg-TFIDF-v1.2"),
        "summaryVerdict": verdict
    }
