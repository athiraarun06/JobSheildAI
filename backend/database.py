"""
JobShield AI — SQLite Persistence Layer
Stores real user-submitted analyses, timestamps, risk scores, and warning signs.
Zero fake data pre-seeded.
"""

import os
import sqlite3
import json
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "jobshield.db")

def get_connection() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analysis_history (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                risk_category TEXT NOT NULL,
                model_probability REAL NOT NULL,
                calibrated_score INTEGER NOT NULL,
                submission_json TEXT NOT NULL,
                warning_signs_json TEXT NOT NULL,
                feature_contributions_json TEXT NOT NULL,
                recommendations_json TEXT NOT NULL,
                summary_verdict TEXT NOT NULL
            )
        """)
        conn.commit()

def save_analysis(analysis: Dict[str, Any]) -> None:
    init_db()
    with get_connection() as conn:
        conn.execute("""
            INSERT OR REPLACE INTO analysis_history (
                id, timestamp, title, company, risk_score, risk_category,
                model_probability, calibrated_score, submission_json,
                warning_signs_json, feature_contributions_json,
                recommendations_json, summary_verdict
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            analysis["id"],
            analysis["timestamp"],
            analysis["submission"]["title"],
            analysis["submission"]["company"],
            analysis["riskScore"],
            analysis["riskCategory"],
            analysis["modelProbability"],
            analysis["calibratedScore"],
            json.dumps(analysis["submission"]),
            json.dumps(analysis["warningSigns"]),
            json.dumps(analysis["featureContributions"]),
            json.dumps(analysis["recommendations"]),
            analysis["summaryVerdict"]
        ))
        conn.commit()

def get_all_history() -> List[Dict[str, Any]]:
    init_db()
    with get_connection() as conn:
        cursor = conn.execute("SELECT * FROM analysis_history ORDER BY timestamp DESC")
        rows = cursor.fetchall()
        results = []
        for row in rows:
            results.append({
                "id": row["id"],
                "timestamp": row["timestamp"],
                "riskScore": row["risk_score"],
                "riskCategory": row["risk_category"],
                "modelProbability": row["model_probability"],
                "calibratedScore": row["calibrated_score"],
                "submission": json.loads(row["submission_json"]),
                "warningSigns": json.loads(row["warning_signs_json"]),
                "featureContributions": json.loads(row["feature_contributions_json"]),
                "recommendations": json.loads(row["recommendations_json"]),
                "summaryVerdict": row["summary_verdict"]
            })
        return results

def delete_analysis(analysis_id: str) -> bool:
    init_db()
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM analysis_history WHERE id = ?", (analysis_id,))
        conn.commit()
        return cursor.rowcount > 0

def clear_all_history() -> None:
    init_db()
    with get_connection() as conn:
        conn.execute("DELETE FROM analysis_history")
        conn.commit()
