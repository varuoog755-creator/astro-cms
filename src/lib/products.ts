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
    slug: 'teepul-royal-velvet-door-curtain',
    name: 'Teepul Royal Velvet Thermal Door Curtain',
    tagline: '100% Noise Reducing & Thermal Blackout Velvet Drapery',
    description: 'Elevate your living space with Teepul Royal Velvet Door Curtains. Crafted from 350 GSM plush micro-velvet with pre-installed stainless steel brass grommets. Blocks 99% light, insulates against heat, and adds timeless luxury to any room.',
    price: 1899,
    originalPrice: 2999,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 184,
    inStock: true,
    colors: [
      { name: 'Royal Cream Ivory', hex: '#fdfbf7' },
      { name: 'Soft Champagne Gold', hex: '#e8dfca' },
      { name: 'Warm Beige', hex: '#d7c4b7' },
      { name: 'Velvet Slate', hex: '#4a5568' },
    ],
    sizes: ['7 Foot (Door)', '9 Foot (Long Door)'],
    fabricSpecs: {
      gsm: 350,
      material: '100% Plush Micro-Velvet',
      fit: 'Tailored Grommet Top (Brass Eyelets)',
      care: 'Dry Clean or Gentle Machine Wash Cold',
    },
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    ],
    features: [
      '350 GSM Heavyweight Velvet Fabric',
      '99% Light & Noise Reduction',
      'Rust-Proof Brass Ring Grommets',
      'Thermal Heat Insulation',
    ],
  },
  {
    id: 'prod-2',
    slug: 'teepul-sheer-linen-window-curtain',
    name: 'Teepul Sheer French Linen Window Curtain',
    tagline: 'Light Filtering Breathable Soft Linen Window Drapery',
    description: 'Transform natural sunlight into ambient glow. Teepul Sheer Linen Window Curtains are woven from 220 GSM French flax linen blend, offering privacy while allowing gentle light diffusion into modern interiors.',
    price: 1299,
    originalPrice: 1999,
    currency: '₹',
    category: 'Window Curtains',
    badge: 'Trending',
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    colors: [
      { name: 'Snow White', hex: '#ffffff' },
      { name: 'Pure Alabaster', hex: '#f7f5f0' },
      { name: 'Warm Sand', hex: '#e5d9c5' },
    ],
    sizes: ['5 Foot (Window)', '7 Foot (Door)'],
    fabricSpecs: {
      gsm: 220,
      material: 'Flax Linen Blend',
      fit: 'Dual Rod Pocket & Back Tab',
      care: 'Machine Wash Cold, Hang Dry',
    },
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80',
    ],
    features: [
      '220 GSM Natural Linen Texture',
      'UV & Heat Light Diffusion',
      'Wrinkle-Resistant Finish',
      'Pre-hemmed Clean Edges',
    ],
  },
  {
    id: 'prod-3',
    slug: 'teepul-nordic-ambient-decor-light',
    name: 'Teepul Nordic Warm Brass Ambient Globe Lamp',
    tagline: 'Dimmable Frosted Glass & Brass Home Decor Lighting',
    description: 'Create a cozy luxury aesthetic in your living room or bedroom. Features hand-blown opal glass globe on a brushed warm gold brass pedestal with touch three-tier dimmable warm LED illumination.',
    price: 2499,
    originalPrice: 3999,
    currency: '₹',
    category: 'Ambient Lighting',
    badge: 'Luxury Pick',
    rating: 5.0,
    reviewCount: 96,
    inStock: true,
    colors: [
      { name: 'Warm Brass Gold', hex: '#d4af37' },
      { name: 'Brushed Silver', hex: '#cbd5e1' },
    ],
    sizes: ['Compact (8 inch)', 'Standard (12 inch)'],
    fabricSpecs: {
      gsm: 0,
      material: 'Hand-Blown Opal Glass & Solid Brass',
      fit: 'Architectural Table & Nightstand Light',
      care: 'Wipe Clean with Soft Microfiber Cloth',
    },
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
    ],
    features: [
      'Hand-Blown Frosted Opal Glass',
      'Touch Dimmable Warm LED (2700K)',
      'Solid Brass Base with Gold Finish',
      'Energy Efficient 5W LED Included',
    ],
  },
  {
    id: 'prod-4',
    slug: 'teepul-architectural-jacquard-cushion-covers',
    name: 'Teepul Jacquard Geometric Cushion Covers (Set of 2)',
    tagline: '3D Embroidered Luxury Sofa Pillow Covers',
    description: 'Add tactile sophistication to your furniture with Teepul Jacquard Cushion Covers. Intricately woven with metallic gold thread accents, hidden zip closure, and heavy double stitching.',
    price: 999,
    originalPrice: 1499,
    currency: '₹',
    category: 'Home Accents',
    badge: 'New Release',
    rating: 4.9,
    reviewCount: 68,
    inStock: true,
    colors: [
      { name: 'Ivory & Gold', hex: '#fbf8f1' },
      { name: 'Cream & Slate', hex: '#e2e8f0' },
    ],
    sizes: ['16x16 inch (40x40 cm)', '18x18 inch (45x45 cm)'],
    fabricSpecs: {
      gsm: 280,
      material: 'High-Density Woven Jacquard',
      fit: 'Hidden Concealed Zipper',
      care: 'Spot Clean or Gentle Hand Wash',
    },
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    ],
    features: [
      'Set of 2 Luxury Covers',
      '3D Woven Jacquard Pattern',
      'Concealed Invisible Zipper',
      'Machine Washable Heavy Fabric',
    ],
  },
];
