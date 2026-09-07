import json

with open("scratch/meesho_seller_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

initial_state = data.get("props", {}).get("pageProps", {}).get("initialState", {})
products = initial_state.get("shopListing", {}).get("listing", {}).get("products", [])

print(f"Total products found in listing: {len(products)}")

for idx, p in enumerate(products):
    print(f"\n--- Product {idx + 1} ---")
    print("ID:", p.get("id"))
    print("Name / Title:", p.get("name") or p.get("title"))
    print("Slug / URL:", p.get("slug") or p.get("product_url") or p.get("url"))
    print("Price:", p.get("price"))
    print("Original Price / MRP:", p.get("original_price") or p.get("mrp"))
    print("Images:", p.get("images"))
    print("Image:", p.get("image"))
    print("Product keys:", list(p.keys()))
