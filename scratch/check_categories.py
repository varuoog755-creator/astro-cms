import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

categories = set(re.findall(r'category:\s*"([^"]+)"', content))
print("Categories in catalog:", categories)
