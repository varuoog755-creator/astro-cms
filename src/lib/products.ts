import prisma from './db/index.ts';
import { getOrSetCache } from './cache';

export interface ProductSize {
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  inStock?: boolean;
}

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
  colors: { name: string; hex: string; images?: string[] }[];
  sizes: (string | ProductSize)[];
  fabricSpecs: {
    gsm: number;
    material: string;
    fit: string;
    care: string;
  };
  images: string[];
  features: string[];
}

export function normalizeProductSizes(sizes: (string | ProductSize)[], basePrice: number = 499, baseOriginalPrice?: number): ProductSize[] {
  const p5 = typeof basePrice === 'number' && basePrice > 0 ? basePrice : 499;
  const p7 = Math.min(569, Math.round((p5 + 50) / 10) * 10 - 1);
  const p9 = Math.min(579, Math.round((p5 + 90) / 10) * 10 - 1);

  const orig5 = baseOriginalPrice || (Math.round((p5 * 2) / 10) * 10 - 1);
  const orig7 = Math.round((p7 * 2) / 10) * 10 - 1;
  const orig9 = Math.round((p9 * 2) / 10) * 10 - 1;

  const defaultSizes: ProductSize[] = [
    { name: "5 Feet (Window)", price: p5, originalPrice: orig5, stock: 50, inStock: true },
    { name: "7 Feet (Door)", price: p7, originalPrice: orig7, stock: 50, inStock: true },
    { name: "9 Feet (Long Door)", price: p9, originalPrice: orig9, stock: 50, inStock: true },
  ];

  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return defaultSizes;
  }

  const filtered = sizes.filter((s) => {
    const name = typeof s === 'string' ? s : s.name;
    return !name.toLowerCase().includes('6');
  });

  if (filtered.length === 0) {
    return defaultSizes;
  }

  return filtered.map((s) => {
    if (typeof s === 'string') {
      const lower = s.toLowerCase();
      let price = p5;
      let calculatedOrigPrice = orig5;

      if (lower.includes('5') || (lower.includes('window') && !lower.includes('door'))) {
        price = p5;
        calculatedOrigPrice = orig5;
      } else if (lower.includes('7') || (lower.includes('door') && !lower.includes('long') && !lower.includes('9'))) {
        price = p7;
        calculatedOrigPrice = orig7;
      } else if (lower.includes('9') || lower.includes('long')) {
        price = p9;
        calculatedOrigPrice = orig9;
      }

      return {
        name: s,
        price,
        originalPrice: calculatedOrigPrice,
        stock: 50,
        inStock: true,
      };
    }
    return {
      name: s.name,
      price: typeof s.price === 'number' && !isNaN(s.price) ? s.price : basePrice,
      originalPrice: typeof s.originalPrice === 'number' && !isNaN(s.originalPrice) ? s.originalPrice : orig5,
      stock: typeof s.stock === 'number' && !isNaN(s.stock) ? s.stock : 50,
      inStock: s.inStock !== false,
    };
  });
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    "id": "meesho-blackout-7wvq",
    "slug": "premium-polyester-blend-blackout-curtains-for-home-set-of-2",
    "name": "Premium Polyester Blend Blackout Curtains for Home | Set of 2 Panels",
    "tagline": "Pack of 2 | 100% Light Blocking Thermal Insulated Eyelet Curtains",
    "description": "Name: Premium Polyester Blend Blackout Curtains for Home | Set of 2 Panels\nMaterial: 100% Heavyweight Polyester & Cotton Blend\nOpacity: Blackout & Room Darkening\nSet: Set of 2 Panels\nPrint or Pattern Type: Elegant Solid Texture with Gold Thread Detailing\nNet Quantity (N): 2\nSizes Available: 5 Feet (Window), 7 Feet (Door), 9 Feet (Long Door)\n\nTransform your home interior with Teepul Premium Polyester Blend Blackout Curtains (Set of 2). Woven with multi-layer dense fabric to block harsh sunlight, UV rays, and outside noise while insulating your room against heat and cold. Pre-fitted with rust-proof stainless steel silver eyelets for smooth movement on standard curtain rods.\n\nKey Highlights:\n✔ Pack of 2 Panels: Complete matching set for windows and doors\n✔ Blackout Room Darkening: Superior glare reduction and total indoor privacy\n✔ Premium Heavyweight Fabric: Elegant drape with wrinkle-resistant finish\n✔ 4 Rich Color Variants: Wine Maroon, Royal Blue, Royal Purple, and Mustard Gold\n✔ 4 Size Options: 5ft, 7ft & 9ft available\n✔ Easy Care: 100% machine and hand wash friendly",
    "price": 455,
    "originalPrice": 910,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Top Seller",
    "rating": 4.8,
    "reviewCount": 114,
    "inStock": true,
    "colors": [
      {
        "name": "Wine Maroon",
        "hex": "#722f37",
        "images": [
          "https://images.meesho.com/images/products/478491390/ijxnr_512.jpg",
          "https://images.meesho.com/images/products/478491390/13vpb_512.jpg",
          "https://images.meesho.com/images/products/478491390/gxuah_512.jpg",
          "https://images.meesho.com/images/products/478491390/hdjib_512.jpg"
        ]
      },
      {
        "name": "Royal Blue",
        "hex": "#1e3a8a",
        "images": [
          "https://images.meesho.com/images/products/478491395/vfhok_512.jpg",
          "https://images.meesho.com/images/products/478491395/iqfz2_512.jpg",
          "https://images.meesho.com/images/products/478491395/kx3uc_512.jpg",
          "https://images.meesho.com/images/products/478491395/yxm7h_512.jpg"
        ]
      },
      {
        "name": "Royal Purple",
        "hex": "#581c87",
        "images": [
          "https://images.meesho.com/images/products/478491392/xctxd_512.jpg",
          "https://images.meesho.com/images/products/478491392/pknla_512.jpg",
          "https://images.meesho.com/images/products/478491392/mra8y_512.jpg",
          "https://images.meesho.com/images/products/478491392/sdav5_512.jpg"
        ]
      },
      {
        "name": "Mustard Gold",
        "hex": "#d97706",
        "images": [
          "https://images.meesho.com/images/products/478491396/tdbr5_512.jpg",
          "https://images.meesho.com/images/products/478491396/b0yem_512.jpg",
          "https://images.meesho.com/images/products/478491396/up2ky_512.jpg",
          "https://images.meesho.com/images/products/478491396/fr4cf_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 455,
        "originalPrice": 910,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 515,
        "originalPrice": 1030,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "Heavyweight Polyester & Cotton Blend",
      "fit": "Stainless Steel Silver Eyelets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/478491390/ijxnr_512.jpg",
      "https://images.meesho.com/images/products/478491390/13vpb_512.jpg",
      "https://images.meesho.com/images/products/478491390/gxuah_512.jpg",
      "https://images.meesho.com/images/products/478491390/hdjib_512.jpg"
    ],
    "features": [
      "Pack of 2 Panels - High Density Blackout Fabric",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Insulation, Glare Reduction & Noise Shield",
      "Machine & Hand Wash Cold Friendly"
    ]
  },
  {
    "id": "meesho-bcvrza",
    "slug": "stylish-blue-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-bcvrza",
    "name": "Stylish Blue Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Blue Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nPrint or Pattern Type: Floral\nLength: Window\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft)",
    "price": 489,
    "originalPrice": 978,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Top Seller",
    "rating": 4.4,
    "reviewCount": 117,
    "inStock": true,
    "colors": [
      {
        "name": "Sky & Royal Blue",
        "hex": "#1e40af"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 489,
        "originalPrice": 978,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/686765926/exfoq_512.jpg",
      "https://images.meesho.com/images/products/686765926/8ncwr_512.jpg",
      "https://images.meesho.com/images/products/686765926/8tsjx_512.jpg",
      "https://images.meesho.com/images/products/686765926/2clds_512.jpg",
      "https://images.meesho.com/images/products/686765926/exfoq_512.webp",
      "https://images.meesho.com/images/products/686765926/8ncwr_512.webp",
      "https://images.meesho.com/images/products/686765926/8tsjx_512.webp",
      "https://images.meesho.com/images/products/686765926/2clds_512.webp",
      "https://images.meesho.com/images/products/686765924/ijjo7_512.jpg",
      "https://images.meesho.com/images/products/686765924/ijjo7_512.webp",
      "https://images.meesho.com/images/products/686765926/exfoq_512.jpg",
      "https://images.meesho.com/images/products/686765926/8ncwr_512.jpg",
      "https://images.meesho.com/images/products/686765926/8tsjx_512.jpg",
      "https://images.meesho.com/images/products/686765926/2clds_512.jpg",
      "https://images.meesho.com/images/products/686765924/ijjo7_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-bf01yu",
    "slug": "stylish-brown-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-bf01yu",
    "name": "Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Door 7 Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur  look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern &lt;warning name=&#x27;Holme&#x27;s&#x27;&gt;homes&lt;/warning&gt; \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric room ko look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
    "price": 459,
    "originalPrice": 918,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.8,
    "reviewCount": 102,
    "inStock": true,
    "colors": [
      {
        "name": "Coffee Brown",
        "hex": "#4e342e"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 459,
        "originalPrice": 918,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 499,
        "originalPrice": 998,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/690324726/znomm_512.jpg",
      "https://images.meesho.com/images/products/690324726/g2x8f_512.jpg",
      "https://images.meesho.com/images/products/690324726/ppcfb_512.jpg",
      "https://images.meesho.com/images/products/690324726/lv5v4_512.jpg",
      "https://images.meesho.com/images/products/690324726/znomm_512.webp",
      "https://images.meesho.com/images/products/690324726/g2x8f_512.webp",
      "https://images.meesho.com/images/products/690324726/ppcfb_512.webp",
      "https://images.meesho.com/images/products/690324726/lv5v4_512.webp",
      "https://images.meesho.com/images/products/690324726/znomm_512.jpg",
      "https://images.meesho.com/images/products/690324726/g2x8f_512.jpg",
      "https://images.meesho.com/images/products/690324726/ppcfb_512.jpg",
      "https://images.meesho.com/images/products/690324726/lv5v4_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-glmlio",
    "slug": "trending-polyester-7-feet-door-curtains-set-of-2-ghar-ke-parde-home-room-parda-glmlio",
    "name": "Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Blackout\nSet: Door\nSize: 7Feet\nNet Quantity (N): 2\n✔ Premium  Style Fabric – Rich texture aur classy look  room ko luxury feel deta hai room ko luxury feel deta hai✔ Soft & Heavy Quality – Better fall, elegant finishing aur long-lasting use\n✔ Light Control & Privacy – Brightness ko control karta hai aur proper privacy deta hai\n✔ Designer Look – Modern aur premium design  living room & bedroom ko upgrade kare\n✔ Easy Care Fabric – Hand wash / gentle machine wash, color  tak same rehta hai\nBring luxury and elegance to your home with Premium  Style Curtains.\nHigh-quality soft aur heavy fabric se bane hue ye curtains room ko rich aur stylish look dete hain.  pattern design modern interiors ke saath perfectly match karta hai.\n\nLiving room, bedroom, hall, office ya hotel décor ke liye ideal choice.\nStrong stitching, smooth texture aur beautiful fall ke saath ye curtains aapke home décor ko next level par le jaate hain.\nTransform your living space with the ASHANK premium curtain collection, where Scandinavian simplicity meets modern elegance. Crafted from high-quality fabrics, these curtains offer excellent light filtering and privacy while enhancing the calm, minimalist vibe of your home. Perfect for any living room or bedroom, they bring effortless style and sophistication to your daily life.",
    "price": 489,
    "originalPrice": 978,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.6,
    "reviewCount": 72,
    "inStock": true,
    "colors": [
      {
        "name": "Floral Wine / Maroon",
        "hex": "#881337"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 489,
        "originalPrice": 978,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/1003785072/erg6c_512.jpg",
      "https://images.meesho.com/images/products/1003785072/c6hrk_512.jpg",
      "https://images.meesho.com/images/products/1003785072/6usb9_512.jpg",
      "https://images.meesho.com/images/products/1003785072/0vlcv_512.jpg",
      "https://images.meesho.com/images/products/1003785072/erg6c_512.webp",
      "https://images.meesho.com/images/products/1003785072/c6hrk_512.webp",
      "https://images.meesho.com/images/products/1003785072/6usb9_512.webp",
      "https://images.meesho.com/images/products/1003785072/0vlcv_512.webp",
      "https://images.meesho.com/images/products/1003785073/iihpe_512.jpg",
      "https://images.meesho.com/images/products/1003785073/iihpe_512.webp",
      "https://images.meesho.com/images/products/1003785072/erg6c_512.jpg",
      "https://images.meesho.com/images/products/1003785072/c6hrk_512.jpg",
      "https://images.meesho.com/images/products/1003785072/6usb9_512.jpg",
      "https://images.meesho.com/images/products/1003785072/0vlcv_512.jpg",
      "https://images.meesho.com/images/products/1003785073/iihpe_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-bf034v",
    "slug": "stylish-brown-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-bf034v",
    "name": "Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
    "price": 479,
    "originalPrice": 958,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Top Seller",
    "rating": 4.5,
    "reviewCount": 57,
    "inStock": true,
    "colors": [
      {
        "name": "Classic Brown",
        "hex": "#5d4037"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 479,
        "originalPrice": 958,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 519,
        "originalPrice": 1038,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/690326239/ca80u_512.jpg",
      "https://images.meesho.com/images/products/690326239/ahkzs_512.jpg",
      "https://images.meesho.com/images/products/690326239/wf1uu_512.jpg",
      "https://images.meesho.com/images/products/690326239/klwpk_512.jpg",
      "https://images.meesho.com/images/products/690326239/ca80u_512.webp",
      "https://images.meesho.com/images/products/690326239/ahkzs_512.webp",
      "https://images.meesho.com/images/products/690326239/wf1uu_512.webp",
      "https://images.meesho.com/images/products/690326239/klwpk_512.webp",
      "https://images.meesho.com/images/products/690326239/ca80u_512.jpg",
      "https://images.meesho.com/images/products/690326239/ahkzs_512.jpg",
      "https://images.meesho.com/images/products/690326239/wf1uu_512.jpg",
      "https://images.meesho.com/images/products/690326239/klwpk_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-eupcep",
    "slug": "stylish-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-eupcep",
    "name": "Stylish Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
    "price": 469,
    "originalPrice": 938,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.4,
    "reviewCount": 42,
    "inStock": true,
    "colors": [
      {
        "name": "Cream Botanical Print",
        "hex": "#f5f5dc"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 469,
        "originalPrice": 938,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 509,
        "originalPrice": 1018,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/898097425/7fsua_512.jpg",
      "https://images.meesho.com/images/products/898097425/xjggy_512.jpg",
      "https://images.meesho.com/images/products/898097425/o16ps_512.jpg",
      "https://images.meesho.com/images/products/898097425/a8kav_512.jpg",
      "https://images.meesho.com/images/products/898097425/7fsua_512.webp",
      "https://images.meesho.com/images/products/898097425/xjggy_512.webp",
      "https://images.meesho.com/images/products/898097425/o16ps_512.webp",
      "https://images.meesho.com/images/products/898097425/a8kav_512.webp",
      "https://images.meesho.com/images/products/898097424/wz7fn_512.jpg",
      "https://images.meesho.com/images/products/898097424/wz7fn_512.webp",
      "https://images.meesho.com/images/products/898097425/7fsua_512.jpg",
      "https://images.meesho.com/images/products/898097425/xjggy_512.jpg",
      "https://images.meesho.com/images/products/898097425/o16ps_512.jpg",
      "https://images.meesho.com/images/products/898097425/a8kav_512.jpg",
      "https://images.meesho.com/images/products/898097424/wz7fn_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-c2ur5l",
    "slug": "trendy-marble-print-curtains-for-home-pack-of-2",
    "name": "Trendy Marble Print Curtains for Home (Pack of 2)",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Trendy Marble Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: 3D\nSet: Door\nPrint or Pattern Type: Floral\nSize: 7Feet\nNet Quantity (N): 2\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai\nEnhance your home décor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    "price": 519,
    "originalPrice": 1039,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Teepul Choice",
    "rating": 4.5,
    "reviewCount": 130,
    "inStock": true,
    "colors": [
      {
        "name": "Blue Marble Print",
        "hex": "#2563eb"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet",
        "price": 519,
        "originalPrice": 1039,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet",
        "price": 569,
        "originalPrice": 1139,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet",
        "price": 579,
        "originalPrice": 1159,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Eyelets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/730388217/4miar_512.jpg",
      "https://images.meesho.com/images/products/730388217/pdhgf_512.jpg",
      "https://images.meesho.com/images/products/730388217/aqakm_512.jpg",
      "https://images.meesho.com/images/products/730388217/zwaue_512.jpg"
    ],
    "features": [
      "Light Filtering & Room Darkening Privacy",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Noise Shield",
      "Easy Maintenance & Machine Washable"
    ]
  },
  {
    "id": "meesho-bcvrz8",
    "slug": "stylish-purple-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-bcvrz8",
    "name": "Stylish Curtains for Door & Windows 5, 7 & 9 FEET (Pack of 2)",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Curtains for Door & Windows 5, 7 & 9 FEET (Pack of 2)\nMaterial: Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft)",
    "price": 479,
    "originalPrice": 958,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.5,
    "reviewCount": 132,
    "inStock": true,
    "colors": [
      {
        "name": "Royal Purple",
        "hex": "#6b21a8",
        "images": [
          "https://images.meesho.com/images/products/686765924/ijjo7_512.jpg",
          "https://images.meesho.com/images/products/686765924/fhvwh_512.jpg",
          "https://images.meesho.com/images/products/686765924/bc8tv_512.jpg",
          "https://images.meesho.com/images/products/686765924/s7og9_512.jpg"
        ]
      },
      {
        "name": "Sky & Royal Blue",
        "hex": "#1e40af",
        "images": [
          "https://images.meesho.com/images/products/686765926/exfoq_512.jpg",
          "https://images.meesho.com/images/products/686765926/8ncwr_512.jpg",
          "https://images.meesho.com/images/products/686765926/8tsjx_512.jpg",
          "https://images.meesho.com/images/products/686765926/2clds_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 479,
        "originalPrice": 958,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 519,
        "originalPrice": 1038,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/686765924/ijjo7_512.jpg",
      "https://images.meesho.com/images/products/686765924/fhvwh_512.jpg",
      "https://images.meesho.com/images/products/686765924/bc8tv_512.jpg",
      "https://images.meesho.com/images/products/686765924/s7og9_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-bcvmm6",
    "slug": "stylish-brown-curtains-for-door-windows-5-6-7-9-feet-pack-of-2",
    "name": "Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: 100% Premium Polyester\nPrint or Pattern Type: Typography\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft)  \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft)",
    "price": 529,
    "originalPrice": 1059,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.6,
    "reviewCount": 141,
    "inStock": true,
    "colors": [
      {
        "name": "Dark Brown",
        "hex": "#451a03"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet",
        "price": 529,
        "originalPrice": 1059,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet",
        "price": 569,
        "originalPrice": 1139,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet",
        "price": 579,
        "originalPrice": 1159,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Eyelets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/686758974/getca_512.jpg",
      "https://images.meesho.com/images/products/686758974/oshac_512.jpg",
      "https://images.meesho.com/images/products/686758974/qvmn2_512.jpg",
      "https://images.meesho.com/images/products/686758974/aygfb_512.jpg"
    ],
    "features": [
      "Light Filtering & Room Darkening Privacy",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Noise Shield",
      "Easy Maintenance & Machine Washable"
    ]
  },
  {
    "id": "meesho-bf04nh",
    "slug": "stylish-brown-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-bf04nh",
    "name": "Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
    "price": 519,
    "originalPrice": 1039,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Luxury Drapery",
    "rating": 4.3,
    "reviewCount": 161,
    "inStock": true,
    "colors": [
      {
        "name": "Chocolate Brown",
        "hex": "#5d4037"
      }
    ],
    "sizes": [
      {
        "name": "9 Feet",
        "price": 579,
        "originalPrice": 1159,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "5 Feet",
        "price": 519,
        "originalPrice": 1039,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet",
        "price": 569,
        "originalPrice": 1139,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavy Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/690328205/5plfv_512.jpg",
      "https://images.meesho.com/images/products/690328205/app1g_512.jpg",
      "https://images.meesho.com/images/products/690328205/p4vyx_512.jpg",
      "https://images.meesho.com/images/products/690328205/atv3z_512.jpg"
    ],
    "features": [
      "Light Filtering & Room Darkening",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Insulation & Noise Reduction",
      "Wrinkle-Resistant Washable Fabric"
    ]
  },
  {
    "id": "meesho-bazczz",
    "slug": "trending-polyester-7-feet-door-curtains-set-of-2-ghar-ke-parde-home-room-parda-bazczz",
    "name": "Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda\nMaterial: 100% Premium Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft)  \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft) \n\n BULLET POINTS\n\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai\n\n PRODUCT DESCRIPTION\n\nEnhance your home décor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    "price": 499,
    "originalPrice": 999,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.6,
    "reviewCount": 107,
    "inStock": true,
    "colors": [
      {
        "name": "Maroon Printed",
        "hex": "#881337"
      }
    ],
    "sizes": [
      {
        "name": "9 Feet",
        "price": 579,
        "originalPrice": 1159,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "5 Feet",
        "price": 499,
        "originalPrice": 999,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet",
        "price": 559,
        "originalPrice": 1119,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavy Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/683573903/vnzkz_512.jpg",
      "https://images.meesho.com/images/products/683573903/um7nh_512.jpg",
      "https://images.meesho.com/images/products/683573903/qdd0t_512.jpg",
      "https://images.meesho.com/images/products/683573903/q8yqh_512.jpg"
    ],
    "features": [
      "Light Filtering & Room Darkening",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Insulation & Noise Reduction",
      "Wrinkle-Resistant Washable Fabric"
    ]
  },
  {
    "id": "meesho-eupceo",
    "slug": "stylish-curtains-for-door-windows-5-6-7-9-feet-pack-of-2-eupceo",
    "name": "Stylish Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Curtains for Door & Windows 5, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
    "price": 479,
    "originalPrice": 959,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Top Seller",
    "rating": 4.2,
    "reviewCount": 35,
    "inStock": true,
    "colors": [
      {
        "name": "Coffee Brown & Cream",
        "hex": "#5d4037"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet",
        "price": 479,
        "originalPrice": 959,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet",
        "price": 539,
        "originalPrice": 1079,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet",
        "price": 569,
        "originalPrice": 1139,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavy Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/898097424/wz7fn_512.jpg",
      "https://images.meesho.com/images/products/898097424/ihoaz_512.jpg",
      "https://images.meesho.com/images/products/898097424/g2ks9_512.jpg",
      "https://images.meesho.com/images/products/898097424/drcoz_512.jpg"
    ],
    "features": [
      "Light Filtering & Room Darkening",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Insulation & Noise Reduction",
      "Wrinkle-Resistant Washable Fabric"
    ]
  },
  {
    "id": "meesho-euou2r",
    "slug": "trendy-print-curtains-for-home-pack-of-2-euou2r",
    "name": "Trendy Print Curtains for Home (Pack of 2)",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Trendy Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Floral\nSize: 9Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric room ko look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
    "price": 489,
    "originalPrice": 979,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Best Seller",
    "rating": 4.5,
    "reviewCount": 89,
    "inStock": true,
    "colors": [
      {
        "name": "Aqua Blue Printed",
        "hex": "#0891b2"
      }
    ],
    "sizes": [
      {
        "name": "7 Feet",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet",
        "price": 579,
        "originalPrice": 1159,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "5 Feet",
        "price": 489,
        "originalPrice": 979,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavy Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/898073667/pfe5s_512.jpg",
      "https://images.meesho.com/images/products/898073667/cqiah_512.jpg",
      "https://images.meesho.com/images/products/898073667/db7dt_512.jpg",
      "https://images.meesho.com/images/products/898073667/moxae_512.jpg"
    ],
    "features": [
      "Light Filtering & Room Darkening",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Insulation & Noise Reduction",
      "Wrinkle-Resistant Washable Fabric"
    ]
  },
  {
    "id": "meesho-cqurq3",
    "slug": "luxury-feather-print-eyelet-curtains-for-living-room-bedroom-set-of-2-7ft-9ft-cqurq3",
    "name": "Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: 3d Printed\nSize: 9Feet\nNet Quantity (N): 1\nPremium Fabric: Made from high-quality 150 GSM polyester/satin for a good feel and long-lasting durability.\n\nPerfect Size: Available in 5ft (Window), 7ft (Door), and 9ft (Long Door) to fit every corner of your home.\n\nEasy Installation: Features rust-resistant metallic eyelet rings for smooth sliding and a modern look.\n\nLight & Privacy Control: Room darkening/Blackout technology blocks 80-90% of Sun light while ensuring complete privacy.\n\nEasy Maintenance: 100% machine washable; color-fast fabric that doesn&#x27;t shrink or fade after washing.\n\nbest Design: Modern 3D prints/Botanical patterns that instantly elevate your living room, bedroom, or office decor.\nMain Terms\tCurtains, , Door Curtains, Window Curtains, Pared, Net Curtain\nMaterial\tPolyester, Cotton, Velvet, Net, Satin, Sheer, Jacquard\nFeatures\tBlackout, Room Darkening, Thermal Insulated, Eyelet, Ring , Washable\nStyle/Pattern\t3D Printed, Floral, Solid, Striped, Abstract, Embroidered, Modern\nSizes/Sets\tSet of 2, Pack of 4, 7 Feet, 9 Feet, Long Door, Window Screen",
    "price": 499,
    "originalPrice": 998,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Top Seller",
    "rating": 4.7,
    "reviewCount": 87,
    "inStock": true,
    "colors": [
      {
        "name": "Beige & Black Feather",
        "hex": "#d7c4b7"
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 499,
        "originalPrice": 998,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 539,
        "originalPrice": 1078,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1099,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/770699739/ow9uo_512.jpg",
      "https://images.meesho.com/images/products/770699739/wdklh_512.jpg",
      "https://images.meesho.com/images/products/770699739/jgo5w_512.jpg",
      "https://images.meesho.com/images/products/770699739/wzcpa_512.jpg",
      "https://images.meesho.com/images/products/770699739/ow9uo_512.webp",
      "https://images.meesho.com/images/products/770699739/wdklh_512.webp",
      "https://images.meesho.com/images/products/770699739/jgo5w_512.webp",
      "https://images.meesho.com/images/products/770699739/wzcpa_512.webp",
      "https://images.meesho.com/images/products/770699743/zxht4_512.jpg",
      "https://images.meesho.com/images/products/770699743/zxht4_512.webp",
      "https://images.meesho.com/images/products/770699739/ow9uo_512.jpg",
      "https://images.meesho.com/images/products/770699739/wdklh_512.jpg",
      "https://images.meesho.com/images/products/770699739/jgo5w_512.jpg",
      "https://images.meesho.com/images/products/770699739/wzcpa_512.jpg",
      "https://images.meesho.com/images/products/770699743/zxht4_512.jpg"
    ],
    "features": [
      "100% Premium Heavyweight Polyester (Pack of 2)",
      "Rust-Proof Stainless Steel Eyelet Rings",
      "Thermal Heat Insulation & Glare Reduction",
      "Easy Maintenance: Machine & Hand Wash Cold"
    ]
  },
  {
    "id": "meesho-702h3z",
    "slug": "ethnic-motif-geometric-blackout-door-window-curtains-pack-of-2-702h3z",
    "name": "Ethnic Motif Geometric Blackout Door & Window Curtains (Pack of 2)",
    "tagline": "Heavyweight thermal blackout drape with ethnic motif pattern and anti-rust metal grommets.",
    "description": "Product DetailsName : Newlook Polyester Door curtains (4 ft X 7 ft) pack of 1Material : PolyesterOpacity : Room DarkeningLength : DoorType : Premium CurtainSet : DoorPrint or Pattern Type : Ethnic MotifsSize : Door 7 FeetNet Quantity (N) : 1Package Contain 1 pc Door curtain with size (4ft X 7 ft), Material : Polyester,Extremely Affordable Prices, You Can Decorate Your Home And Give It A Luxurious Look And Feel. These Curtains Define A Modern Look In Drapery, These Drapes Are Easier To Put Up And Take Down Than The More Traditional Ones. We are manufacturer of home furnishing products like curtains, cushion covers, bedsheets. We pay special attention towards quality assurance. Country of Origin : IndiaMore Information",
    "price": 469,
    "originalPrice": 938,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Teepul Choice",
    "rating": 4.8,
    "reviewCount": 382,
    "inStock": true,
    "colors": [
      {
        "name": "Navy & Grey",
        "hex": "#1e293b",
        "images": [
          "https://images.meesho.com/images/products/423378719/fp7sq_512.jpg",
          "https://images.meesho.com/images/products/423378719/noqzi_512.jpg"
        ]
      },
      {
        "name": "Coffee Brown",
        "hex": "#5c4033",
        "images": [
          "https://images.meesho.com/images/products/423378719/vkxmo_512.jpg",
          "https://images.meesho.com/images/products/423378719/djhjr_512.jpg"
        ]
      },
      {
        "name": "Royal Maroon",
        "hex": "#800000",
        "images": [
          "https://images.meesho.com/images/products/423378717/ia6pq_512.jpg",
          "https://images.meesho.com/images/products/423378718/sucbd_512.jpg"
        ]
      },
      {
        "name": "Teal Blue",
        "hex": "#005f73",
        "images": [
          "https://images.meesho.com/images/products/423378714/cb87b_512.jpg",
          "https://images.meesho.com/images/products/423378715/ywqfw_512.jpg"
        ]
      },
      {
        "name": "Olive Green",
        "hex": "#3d5a40",
        "images": [
          "https://images.meesho.com/images/products/423378719/fp7sq_512.jpg",
          "https://images.meesho.com/images/products/423378719/noqzi_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 469,
        "originalPrice": 938,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 509,
        "originalPrice": 1018,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/423378719/fp7sq_512.jpg",
      "https://images.meesho.com/images/products/423378719/noqzi_512.jpg",
      "https://images.meesho.com/images/products/423378719/vkxmo_512.jpg",
      "https://images.meesho.com/images/products/423378719/djhjr_512.jpg",
      "https://images.meesho.com/images/products/423378717/ia6pq_512.jpg",
      "https://images.meesho.com/images/products/423378718/sucbd_512.jpg",
      "https://images.meesho.com/images/products/423378714/cb87b_512.jpg",
      "https://images.meesho.com/images/products/423378715/ywqfw_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-f88u0z",
    "slug": "modern-abstract-printed-eyelet-curtains-for-living-room-pack-of-2-f88u0z",
    "name": "Modern Abstract Wave Printed Eyelet Curtains for Living Room (Pack of 2)",
    "tagline": "Geometric wave drape with superior light filtering, anti-rust grommets & graceful pleating.",
    "description": "Product Details\nName: Divine's Polyester Printed Panel Curtains for Living Room Window, Door and Long Door (Pack of 2 Pcs)\nMaterial: 100% Heavyweight Polyester\nPrint or Pattern Type: Modern Abstract Geometric Wave\nSet: Pack of 2 Panels\nSizes: 5 Feet (Window: 5 ft x 4 ft), 7 Feet (Door: 7 ft x 4 ft), 9 Feet (Long Door: 9 ft x 4 ft)\n\nReadymade curtains ideal for living room or bedroom. Vibrant designing in rich and sharp colors. Made of superior fabrics with expert workmanship with 8 pre-fitted eyelets for easy hanging. Beautiful for your home and gifting. Translucency filters direct sunlight and illuminates the room naturally while ensuring complete privacy.\nCountry of Origin: India (Panipat Mill Direct)",
    "price": 479,
    "originalPrice": 958,
    "currency": "₹",
    "category": "Printed Curtains",
    "badge": "Bestseller",
    "rating": 4.9,
    "reviewCount": 420,
    "inStock": true,
    "colors": [
      {
        "name": "Coffee Brown & Beige",
        "hex": "#4e342e",
        "images": [
          "https://images.meesho.com/images/products/920841731/ftnjt_512.jpg",
          "https://images.meesho.com/images/products/920841731/rhjlp_512.jpg",
          "https://images.meesho.com/images/products/920841731/ew4dt_512.jpg"
        ]
      },
      {
        "name": "Wine Maroon & Cream",
        "hex": "#722f37",
        "images": [
          "https://images.meesho.com/images/products/920841732/fjjkx_512.jpg"
        ]
      },
      {
        "name": "Royal Blue & Silver",
        "hex": "#1e3a8a",
        "images": [
          "https://images.meesho.com/images/products/920841733/yjnbi_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 479,
        "originalPrice": 958,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 519,
        "originalPrice": 1038,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 539,
        "originalPrice": 1078,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/920841731/ftnjt_512.jpg",
      "https://images.meesho.com/images/products/920841732/fjjkx_512.jpg",
      "https://images.meesho.com/images/products/920841733/yjnbi_512.jpg",
      "https://images.meesho.com/images/products/920841731/rhjlp_512.jpg",
      "https://images.meesho.com/images/products/920841731/ew4dt_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-dxja72",
    "slug": "modern-botanical-leaf-printed-eyelet-window-curtains-pack-of-2-dxja72",
    "name": "Modern Botanical Leaf Printed Eyelet Window Curtains (Pack of 2)",
    "tagline": "Refreshing nature-inspired leaf pattern on high-density semi-sheer polyester fabric.",
    "description": "Product DetailsName : Premium Polyester Printed Window Curtain 5ft | Modern Leaf Design Eyelet Curtains for Living Room Bedroom | Pack of 2Material : PolyesterLength : WindowNet Quantity (N) : 2Sizes : 5 Feet (Length Size: 5 ft, Width Size: 4 ft) Country of Origin : IndiaMore Information",
    "price": 469,
    "originalPrice": 938,
    "currency": "₹",
    "category": "Window Curtains",
    "badge": "Trending",
    "rating": 4.8,
    "reviewCount": 295,
    "inStock": true,
    "colors": [
      {
        "name": "Sage Green Leaf",
        "hex": "#4b6f44",
        "images": [
          "https://images.meesho.com/images/products/842387294/qxit7_512.jpg",
          "https://images.meesho.com/images/products/842387294/nklxg_512.jpg"
        ]
      },
      {
        "name": "Slate Grey Leaf",
        "hex": "#475569",
        "images": [
          "https://images.meesho.com/images/products/842387294/6iipm_512.jpg",
          "https://images.meesho.com/images/products/842387294/ttmjx_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 469,
        "originalPrice": 938,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 509,
        "originalPrice": 1018,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/842387294/qxit7_512.jpg",
      "https://images.meesho.com/images/products/842387294/nklxg_512.jpg",
      "https://images.meesho.com/images/products/842387294/6iipm_512.jpg",
      "https://images.meesho.com/images/products/842387294/ttmjx_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-7t30ig",
    "slug": "crushed-velvet-patchwork-blackout-door-curtains-set-of-2-7t30ig",
    "name": "Crushed Velvet Patchwork Blackout Door Curtains (Set of 2)",
    "tagline": "Dual-panel rich crushed velvet patch with thermal insulation and heavy fall.",
    "description": "Product DetailsName : Some Thing New Presents new long crush patch curtain ( coffe)Material : PolyesterOpacity : Room DarkeningLength : DoorType : BlackoutSet : DoorSize : 7FeetNet Quantity (N) : 2 Country of Origin : IndiaMore Information",
    "price": 489,
    "originalPrice": 978,
    "currency": "₹",
    "category": "Blackout Curtains",
    "badge": "Luxury Finish",
    "rating": 4.9,
    "reviewCount": 512,
    "inStock": true,
    "colors": [
      {
        "name": "Coffee Bronze",
        "hex": "#4a3525",
        "images": [
          "https://images.meesho.com/images/products/472112728/nndos_512.jpg"
        ]
      },
      {
        "name": "Dark Slate",
        "hex": "#334155",
        "images": [
          "https://images.meesho.com/images/products/472112728/nndos_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 489,
        "originalPrice": 978,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1098,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/472112728/nndos_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-3998c0",
    "slug": "3d-striped-jacquard-border-door-curtains-pack-of-2-3998c0",
    "name": "3D Striped Jacquard Border Door Curtains (Pack of 2)",
    "tagline": "Textured woven 3D border ptta styling with light-filtering privacy protection.",
    "description": "Product DetailsName : Some Thing New 3D Long curtain  Ptta 7ft Pack Of 2Material : PolyesterOpacity : Light FilteringLength : DoorType : Polyester Semi TransparentSet : Door and WindowPrint or Pattern Type : ColorblockedSize : Door 7 FeetNet Quantity (N) : 2 Country of Origin : IndiaMore Information",
    "price": 469,
    "originalPrice": 938,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Mill Direct",
    "rating": 4.7,
    "reviewCount": 218,
    "inStock": true,
    "colors": [
      {
        "name": "Golden Maroon",
        "hex": "#722f37",
        "images": [
          "https://images.meesho.com/images/products/196945776/2qfat_512.jpg",
          "https://images.meesho.com/images/products/196945776/pxceo_512.jpg"
        ]
      },
      {
        "name": "Royal Blue Border",
        "hex": "#1e3a8a",
        "images": [
          "https://images.meesho.com/images/products/196945776/2qfat_512.jpg",
          "https://images.meesho.com/images/products/196945776/pxceo_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 469,
        "originalPrice": 938,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 509,
        "originalPrice": 1018,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/196945776/2qfat_512.jpg",
      "https://images.meesho.com/images/products/196945776/pxceo_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-b05bfk",
    "slug": "multi-foil-velvet-room-darkening-luxury-drapery-pack-of-2-b05bfk",
    "name": "Multi-Foil Velvet Room Darkening Luxury Drapery (Pack of 2)",
    "tagline": "Gleaming metallic foil stamped velvet panels for royal palace living rooms.",
    "description": "Product DetailsName : MANVI CREATIONS MULTI FOIL VELVET ROOM DARKENING ATTRACTIVE CURTAINS ( PARDA) IN LATEST DESIGNS - 1 PCS (SIZES - WINDOW-5FT/DOOR -7FT/LONG DOOR -9FT)  GREYMaterial : VelvetOpacity : Room DarkeningLength : DoorType : Premium CurtainSet : Door and WindowPrint or Pattern Type : AbstrastSize : Long Door 9 FeetNet Quantity (N) : 1 Country of Origin : IndiaMore Information",
    "price": 499,
    "originalPrice": 998,
    "currency": "₹",
    "category": "Blackout Curtains",
    "badge": "Luxury Velvet",
    "rating": 4.9,
    "reviewCount": 630,
    "inStock": true,
    "colors": [
      {
        "name": "Foil Charcoal Grey",
        "hex": "#374151",
        "images": [
          "https://images.meesho.com/images/products/665376032/9kfo2_512.jpg",
          "https://images.meesho.com/images/products/665376032/cxse4_512.jpg"
        ]
      },
      {
        "name": "Foil Champagne Gold",
        "hex": "#d4af37",
        "images": [
          "https://images.meesho.com/images/products/665376032/hxn82_512.jpg",
          "https://images.meesho.com/images/products/665376032/1i1es_512.jpg"
        ]
      },
      {
        "name": "Foil Royal Wine",
        "hex": "#4c1d95",
        "images": [
          "https://images.meesho.com/images/products/665376031/csvz1_512.jpg",
          "https://images.meesho.com/images/products/665376033/d6zgs_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 499,
        "originalPrice": 998,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 539,
        "originalPrice": 1078,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1098,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/665376032/9kfo2_512.jpg",
      "https://images.meesho.com/images/products/665376032/cxse4_512.jpg",
      "https://images.meesho.com/images/products/665376032/hxn82_512.jpg",
      "https://images.meesho.com/images/products/665376032/1i1es_512.jpg",
      "https://images.meesho.com/images/products/665376031/csvz1_512.jpg",
      "https://images.meesho.com/images/products/665376033/d6zgs_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-6vtvis",
    "slug": "solid-contemporary-eyelet-living-room-drapes-pack-of-4-full-set-6vtvis",
    "name": "Solid Contemporary Eyelet Living Room Drapes (Pack of 4 Full Set)",
    "tagline": "Complete 4-panel solid curtain set with pre-fitted stainless steel eyelet grommets.",
    "description": "Product DetailsName : Balaji Home Furnishings Presents stylish trendy curtains Pack of 4Material : PolyesterOpacity : Room DarkeningLength : WindowType : BlackoutSet : WindowPrint or Pattern Type : SolidSize : Window 5 FeetNet Quantity (N) : 4Give your home a bright and modernistic appeal with these designs. The surreal attention is sure to steal hearts. These contemporary eyelet and valance curtains slide smoothly so when you draw them apart first thing in the morning to welcome the bright sun rays you want to wish good morning to the whole world and when you draw them close in the evening, you create the most special moments of joyous beauty given by the soothing prints. Bring home the elegant curtain that softly filters light in your room so that you get the right amount. Country of Origin : IndiaMore Information",
    "price": 539,
    "originalPrice": 1078,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Super Saver Pack",
    "rating": 4.8,
    "reviewCount": 440,
    "inStock": true,
    "colors": [
      {
        "name": "Solid Slate Grey",
        "hex": "#64748b",
        "images": [
          "https://images.meesho.com/images/products/416259028/3ce0l_512.jpg",
          "https://images.meesho.com/images/products/416259028/kmddg_512.jpg"
        ]
      },
      {
        "name": "Solid Warm Tan",
        "hex": "#d2b48c",
        "images": [
          "https://images.meesho.com/images/products/416259028/urj86_512.jpg",
          "https://images.meesho.com/images/products/416259028/g9j8y_512.jpg"
        ]
      },
      {
        "name": "Solid Navy Blue",
        "hex": "#1e293b",
        "images": [
          "https://images.meesho.com/images/products/416259028/3ce0l_512.jpg",
          "https://images.meesho.com/images/products/416259028/kmddg_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 539,
        "originalPrice": 1078,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 539,
        "originalPrice": 1078,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 549,
        "originalPrice": 1098,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/416259028/3ce0l_512.jpg",
      "https://images.meesho.com/images/products/416259028/kmddg_512.jpg",
      "https://images.meesho.com/images/products/416259028/urj86_512.jpg",
      "https://images.meesho.com/images/products/416259028/g9j8y_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-fh41is",
    "slug": "artistic-tree-silhouette-semi-transparent-drapes-pack-of-2-fh41is",
    "name": "Artistic Tree Silhouette Semi-Transparent Drapes (Pack of 2)",
    "tagline": "Soft sunlight diffusing polycotton panels featuring modern tree branch motifs.",
    "description": "Product DetailsName : Home Sazawat “Affordable Luxury Brown Tree Print Semi Transparent Curtains | Premium Eyelet Window Drapes for Bedroom & Living Room for daily use home decor Pack of 1 (Door, Long-Door)Material : PolycottonOpacity : Light FilteringLength : DoorType : Polyester Semi TransparentSet : Door and WindowPrint or Pattern Type : Self-DesignSize : 5FeetNet Quantity (N) : 1Home Sazawat : Transform your home with these  and modern tree print curtains, designed to add style, privacy, and  to any room. The rich purple tones combined with artistic tree patterns create a luxurious look that perfectly complements bedrooms, living rooms, offices, and lounges. Country of Origin : IndiaMore Information",
    "price": 479,
    "originalPrice": 958,
    "currency": "₹",
    "category": "Window Curtains",
    "badge": "New 2026",
    "rating": 4.8,
    "reviewCount": 185,
    "inStock": true,
    "colors": [
      {
        "name": "Warm Brown Tree",
        "hex": "#5c3a21",
        "images": [
          "https://images.meesho.com/images/products/935734708/si1kq_512.jpg",
          "https://images.meesho.com/images/products/935734708/991fa_512.jpg"
        ]
      },
      {
        "name": "Smoky Purple Tree",
        "hex": "#581c87",
        "images": [
          "https://images.meesho.com/images/products/935734708/mccz5_512.jpg",
          "https://images.meesho.com/images/products/935734708/qhpoq_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 479,
        "originalPrice": 958,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 519,
        "originalPrice": 1038,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 539,
        "originalPrice": 1078,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/935734708/si1kq_512.jpg",
      "https://images.meesho.com/images/products/935734708/991fa_512.jpg",
      "https://images.meesho.com/images/products/935734708/mccz5_512.jpg",
      "https://images.meesho.com/images/products/935734708/qhpoq_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-gwpibg",
    "slug": "floral-vine-jacquard-privacy-door-window-curtains-pack-of-2-gwpibg",
    "name": "Floral Vine Jacquard Privacy Door & Window Curtains (Pack of 2)",
    "tagline": "Delicate floral vine weave providing natural daylight with 100% exterior privacy.",
    "description": "Product DetailsName : Semi Transparent  Curtains PACK 1  Size Guide Door Curtain 7 (feet) & Window Curtain 5 (feet)Material : PolyesterOpacity : Light FilteringLength : DoorType : Polyester Semi TransparentSet : DoorPrint or Pattern Type : FloralSize : 7FeetNet Quantity (N) : 1door curtains 7 ftwindows curtainkorean curtainscurtain 7 feetcurtain 7 feet 2 piecepardacurtain set for windowscurtain set new designwindow curtainkitchen door curtains 7 feetcurtain grey colourdoor curtain set of 2kitchen partition curtain setdoor curtains new modelgrey window curtaincurtainnon transparent curtainscurtainscertain windowsgrey colour curtainprinted curtain for windowcurtain setcurtain for window7 fit door curtaincurtains 5 feetcurtain for doorcurtain set with roddoor curtaingrey color curtaincurtain 5 feetcurtain doorcurtains for windowsdoor curtains Country of Origin : IndiaMore Information",
    "price": 469,
    "originalPrice": 938,
    "currency": "₹",
    "category": "Printed Curtains",
    "badge": "Top Rated",
    "rating": 4.9,
    "reviewCount": 360,
    "inStock": true,
    "colors": [
      {
        "name": "Mist Grey Vine",
        "hex": "#94a3b8",
        "images": [
          "https://images.meesho.com/images/products/1022396668/mwnub_512.jpg",
          "https://images.meesho.com/images/products/1022396668/opbks_512.jpg"
        ]
      },
      {
        "name": "Aqua Blue Vine",
        "hex": "#0284c7",
        "images": [
          "https://images.meesho.com/images/products/1022396668/aapor_512.jpg",
          "https://images.meesho.com/images/products/1022396668/wreom_512.jpg"
        ]
      },
      {
        "name": "Rose Pink Vine",
        "hex": "#f43f5e",
        "images": [
          "https://images.meesho.com/images/products/1022396669/7rztm_512.jpg",
          "https://images.meesho.com/images/products/1022396670/npx7g_512.jpg"
        ]
      },
      {
        "name": "Olive Vine",
        "hex": "#65a30d",
        "images": [
          "https://images.meesho.com/images/products/1022396671/f0uhk_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 469,
        "originalPrice": 938,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 509,
        "originalPrice": 1018,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/1022396668/mwnub_512.jpg",
      "https://images.meesho.com/images/products/1022396668/opbks_512.jpg",
      "https://images.meesho.com/images/products/1022396668/aapor_512.jpg",
      "https://images.meesho.com/images/products/1022396668/wreom_512.jpg",
      "https://images.meesho.com/images/products/1022396669/7rztm_512.jpg",
      "https://images.meesho.com/images/products/1022396670/npx7g_512.jpg",
      "https://images.meesho.com/images/products/1022396671/f0uhk_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  },
  {
    "id": "meesho-76a2z4",
    "slug": "colorblocked-dual-tone-contemporary-living-room-curtains-set-of-2-76a2z4",
    "name": "Colorblocked Dual-Tone Contemporary Living Room Curtains (Set of 2)",
    "tagline": "Two-tone contrast border drapery designed to elevate modern apartment interiors.",
    "description": "Product DetailsName : Polyester Curtains for HomeMaterial : PolyesterOpacity : Light FilteringLength : DoorType : Polyester Semi TransparentSet : DoorPrint or Pattern Type : ColorblockedSize : 7FeetNet Quantity (N) : 2 Country of Origin : IndiaMore Information",
    "price": 469,
    "originalPrice": 938,
    "currency": "₹",
    "category": "Door Curtains",
    "badge": "Modern Chic",
    "rating": 4.8,
    "reviewCount": 275,
    "inStock": true,
    "colors": [
      {
        "name": "Mocha & Cream",
        "hex": "#78350f",
        "images": [
          "https://images.meesho.com/images/products/433811344/thftc_512.jpg",
          "https://images.meesho.com/images/products/433811344/fzmpi_512.jpg"
        ]
      },
      {
        "name": "Charcoal & Silver",
        "hex": "#1f2937",
        "images": [
          "https://images.meesho.com/images/products/433811344/s1hft_512.jpg",
          "https://images.meesho.com/images/products/433811344/ml8mf_512.jpg"
        ]
      }
    ],
    "sizes": [
      {
        "name": "5 Feet (Window)",
        "price": 469,
        "originalPrice": 938,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "7 Feet (Door)",
        "price": 509,
        "originalPrice": 1018,
        "stock": 50,
        "inStock": true
      },
      {
        "name": "9 Feet (Long Door)",
        "price": 529,
        "originalPrice": 1058,
        "stock": 50,
        "inStock": true
      }
    ],
    "fabricSpecs": {
      "gsm": 150,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/433811344/thftc_512.jpg",
      "https://images.meesho.com/images/products/433811344/fzmpi_512.jpg",
      "https://images.meesho.com/images/products/433811344/s1hft_512.jpg",
      "https://images.meesho.com/images/products/433811344/ml8mf_512.jpg",
      "https://images.meesho.com/images/products/433811346/yw7dm_512.jpg"
    ],
    "features": [
      "Panipat Factory-Direct Weave & Finish",
      "85%+ Glare & Sunlight Control",
      "Rust-Free Stainless Steel Eyelets",
      "Pre-Shrunk & Machine Wash Safe"
    ]
  }
];


export async function getStorefrontProducts(): Promise<Product[]> {
  return getOrSetCache('storefront_products', 300, async () => {
    try {
      let mappedDb: Product[] = [];
      try {
        const dbProducts = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        });

        if (dbProducts && dbProducts.length > 0) {
          mappedDb = dbProducts.map((p) => {
            try {
              const parseJson = (str: string) => {
                try {
                  return JSON.parse(str || '[]');
                } catch {
                  return [];
                }
              };

              return {
                id: p.id,
                slug: p.slug,
                name: p.name,
                tagline: p.tagline || '',
                description: p.description,
                price: p.price,
                originalPrice: p.originalPrice || undefined,
                currency: p.currency || '₹',
                category: p.category,
                badge: p.badge || undefined,
                rating: p.rating,
                reviewCount: p.reviewCount,
                inStock: p.inStock,
                colors: parseJson(p.colorsJson),
                sizes: parseJson(p.sizesJson),
                fabricSpecs: {
                  gsm: p.gsm || 150,
                  material: p.material || '100% Premium Polyester',
                  fit: p.fit || 'Silver Eyelet Grommets',
                  care: p.care || 'Hand & Machine Wash Cold',
                },
                images: parseJson(p.imagesJson).map((img: string) => {
                  if (typeof img === 'string' && img.includes('ibb.co/MDrxVyJY')) {
                    return '/uploads/grey-eyelet-curtain-front.webp';
                  }
                  return img;
                }),
                features: parseJson(p.featuresJson),
              };
            } catch (err) {
              console.error('Failed to map product item:', err);
              return null;
            }
          }).filter(Boolean) as Product[];
        }
      } catch (dbErr) {
        console.error('Failed to query DB products:', dbErr);
      }

      const catalog = PRODUCTS_CATALOG.filter(Boolean);
      const combinedMap = new Map<string, Product>();

      // Add catalog items first so base products are present
      for (const p of catalog) {
        combinedMap.set(p.id, p);
      }

      // Overwrite with DB items so admin edits are live on storefront!
      for (const p of mappedDb) {
        // Remove any catalog entry that might share the same slug if id differs
        for (const [catId, catItem] of combinedMap.entries()) {
          if (catItem.slug === p.slug && catId !== p.id) {
            combinedMap.delete(catId);
          }
        }
        combinedMap.set(p.id, p);
      }

      // Check for deleted product IDs/slugs recorded in settings
      let deletedSet = new Set<string>();
      try {
        const deletedSetting = await prisma.setting.findUnique({
          where: { key: 'deleted_product_ids' },
        });
        if (deletedSetting?.value) {
          const parsed = JSON.parse(deletedSetting.value);
          if (Array.isArray(parsed)) {
            deletedSet = new Set(parsed.map(String));
          }
        }
      } catch {
        // ignore
      }

      return Array.from(combinedMap.values()).filter((p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
    } catch (error) {
      console.error('Failed to load DB products:', error);
      return PRODUCTS_CATALOG.filter(Boolean);
    }
  });
}
