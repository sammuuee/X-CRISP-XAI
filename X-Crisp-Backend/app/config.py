from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
AI_BACKEND_DIR = PROJECT_ROOT / "X-CRISP-XAI" / "backend"
AI_ML_DIR = AI_BACKEND_DIR / "app" / "ml"
DEFAULT_MODEL_PATH = AI_BACKEND_DIR / "models" / "K562_mismatch.pt"
DB_PATH = PROJECT_ROOT / "x_crisp_app.sqlite3"

API_TITLE = "X-CRISP-XAI API"
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
LOCAL_ORIGIN_REGEX = r"^http://(localhost|127\.0\.0\.1):\d+$"
