import json
import sqlite3
import os

# 1. Read Batch 1 (9 products)
with open('scratch/batch1.json', 'r', encoding='utf-8') as f:
    batch1 = json.load(f)

# 2. Read Batch 2 (10 products)
with open('scratch/10_products_parsed.json', 'r', encoding='utf-8') as f:
    batch2 = json.load(f)

print(f"Batch 1 count: {len(batch1)}")
print(f"Batch 2 count: {len(batch2)}")

# 3. Merge both batches, deduplicating by slug
combined_map = {}
for p in batch1:
    if isinstance(p, dict) and p.get('slug'):
        combined_map[p['slug']] = p

for p in batch2:
    if isinstance(p, dict) and p.get('slug'):
        combined_map[p['slug']] = p

all_19_products = list(combined_map.values())
print(f"Total combined products: {len(all_19_products)}")

# 4. Insert/Upsert into SQLite Database (prisma/cms.db)
db_path = os.path.join(os.getcwd(), "prisma", "cms.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS "products" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "tagline" TEXT,
  "description" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "originalPrice" REAL,
  "currency" TEXT DEFAULT '₹',
  "category" TEXT NOT NULL,
  "badge" TEXT,
  "rating" REAL DEFAULT 4.5,
  "reviewCount" INTEGER DEFAULT 10,
  "inStock" BOOLEAN DEFAULT 1,
  "colorsJson" TEXT,
  "sizesJson" TEXT,
  "imagesJson" TEXT,
  "featuresJson" TEXT,
  "gsm" INTEGER DEFAULT 280,
  "material" TEXT,
  "fit" TEXT,
  "care" TEXT,
  "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
''')

inserted_count = 0
for p in all_19_products:
    colors_json = json.dumps(p.get('colors', []), ensure_ascii=False)
    sizes_json = json.dumps(p.get('sizes', []), ensure_ascii=False)
    images_json = json.dumps(p.get('images', []), ensure_ascii=False)
    features_json = json.dumps(p.get('features', []), ensure_ascii=False)
    fabric = p.get('fabricSpecs', {})
    
    cursor.execute('''
    INSERT INTO "products" (
        "id", "slug", "name", "tagline", "description", "price", "originalPrice", "currency",
        "category", "badge", "rating", "reviewCount", "inStock", "colorsJson", "sizesJson",
        "imagesJson", "featuresJson", "gsm", "material", "fit", "care", "updatedAt"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT("slug") DO UPDATE SET
        "name" = excluded."name",
        "tagline" = excluded."tagline",
        "description" = excluded."description",
        "price" = excluded."price",
        "originalPrice" = excluded."originalPrice",
        "currency" = excluded."currency",
        "category" = excluded."category",
        "badge" = excluded."badge",
        "colorsJson" = excluded."colorsJson",
        "sizesJson" = excluded."sizesJson",
        "imagesJson" = excluded."imagesJson",
        "featuresJson" = excluded."featuresJson",
        "updatedAt" = CURRENT_TIMESTAMP;
    ''', (
        p.get('id', p['slug']), p['slug'], p['name'], p.get('tagline', ''), p.get('description', ''),
        p['price'], p.get('originalPrice'), p.get('currency', '₹'), p.get('category', 'Door Curtains'),
        p.get('badge'), p.get('rating', 4.5), p.get('reviewCount', 50), 1 if p.get('inStock', True) else 0,
        colors_json, sizes_json, images_json, features_json, fabric.get('gsm', 280),
        fabric.get('material', '100% Premium Polyester'), fabric.get('fit', 'Silver Eyelet Grommets'),
        fabric.get('care', 'Hand & Machine Wash Cold')
    ))
    inserted_count += 1

conn.commit()
conn.close()
print(f"Successfully upserted {inserted_count} products into prisma/cms.db SQLite DB")

# 5. Generate PRODUCTS_CATALOG in src/lib/products.ts
products_ts_path = os.path.join(os.getcwd(), "src", "lib", "products.ts")
with open(products_ts_path, "r", encoding="utf-8") as f:
    code = f.read()

catalog_ts = "export const PRODUCTS_CATALOG: Product[] = [\n"
for i, p in enumerate(all_19_products):
    comma = "," if i < len(all_19_products) - 1 else ""
    catalog_ts += f"""  {{
    id: {json.dumps(p.get('id', p['slug']))},
    slug: {json.dumps(p['slug'])},
    name: {json.dumps(p['name'])},
    tagline: {json.dumps(p.get('tagline', ''))},
    description: {json.dumps(p.get('description', ''))},
    price: {p['price']},
    originalPrice: {p.get('originalPrice', int(p['price'] * 1.8))},
    currency: {json.dumps(p.get('currency', '₹'))},
    category: {json.dumps(p.get('category', 'Door Curtains'))},
    badge: {json.dumps(p.get('badge', 'Best Seller'))},
    rating: {p.get('rating', 4.8)},
    reviewCount: {p.get('reviewCount', 85)},
    inStock: true,
    colors: {json.dumps(p.get('colors', []))},
    sizes: {json.dumps(p.get('sizes', []))},
    fabricSpecs: {json.dumps(p.get('fabricSpecs', {}))},
    images: {json.dumps(p.get('images', []))},
    features: {json.dumps(p.get('features', []))}
  }}{comma}\n"""
catalog_ts += "];"

start_mark = "export const PRODUCTS_CATALOG: Product[] = ["
end_mark = "export async function getStorefrontProducts()"

curr_start_pos = code.find(start_mark)
curr_end_pos = code.find(end_mark)

if curr_start_pos != -1 and curr_end_pos != -1:
    new_code = code[:curr_start_pos] + catalog_ts + "\n\n" + code[curr_end_pos:]
    with open(products_ts_path, "w", encoding="utf-8") as f:
        f.write(new_code)
    print(f"Successfully updated src/lib/products.ts with ALL {len(all_19_products)} products!")
else:
    print("Could not find PRODUCTS_CATALOG bounds in src/lib/products.ts!")
