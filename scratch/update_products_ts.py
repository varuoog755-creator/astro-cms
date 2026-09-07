import json
import os

with open("scratch/all_meesho_products.json", "r", encoding="utf-8") as f:
    meesho_prods = json.load(f)

products_ts_path = "src/lib/products.ts"

with open(products_ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Generate TS objects
ts_objects = []
for p in meesho_prods:
    # check if already in products.ts by id or slug
    if p["id"] in content or p["slug"] in content:
        print(f"Skipping {p['name']} (already in products.ts)")
        continue

    ts_obj = f"""  {{
    id: '{p["id"]}',
    slug: '{p["slug"]}',
    name: {json.dumps(p["name"])},
    tagline: {json.dumps(p["tagline"])},
    description: {json.dumps(p["description"])},
    price: {p["price"]},
    originalPrice: {p["originalPrice"]},
    currency: '{p["currency"]}',
    category: '{p["category"]}',
    badge: '{p["badge"]}',
    rating: {p["rating"]},
    reviewCount: {p["reviewCount"]},
    inStock: true,
    colors: {json.dumps(p["colors"])},
    sizes: {json.dumps(p["sizes"])},
    fabricSpecs: {json.dumps(p["fabricSpecs"])},
    images: {json.dumps(p["images"])},
    features: {json.dumps(p["features"])}
  }}"""
    ts_objects.append(ts_obj)

if ts_objects:
    new_catalog_code = ",\n" + ",\n".join(ts_objects) + "\n];"
    content = content.replace("\n];", new_catalog_code)
    
    with open(products_ts_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Appended {len(ts_objects)} products to {products_ts_path}!")
else:
    print("All products are already present in products.ts")
