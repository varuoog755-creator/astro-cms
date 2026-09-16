import sqlite3
import json

exact_colors_map = {
    "prod-5": [{"name": "Premium Dark Brown", "hex": "#3e2723"}],
    "meesho-eupceo": [{"name": "Coffee Brown & Cream", "hex": "#5d4037"}],
    "meesho-ho7bot": [{"name": "Blue Floral Leaf", "hex": "#1e40af"}],
    "meesho-hn79yx": [{"name": "Slate Grey", "hex": "#4b5563"}],
    "meesho-euou2r": [{"name": "Aqua Blue Printed", "hex": "#0891b2"}],
    "meesho-bazczz": [{"name": "Maroon Printed", "hex": "#881337"}],
    "meesho-cqurq3": [{"name": "Beige & Black Feather", "hex": "#d7c4b7"}],
    "meesho-hmctql": [{"name": "Premium Black", "hex": "#18181b"}],
    "meesho-bf04nh": [{"name": "Chocolate Brown", "hex": "#5d4037"}],
    "meesho-hnjfvf": [{"name": "Blue & White Leaf", "hex": "#1e40af"}],
    "meesho-hr66fp": [{"name": "Blush Pink", "hex": "#ec4899"}],
    "meesho-fqgsji": [{"name": "Solid Maroon", "hex": "#881337"}],
    "meesho-ho5hps": [{"name": "Green Floral Leaf", "hex": "#059669"}],
    "meesho-hob973": [{"name": "Beige & Black Feather", "hex": "#d7c4b7"}],
    "meesho-hoalhs": [{"name": "Maroon Leaf Print", "hex": "#881337"}],
    "meesho-ho1xzt": [{"name": "Magenta Leaf Print", "hex": "#be185d"}],
    "meesho-bcvrz8": [{"name": "Royal Purple", "hex": "#6b21a8"}],
    "meesho-c2ur5l": [{"name": "Blue Marble Print", "hex": "#2563eb"}],
    "meesho-bcvmm6": [{"name": "Dark Brown", "hex": "#451a03"}]
}

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()

updated_count = 0
for p_id, colors in exact_colors_map.items():
    colors_json = json.dumps(colors)
    cursor.execute("UPDATE products SET colorsJson=? WHERE id=?;", (colors_json, p_id))
    if cursor.rowcount > 0:
        updated_count += 1

conn.commit()
conn.close()

print(f"Updated colorsJson in SQLite DB for {updated_count} products!")
