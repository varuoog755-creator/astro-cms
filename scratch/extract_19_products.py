import re
import json

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match id, slug, name, price, originalPrice, category, images, fabricSpecs, description, features
pattern = r'id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"'
matches = re.findall(pattern, text)
print(f"Found {len(matches)} product matches:")
for i, m in enumerate(matches, 1):
    print(f"{i}. [{m[0]}] {m[2]} -> slug: {m[1]}")
