import json
import sqlite3
import os

items = json.load(open('scratch/10_products_parsed.json', encoding='utf-8'))

print(f"Loaded {len(items)} products from scratch/10_products_parsed.json")

# 1. Update SQLite Database
db_path = os.path.join(os.getcwd(), "prisma", "cms.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Ensure table exists
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
for p in items:
    colors_json = json.dumps(p['colors'], ensure_ascii=False)
    sizes_json = json.dumps(p['sizes'], ensure_ascii=False)
    images_json = json.dumps(p['images'], ensure_ascii=False)
    features_json = json.dumps(p['features'], ensure_ascii=False)
    
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
        p['id'], p['slug'], p['name'], p['tagline'], p['description'], p['price'], p['originalPrice'],
        p['currency'], p['category'], p['badge'], p['rating'], p['reviewCount'], 1 if p['inStock'] else 0,
        colors_json, sizes_json, images_json, features_json, p['fabricSpecs']['gsm'],
        p['fabricSpecs']['material'], p['fabricSpecs']['fit'], p['fabricSpecs']['care']
    ))
    inserted_count += 1

conn.commit()
conn.close()
print(f"Successfully upserted {inserted_count} products into prisma/cms.db")

# 2. Update src/lib/products.ts
products_ts_path = os.path.join(os.getcwd(), "src", "lib", "products.ts")
with open(products_ts_path, "r", encoding="utf-8") as f:
    code = f.read()

# Generate PRODUCTS_CATALOG JS array text
catalog_ts = "export const PRODUCTS_CATALOG: Product[] = [\n"
for i, p in enumerate(items):
    comma = "," if i < len(items) - 1 else ""
    catalog_ts += f"""  {{
    id: {json.dumps(p['id'])},
    slug: {json.dumps(p['slug'])},
    name: {json.dumps(p['name'])},
    tagline: {json.dumps(p['tagline'])},
    description: {json.dumps(p['description'])},
    price: {p['price']},
    originalPrice: {p['originalPrice']},
    currency: {json.dumps(p['currency'])},
    category: {json.dumps(p['category'])},
    badge: {json.dumps(p['badge'])},
    rating: {p['rating']},
    reviewCount: {p['reviewCount']},
    inStock: true,
    colors: {json.dumps(p['colors'])},
    sizes: {json.dumps(p['sizes'])},
    fabricSpecs: {json.dumps(p['fabricSpecs'])},
    images: {json.dumps(p['images'])},
    features: {json.dumps(p['features'])}
  }}{comma}\n"""
catalog_ts += "];"

start_mark = "export const PRODUCTS_CATALOG: Product[] = ["
end_mark = "export async function getStorefrontProducts()"

start_pos = code.find(start_mark)
end_pos = code.find(end_mark)

if start_pos != -1 and end_pos != -1:
    new_code = code[:start_pos] + catalog_ts + "\n\n" + code[end_pos:]
    with open(products_ts_path, "w", encoding="utf-8") as f:
        f.write(new_code)
    print("Successfully updated src/lib/products.ts with new 10 Meesho seller products!")
else:
    print("Could not find start/end marks in products.ts!")
