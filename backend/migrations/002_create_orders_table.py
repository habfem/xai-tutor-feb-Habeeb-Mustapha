"""
Migration: Create orders table
Version: 002
Description: Creates orders table with sample data
"""

import sqlite3
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH


def upgrade():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Ensure migrations table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", ("002_create_orders_table",))
    if cursor.fetchone():
        print("Migration 002_create_orders_table already applied. Skipping.")
        conn.close()
        return

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT NOT NULL UNIQUE,
            customer_name TEXT NOT NULL,
            customer_avatar TEXT,
            order_date TEXT NOT NULL,
            status TEXT NOT NULL,
            total_amount REAL NOT NULL,
            payment_status TEXT NOT NULL
        )
    """)

    sample_orders = [
        ("ORD-1001", "Alice Johnson", "", "2026-01-10T10:00:00", "Pending", 120.50, "Unpaid"),
        ("ORD-1002", "Bob Smith", "", "2026-01-12T14:30:00", "Completed", 45.00, "Paid"),
        ("ORD-1003", "Cara Lee", "", "2026-01-15T09:15:00", "Refunded", 78.99, "Paid"),
        ("ORD-1004", "David Kim", "", "2026-02-01T11:20:00", "Pending", 34.20, "Unpaid"),
    ]
    cursor.executemany(
        "INSERT INTO orders (order_number, customer_name, customer_avatar, order_date, status, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        sample_orders,
    )

    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", ("002_create_orders_table",))

    conn.commit()
    conn.close()
    print("Migration 002_create_orders_table applied successfully.")


def downgrade():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS orders")
    cursor.execute("DELETE FROM _migrations WHERE name = ?", ("002_create_orders_table",))

    conn.commit()
    conn.close()
    print("Migration 002_create_orders_table reverted successfully.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run database migration")
    parser.add_argument(
        "action",
        choices=["upgrade", "downgrade"],
        help="Migration action to perform",
    )

    args = parser.parse_args()

    if args.action == "upgrade":
        upgrade()
    elif args.action == "downgrade":
        downgrade()
