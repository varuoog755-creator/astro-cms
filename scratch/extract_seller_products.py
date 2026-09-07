import json
import re
import urllib.request
import os

url = "https://www.meesho.com/ASHANKECOMMERCEPRIVATELIMITED?ms=2"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

html = ""
try:
    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req).read().decode('utf-8')
except Exception as e:
    print(f"Error fetching URL: {e}")

if not html:
    step_file = r"C:\Users\Gourav\.gemini\antigravity\brain\59564369-666c-4778-b4b0-3e43378ab7cc\.system_generated\steps\1293\content.md"
    if os.path.exists(step_file):
        with open(step_file, encoding='utf-8') as f:
            html = f.read()

m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
if m:
    data = json.loads(m.group(1))
    print("Found __NEXT_DATA__")
    os.makedirs("scratch", exist_ok=True)
    with open("scratch/meesho_seller_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("Saved json to scratch/meesho_seller_data.json")
else:
    print("No __NEXT_DATA__ found")
