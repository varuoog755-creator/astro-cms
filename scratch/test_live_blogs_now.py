import urllib.request
import re

url_blog = "https://astro-cms.onrender.com/blog"
req = urllib.request.Request(url_blog, headers={'User-Agent': 'Mozilla/5.0'})

with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')
    print("Live /blog status:", resp.status)
    slugs = list(set(re.findall(r'href="/blog/([^"/]+)"', html)))
    print(f"Total blog guides found on live site ({len(slugs)}):")
    for i, s in enumerate(slugs, 1):
        print(f"  {i}. {s}")

# Test individual blog detail page
if slugs:
    test_url = f"https://astro-cms.onrender.com/blog/{slugs[0]}"
    req_detail = urllib.request.Request(test_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_detail) as r_detail:
        print(f"\nTested Detail Page {test_url} -> Status: {r_detail.status}")
