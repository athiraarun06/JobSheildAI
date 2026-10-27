# JobShield AI — Python FastAPI Backend

This directory contains the standalone Python FastAPI backend for JobShield AI, utilizing Scikit-learn, Pandas, NumPy, and SQLite.

## Architecture
- `main.py`: FastAPI application exposing prediction and statistics endpoints.
- `database.py`: SQLite persistence layer using Python's built-in `sqlite3`.
- `engine.py`: Scikit-learn TF-IDF feature extraction, Logistic Regression inference, and linear feature attribution.
- `requirements.txt`: Python dependencies.

## Local Execution Instructions

### 1. Create a Python Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the FastAPI Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The API documentation (Swagger UI) will be accessible at:
`http://localhost:8000/docs`

### 4. Connect the Frontend
In your `.env` file in the root directory:
```
VITE_API_URL="http://localhost:8000"
```
Or use the built-in single-process Node/TS runner (`npm run dev`) which includes the identical pre-trained model and preprocessing pipeline.
