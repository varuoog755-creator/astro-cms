import sqlite3
import os

# 1. Clean DB
db_paths = ["prisma/cms.db", "data/ecom_cms.db"]
for db_path in db_paths:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("DELETE FROM products WHERE id IN ('prod-1', 'prod-2', 'prod-3', 'prod-4') OR slug IN ('teepul-royal-velvet-door-curtain', 'teepul-sheer-linen-window-curtain', 'teepul-nordic-ambient-decor-light', 'teepul-architectural-jacquard-cushion-covers')")
        conn.commit()
        print(f"Cleaned demo products from {db_path} (deleted {c.rowcount} rows)")
        conn.close()

# 2. Clean products.ts
ts_path = "src/lib/products.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace demo objects prod-1 to prod-4 from PRODUCTS_CATALOG
import re
# Match from prod-1 up to prod-5
pattern = r"  \{\s*id: 'prod-1',.*?\n  \},\n  \{\s*id: 'prod-2',.*?\n  \},\n  \{\s*id: 'prod-3',.*?\n  \},\n  \{\s*id: 'prod-4',.*?\n  \},\n"
new_content = re.sub(pattern, "", content, flags=re.DOTALL)

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Removed demo products prod-1, prod-2, prod-3, prod-4 from {ts_path}!")
