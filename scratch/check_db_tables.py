import sqlite3

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in sqlite DB:", tables)

for (t,) in tables:
    if 'prod' in t.lower():
        cursor.execute(f"SELECT COUNT(*) FROM `{t}`;")
        cnt = cursor.fetchone()[0]
        print(f"Table '{t}' count: {cnt}")
conn.close()
