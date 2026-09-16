import json
import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract products array string
match = re.search(r'export const PRODUCTS_CATALOG: Product\[\] = (\[.*\]);', content, re.DOTALL)
if match:
    catalog_raw = match.group(1)
    print(f"Catalog length in raw code: {len(re.findall(r'id:', catalog_raw))}")
