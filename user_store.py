import sqlite3
import threading
import os
from typing import Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "chats.sqlite3")
_lock = threading.Lock()


def _get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_users_table() -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                is_premium INTEGER DEFAULT 0,
                premium_expires TEXT
            )
            """
        )
        conn.commit()
        conn.close()


def set_premium(user_id: str, premium: bool = True, expires: Optional[str] = None) -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (user_id, is_premium, premium_expires) VALUES (?, ?, ?)"
            " ON CONFLICT(user_id) DO UPDATE SET is_premium=excluded.is_premium, premium_expires=excluded.premium_expires",
            (user_id, 1 if premium else 0, expires),
        )
        conn.commit()
        conn.close()


def is_premium(user_id: str) -> bool:
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute("SELECT is_premium FROM users WHERE user_id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return False
    return bool(row["is_premium"])


init_users_table()
