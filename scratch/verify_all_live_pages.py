import urllib.request
import re

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

items = re.findall(r'slug:\s*"([^"]+)"', content)

print(f"Testing {len(items)} product pages on live site...")

success = 0
failed = 0

for i, slug in enumerate(items, 1):
    url = f"https://astro-cms.onrender.com/products/{slug}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print(f"[{i}/{len(items)}] OK 200: {slug}")
                success += 1
            else:
                print(f"[{i}/{len(items)}] FAIL {resp.status}: {slug}")
                failed += 1
    except Exception as e:
        print(f"[{i}/{len(items)}] ERROR {e}: {slug}")
        failed += 1

print(f"\nSummary: {success} succeeded, {failed} failed out of {len(items)} products.")
