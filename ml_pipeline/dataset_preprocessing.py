#!/usr/bin/env python3
"""
JobShield AI — Dataset Preprocessing Pipeline
Dataset: Employment Scam Aegean Dataset (EMSCAD)
Author: JobShield AI Data Science Team
"""

import os
import re
import json
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any

# Preprocessing Constants
TEXT_COLUMNS = ['title', 'company_profile', 'description', 'requirements', 'benefits']
CATEGORICAL_COLUMNS = ['employment_type', 'required_experience', 'required_education', 'industry', 'function']
BINARY_COLUMNS = ['telecommuting', 'has_company_logo', 'has_questions']
TARGET_COLUMN = 'fraudulent'

def clean_text(text: Any) -> str:
    """Normalize raw text by stripping HTML, non-alphanumeric chars, and excess whitespace."""
    if pd.isna(text) or text is None:
        return ""
    text = str(text)
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Strip URLs
    text = re.sub(r'http\S+|www\.\S+', ' ', text)
    # Strip special characters and keep alphanumeric
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    # Collapse multiple whitespace
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def preprocess_emscad_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean, impute, deduplicate, and formulate unified text representations.
    Prevents data leakage by removing duplicate descriptions.
    """
    initial_count = len(df)
    print(f"[*] Initial dataset size: {initial_count} records")

    # Handle missing values in text columns
    for col in TEXT_COLUMNS:
        if col in df.columns:
            df[col] = df[col].apply(clean_text)
        else:
            df[col] = ""

    # Fill categorical missing values with 'Unspecified'
    for col in CATEGORICAL_COLUMNS:
        if col in df.columns:
            df[col] = df[col].fillna('Unspecified').astype(str).str.strip()

    # Fill binary missing values with 0
    for col in BINARY_COLUMNS:
        if col in df.columns:
            df[col] = df[col].fillna(0).astype(int)

    # Combine text fields into a unified corpus
    df['combined_text'] = (
        df['title'] + " " +
        df['company_profile'] + " " +
        df['description'] + " " +
        df['requirements'] + " " +
        df['benefits']
    ).str.strip()

    # Remove exact duplicate postings on combined_text to prevent leakage between train and test
    before_dedup = len(df)
    df = df.drop_duplicates(subset=['combined_text', TARGET_COLUMN]).reset_index(drop=True)
    dedup_removed = before_dedup - len(df)
    print(f"[*] Deduplication complete: removed {dedup_removed} duplicate postings. Remaining: {len(df)}")

    # Class balance inspection
    fraud_counts = df[TARGET_COLUMN].value_counts().to_dict()
    fraud_rate = (fraud_counts.get(1, 0) / len(df)) * 100
    print(f"[*] Class distribution: Legitimate (0) = {fraud_counts.get(0, 0)}, Fraudulent (1) = {fraud_counts.get(1, 0)} ({fraud_rate:.2f}%)")

    return df

def generate_dataset_summary_statistics(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate empirical risk statistics for dashboard presentation."""
    total = len(df)
    fraud_mask = df[TARGET_COLUMN] == 1
    legit_mask = df[TARGET_COLUMN] == 0

    tele_fraud_rate = 0.0
    if 'telecommuting' in df.columns:
        tele_postings = df[df['telecommuting'] == 1]
        if len(tele_postings) > 0:
            tele_fraud_rate = round(float((tele_postings[TARGET_COLUMN] == 1).mean() * 100), 2)

    no_logo_fraud_rate = 0.0
    if 'has_company_logo' in df.columns:
        no_logo = df[df['has_company_logo'] == 0]
        if len(no_logo) > 0:
            no_logo_fraud_rate = round(float((no_logo[TARGET_COLUMN] == 1).mean() * 100), 2)

    has_questions_fraud_rate = 0.0
    if 'has_questions' in df.columns:
        with_q = df[df['has_questions'] == 1]
        if len(with_q) > 0:
            has_questions_fraud_rate = round(float((with_q[TARGET_COLUMN] == 1).mean() * 100), 2)

    return {
        "dataset_name": "EMSCAD (Employment Scam Aegean Dataset)",
        "total_records": total,
        "fraudulent_count": int(fraud_mask.sum()),
        "legitimate_count": int(legit_mask.sum()),
        "fraud_percentage": round(float(fraud_mask.mean() * 100), 2),
        "telecommuting_fraud_rate": tele_fraud_rate,
        "no_logo_fraud_rate": no_logo_fraud_rate,
        "has_questions_fraud_rate": has_questions_fraud_rate
    }

if __name__ == "__main__":
    print("[*] Dataset Preprocessing Module loaded.")
