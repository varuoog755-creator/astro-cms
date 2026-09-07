import json

with open("scratch/meesho_seller_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def find_lists_with_items(obj, path="root"):
    if isinstance(obj, dict):
        for k, v in obj.items():
            current_path = f"{path}.{k}"
            if isinstance(v, list) and len(v) > 0:
                if isinstance(v[0], dict) and any(key in v[0] for key in ['id', 'name', 'title', 'price', 'product_id', 'catalog_id']):
                    print(f"Path: {current_path} | Length: {len(v)} | First item keys: {list(v[0].keys())}")
            find_lists_with_items(v, current_path)
    elif isinstance(obj, list):
        for idx, item in enumerate(obj):
            find_lists_with_items(item, f"{path}[{idx}]")

find_lists_with_items(data)
