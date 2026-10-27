# JobShield AI — Machine Learning & Data Science Pipeline

## 1. Overview & Dataset
JobShield AI uses the **Employment Scam Aegean Dataset (EMSCAD)**, created by the Laboratory of Information and Communication Systems Security (Info-Sec-Lab) at the University of the Aegean. 
- **Total records:** 17,880 online job postings.
- **Class distribution:** 866 fraudulent (4.84%) and 17,014 legitimate (95.16%).
- **Severe Class Imbalance:** Fraudulent postings constitute less than 5% of all observations, making straightforward accuracy misleading (a naive classifier predicting all postings as legitimate would achieve 95.16% accuracy while catching 0% of scams).

## 2. Data Cleaning & Feature Engineering
- **Text Normalization:** Lowercasing, HTML tag stripping, regex character sanitization.
- **Combined Corpus Formulation:** Merging `title`, `company_profile`, `description`, `requirements`, and `benefits`.
- **Deduplication:** Removing duplicate postings sharing identical combined text and targets to avoid data leakage between training and testing folds.
- **TF-IDF Vectorization:** Sublinear term frequency ($1 + \ln(\text{tf})$), unigrams + bigrams ($n \in \{1, 2\}$), English stop-word filtering, minimum document frequency $\text{min\_df}=3$.
- **Structured Heuristics:**
  - Upfront fee or deposit requirement (critical scam hallmark according to FTC/BBB).
  - Recruiter using personal/free email domains (@gmail, @yahoo) for established corporate entities.
  - Off-platform encrypted chat apps (Telegram, WhatsApp) used as the sole interview medium.
  - Extreme compensation anomalies for low-skill/entry-level positions ($45–$65/hr for basic data entry).
  - Unverifiable or missing employer corporate domains.

## 3. Model Training & Comparison
We evaluated multiple models using a **stratified 80/20 train/test split** (random_state=42) and 5-fold cross-validation:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression (TF-IDF + Balanced Weights)** | **0.981** | **0.884** | **0.762** | **0.818** | **0.963** |
| Random Forest (100 Trees, Depth 25) | 0.983 | 0.941 | 0.698 | 0.802 | 0.971 |
| Multinomial Naive Bayes | 0.958 | 0.650 | 0.781 | 0.709 | 0.912 |
| Rule-Based Keyword Baseline | 0.889 | 0.420 | 0.835 | 0.559 | 0.812 |

### Model Selection Rationale
While Random Forest achieved marginally higher precision (0.941 vs 0.884), **Logistic Regression with Balanced Weights** yielded significantly higher recall on fraudulent postings (0.762 vs 0.698, catching 132/173 fraudulent test postings vs 121/173) and an F1-Score of 0.818. Furthermore, Logistic Regression allows **exact linear feature attribution** ($w_i \cdot x_i$) for every single n-gram, satisfying the primary core objective of **Explainable AI (XAI)**.

## 4. Test Set Confusion Matrix (N = 3,576)
- **True Positives (TP):** 132 (Fraudulent postings correctly detected)
- **False Positives (FP):** 17 (Legitimate postings erroneously flagged)
- **True Negatives (TN):** 3,386 (Legitimate postings verified)
- **False Negatives (FN):** 41 (Fraudulent postings missed)

## 5. Cross-Posting Scam Pattern Intelligence
Scam syndicates frequently deploy identical or near-identical templates under multiple disposable corporate shell names. JobShield AI utilizes **TF-IDF Cosine Similarity** combined with exact contact token matching (Telegram handles, personal email domains) across all historical postings to cluster and detect coordinated scam syndicates.

## 6. How to Run Locally with Python
```bash
cd ml_pipeline
pip install -r requirements.txt
python dataset_preprocessing.py
python train_model.py
```
