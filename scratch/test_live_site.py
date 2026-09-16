import urllib.request
import re

def check_url(url):
    print(f"--- Checking {url} ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            buy_count = html.count('View & Buy')
            view_item_count = html.count('View Item')
            slugs = list(set(re.findall(r'href="/products/([^"/]+)"', html)))
            print(f"Status: {resp.status}")
            print(f"'View & Buy' count: {buy_count}")
            print(f"'View Item' count: {view_item_count}")
            print(f"Unique product slugs found ({len(slugs)}):")
            for i, s in enumerate(slugs, 1):
                print(f"  {i}. {s}")
    except Exception as e:
        print(f"Error fetching {url}: {e}")

check_url("https://astro-cms.onrender.com/products")
check_url("https://astro-cms.onrender.com/")
