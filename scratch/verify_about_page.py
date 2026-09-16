import urllib.request
import time

url = "https://astro-cms.onrender.com/about"
print("Checking live /about page...")

for i in range(1, 10):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            if 'Panipat' in html and 'Sector 25' in html:
                print(f"[Check {i}] SUCCESS! Live About page updated with Panipat address & heritage!")
                print(f"Status: {resp.status}")
                break
            else:
                print(f"[Check {i}] Waiting for Render deployment...")
    except Exception as e:
        print(f"[Check {i}] Error: {e}")
    time.sleep(6)
