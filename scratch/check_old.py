import re
import json

code = open('scratch/old_products.ts', encoding='utf-8').read()
matches = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', code)
print(f"Found {len(matches)} product IDs in old_products.ts:")
for m in matches:
    print(" -", m)
