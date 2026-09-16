import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

catalog_str = text[text.find('export const PRODUCTS_CATALOG'):]
blocks = re.split(r'\n\s*\{\s*\n\s*id:\s*"', catalog_str)

for i, block in enumerate(blocks[1:], 1):
    p_id = block[:block.find('"')]
    
    name_match = re.search(r'name:\s*"([^"]+)"', block)
    name = name_match.group(1) if name_match else ""
    
    img_match = re.search(r'images:\s*\[\s*"([^"]+)"', block)
    img = img_match.group(1) if img_match else ""
    
    print(f"{i}. [{p_id}]\n   Name: {name}\n   Image: {img}\n")
