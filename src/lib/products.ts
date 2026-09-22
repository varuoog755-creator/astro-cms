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
  const p6 = Math.min(559, Math.round((p5 + 30) / 10) * 10 - 1);
  const p7 = Math.min(569, Math.round((p5 + 60) / 10) * 10 - 1);
  const p9 = Math.min(579, Math.round((p5 + 90) / 10) * 10 - 1);

  const orig5 = baseOriginalPrice || (Math.round((p5 * 2) / 10) * 10 - 1);
  const orig6 = Math.round((p6 * 2) / 10) * 10 - 1;
  const orig7 = Math.round((p7 * 2) / 10) * 10 - 1;
  const orig9 = Math.round((p9 * 2) / 10) * 10 - 1;

  const defaultSizes: ProductSize[] = [
    { name: "5 Feet (Window)", price: p5, originalPrice: orig5, stock: 50, inStock: true },
    { name: "6 Feet", price: p6, originalPrice: orig6, stock: 50, inStock: true },
    { name: "7 Feet (Door)", price: p7, originalPrice: orig7, stock: 50, inStock: true },
    { name: "9 Feet (Long Door)", price: p9, originalPrice: orig9, stock: 50, inStock: true },
  ];

  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return defaultSizes;
  }

  // Ensure 5ft, 6ft, 7ft, 9ft have distinct psychological prices scaled from basePrice
  return sizes.map((s) => {
    if (typeof s === 'string') {
      const lower = s.toLowerCase();
      let price = p5;
      let calculatedOrigPrice = orig5;

      if (lower.includes('5') || (lower.includes('window') && !lower.includes('door'))) {
        price = p5;
        calculatedOrigPrice = orig5;
      } else if (lower.includes('6')) {
        price = p6;
        calculatedOrigPrice = orig6;
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
    "description": "Name: Premium Polyester Blend Blackout Curtains for Home | Set of 2 Panels\nMaterial: 100% Heavyweight Polyester & Cotton Blend\nOpacity: Blackout & Room Darkening\nSet: Set of 2 Panels\nPrint or Pattern Type: Elegant Solid Texture with Gold Thread Detailing\nNet Quantity (N): 2\nSizes Available: 5 Feet (Window), 6 Feet, 7 Feet (Door), 9 Feet (Long Door)\n\nTransform your home interior with Teepul Premium Polyester Blend Blackout Curtains (Set of 2). Woven with multi-layer dense fabric to block harsh sunlight, UV rays, and outside noise while insulating your room against heat and cold. Pre-fitted with rust-proof stainless steel silver eyelets for smooth movement on standard curtain rods.\n\nKey Highlights:\n✔ Pack of 2 Panels: Complete matching set for windows and doors\n✔ Blackout Room Darkening: Superior glare reduction and total indoor privacy\n✔ Premium Heavyweight Fabric: Elegant drape with wrinkle-resistant finish\n✔ 4 Rich Color Variants: Wine Maroon, Royal Blue, Royal Purple, and Mustard Gold\n✔ 4 Size Options: 5ft, 6ft, 7ft & 9ft available\n✔ Easy Care: 100% machine and hand wash friendly",
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
        "name": "6 Feet",
        "price": 485,
        "originalPrice": 970,
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
      "gsm": 320,
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
    "slug": "stylish-blue-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bcvrza",
    "name": "Stylish Blue Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Blue Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nPrint or Pattern Type: Floral\nLength: Window\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft)",
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
        "name": "6 Feet",
        "price": 509,
        "originalPrice": 1018,
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
      "gsm": 280,
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
    "slug": "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bf01yu",
    "name": "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Door 7 Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur  look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern &lt;warning name=&#x27;Holme&#x27;s&#x27;&gt;homes&lt;/warning&gt; \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric room ko look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
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
        "name": "6 Feet",
        "price": 479,
        "originalPrice": 958,
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
      "gsm": 280,
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
        "name": "6 Feet",
        "price": 509,
        "originalPrice": 1018,
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
      "gsm": 280,
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
    "slug": "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bf034v",
    "name": "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
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
        "name": "6 Feet",
        "price": 499,
        "originalPrice": 998,
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
      "gsm": 280,
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
    "slug": "stylish-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-eupcep",
    "name": "Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
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
        "name": "6 Feet",
        "price": 489,
        "originalPrice": 978,
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
      "gsm": 280,
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
        "name": "6 Feet",
        "price": 549,
        "originalPrice": 1099,
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
      "gsm": 280,
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
    "slug": "stylish-purple-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bcvrz8",
    "name": "Stylish Purple Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Purple Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft)",
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
        "hex": "#6b21a8"
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
        "name": "6 Feet",
        "price": 499,
        "originalPrice": 998,
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
      "gsm": 280,
      "material": "100% Premium Heavyweight Polyester",
      "fit": "Stainless Steel Silver Grommets",
      "care": "Hand & Machine Wash Cold"
    },
    "images": [
      "https://images.meesho.com/images/products/686765924/ijjo7_512.jpg",
      "https://images.meesho.com/images/products/686765924/fhvwh_512.jpg",
      "https://images.meesho.com/images/products/686765924/bc8tv_512.jpg",
      "https://images.meesho.com/images/products/686765924/s7og9_512.jpg",
      "https://images.meesho.com/images/products/686765924/ijjo7_512.webp",
      "https://images.meesho.com/images/products/686765924/fhvwh_512.webp",
      "https://images.meesho.com/images/products/686765924/bc8tv_512.webp",
      "https://images.meesho.com/images/products/686765924/s7og9_512.webp",
      "https://images.meesho.com/images/products/686765926/exfoq_512.jpg",
      "https://images.meesho.com/images/products/686765926/exfoq_512.webp",
      "https://images.meesho.com/images/products/686765924/ijjo7_512.jpg",
      "https://images.meesho.com/images/products/686765924/fhvwh_512.jpg",
      "https://images.meesho.com/images/products/686765924/bc8tv_512.jpg",
      "https://images.meesho.com/images/products/686765924/s7og9_512.jpg",
      "https://images.meesho.com/images/products/686765926/exfoq_512.jpg"
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
    "slug": "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2",
    "name": "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: 100% Premium Polyester\nPrint or Pattern Type: Typography\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft)",
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
        "name": "6 Feet",
        "price": 559,
        "originalPrice": 1119,
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
      "gsm": 280,
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
    "slug": "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bf04nh",
    "name": "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
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
        "name": "6 Feet",
        "price": 549,
        "originalPrice": 1099,
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
      "gsm": 280,
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
    "description": "Name: Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda\nMaterial: 100% Premium Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft) \n\n BULLET POINTS\n\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai\n\n PRODUCT DESCRIPTION\n\nEnhance your home décor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
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
        "name": "6 Feet",
        "price": 529,
        "originalPrice": 1059,
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
      "gsm": 280,
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
    "slug": "stylish-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-eupceo",
    "name": "Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    "tagline": "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    "description": "Name: Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
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
        "name": "6 Feet",
        "price": 509,
        "originalPrice": 1019,
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
      "gsm": 280,
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
        "name": "6 Feet",
        "price": 519,
        "originalPrice": 1039,
        "stock": 50,
        "inStock": true
      },
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
      "gsm": 280,
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
        "name": "6 Feet",
        "price": 519,
        "originalPrice": 1038,
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
      "gsm": 280,
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
  }
];

export async function getStorefrontProducts(): Promise<Product[]> {
  return getOrSetCache('storefront_products', 60, async () => {
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
                  gsm: p.gsm || 280,
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
