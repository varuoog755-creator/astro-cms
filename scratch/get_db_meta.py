import sqlite3

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()
cursor.execute("SELECT id, displayName, email FROM users LIMIT 1;")
user = cursor.fetchone()
print("Admin user:", user)

cursor.execute("SELECT id, slug, name FROM categories;")
categories = cursor.fetchall()
print("Categories in DB:", categories)

conn.close()
