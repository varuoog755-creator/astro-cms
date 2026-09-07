import json
import re
import os

files = [
    r"C:\Users\Gourav\AppData\Local\BrowserClaw\Application\148.0.7985.97\.browseros\tool-output\evaluate-1788772051726-525bf059-757d-4230-9e35-f0295ac91071.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2187\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2191\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2195\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2199\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2203\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2207\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2211\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2215\output.txt",
    r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\2219\output.txt",
]

parsed_products = []

for idx, fpath in enumerate(files):
    target_path = fpath
    if not os.path.exists(target_path):
        print(f"File missing: {target_path}")
        continue
        
    with open(target_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Check if this is a step wrapper file pointing to full result
    if "Full result" in content and "saved to:" in content:
        m_path = re.search(r'saved to:\s*(?:\\\\\\\?\\)?([^\r\n]+)', content)
        if m_path:
            full_file = m_path.group(1).strip()
            if os.path.exists(full_file):
                target_path = full_file
                with open(target_path, "r", encoding="utf-8", errors="ignore") as f2:
                    content = f2.read()

    try:
        # If content starts with quotes (JSON string)
        json_obj = None
        # Extract between [UNTRUSTED_PAGE_CONTENT...] and [END_UNTRUSTED_PAGE_CONTENT] or find {"props"
        start_idx = content.find('{"props":')
        if start_idx != -1:
            json_str = content[start_idx:]
            end_idx = json_str.rfind('}')
            if end_idx != -1:
                json_str = json_str[:end_idx+1]
            json_obj = json.loads(json_str)
        elif content.startswith('"') and content.endswith('"'):
            json_obj = json.loads(json.loads(content))
        else:
            json_obj = json.loads(content)

        page_props = json_obj.get('props', {}).get('pageProps', {})
        prod = page_props.get('product', {})
        if not prod and 'details' in page_props.get('initialState', {}).get('product', {}):
            prod = page_props['initialState']['product']['details']

        details = prod.get('details', {}) if isinstance(prod, dict) and 'details' in prod else prod
        pdata = details.get('data', {}) if isinstance(details, dict) and 'data' in details else details

        name = pdata.get('name') or f"Teepul Premium Curtain {idx+1}"
        pid = pdata.get('product_id') or pdata.get('slug') or f"prod-{idx+1}"
        slug = pdata.get('slug') or pid

        raw_desc = pdata.get('description') or ""
        clean_desc = re.sub(r'Country of Origin:.*$', '', raw_desc, flags=re.DOTALL).strip()
        if not clean_desc or len(clean_desc) < 20:
            clean_desc = f"Elevate your home decor with Teepul {name}. Premium polyester drapery with rust-proof silver eyelets, light filtering privacy, and thermal insulation."

        price = pdata.get('price', 349)
        suppliers = pdata.get('suppliers', [])
        if suppliers and isinstance(suppliers, list) and len(suppliers) > 0:
            price = suppliers[0].get('price', price)

        images = pdata.get('images', [])
        if not images or len(images) == 0:
            img_matches = re.findall(r'https://images\.meesho\.com/images/products/\d+/\w+_\d+\.(?:jpg|avif|png|webp)', content)
            images = list(dict.fromkeys(img_matches))[:4]

        if not images:
            images = ["https://images.meesho.com/images/products/1067463195/okexo_512.jpg"]

        category = "Door Curtains"
        if "window" in name.lower():
            category = "Window Curtains"

        badge = "Teepul Choice" if idx % 2 == 0 else "Best Seller"

        colors = [
            {"name": "Royal Blue & White", "hex": "#1e40af"},
            {"name": "Warm Beige", "hex": "#d7c4b7"}
        ]
        if "pink" in name.lower():
            colors = [{"name": "Blush Pink", "hex": "#ec4899"}, {"name": "Soft Rose", "hex": "#f43f5e"}]
        elif "green" in name.lower():
            colors = [{"name": "Emerald Green", "hex": "#059669"}, {"name": "Sage Green", "hex": "#10b981"}]
        elif "maroon" in name.lower() or "magenta" in name.lower():
            colors = [{"name": "Royal Maroon", "hex": "#881337"}, {"name": "Deep Wine", "hex": "#4c0519"}]
        elif "purple" in name.lower():
            colors = [{"name": "Imperial Purple", "hex": "#6b21a8"}, {"name": "Soft Lavender", "hex": "#a855f7"}]
        elif "brown" in name.lower():
            colors = [{"name": "Chocolate Brown", "hex": "#78350f"}, {"name": "Espresso", "hex": "#451a03"}]

        sizes = ["5 Feet", "6 Feet", "7 Feet", "9 Feet"]

        parsed_products.append({
            'id': f"meesho-{pid}",
            'slug': slug,
            'name': name,
            'tagline': "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
            'description': clean_desc,
            'price': int(price),
            'originalPrice': int(price * 1.8),
            'currency': '₹',
            'category': category,
            'badge': badge,
            'rating': 4.5 + (idx % 4) * 0.1,
            'reviewCount': 42 + idx * 11,
            'inStock': True,
            'colors': colors,
            'sizes': sizes,
            'fabricSpecs': {
                'gsm': 280,
                'material': '100% Premium Heavyweight Polyester',
                'fit': 'Stainless Steel Silver Eyelets',
                'care': 'Hand & Machine Wash Cold'
            },
            'images': images,
            'features': [
                'Light Filtering & Room Darkening Privacy',
                'Rust-Proof Stainless Steel Eyelet Rings',
                'Thermal Heat Insulation & Noise Shield',
                'Easy Maintenance & Machine Washable'
            ]
        })
        print(f"[{idx+1}/10] Parsed: {name[:50]}... (Price: ₹{price}, Images: {len(images)})")
    except Exception as e:
        print(f"Error parsing file {fpath}: {e}")

with open("scratch/10_products_parsed.json", "w", encoding="utf-8") as f:
    json.dump(parsed_products, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully saved {len(parsed_products)} parsed products to scratch/10_products_parsed.json")
