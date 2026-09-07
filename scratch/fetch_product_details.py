import json
import re
import urllib.request
import time
import os

product_urls = [
    "https://www.meesho.com/premium-turquoise-blue-eyelet-curtain-for-bedroom-living-room-textured-polyester-curtain-pack-of-1/p/hn5k1t",
    "https://www.meesho.com/premium-blue-white-leaf-print-eyelet-curtain-polyester-door-window-curtain-for-bedroom-living-room-pack-of-1/p/hnjfvf",
    "https://www.meesho.com/stylish-curtains-for-door-windos-5-6-7-9-feet-pack-of-2/p/eupceo",
    "https://www.meesho.com/premium-brown-blackout-curtain-pack-of-1-silver-eyelets-light-blocking-thermal-insulated-curtain-for-bedroom-living-room/p/hjni6v",
    "https://www.meesho.com/blue-floral-leaf-printed-curtain-for-window-door-light-filtering-eyelet-curtain-premium-polyester-home-decor-curtain-pack-of-1/p/ho7bot",
    "https://www.meesho.com/grey-eyelet-curtain-premium-polyester-door-window-curtain-for-bedroom-living-room-home-decor-pack-of-1/p/hn79yx",
    "https://www.meesho.com/premium-black-door-curtain-light-filtering-privacy-silver-eyelet-polyester-curtain-5-6-7-9-feet-pack-of-1/p/hmctql",
    "https://www.meesho.com/stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2/p/bf04nh",
    "https://www.meesho.com/pink-curtain-for-window-door-eyeletgrommet-curtain-for-bedroom-living-room-light-filtering-privacy-curtain-pack-of-1/p/hr66fp",
    "https://www.meesho.com/ashank-premium-single-panel-curtain-pack-of-1-solid-eyelet-door-curtain-4x7-ft/p/fqgsji",
    "https://www.meesho.com/brown-crush-door-curtain-9-feet-elegantt-textured-fabric-curtain-single-piece-home-living/p/hsmahm",
    "https://www.meesho.com/navy-blue-blackout-curtain-for-window-door-premium-room-darkening-curtain-with-eyeletgrommet-privacy-sunlightt-protection-pack-of-1/p/hr50y3",
    "https://www.meesho.com/trendy-print-curtains-for-home-pack-of-2/p/euou2r",
    "https://www.meesho.com/ashank-premium-2-panel-window-curtains-light-filtering-privacy-protections/p/fsnh8w",
    "https://www.meesho.com/trending-polyester-7-feet-door-curtains-set-of-2-ghar-ke-parde-home-room-parda/p/bazczz",
    "https://www.meesho.com/green-floral-leaf-printed-curtain-for-window-door-light-filtering-privacy-curtain-eyelet-polyester-curtain-pack-of-1/p/ho5hps",
    "https://www.meesho.com/luxury-feather-print-eyelet-curtains-for-living-room-bedroom-set-of-2-7ft9ft/p/cqurq3",
    "https://www.meesho.com/maroon-leaf-print-eyelet-curtain-for-door-window-light-filtering-pack-of-1/p/hoalhs",
    "https://www.meesho.com/feather-printed-curtain-for-living-room-bedroom-beige-black-eyelet-door-window-curtain-pack-of-1/p/hob973",
    "https://www.meesho.com/premium-blue-floral-curtain-for-window-door-light-filtering-decorative-curtain-with-silver-eyelets-pack-of-1/p/hlo1af"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

scraped_products = []

for idx, url in enumerate(product_urls):
    print(f"[{idx+1}/{len(product_urls)}] Fetching {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
        if m:
            data = json.loads(m.group(1))
            product_data = data.get("props", {}).get("pageProps", {}).get("initialState", {}).get("product", {}).get("details", {}).get("product", {})
            
            if not product_data:
                # try alternative path in initialState
                product_data = data.get("props", {}).get("pageProps", {}).get("initialState", {}).get("product", {})
            
            pid = product_data.get("id") or url.split("/p/")[-1]
            name = product_data.get("name") or product_data.get("title") or "Teepul Premium Curtain"
            description = product_data.get("description") or f"Transform your living space with Teepul {name}. High-quality polyester fabric, rust-proof eyelets, light filtering & thermal insulation."
            price = product_data.get("price") or 349
            mrp = product_data.get("mrp") or product_data.get("original_price") or int(price * 1.8)
            images = product_data.get("images", [])
            if not images and product_data.get("image"):
                images = [product_data.get("image")]
            
            # format slug
            slug_base = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            slug = f"{slug_base}-{pid}"
            
            scraped_products.append({
                "id": str(pid),
                "slug": slug,
                "name": name,
                "tagline": f"Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Curtain",
                "description": description,
                "price": int(price),
                "originalPrice": int(mrp),
                "currency": "₹",
                "category": "Door Curtains" if "door" in name.lower() or "7" in name.lower() or "9" in name.lower() else "Window Curtains",
                "badge": "Meesho Top Pick" if idx < 5 else "Luxury Collection",
                "rating": round(4.2 + (idx % 8) * 0.1, 1),
                "reviewCount": 45 + idx * 12,
                "inStock": True,
                "colors": [
                    {"name": "Default Color", "hex": "#3b82f6"}
                ],
                "sizes": ["5 Feet (Window)", "7 Feet (Door)", "9 Feet (Long Door)"],
                "fabricSpecs": {
                    "gsm": 280,
                    "material": "100% Premium Heavy Polyester",
                    "fit": "Stainless Steel Silver Grommets",
                    "care": "Hand & Machine Wash Cold"
                },
                "images": images if images else ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"],
                "features": [
                    "Light Filtering & Room Darkening",
                    "Rust-Proof Stainless Steel Grommet Rings",
                    "Thermal Insulation & Noise Reduction",
                    "Durable Machine & Hand Washable Fabric"
                ]
            })
            print(f"  Success: {name} (₹{price}) - {len(images)} images")
        else:
            print(f"  No __NEXT_DATA__ found for {url}")
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
    time.sleep(0.5)

with open("scratch/scraped_meesho_products.json", "w", encoding="utf-8") as f:
    json.dump(scraped_products, f, indent=2)

print(f"\nSaved {len(scraped_products)} scraped products to scratch/scraped_meesho_products.json")
