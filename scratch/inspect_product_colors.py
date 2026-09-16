import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match each product block
catalog_str = text[text.find('export const PRODUCTS_CATALOG'):]
blocks = re.split(r'\n\s*\{\s*\n\s*id:\s*"', catalog_str)

print(f"Inspecting colors for {len(blocks)-1} products:")

for i, block in enumerate(blocks[1:], 1):
    p_id = block[:block.find('"')]
    
    name_match = re.search(r'name:\s*"([^"]+)"', block)
    name = name_match.group(1) if name_match else ""
    
    slug_match = re.search(r'slug:\s*"([^"]+)"', block)
    slug = slug_match.group(1) if slug_match else ""
    
    colors_match = re.search(r'colors:\s*(\[[^\]]+\])', block)
    colors = colors_match.group(1) if colors_match else ""
    
    print(f"\n{i}. [{p_id}] {name}\n   Slug: {slug}\n   Colors: {colors}")
