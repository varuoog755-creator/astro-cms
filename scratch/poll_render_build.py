import urllib.request
import time

url = "https://astro-cms.onrender.com/blog"
print("Waiting for Render deployment to finish...")

for i in range(1, 12):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            if 'buying-guide' in html:
                print(f"[Check {i}] SUCCESS! Render build deployed and live! Found 'buying-guide' in HTML!")
                count = html.count('buying-guide-')
                print(f"Total guide mentions in HTML: {count}")
                break
            else:
                print(f"[Check {i}] Build still in progress... (Render deployment pending)")
    except Exception as e:
        print(f"[Check {i}] Error: {e}")
    time.sleep(8)
