import sqlite3
import re
import json
import uuid

with open('src/lib/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

catalog_str = text[text.find('export const PRODUCTS_CATALOG'):]
blocks = re.split(r'\n\s*\{\s*\n\s*id:\s*"', catalog_str)

products_data = []
for block in blocks[1:]:
    p_id = block[:block.find('"')]
    
    slug_match = re.search(r'slug:\s*"([^"]+)"', block)
    p_slug = slug_match.group(1) if slug_match else ""
    
    name_match = re.search(r'name:\s*"([^"]+)"', block)
    p_name = name_match.group(1) if name_match else ""
    
    price_match = re.search(r'price:\s*(\d+)', block)
    price = int(price_match.group(1)) if price_match else 399
    
    orig_match = re.search(r'originalPrice:\s*(\d+)', block)
    orig_price = int(orig_match.group(1)) if orig_match else price * 2
    
    cat_match = re.search(r'category:\s*"([^"]+)"', block)
    category = cat_match.group(1) if cat_match else "Door Curtains"
    
    img_match = re.search(r'images:\s*\[\s*"([^"]+)"', block)
    image = img_match.group(1) if img_match else "https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512"
    
    gsm_match = re.search(r'"gsm":\s*(\d+)', block)
    gsm = int(gsm_match.group(1)) if gsm_match else 280

    mat_match = re.search(r'"material":\s*"([^"]+)"', block)
    material = mat_match.group(1) if mat_match else "100% Premium Polyester"

    if p_slug and p_name:
        products_data.append({
            "id": p_id,
            "slug": p_slug,
            "name": p_name,
            "price": price,
            "orig_price": orig_price,
            "category": category,
            "image": image,
            "gsm": gsm,
            "material": material
        })

print(f"Loaded {len(products_data)} products for blog generation.")

# Open DB connection
conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()

# Get or create author ID
cursor.execute("SELECT id FROM users LIMIT 1;")
author_row = cursor.fetchone()
author_id = author_row[0] if author_row else "1378cb33-9298-48ed-92d3-0314f8ec0161"

# Get or create Category ID for Home Decor
cursor.execute("SELECT id FROM categories WHERE slug='home-decor';")
cat_row = cursor.fetchone()
if not cat_row:
    cat_id = str(uuid.uuid4())
    now_ts = "2026-09-14 11:00:00"
    cursor.execute(
        "INSERT INTO categories (id, name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);",
        (cat_id, "Home Decor & Drapery", "home-decor", "Luxury Door Curtains, Window Drapes & Home Interior Styling Guides.", now_ts, now_ts)
    )
else:
    cat_id = cat_row[0]

blogs_inserted = 0

for i, p in enumerate(products_data):
    blog_slug = f"buying-guide-{p['slug']}"
    blog_title = f"{p['name']} - Complete Buying Guide & Styling Tips (2026)"
    excerpt = f"Everything you need to know about {p['name']}. Specs, fabric density, light blocking, room placement tips, and internal styling guides for Indian home decor."
    
    # Select 2 other products for internal linking
    prev_p = products_data[(i - 1) % len(products_data)]
    next_p = products_data[(i + 1) % len(products_data)]

    # Generate Rich HTML Content with 3D Animations, Specs Table, AEO Boxes & Internal Links
    content_html = f"""
<div class="space-y-10 text-slate-800">

  <!-- GEO & AEO Summary Banner -->
  <div class="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-sm relative overflow-hidden">
    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="flex items-center gap-2 text-amber-900 text-xs font-black uppercase tracking-widest mb-3">
      <span class="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
      <span>AI Overview & Generative Buying Summary</span>
    </div>
    <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Why Choose {p['name']}?</h2>
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium text-slate-700">
      <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> <span><strong>High Density Fabric:</strong> Premium {p['material']} texture.</span></li>
      <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> <span><strong>Light & Noise Control:</strong> Filters glare while enhancing room privacy.</span></li>
      <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> <span><strong>Heavy-Duty Grommets:</strong> Rust-proof stainless steel silver eyelet rings.</span></li>
      <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> <span><strong>Affordable Luxury:</strong> Discounted at ₹{p['price']} (MRP ₹{p['orig_price']}).</span></li>
    </ul>
  </div>

  <!-- 3D Interactive Product Card Preview -->
  <div class="relative group my-8">
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1">
      <div class="md:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
        <img src="{p['image']}" alt="{p['name']}" class="w-full h-full object-cover" />
        <span class="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
          {p['category']}
        </span>
        <span class="absolute top-3 right-3 bg-amber-800 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg shadow">
          Heavy Weave
        </span>
      </div>

      <div class="md:col-span-7 space-y-4">
        <div class="inline-block bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Featured Product Showcase
        </div>
        <h3 class="text-2xl font-extrabold text-slate-900 leading-snug">
          {p['name']}
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed font-medium">
          Elevate your home decoration with Teepul luxury craftsmanship. Engineered for living rooms, master bedrooms, and modern apartments across India.
        </p>

        <div class="flex items-baseline gap-3 pt-2">
          <span class="text-3xl font-black text-slate-900">₹{p['price']}</span>
          <span class="text-sm text-slate-400 line-through font-semibold">₹{p['orig_price']}</span>
          <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">Save {int((1 - p['price']/p['orig_price']) * 100)}%</span>
        </div>

        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
          <a href="/products/{p['slug']}" class="bg-slate-900 hover:bg-amber-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2">
            <span>🛍️ View Details & Buy Now</span>
            <span>&rarr;</span>
          </a>
          <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>✓ In Stock</span> · <span>Free Express Delivery</span>
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Detailed Fabric & Product Specifications Table -->
  <div class="space-y-4">
    <h3 class="text-xl font-extrabold text-slate-900">Technical Specifications & Material Quality</h3>
    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
      When selecting luxury drapery for your home, weave density and grommet durability dictate long-term aesthetic and functional performance.
    </p>

    <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table class="w-full text-left text-xs text-slate-700">
        <thead class="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
          <tr>
            <th class="p-4">Feature / Parameter</th>
            <th class="p-4">Specification Details</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white font-medium">
          <tr>
            <td class="p-4 font-bold text-slate-900">Fabric Density</td>
            <td class="p-4 text-amber-800 font-bold">Heavyweight Weave</td>
          </tr>
          <tr>
            <td class="p-4 font-bold text-slate-900">Material Composition</td>
            <td class="p-4">{p['material']}</td>
          </tr>
          <tr>
            <td class="p-4 font-bold text-slate-900">Eyelet Ring Finish</td>
            <td class="p-4">Rust-Proof Stainless Steel Silver Grommets</td>
          </tr>
          <tr>
            <td class="p-4 font-bold text-slate-900">Available Lengths</td>
            <td class="p-4">5 Feet (Window), 7 Feet (Door), 9 Feet (Long Door)</td>
          </tr>
          <tr>
            <td class="p-4 font-bold text-slate-900">Maintenance & Care</td>
            <td class="p-4">Gentle Machine Wash or Hand Wash in Cold Water</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Interior Styling & Decor Advice -->
  <div class="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
    <h3 class="text-xl font-extrabold text-slate-900">Interior Styling & Room Placement Guide</h3>
    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
      Pairing <strong>{p['name']}</strong> with complementary wall colors and lighting creates a harmonious living environment. For best results:
    </p>
    <ul class="space-y-2 text-xs sm:text-sm text-slate-700 font-medium list-disc list-inside">
      <li><strong>Living Room Placement:</strong> Hang curtains 4 to 6 inches above the door frame to create an elongated vertical appearance.</li>
      <li><strong>Bedroom Thermal Comfort:</strong> Helps reduce exterior noise and regulate indoor room temperature during peak summers and winters.</li>
      <li><strong>Lighting Pairing:</strong> Pairs excellently with warm ambient brass lamps and modern LED ceiling cove lighting.</li>
    </ul>
  </div>

  <!-- Two-Way Internal Linking SEO Cluster -->
  <div class="my-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
    <h4 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Explore Related Teepul Catalog Collections</h4>
    <p class="text-xs text-slate-500">Discover matching drapery options to complete your interior theme:</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a href="/blog/buying-guide-{prev_p['slug']}" class="p-4 bg-amber-50/60 hover:bg-amber-100/80 rounded-2xl border border-amber-200/60 transition group flex items-center gap-3">
        <img src="{prev_p['image']}" class="w-12 h-12 rounded-xl object-cover border border-amber-200" alt="{prev_p['name']}" />
        <div>
          <span class="text-[10px] font-bold uppercase text-amber-800">Previous Guide &rarr;</span>
          <h5 class="text-xs font-bold text-slate-900 group-hover:text-amber-900 line-clamp-1">{prev_p['name']}</h5>
        </div>
      </a>

      <a href="/blog/buying-guide-{next_p['slug']}" class="p-4 bg-amber-50/60 hover:bg-amber-100/80 rounded-2xl border border-amber-200/60 transition group flex items-center gap-3">
        <img src="{next_p['image']}" class="w-12 h-12 rounded-xl object-cover border border-amber-200" alt="{next_p['name']}" />
        <div>
          <span class="text-[10px] font-bold uppercase text-amber-800">Next Guide &rarr;</span>
          <h5 class="text-xs font-bold text-slate-900 group-hover:text-amber-900 line-clamp-1">{next_p['name']}</h5>
        </div>
      </a>
    </div>
  </div>

  <!-- Frequently Asked Questions (Structured AEO / GEO Schema) -->
  <div class="space-y-4">
    <h3 class="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
    <div class="space-y-3">
      <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
        <h4 class="font-bold text-sm text-slate-900">Q: Is {p['name']} suitable for machine washing?</h4>
        <p class="text-xs text-slate-600 leading-relaxed font-medium">A: Yes! Use a gentle machine wash cycle with mild detergent in cold water. Do not bleach or tumble dry on high heat.</p>
      </div>

      <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
        <h4 class="font-bold text-sm text-slate-900">Q: How many curtain panels are included in this pack?</h4>
        <p class="text-xs text-slate-600 leading-relaxed font-medium">A: Each pack contains high quality panels formatted for immediate installation with stainless steel eyelet rings.</p>
      </div>

      <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
        <h4 class="font-bold text-sm text-slate-900">Q: How fast is doorstep delivery across India?</h4>
        <p class="text-xs text-slate-600 leading-relaxed font-medium">A: Orders are dispatched within 24 hours with express doorstep delivery across all major Indian cities and pincodes.</p>
      </div>
    </div>
  </div>

  <!-- Bottom CTA Banner -->
  <div class="bg-slate-900 text-white p-8 rounded-3xl text-center space-y-4 shadow-xl">
    <span class="bg-amber-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">LIMITED PERIOD OFFER</span>
    <h3 class="text-2xl font-extrabold text-white">Ready to Transform Your Living Room?</h3>
    <p class="text-xs text-slate-300 max-w-xl mx-auto font-medium">
      Order <strong>{p['name']}</strong> today at exclusive discounted pricing with 100% Quality Guarantee & Express Shipping.
    </p>
    <a href="/products/{p['slug']}" class="inline-block bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-8 py-4 rounded-full shadow-lg hover:shadow-amber-600/40 transition-all">
      🛍️ Buy {p['name']} at ₹{p['price']} &rarr;
    </a>
  </div>

</div>
"""

    # Check if post already exists in sqlite DB
    cursor.execute("SELECT id FROM posts WHERE slug=?;", (blog_slug,))
    existing = cursor.fetchone()
    
    now = "2026-09-14 11:00:00"
    
    if existing:
        cursor.execute(
            "UPDATE posts SET title=?, excerpt=?, content=?, status=?, publishedAt=?, updatedAt=? WHERE id=?;",
            (blog_title, excerpt, content_html, "published", now, now, existing[0])
        )
        post_id = existing[0]
    else:
        post_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO posts (id, title, slug, excerpt, content, status, publishedAt, authorId, viewsCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            (post_id, blog_title, blog_slug, excerpt, content_html, "published", now, author_id, 0, now, now)
        )
    
    # Attach category relation
    cursor.execute("SELECT * FROM post_categories WHERE postId=? AND categoryId=?;", (post_id, cat_id))
    if not cursor.fetchone():
        cursor.execute("INSERT INTO post_categories (postId, categoryId) VALUES (?, ?);", (post_id, cat_id))

    blogs_inserted += 1

conn.commit()
conn.close()

print(f"Successfully created & inserted {blogs_inserted} GEO/AEO/SEO blog posts into prisma/cms.db!")
