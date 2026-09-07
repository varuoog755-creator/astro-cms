import json

with open("scratch/meesho_seller_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

page_props = data.get("props", {}).get("pageProps", {})
initial_state = page_props.get("initialState", {})

shop_listing = initial_state.get("shopListing", {})
print("shopListing keys:", list(shop_listing.keys()))

# Check catalogs inside shopListing
catalogs = shop_listing.get("catalogs", [])
print(f"catalogs count: {len(catalogs)}")
if not catalogs:
    # check products or other keys
    for k, v in shop_listing.items():
        if isinstance(v, dict):
            print(f"shopListing[{k}] keys:", list(v.keys()))
        elif isinstance(v, list):
            print(f"shopListing[{k}] list len:", len(v))

if catalogs:
    first = catalogs[0]
    print("First catalog sample keys:", list(first.keys()))
    print("First catalog title:", first.get("name") or first.get("title"))
    print("First catalog price:", first.get("min_price") or first.get("price"))
    print("First catalog images:", first.get("images"))
