export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  colors: { name: string; hex: string }[];
  sizes: string[];
  fabricSpecs: {
    gsm: number;
    material: string;
    fit: string;
    care: string;
  };
  images: string[];
  features: string[];
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'prod-1',
    slug: 'desi-hustle-heavyweight-zip-hoodie',
    name: 'Desi Hustle Heavyweight Zip Hoodie',
    tagline: '240 GSM Heavyweight French Terry Streetwear',
    description: 'Designed for daily hustle and premium comfort. Crafted from 240 GSM 100% combed cotton, featuring heavy-duty YKK zipper, double-needle stitching, and custom high-density typography print on the back.',
    price: 2499,
    originalPrice: 3499,
    currency: '₹',
    category: 'Hoodies',
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 128,
    inStock: true,
    colors: [
      { name: 'Pitch Black', hex: '#111827' },
      { name: 'Charcoal Grey', hex: '#374151' },
      { name: 'Navy Blue', hex: '#1e3a8a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabricSpecs: {
      gsm: 240,
      material: '100% Combed Cotton French Terry',
      fit: 'Oversized Streetwear Fit',
      care: 'Machine Wash Cold, Inside Out',
    },
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    features: [
      'Heavyweight 240 GSM Fabric',
      'Pre-shrunk & Bio-washed',
      'High-Density Screen Print',
      'Concealed Zipper Pocket',
    ],
  },
  {
    id: 'prod-2',
    slug: 'astro-developer-oversized-tee',
    name: 'Astro Developer Oversized Tee',
    tagline: '220 GSM Bio-Washed Cotton Graphic Tee',
    description: 'Engineered for full-stack creators. Ultra-soft 220 GSM cotton with minimal developer aesthetic branding, dropped shoulders, and breathable relaxed silhouette.',
    price: 1299,
    originalPrice: 1799,
    currency: '₹',
    category: 'T-Shirts',
    badge: 'Trending',
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    colors: [
      { name: 'Cloud White', hex: '#f8fafc' },
      { name: 'Onyx Black', hex: '#0f172a' },
      { name: 'Sage Green', hex: '#334155' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabricSpecs: {
      gsm: 220,
      material: '100% Ring-Spun Cotton',
      fit: 'Relaxed Dropped Shoulder',
      care: 'Do Not Iron Directly on Print',
    },
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    ],
    features: [
      '220 GSM Premium Feel',
      'Zero Shrinkage Technology',
      'Reinforced Collar Rib',
      'Minimalist Tech Aesthetic',
    ],
  },
  {
    id: 'prod-3',
    slug: 'code-and-craft-embroidered-sweatshirt',
    name: 'Code & Craft Embroidered Sweatshirt',
    tagline: '280 GSM Fleece Lined Luxury Sweatshirt',
    description: 'Precision embroidery meets supreme thermal warmth. Features high-density 3D chest logo embroidery, ribbed cuffs, and plush fleece interior lining.',
    price: 2199,
    originalPrice: 2999,
    currency: '₹',
    category: 'Sweatshirts',
    badge: 'New Release',
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
    colors: [
      { name: 'Oatmeal Beige', hex: '#e2e8f0' },
      { name: 'Deep Forest', hex: '#14532d' },
    ],
    sizes: ['M', 'L', 'XL'],
    fabricSpecs: {
      gsm: 280,
      material: 'Fleece Lined Cotton Blend',
      fit: 'Classic Athletic Fit',
      care: 'Dry Clean Recommended',
    },
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    ],
    features: [
      '3D Precision Embroidery',
      'Thermal Fleece Lining',
      'Heavy Rib Hem',
      'Durable Twin Needle Stitching',
    ],
  },
];
