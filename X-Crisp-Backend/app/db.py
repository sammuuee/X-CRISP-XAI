from __future__ import annotations

from datetime import datetime
import hashlib
import secrets
import sqlite3

from app.config import DB_PATH

DEMO_COMPANIES = [
    ("36252187900034", "GenomEdge SAS"),
    ("35600082700117", "BioTech Corp. SA"),
    ("51234567800019", "InnovaGen Laboratoires"),
    ("78231456700028", "CRISPRPath Biotech"),
    ("55210055400013", "Institut Pasteur Démo"),
    ("78467169500017", "Sorbonne Biologie Lab"),
    ("18008901303720", "CNRS Génomique Test"),
]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                company_name TEXT NOT NULL,
                siret TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                sequence TEXT NOT NULL,
                target_sequence TEXT,
                dna_sequence TEXT,
                score INTEGER NOT NULL,
                risk_level TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS company_registry (
                siret TEXT PRIMARY KEY,
                company_name TEXT NOT NULL
            );
            """
        )
        conn.executemany(
            """
            INSERT OR IGNORE INTO company_registry (siret, company_name)
            VALUES (?, ?)
            """,
            DEMO_COMPANIES,
        )


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()


def create_user(email: str, password: str, company_name: str, siret: str) -> sqlite3.Row:
    salt = secrets.token_hex(16)
    password_hash = hash_password(password, salt)
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO users (email, password_hash, salt, company_name, siret, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (email, password_hash, salt, company_name, siret, now_iso()),
        )
        return conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()


def get_user_by_email(email: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()


def get_user_by_token(token: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT users.*
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token = ?
            """,
            (token,),
        ).fetchone()


def verify_password(user: sqlite3.Row, password: str) -> bool:
    return hash_password(password, user["salt"]) == user["password_hash"]


def create_session(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
            (token, user_id, now_iso()),
        )
    return token


def delete_session(token: str) -> None:
    with get_connection() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))


def add_history(
    user_id: int,
    sequence: str,
    target_sequence: str | None,
    dna_sequence: str | None,
    score: int,
    risk_level: str,
) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO history
            (user_id, sequence, target_sequence, dna_sequence, score, risk_level, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, sequence, target_sequence, dna_sequence, score, risk_level, now_iso()),
        )


def list_history(user_id: int) -> list[sqlite3.Row]:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT id, created_at, sequence, target_sequence, dna_sequence, score, risk_level
            FROM history
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 25
            """,
            (user_id,),
        ).fetchall()


def list_demo_companies() -> list[sqlite3.Row]:
    with get_connection() as conn:
        return conn.execute(
            "SELECT siret, company_name FROM company_registry ORDER BY company_name"
        ).fetchall()
