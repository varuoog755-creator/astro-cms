import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'ecom_cms.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Recreate database tables with Indian E-Commerce attributes
db.exec(`
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS posts;
  DROP TABLE IF EXISTS coupons;
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS pages;
  DROP TABLE IF EXISTS store_settings;

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    price REAL NOT NULL,
    compare_at_price REAL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    image_url TEXT,
    badge TEXT,
    rating REAL DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 142,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    coupon_code TEXT,
    status TEXT DEFAULT 'Pending',
    payment_status TEXT DEFAULT 'Paid',
    items_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Streetwear Guide',
    author TEXT DEFAULT 'Teepul Editorial',
    image_url TEXT,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    value REAL NOT NULL,
    min_spend REAL DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_approved INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE store_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Insert Store Settings for Indian Market
const insertSetting = db.prepare('INSERT INTO store_settings (key, value) VALUES (?, ?)');
insertSetting.run('store_name', 'Teepul Streetwear');
insertSetting.run('store_tagline', 'Heavyweight 240 GSM Oversized Apparel for India.');
insertSetting.run('hero_headline', 'Wear the Culture. Feel the Pleasure.');
insertSetting.run('currency_symbol', '₹');
insertSetting.run('free_shipping_threshold', '799');
insertSetting.run('support_email', 'care@teepul.com');

// Insert Categories
const insertCat = db.prepare('INSERT INTO categories (name, slug, description, image_url) VALUES (@name, @slug, @description, @image_url)');
insertCat.run({ name: 'Oversized Streetwear Tees', slug: 'oversized-tees', description: '240 GSM 100% French Terry Cotton with relaxed drop-shoulder fit.', image_url: '/uploads/oversized_tee.jpg' });
insertCat.run({ name: 'Anime & Cyber Hoodies', slug: 'anime-hoodies', description: '500 GSM Fleece Hoodies with high-density Cyberpunk prints.', image_url: '/uploads/anime_hoodie.jpg' });
insertCat.run({ name: 'Typographic & Quote Tees', slug: 'quote-tees', description: 'Minimalist statement quotes for everyday hustle & comedy.', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' });
insertCat.run({ name: 'Desi Co-ord & Cargo Sets', slug: 'desi-coords', description: 'Utility cargo pants and heavy aesthetic matching streetwear sets.', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80' });

// Insert Products (Teepul Brand Style with Indian Rupee Prices)
const insertProd = db.prepare(`
  INSERT INTO products (title, slug, summary, description, price, compare_at_price, stock, category_id, image_url, badge, rating, reviews_count, is_featured)
  VALUES (@title, @slug, @summary, @description, @price, @compare_at_price, @stock, @category_id, @image_url, @badge, @rating, @reviews_count, @is_featured)
`);

insertProd.run({
  title: 'Axel Minimalist 240 GSM Oversized Tee',
  slug: 'axel-minimalist-240gsm-oversized-tee',
  summary: '240 GSM Heavyweight Terry Cotton with London-Milan architectural print.',
  description: 'Designed for ultimate comfort and social flex. Features a relaxed drop-shoulder cut, anti-pilling French terry weave, and breathable puff screenprint on back. Fits true to Indian streetwear sizing.',
  price: 799,
  compare_at_price: 1499,
  stock: 12,
  category_id: 1,
  image_url: '/uploads/oversized_tee.jpg',
  badge: '🔥 48 Sold Today',
  rating: 4.9,
  reviews_count: 248,
  is_featured: 1
});

insertProd.run({
  title: 'Neo Tokyo Cyberpunk Anime Hoodie',
  slug: 'neo-tokyo-cyberpunk-anime-hoodie',
  summary: '500 GSM Heavyweight Cream Fleece Hoodie with vivid neon graphic.',
  description: 'Pure dopamine in a hoodie. Crafted with ultra-soft brushed fleece interior, double-lined hood, and high-density DTG cyberpunk anime print that won’t fade after 100 washes.',
  price: 1499,
  compare_at_price: 2499,
  stock: 8,
  category_id: 2,
  image_url: '/uploads/anime_hoodie.jpg',
  badge: '⚡ Limited Edition',
  rating: 5.0,
  reviews_count: 312,
  is_featured: 1
});

insertProd.run({
  title: 'Overthinking Society Vintage Graphic Tee',
  slug: 'overthinking-society-vintage-graphic-tee',
  summary: 'Acid-washed charcoal grey t-shirt with retro typography print.',
  description: 'Trigger instant relatable conversations with this viral tee. Made from 100% combed cotton with acid wash finish and vintage distressed lettering.',
  price: 699,
  compare_at_price: 1299,
  stock: 25,
  category_id: 3,
  image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  badge: 'Best Seller',
  rating: 4.8,
  reviews_count: 189,
  is_featured: 1
});

insertProd.run({
  title: 'Desi Hustle Heavyweight Zip Hoodie',
  slug: 'desi-hustle-heavyweight-zip-hoodie',
  summary: 'Full-zip black fleece hoodie with embroidered chest logo.',
  description: 'Engineered for night shifts, college campuses, and airport looks. Includes YKK matte black zipper, hidden stash pocket for earphones, and thumbhole cuffs.',
  price: 1699,
  compare_at_price: 2799,
  stock: 14,
  category_id: 2,
  image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
  badge: '🔥 Trending',
  rating: 4.9,
  reviews_count: 164,
  is_featured: 1
});

// Insert Coupons
const insertCoupon = db.prepare('INSERT INTO coupons (code, type, value, min_spend) VALUES (?, ?, ?, ?)');
insertCoupon.run('DESI20', 'percent', 20, 999);
insertCoupon.run('TEEPUL100', 'fixed', 100, 699);
insertCoupon.run('FIRSTBUY', 'fixed', 150, 999);

// Insert Indian Customer Reviews
const insertReview = db.prepare('INSERT INTO reviews (product_id, customer_name, rating, comment, is_approved) VALUES (?, ?, ?, ?, 1)');
insertReview.run(1, 'Aarav Sharma (Bangalore)', 5, 'Bhai cloth quality is next level! 240 GSM heavy terry cotton, fits like high-end Zara/Yeezy oversized tee.');
insertReview.run(1, 'Ananya Patel (Mumbai)', 5, 'Got it delivered in 2 days in Mumbai. COD option was smooth and print quality is top notch!');
insertReview.run(2, 'Rohan Verma (Delhi)', 5, 'Anime print colors are insanely vibrant! Got so many compliments in college.');

// Insert Static Pages
const insertPage = db.prepare('INSERT INTO pages (title, slug, content) VALUES (?, ?, ?)');
insertPage.run('About Teepul', 'about', 'Teepul is India’s premier streetwear brand, crafting 240 GSM heavyweight oversized tees and 500 GSM fleece hoodies for Gen-Z and millennial culture.');
insertPage.run('Shipping & COD Policy', 'faq', 'We ship across 19,000+ pincodes in India. Orders dispatched within 24 hours. Cash on Delivery (COD) and UPI Express payments available.');
insertPage.run('Returns & Exchange Guarantee', 'terms', 'Hassle-free 7-day reverse pickup exchange policy across India.');

// Insert Blog Post
const insertPost = db.prepare('INSERT INTO posts (title, slug, excerpt, content, category, author, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
insertPost.run(
  'Why 240 GSM Heavyweight Terry Cotton is Taking Over Indian Streetwear',
  'why-240gsm-heavyweight-terry-cotton-taking-over',
  'Understanding fabric weight, drop-shoulder silhouettes, and how to style oversized tees.',
  'Standard t-shirts in India are typically 140-160 GSM, which cling to the body and lose shape after a few washes. Teepul introduced 240 GSM French Terry Cotton, offering a structured architectural drape that flatters all body types while keeping you cool in Indian summers.',
  'Fashion Psychology',
  'Teepul Design Team',
  '/uploads/oversized_tee.jpg'
);

export default db;
