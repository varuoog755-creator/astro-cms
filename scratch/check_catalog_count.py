import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

slugs = re.findall(r'slug:\s*"([^"]+)"', content)
print(f"Total product slugs in PRODUCTS_CATALOG: {len(slugs)}")
for i, slug in enumerate(slugs, 1):
    print(f"{i}. {slug}")
