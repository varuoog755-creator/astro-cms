import sqlite3
import json
import re

# Load products catalog from TS file
with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Parse items from products.ts
product_blocks = re.findall(r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"([\s\S]*?)\n  \},', ts_code)

print(f"Parsed {len(product_blocks)} product blocks from src/lib/products.ts!")

products_data = []
for p_id, p_slug, p_name, p_rest in product_blocks:
    # Extract price, originalPrice, category, images
    price_match = re.search(r'price:\s*(\d+)', p_rest)
    price = int(price_match.group(1)) if price_match else 399
    
    orig_price_match = re.search(r'originalPrice:\s*(\d+)', p_rest)
    orig_price = int(orig_price_match.group(1)) if orig_price_match else price * 2
    
    cat_match = re.search(r'category:\s*"([^"]+)"', p_rest)
    category = cat_match.group(1) if cat_match else "Door Curtains"
    
    img_match = re.search(r'images:\s*\[([^\]]+)\]', p_rest)
    images = []
    if img_match:
        images = [url.strip().strip('"').strip("'") for url in img_match.group(1).split(',')]
    img = images[0] if images else "https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512"

    gsm_match = re.search(r'"gsm":\s*(\d+)', p_rest)
    gsm = int(gsm_match.group(1)) if gsm_match else 280

    material_match = re.search(r'"material":\s*"([^"]+)"', p_rest)
    material = material_match.group(1) if material_match else "100% Premium Heavy Duty Polyester"

    products_data.append({
        "id": p_id,
        "slug": p_slug,
        "name": p_name,
        "price": price,
        "orig_price": orig_price,
        "category": category,
        "image": img,
        "gsm": gsm,
        "material": material
    })

print(f"Extracted {len(products_data)} products successfully!")
