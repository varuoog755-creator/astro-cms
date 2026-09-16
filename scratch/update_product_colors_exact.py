import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Exact color mapping per product ID / slug
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

# Replace colors in products.ts
catalog_start = content.find('export const PRODUCTS_CATALOG')
catalog_text = content[catalog_start:]

for p_id, colors_list in exact_colors_map.items():
    colors_json = str(colors_list).replace("'", '"')
    # Find block for p_id
    pattern = r'(\{\s*id:\s*"' + re.escape(p_id) + r'"[\s\S]*?colors:\s*)(\[[^\]]+\])'
    catalog_text = re.sub(pattern, r'\1' + colors_json, catalog_text)

new_content = content[:catalog_start] + catalog_text

with open('src/lib/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated src/lib/products.ts with exact single color per product!")
