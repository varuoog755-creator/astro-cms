import json

items = json.load(open('scratch/10_products_parsed.json', encoding='utf-8'))
for i, p in enumerate(items):
    print(f"{i+1}. [{p['slug']}] {p['name']} | Price: Rs.{p['price']} | Images: {len(p['images'])}")
