import urllib.request

req = urllib.request.Request("https://astro-cms.onrender.com/products", headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    print("Status:", resp.status)
    print("Headers:")
    for k, v in resp.headers.items():
        print(f"  {k}: {v}")
