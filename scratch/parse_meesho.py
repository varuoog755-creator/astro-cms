import urllib.request
import json
import re
import os

urls = [
    "https://www.meesho.com/premium-blue-white-leaf-print-eyelet-curtain-polyester-door-window-curtain-for-bedroom-living-room-pack-of-1/p/hnjfvf?ms=2&source=Meri+Shop",
    "https://www.meesho.com/pink-curtain-for-window-door-eyeletgrommet-curtain-for-bedroom-living-room-light-filtering-privacy-curtain-pack-of-1/p/hr66fp?ms=2&source=Meri+Shop",
    "https://www.meesho.com/ashank-premium-single-panel-curtain-pack-of-1-solid-eyelet-door-curtain-4x7-ft/p/fqgsji?ms=2&source=Meri+Shop",
    "https://www.meesho.com/green-floral-leaf-printed-curtain-for-window-door-light-filtering-privacy-curtain-eyelet-polyester-curtain-pack-of-1/p/ho5hps?ms=2&source=Meri+Shop",
    "https://www.meesho.com/feather-printed-curtain-for-living-room-bedroom-beige-black-eyelet-door-window-curtain-pack-of-1/p/hob973?ms=2&source=Meri+Shop",
    "https://www.meesho.com/maroon-leaf-print-eyelet-curtain-for-door-window-light-filtering-pack-of-1/p/hoalhs?ms=2&source=Meri+Shop",
    "https://www.meesho.com/magenta-printed-door-curtain-for-home-premium-leaf-design-polyester-curtain-light-filtering-privacy-curtain-pack-of-1/p/ho1xzt?ms=2&source=Meri+Shop",
    "https://www.meesho.com/stylish-purple-curtains-for-door-windos-5-6-7-9-feet-pack-of-2/p/bcvrz8?ms=2&source=Meri+Shop",
    "https://www.meesho.com/trendy-marble-print-curtains-for-home-pack-of-2/p/c2ur5l?ms=2&source=Meri+Shop",
    "https://www.meesho.com/stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2/p/bcvmm6?ms=2&source=Meri+Shop"
]

results = []

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

for index, url in enumerate(urls):
    print(f"[{index+1}/{len(urls)}] Fetching {url}")
    clean_url = url.split('?')[0]
    pid = clean_url.split('/p/')[-1]
    
    try:
        req = urllib.request.Request(clean_url, headers=headers)
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')
        
        m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.DOTALL)
        if not m:
            print(f"  Failed to find NEXT_DATA for {pid}")
            continue
            
        data = json.loads(m.group(1))
        page_props = data.get('props', {}).get('pageProps', {})
        initial_state = page_props.get('initialState', {})
        
        prod_data = {}
        if 'product' in page_props:
            prod_data = page_props['product']
        elif 'product' in initial_state and isinstance(initial_state['product'], dict):
            prod_data = initial_state['product'].get('data', {})
        elif 'data' in page_props:
            prod_data = page_props['data']
        else:
            prod_data = page_props
            
        name = prod_data.get('name') or prod_data.get('title')
        if not name and isinstance(prod_data.get('data'), dict):
            name = prod_data['data'].get('name')
            
        if not name:
            slug_part = clean_url.split('/')[-3] if len(clean_url.split('/')) >= 3 else pid
            name = slug_part.replace('-', ' ').title()
            
        desc = prod_data.get('description') or (prod_data.get('data', {}).get('description') if isinstance(prod_data.get('data'), dict) else "") or ""
        clean_desc = re.sub(r'Country of Origin:.*$', '', desc, flags=re.DOTALL).strip()
        
        price = 349
        suppliers = prod_data.get('suppliers') or (prod_data.get('data', {}).get('suppliers') if isinstance(prod_data.get('data'), dict) else [])
        if suppliers and isinstance(suppliers, list) and len(suppliers) > 0:
            price = suppliers[0].get('price', 349)
        elif 'price' in prod_data:
            price = prod_data['price']
            
        images = []
        if 'images' in prod_data and isinstance(prod_data['images'], list):
            images = [img if isinstance(img, str) else img.get('url', '') for img in prod_data['images']]
        elif isinstance(prod_data.get('data'), dict) and 'images' in prod_data['data']:
            images = [img if isinstance(img, str) else img.get('url', '') for img in prod_data['data']['images']]
            
        if not images or len(images) == 0:
            img_matches = re.findall(r'https://images\.meesho\.com/images/products/\d+/\w+_\d+\.(?:jpg|avif|png|webp)', html)
            images = list(dict.fromkeys(img_matches))[:4]
            
        results.append({
            'pid': pid,
            'url': clean_url,
            'name': name,
            'description': clean_desc,
            'price': price,
            'images': images
        })
        print(f"  Successfully extracted: {name} (Price: ₹{price}, Images: {len(images)})")
    except Exception as e:
        print(f"  Error fetching {pid}: {e}")

os.makedirs("scratch", exist_ok=True)
with open("scratch/meesho_extracted.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Done! Saved {len(results)} items to scratch/meesho_extracted.json")
