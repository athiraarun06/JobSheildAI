"""
JobShield AI — FastAPI Backend Application
Author: JobShield AI Data Science Team
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
import json

from engine import analyze_job, load_model_artifacts
import database

app = FastAPI(
    title="JobShield AI — Risk Intelligence & Fraud Detection API",
    description="Machine learning prediction, explainable AI attribution, and pattern intelligence for job postings.",
    version="1.2.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobSubmissionModel(BaseModel):
    title: str = Field(..., min_length=2, description="Job title")
    company: str = Field(..., min_length=2, description="Company name")
    description: str = Field(..., min_length=15, description="Full job description text")
    salary: Optional[str] = ""
    location: Optional[str] = ""
    workArrangement: Optional[str] = "remote"
    employerWebsite: Optional[str] = ""
    contactEmail: Optional[str] = ""
    contactPhone: Optional[str] = ""
    contactOther: Optional[str] = ""
    requiresPayment: Optional[bool] = False
    paymentDetails: Optional[str] = ""
    jobUrl: Optional[str] = ""

@app.on_event("startup")
def startup_db():
    database.init_db()

@app.get("/api/health")
def health():
    history = database.get_all_history()
    return {
        "status": "online",
        "engine": "FastAPI + Scikit-Learn TF-IDF Logistic Regression",
        "database": "SQLite (data/jobshield.db)",
        "dataset": "EMSCAD Benchmark (17,880 records)",
        "historyCount": len(history)
    }

@app.post("/api/analyze")
def analyze(submission: JobSubmissionModel):
    history = database.get_all_history()
    sub_dict = submission.dict()
    result = analyze_job(sub_dict, history)
    database.save_analysis(result)
    return result

@app.get("/api/history")
def get_history():
    return database.get_all_history()

@app.delete("/api/history/{analysis_id}")
def delete_history_item(analysis_id: str):
    success = database.delete_analysis(analysis_id)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return {"success": True, "id": analysis_id}

@app.delete("/api/history")
def clear_history():
    database.clear_all_history()
    return {"success": True, "message": "All history cleared."}

@app.get("/api/model-metrics")
def get_metrics():
    artifacts = load_model_artifacts()
    return {
        "modelVersion": artifacts.get("modelVersion"),
        "dataset": artifacts.get("dataset"),
        "metrics": artifacts.get("metrics"),
        "confusionMatrix": artifacts.get("confusionMatrix"),
        "topScamNgrams": artifacts.get("topScamNgrams"),
        "topLegitNgrams": artifacts.get("topLegitNgrams")
    }

@app.get("/api/dashboard")
def get_dashboard():
    artifacts = load_model_artifacts()
    history = database.get_all_history()

    live_total = len(history)
    live_fraud = sum(1 for h in history if h.get("riskCategory") in ["high", "very_high"])
    live_legit = sum(1 for h in history if h.get("riskCategory") == "low")
    live_mod = sum(1 for h in history if h.get("riskCategory") == "moderate")

    return {
        "dataset": {
            "datasetName": artifacts["dataset"]["name"],
            "totalRecords": artifacts["dataset"]["totalRecords"],
            "fraudulentRecords": artifacts["dataset"]["fraudulentRecords"],
            "legitimateRecords": artifacts["dataset"]["legitimateRecords"],
            "fraudulentPercentage": artifacts["dataset"]["fraudulentPercentage"],
            "telecommutingFraudRate": artifacts.get("telecommutingFraudRate", 18.2),
            "missingLogoFraudRate": artifacts.get("missingLogoFraudRate", 12.8),
            "salaryDistribution": artifacts.get("salaryDistribution", []),
            "datasetWarningFrequencies": artifacts.get("warningSignFrequencies", [])
        },
        "liveSubmissions": {
            "total": live_total,
            "fraudulent": live_fraud,
            "legitimate": live_legit,
            "moderate": live_mod,
            "fraudPercentage": round((live_fraud / live_total) * 100) if live_total > 0 else 0
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
