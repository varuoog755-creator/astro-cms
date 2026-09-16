import urllib.request
import re
import time

url = "https://astro-cms.onrender.com/blog"
print("Testing live blog list at:", url)

for attempt in range(5):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            guides = re.findall(r'href="/blog/(buying-guide-[^"]+)"', html)
            print(f"[Attempt {attempt+1}] Status: {resp.status}, Guides found: {len(set(guides))}")
            if len(set(guides)) >= 19:
                print("All 19 buying guides are live!")
                break
    except Exception as e:
        print(f"[Attempt {attempt+1}] Error: {e}")
    time.sleep(5)
