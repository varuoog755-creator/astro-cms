import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

items = re.findall(r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"', content)
print(f"Total products found: {len(items)}")
for i, (pid, slug, name) in enumerate(items, 1):
    print(f"{i}. [{pid}] {name[:40]}... -> {slug}")
