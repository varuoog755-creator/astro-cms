import re
import json

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Run node script or regex to get all product items
import subprocess
result = subprocess.run(
    ["node", "-e", """
    const fs = require('fs');
    const text = fs.readFileSync('src/lib/products.ts', 'utf-8');
    const match = text.match(/export const PRODUCTS_CATALOG: Product\\[\\] = ([\\s\\S]*?);\\n\\nexport/);
    if (match) {
        console.log(match[1]);
    }
    """],
    capture_output=True,
    text=True
)

print("Output length:", len(result.stdout))
