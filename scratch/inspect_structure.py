import json

with open("scratch/meesho_seller_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

page_props = data.get("props", {}).get("pageProps", {})
initial_state = page_props.get("initialState", {})

print("initial_state keys:", list(initial_state.keys()))

# Look for catalogs or products list
catalogs = []

# Check common state structures in meesho next data
def search_for_catalogs(obj, depth=0):
    if depth > 5:
        return
    if isinstance(obj, dict):
        if "catalogs" in obj:
            print("Found 'catalogs' key:", type(obj["catalogs"]))
            if isinstance(obj["catalogs"], list):
                print(f"Catalogs length: {len(obj['catalogs'])}")
                if len(obj["catalogs"]) > 0:
                    print("Sample item keys:", list(obj["catalogs"][0].keys()))
            elif isinstance(obj["catalogs"], dict):
                print("Catalogs dict keys:", list(obj["catalogs"].keys()))
        for k, v in obj.items():
            if k in ["products", "catalogs", "feedList", "catalogList"]:
                print(f"Found interesting key '{k}' at depth {depth}")
            search_for_catalogs(v, depth + 1)
    elif isinstance(obj, list):
        for item in obj[:3]:
            search_for_catalogs(item, depth + 1)

search_for_catalogs(initial_state)
