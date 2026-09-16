import sqlite3

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()

try:
    cursor.execute("SELECT id, slug, name FROM Product;")
    rows = cursor.fetchall()
    print(f"Total products in SQLite DB (prisma/cms.db): {len(rows)}")
    for i, r in enumerate(rows, 1):
        print(f"{i}. [{r[0]}] {r[1]}")
except Exception as e:
    print(f"Error querying SQLite DB: {e}")
finally:
    conn.close()
