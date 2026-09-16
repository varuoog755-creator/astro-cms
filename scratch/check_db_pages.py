import sqlite3

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, slug, content FROM pages WHERE slug='about';")
page = cursor.fetchone()
print("Page 'about' in SQLite DB:", page)

conn.close()
