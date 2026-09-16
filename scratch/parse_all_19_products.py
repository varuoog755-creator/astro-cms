import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Split catalog array
catalog_str = text[text.find('export const PRODUCTS_CATALOG'):]

# Find all blocks starting with { id:
blocks = re.split(r'\n\s*\{\s*\n\s*id:\s*"', catalog_str)
print(f"Total raw blocks: {len(blocks) - 1}")

products_data = []
for block in blocks[1:]:
    p_id = block[:block.find('"')]
    
    slug_match = re.search(r'slug:\s*"([^"]+)"', block)
    p_slug = slug_match.group(1) if slug_match else ""
    
    name_match = re.search(r'name:\s*"([^"]+)"', block)
    p_name = name_match.group(1) if name_match else ""
    
    price_match = re.search(r'price:\s*(\d+)', block)
    price = int(price_match.group(1)) if price_match else 399
    
    orig_match = re.search(r'originalPrice:\s*(\d+)', block)
    orig_price = int(orig_match.group(1)) if orig_match else price * 2
    
    cat_match = re.search(r'category:\s*"([^"]+)"', block)
    category = cat_match.group(1) if cat_match else "Door Curtains"
    
    img_match = re.search(r'images:\s*\[\s*"([^"]+)"', block)
    image = img_match.group(1) if img_match else "https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512"
    
    gsm_match = re.search(r'"gsm":\s*(\d+)', block)
    gsm = int(gsm_match.group(1)) if gsm_match else 280

    mat_match = re.search(r'"material":\s*"([^"]+)"', block)
    material = mat_match.group(1) if mat_match else "100% Premium Polyester"

    if p_slug and p_name:
        products_data.append({
            "id": p_id,
            "slug": p_slug,
            "name": p_name,
            "price": price,
            "orig_price": orig_price,
            "category": category,
            "image": image,
            "gsm": gsm,
            "material": material
        })

print(f"Successfully extracted {len(products_data)} products!")
for i, p in enumerate(products_data, 1):
    print(f"{i}. [{p['id']}] {p['name'][:35]}... -> {p['slug']}")
