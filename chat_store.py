import sqlite3
import threading
from typing import List, Dict, Any
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "chats.sqlite3")
_lock = threading.Lock()

def _get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
            )
            """
        )
        conn.commit()
        conn.close()


def add_message(user_id: str, role: str, content: str) -> int:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)",
            (user_id, role, content),
        )
        conn.commit()
        rowid = cur.lastrowid
        conn.close()
        return rowid


def get_history(user_id: str, limit: int = 200) -> List[Dict[str, Any]]:
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, user_id, role, content, created_at FROM messages WHERE user_id = ? ORDER BY id DESC LIMIT ?",
        (user_id, limit),
    )
    rows = cur.fetchall()
    conn.close()
    # return newest-last
    return [dict(r) for r in reversed(rows)]


def export_history_jsonl(out_path: str = "chat_history.jsonl") -> str:
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, user_id, role, content, created_at FROM messages ORDER BY id ASC")
    rows = cur.fetchall()
    with open(out_path, "w", encoding="utf-8") as f:
        for r in rows:
            import json

            f.write(json.dumps(dict(r), ensure_ascii=False) + "\n")
    conn.close()
    return out_path


init_db()


def count_user_messages_since(user_id: str, since_ts: str) -> int:
    """Count messages for a user since an ISO timestamp string."""
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT COUNT(*) as cnt FROM messages WHERE user_id = ? AND created_at >= ?",
        (user_id, since_ts),
    )
    row = cur.fetchone()
    conn.close()
    return int(row["cnt"] if row else 0)


def count_user_messages_today(user_id: str) -> int:
    """Count messages the user has sent today (UTC day)."""
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc)
    start_of_day = datetime(now.year, now.month, now.day, tzinfo=timezone.utc).isoformat()
    return count_user_messages_since(user_id, start_of_day)
