import prisma from './db/index.ts';

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
  colors: { name: string; hex: string }[];
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

export function normalizeProductSizes(sizes: (string | ProductSize)[], basePrice: number = 459, baseOriginalPrice: number = 899): ProductSize[] {
  const defaultSizes: ProductSize[] = [
    { name: "5 Feet (Window)", price: 459, originalPrice: 899, stock: 50, inStock: true },
    { name: "6 Feet", price: 499, originalPrice: 999, stock: 50, inStock: true },
    { name: "7 Feet (Door)", price: 549, originalPrice: 1099, stock: 50, inStock: true },
    { name: "9 Feet (Long Door)", price: 579, originalPrice: 1199, stock: 50, inStock: true },
  ];

  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return defaultSizes;
  }

  // Ensure 5ft, 6ft, 7ft, 9ft have distinct psychological prices
  return sizes.map((s) => {
    if (typeof s === 'string') {
      const lower = s.toLowerCase();
      let price = 459;
      let origPrice: number | undefined = 899;

      if (lower.includes('5') || (lower.includes('window') && !lower.includes('door'))) {
        price = 459;
        origPrice = 899;
      } else if (lower.includes('6')) {
        price = 499;
        origPrice = 999;
      } else if (lower.includes('7') || (lower.includes('door') && !lower.includes('long') && !lower.includes('9'))) {
        price = 549;
        origPrice = 1099;
      } else if (lower.includes('9') || lower.includes('long')) {
        price = 579;
        origPrice = 1199;
      } else {
        price = basePrice || 459;
        origPrice = baseOriginalPrice || 899;
      }

      return {
        name: s,
        price,
        originalPrice: origPrice,
        stock: 50,
        inStock: true,
      };
    }
    return {
      name: s.name,
      price: typeof s.price === 'number' && !isNaN(s.price) ? s.price : 459,
      originalPrice: typeof s.originalPrice === 'number' && !isNaN(s.originalPrice) ? s.originalPrice : 899,
      stock: typeof s.stock === 'number' && !isNaN(s.stock) ? s.stock : 50,
      inStock: s.inStock !== false,
    };
  });
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: "prod-5",
    slug: "premium-brown-thermal-blackout-door-curtain",
    name: "Premium Brown Thermal Blackout Door Curtain (Pack of 2)",
    tagline: "Pack of 2 | Silver Eyelets 100% Light Blocking Thermal Insulated Curtain",
    description: "Transform your bedroom or living room with Teepul Premium Brown Thermal Blackout Curtains (Pack of 2). Features heavy-duty silver ring eyelets, 100% noise and light blocking thermal insulation, and rich solid texture. Net Quantity (N): 2.",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Top Seller",
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    colors: [{"name": "Premium Dark Brown", "hex": "#3e2723"}],
    sizes: ["7 Feet (Door Curtain)", "9 Feet (Long Door)"],
    fabricSpecs: {"gsm": 320, "material": "Polyester Thermal Fabric", "fit": "Silver Eyelet Grommets", "care": "Hand & Machine Washable"},
    images: ["https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512", "https://images.meesho.com/images/products/1060934359/ibskg_512.avif?width=512", "https://images.meesho.com/images/products/1060934359/z3epy_512.avif?width=512"],
    features: ["100% Light Blocking Thermal Insulation", "Rust-Proof Stainless Steel Eyelet Rings", "Noise & Heat Shield Fabric", "Machine & Hand Washable"]
  },
  {
    id: "meesho-eupceo",
    slug: "stylish-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-eupceo",
    name: "Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Top Seller",
    rating: 4.2,
    reviewCount: 35,
    inStock: true,
    colors: [{"name": "Coffee Brown & Cream", "hex": "#5d4037"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/898097424/wz7fn_512.jpg", "https://images.meesho.com/images/products/898097424/ihoaz_512.jpg", "https://images.meesho.com/images/products/898097424/g2ks9_512.jpg", "https://images.meesho.com/images/products/898097424/drcoz_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-ho7bot",
    slug: "blue-floral-leaf-printed-curtain-for-window-door-light-filtering-eyelet-curtain-premium-polyester-home-decor-curtain-pack-of-1-ho7bot",
    name: "Blue Floral Leaf Printed Curtain for Window & Door | Light Filtering Eyelet Curtain | Premium Polyester Home Decor Curtain | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Blue Floral Leaf Printed Curtain for Window & Door | Light Filtering Eyelet Curtain | Premium Polyester Home Decor Curtain | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nSize: 7Feet\nNet Quantity (N): 2\nGive your home a fresh and elegant look with this Blue Floral Leaf Printed Curtain (Pack of 2). The attractive blue base with delicate leaf detailing adds a stylish touch to living rooms, bedrooms, windows and doors. Its eyelet design makes hanging simple, while the fabric helps filter daylight and provides added privacy.\n\nProduct Highlights\n\nPack of 2 Curtains\nBlue floral leaf printed design\nLight-filtering curtain\nEyelet/grommet top\nSuitable for windows and doors\nSuitable for living room, bedroom and home décor\nAvailable in 5, 6, 7 & 9 Feet\nEasy-care fabric\n Size Information\n\nAvailable Heights:\n5 Feet | 6 Feet | 7 Feet | 9 Feet\n\nPack: 2 Curtain Panels\n\nBlue Curtain, Floral Curtain, Leaf Print Curtain, Window Curtain, Door Curtain\n\nBlue Floral Curtain, Printed Curtain, Eyelet Curtain, Polyester Curtain, Living Room Curtain, Bedroom Curtain, Home Decor Curtain, Light Filtering Curtain\n\nBlue floral curtain for window, blue curtain for bedroom, leaf print curtain for living room, printed eyelet curtain for door, blue home decor curtain",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Top Seller",
    rating: 4.3,
    reviewCount: 53,
    inStock: true,
    colors: [{"name": "Blue Floral Leaf", "hex": "#1e40af"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068577517/dwkky_512.jpg", "https://images.meesho.com/images/products/1068577517/7d95j_512.jpg", "https://images.meesho.com/images/products/1068577517/t94in_512.jpg", "https://images.meesho.com/images/products/1068577517/6xs5w_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-hn79yx",
    slug: "grey-eyelet-curtain-premium-polyester-door-window-curtain-for-bedroom-living-room-home-decor-pack-of-1-hn79yx",
    name: "Grey Eyelet Curtain | Premium Polyester Door & Window Curtain for Bedroom, Living Room & Home Decor | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Grey Eyelet Curtain | Premium Polyester Door & Window Curtain for Bedroom, Living Room & Home Decor | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Conversational\nSize: 7Feet\nNet Quantity (N): 2\nPremium Grey Eyelet Curtain – Pack of 2\n\nGive your home a clean and sophisticated look with this Premium Grey Curtain, designed for modern bedrooms, living rooms and other indoor spaces. Made from polyester fabric, the curtain features a subtle textured finish and silver metal eyelets for a neat, contemporary appearance.\n\nThe curtain panels are suitable for compatible door and window curtain rods. Its neutral grey colour blends easily with different interior styles, making it a practical choice for everyday home décor.\n\nKey Features\nColour: Grey / Silver Grey\nMaterial: Polyester\nPattern: Solid Textured\nCurtain Type: Eyelet Curtain\nEyelet: Silver Metal Eyelets\nPack: 2 Curtain Panels\nSuitable For: Bedroom, Living Room, Door & Window\nStyle: Modern\nInstallation: Easy to hang on a compatible curtain rod\nCare: Follow the fabric care instructions\nPerfect For\n\nUse this grey curtain for bedroom décor, living room décor, window covering, door covering and modern home interiors.",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Top Seller",
    rating: 4.4,
    reviewCount: 71,
    inStock: true,
    colors: [{"name": "Slate Grey", "hex": "#4b5563"}],
    sizes: ["7 Feet", "9 Feet", "5 Feet", "6 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1066895673/jv7gh_512.jpg", "https://images.meesho.com/images/products/1066895673/j0wld_512.jpg", "https://images.meesho.com/images/products/1066895673/8wzrf_512.jpg", "https://images.meesho.com/images/products/1066895673/sg049_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-euou2r",
    slug: "trendy-print-curtains-for-home-pack-of-2-euou2r",
    name: "Trendy Print Curtains for Home (Pack of 2)",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trendy Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Floral\nSize: 9Feet\nNet Quantity (N): 2\nEnhance your home décor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric room ko look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    colors: [{"name": "Aqua Blue Printed", "hex": "#0891b2"}],
    sizes: ["6 Feet", "7 Feet", "9 Feet", "5 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/898073667/pfe5s_512.jpg", "https://images.meesho.com/images/products/898073667/cqiah_512.jpg", "https://images.meesho.com/images/products/898073667/db7dt_512.jpg", "https://images.meesho.com/images/products/898073667/moxae_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-bazczz",
    slug: "trending-polyester-7-feet-door-curtains-set-of-2-ghar-ke-parde-home-room-parda-bazczz",
    name: "Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda\nMaterial: 100% Premium Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft) \n\n BULLET POINTS\n\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai\n\n PRODUCT DESCRIPTION\n\nEnhance your home décor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 107,
    inStock: true,
    colors: [{"name": "Maroon Printed", "hex": "#881337"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/683573903/vnzkz_512.jpg", "https://images.meesho.com/images/products/683573903/um7nh_512.jpg", "https://images.meesho.com/images/products/683573903/qdd0t_512.jpg", "https://images.meesho.com/images/products/683573903/q8yqh_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-cqurq3",
    slug: "luxury-feather-print-eyelet-curtains-for-living-room-bedroom-set-of-2-7ft-9ft-cqurq3",
    name: "Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft\nMaterial: 100% Premium Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: 3d Printed\nSize: 9Feet\nNet Quantity (N): 2\nPremium Fabric: Made from high-quality heavyweight polyester for a rich feel and long-lasting durability.\n\nPerfect Size: Available in 5ft (Window), 7ft (Door), and 9ft (Long Door) to fit every corner of your home.\n\nEasy Installation: Features rust-resistant metallic eyelet rings for smooth sliding and a modern look.\n\nLight & Privacy Control: Room darkening/Blackout technology blocks 80-90% of Sun light while ensuring complete privacy.\n\nEasy Maintenance: 100% machine washable; color-fast fabric that doesn't shrink or fade after washing.\n\nbest Design: Modern 3D prints/Botanical patterns that instantly elevate your living room, bedroom, or office decor.\nMain Terms\tCurtains, , Door Curtains, Window Curtains, Pared, Net Curtain\nMaterial\t100% Premium Polyester\nFeatures\tBlackout, Room Darkening, Thermal Insulated, Eyelet, Ring , Washable\nStyle/Pattern\t3D Printed, Floral, Solid, Striped, Abstract, Embroidered, Modern\nSizes/Sets\tSet of 2, Pack of 4, 7 Feet, 9 Feet, Long Door, Window Screen",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.7,
    reviewCount: 125,
    inStock: true,
    colors: [{"name": "Beige & Black Feather", "hex": "#d7c4b7"}],
    sizes: ["6 Feet", "7 Feet", "9 Feet", "5 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/770699739/ow9uo_512.jpg", "https://images.meesho.com/images/products/770699739/wdklh_512.jpg", "https://images.meesho.com/images/products/770699739/jgo5w_512.jpg", "https://images.meesho.com/images/products/770699739/wzcpa_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-hmctql",
    slug: "premium-black-door-curtain-light-filtering-privacy-silver-eyelet-polyester-curtain-5-6-7-9-feet-pack-of-1-hmctql",
    name: "Premium Black Door Curtain | Light Filtering & Privacy | Silver Eyelet Polyester Curtain | 5, 6, 7 & 9 Feet | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Premium Black Door Curtain | Light Filtering & Privacy | Silver Eyelet Polyester Curtain | 5, 6, 7 & 9 Feet | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Solid\nSize: 7Feet\nNet Quantity (N): 2\nUpgrade your home with this elegant black door curtain (Pack of 2) designed for doors and long windows. Made from durable polyester fabric, it offers a clean, sophisticated look while helping provide privacy and control incoming light.\n\nKey Features:\n\nPremium black polyester fabric\nLight-filtering design for comfortable indoor lighting\nHelps enhance privacy\nSilver metal eyelets for easy installation and smooth movement\nSuitable for bedrooms, living rooms, balconies, offices and doors\nAvailable in 5, 6, 7 and 9 feet height options\nEasy to hang and maintain\nSuitable for modern and traditional interiors",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.2,
    reviewCount: 143,
    inStock: true,
    colors: [{"name": "Premium Black", "hex": "#18181b"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1065474957/iilfa_512.jpg", "https://images.meesho.com/images/products/1065474957/otnrr_512.jpg", "https://images.meesho.com/images/products/1065474957/dvozh_512.jpg", "https://images.meesho.com/images/products/1065474957/mrfcs_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-bf04nh",
    slug: "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bf04nh",
    name: "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Luxury Drapery",
    rating: 4.3,
    reviewCount: 161,
    inStock: true,
    colors: [{"name": "Chocolate Brown", "hex": "#5d4037"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/690328205/5plfv_512.jpg", "https://images.meesho.com/images/products/690328205/app1g_512.jpg", "https://images.meesho.com/images/products/690328205/p4vyx_512.jpg", "https://images.meesho.com/images/products/690328205/atv3z_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-hnjfvf",
    slug: "premium-blue-white-leaf-print-eyelet-curtain-polyester-door-window-curtain-for-bedroom-living-room-pack-of-1",
    name: "Premium Blue & White Leaf Print Eyelet Curtain | Polyester Door & Window Curtain for Bedroom & Living Room | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Premium Blue & White Leaf Print Eyelet Curtain | Polyester Door & Window Curtain for Bedroom & Living Room | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: 3D\nSet: Door and Window\nSize: 7Feet\nNet Quantity (N): 2\nPremium Blue Printed Eyelet Curtain – Pack of 2\n\nGive your home a stylish and refreshing makeover with this Blue Printed Eyelet Curtain, featuring a combination of royal blue side panels and a white centre panel with blue leaf motifs. The attractive botanical-inspired design adds a modern decorative touch to bedrooms, living rooms, doors and windows.\n\nMade from polyester fabric, this curtain is designed with metal eyelets for easy hanging on a compatible curtain rod. The combination of solid blue and printed panels creates a balanced look that works well with both contemporary and classic interiors.\n\nKey Features\n\nColour: Royal Blue & White\nMaterial: Polyester\nPattern: Leaf / Botanical Print\nCurtain Type: Eyelet Curtain\nDesign: Blue Side Panels with Blue Leaf Print Centre\nPack: 2 Curtain Panels\nSuitable For: Bedroom, Living Room, Door & Window\nStyle: Modern, Elegant & Decorative\nHanging: Metal Eyelet\n\nPerfect For:\nBedroom curtains, living room curtains, window curtains, door curtains, home décor and modern interior styling.",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Teepul Choice",
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    colors: [{"name": "Blue & White Leaf", "hex": "#1e40af"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1067463195/okexo_512.jpg", "https://images.meesho.com/images/products/1067463195/h6czi_512.jpg", "https://images.meesho.com/images/products/1067463195/yadep_512.jpg", "https://images.meesho.com/images/products/1067463195/c43ue_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-hr66fp",
    slug: "pink-curtain-for-window-door-eyeletgrommet-curtain-for-bedroom-living-room-light-filtering-privacy-curtain-pack-of-1",
    name: "Pink Curtain for Window & Door | Eyelet/Grommet Curtain for Bedroom & Living Room | Light Filtering Privacy Curtain | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Pink Curtain for Window & Door | Eyelet/Grommet Curtain for Bedroom & Living Room | Light Filtering Privacy Curtain | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Solid\nSize: 7Feet\nNet Quantity (N): 2\nAdd a soft and elegant touch to your home with this Pink Window Curtain (Pack of 2), designed for bedrooms, living rooms, guest rooms and other indoor spaces. Its attractive pink colour complements modern and contemporary interiors, while the eyelet/grommet top makes it convenient to hang on a compatible curtain rod.\n\nThe curtain is suitable for everyday home décor and helps create a comfortable, private indoor environment while allowing natural light to brighten the room.\n\n✨ Key Features\nElegant Pink Colour – Gives your room a fresh, soft and stylish appearance.\nLight Filtering – Allows natural daylight to enter while helping soften the brightness.\nPrivacy Support – Helps reduce direct outside visibility for a more comfortable space.\nEyelet/Grommet Top – Easy to hang on a compatible curtain rod.\nVersatile Home Décor – Suitable for bedrooms, living rooms, guest rooms, study rooms and home offices.\nEasy Everyday Styling – Works well with neutral walls, wooden furniture and contemporary interiors.\nPack of 2 – Includes two curtain panels.",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 53,
    inStock: true,
    colors: [{"name": "Blush Pink", "hex": "#ec4899"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1073562901/bsjqf_512.jpg", "https://images.meesho.com/images/products/1073562901/dqmxk_512.jpg", "https://images.meesho.com/images/products/1073562901/ueowl_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-fqgsji",
    slug: "ashank-premium-single-panel-curtain-pack-of-1-solid-eyelet-door-curtain-4x7-ft",
    name: "ASHANK Premium Double Panel Curtains – Pack of 2 Solid Eyelet Door Curtains 4x7 ft",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: ASHANK Premium Double Panel Curtains – Pack of 2 Solid Eyelet Door Curtains 4x7 ft\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nPackage Contains: 2 Panels (Pack of 2) Curtains with pre-installed rust-resistant eyelets/grommets for smooth sliding.\n\nPremium Fabric & Finish: Crafted from high-quality, durable polyester fabric featuring a sophisticated, wrinkle-resistant texture that drapes beautifully.\n\nLight Control & Privacy: Offers optimal room darkening/light filtering capabilities, softening harsh sun light while ensuring 100% complete indoor privacy.\n\nVersatile Sizing: Available in standard sizes (5 Feet for Windows, 7 Feet for Doors, and 9 Feet for Long Doors) to fit seamlessly across your living room, bedroom, or balcony.\n\nEasy Maintenance: Machine washable in cold water, fade-resistant color, and shrink-proof material designed for long-lasting home styling.",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Teepul Choice",
    rating: 4.7,
    reviewCount: 64,
    inStock: true,
    colors: [{"name": "Solid Maroon", "hex": "#881337"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/951446142/rz5kg_512.jpg", "https://images.meesho.com/images/products/951446142/qs2gk_512.jpg", "https://images.meesho.com/images/products/951446142/f4cue_512.jpg", "https://images.meesho.com/images/products/951446142/7ofgs_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-ho5hps",
    slug: "green-floral-leaf-printed-curtain-for-window-door-light-filtering-privacy-curtain-eyelet-polyester-curtain-pack-of-1",
    name: "Green Floral Leaf Printed Curtain for Window & Door | Light Filtering Privacy Curtain | Eyelet Polyester Curtain | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Green Floral Leaf Printed Curtain for Window & Door | Light Filtering Privacy Curtain | Eyelet Polyester Curtain | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nUpgrade your home décor with this elegant Green Floral Leaf Printed Curtain (Pack of 2), designed for windows and doors. The cream base with deep green leafy print creates a modern, natural look that works well in living rooms, bedrooms, balconies and other home spaces.\n\nKey Features:\n\nPack of 2 Curtains\nGreen & cream floral leaf design\nLight filtering for a soft, comfortable ambience\nHelps provide privacy\nEyelet/grommet top for easy hanging\nSuitable for windows and doors\nEasy-care polyester fabric\nAvailable in 5, 6, 7 & 9 feet height options\n\nAvailable Sizes:\n5 Feet | 6 Feet | 7 Feet | 9 Feet\n\nBest For: Living Room, Bedroom, Window, Door, Home Décor, Balcony & Interior Decoration.",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 75,
    inStock: true,
    colors: [{"name": "Green Floral Leaf", "hex": "#059669"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068492016/31zal_512.jpg", "https://images.meesho.com/images/products/1068492016/xczj5_512.jpg", "https://images.meesho.com/images/products/1068492016/1moo5_512.jpg", "https://images.meesho.com/images/products/1068492016/fomya_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-hob973",
    slug: "feather-printed-curtain-for-living-room-bedroom-beige-black-eyelet-door-window-curtain-pack-of-1",
    name: "Feather Printed Curtain for Living Room & Bedroom | Beige & Black Eyelet Door Window Curtain | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Feather Printed Curtain for Living Room & Bedroom | Beige & Black Eyelet Door Window Curtain | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Abstract\nSize: 7Feet\nNet Quantity (N): 2\nGive your home a clean and elegant look with this Beige & Black Feather Printed Curtain (Pack of 2). The curtain features a stylish feather pattern on a light beige/ivory background, making it suitable for modern and contemporary home interiors.\n\nDesigned with metal eyelets/grommets, the curtain is easy to hang on a compatible curtain rod and creates neat, natural folds when installed.\n\nKey Features:\n\nDesign: Feather Printed\nColor: Beige/Ivory with Black & Grey Print\nStyle: Modern & Elegant\nHanging Type: Eyelet / Grommet\nPack: 2 Curtain Panels\nSuitable For: Living Room, Bedroom, Study Room, Dining Area and Door/Window\nUse: Home Décor, Window Curtain, Door Curtain\nPattern: Repeated Feather Print\n\nWhy Choose This Curtain?\nThe neutral beige base with black and grey feather motifs blends easily with a variety of interior décor styles. It can be used to enhance windows or doors while adding a refined decorative touch to your room.\n\nPackage Includes:\n2 × Feather Printed Curtains",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Teepul Choice",
    rating: 4.5,
    reviewCount: 86,
    inStock: true,
    colors: [{"name": "Beige & Black Feather", "hex": "#d7c4b7"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068760911/gpdcb_512.jpg", "https://images.meesho.com/images/products/1068760911/b3ude_512.jpg", "https://images.meesho.com/images/products/1068760911/gchyh_512.jpg", "https://images.meesho.com/images/products/1068760911/9vd0h_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-hoalhs",
    slug: "maroon-leaf-print-eyelet-curtain-for-door-window-light-filtering-pack-of-1",
    name: "Maroon Leaf Print Eyelet Curtain for Door & Window | Light Filtering | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Maroon Leaf Print Eyelet Curtain for Door & Window | Light Filtering | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nSize: 7Feet\nNet Quantity: 2\nRefresh your home décor with this elegant Maroon Leaf Print Eyelet Curtain (Pack of 2), designed to complement living rooms, bedrooms, doors and windows. The curtain features a stylish botanical leaf pattern on a rich maroon base, giving your space a warm and contemporary look.\n\nMade from polyester fabric, this semi-transparent curtain allows natural daylight to filter through while adding a comfortable level of visual privacy. The eyelet hanging design makes installation and opening or closing convenient with a compatible curtain rod.\n\nThe printed leaf pattern works well with modern, contemporary and traditional Indian home interiors. Use it for living room windows, bedroom windows, balcony doors or other suitable door and window spaces.\n\n### Key Features\n\n• Maroon leaf and botanical print design\n• Polyester fabric\n• Semi-transparent, light-filtering construction\n• Eyelet hanging style\n• Suitable for door and window use\n• Pack of 2 curtain panels\n• Available in 5 Feet, 6 Feet, 7 Feet and 9 Feet sizes\n• Hand and machine washable\n\n### Ideal For\n\nLiving room curtains, bedroom curtains, window curtains, door curtains, home décor, apartment interiors and everyday home furnishing.\n\n### Product Details\n\nColor: Maroon\nMaterial: Polyester\nPattern: Leaf Print\nHanging Type: Eyelet\nOpacity: Light Filtering\nType: Polyester Semi Transparent\nNet Quantity: 2",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Window Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 97,
    inStock: true,
    colors: [{"name": "Maroon Leaf Print", "hex": "#881337"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068730192/cpkmc_512.jpg", "https://images.meesho.com/images/products/1068730192/3kq7a_512.jpg", "https://images.meesho.com/images/products/1068730192/um9mu_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-ho1xzt",
    slug: "magenta-printed-door-curtain-for-home-premium-leaf-design-polyester-curtain-light-filtering-privacy-curtain-pack-of-1",
    name: "Magenta Printed Door Curtain for Home | Premium Leaf Design Polyester Curtain | Light Filtering Privacy Curtain | Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Magenta Printed Door Curtain for Home | Premium Leaf Design Polyester Curtain | Light Filtering Privacy Curtain | Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Ethnic Motifs\nSize: 7Feet\nNet Quantity (N): 2\nUpgrade your home décor with this magenta printed door curtain (Pack of 2), designed with an elegant leaf pattern and a premium-looking finish. The combination of rich magenta side panels and a contrasting printed center adds a stylish decorative touch to doors, bedrooms and living spaces.\n\nKey Features\nElegant Leaf Print: Attractive magenta leaf-and-vine pattern creates a modern decorative look.\nPremium Polyester Fabric: Smooth fabric with a neat drape and glossy appearance.\nLight Filtering: Allows soft natural light into the room while helping create a more comfortable indoor space.\nPrivacy Support: Helps reduce direct outside visibility when the curtain is closed.\nSilver Eyelets: Metal eyelets make installation on a compatible curtain rod simple and convenient.\nVersatile Home Décor: Suitable for doors, bedrooms, living rooms and other indoor spaces.\nPack of 2: Includes two curtain panels.\nWhy Choose This Curtain?\n\nIf you are looking for a magenta door curtain, printed curtain for bedroom, leaf design curtain or stylish polyester curtain for home, this design combines decorative appeal with everyday functionality. Its vibrant color and botanical-inspired print can complement contemporary and traditional interiors.\n\nProduct Information\n\nProduct Type: Door Curtain\nDesign: Leaf / Floral-Inspired Print\nColor: Magenta & White\nMaterial: Polyester\nPattern: Printed\nLight Control: Light Filter",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Teepul Choice",
    rating: 4.7,
    reviewCount: 108,
    inStock: true,
    colors: [{"name": "Magenta Leaf Print", "hex": "#be185d"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068326489/pm2rg_512.jpg", "https://images.meesho.com/images/products/1068326489/iewtk_512.jpg", "https://images.meesho.com/images/products/1068326489/ubves_512.jpg", "https://images.meesho.com/images/products/1068326489/xymkv_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-bcvrz8",
    slug: "stylish-purple-curtains-for-door-windos-5-6-7-9-feet-pack-of-2",
    name: "Stylish Purple Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Purple Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft)",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 119,
    inStock: true,
    colors: [{"name": "Royal Purple", "hex": "#6b21a8"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/686765924/ijjo7_512.jpg", "https://images.meesho.com/images/products/686765924/fhvwh_512.jpg", "https://images.meesho.com/images/products/686765924/bc8tv_512.jpg", "https://images.meesho.com/images/products/686765924/s7og9_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-c2ur5l",
    slug: "trendy-marble-print-curtains-for-home-pack-of-2",
    name: "Trendy Marble Print Curtains for Home (Pack of 2)",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trendy Marble Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: 3D\nSet: Door\nPrint or Pattern Type: Floral\nSize: 7Feet\nNet Quantity (N): 2\n✔ Premium Tissue Fabric – Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n✔ Sheer & Light Filtering – Natural light andar aane deta hai aur privacy bhi maintain karta hai\n✔ Multi-Purpose Use – Living room, bedroom, balcony, office, hotel ke liye perfect\n✔ Easy to Wash & Maintain – Hand wash / gentle machine wash friendly\n✔ Perfect Fall & Finish – Curtain rod pe lagane ke baad classy fall aata hai\nEnhance your home décor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office — har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Teepul Choice",
    rating: 4.5,
    reviewCount: 130,
    inStock: true,
    colors: [{"name": "Blue Marble Print", "hex": "#2563eb"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/730388217/4miar_512.jpg", "https://images.meesho.com/images/products/730388217/pdhgf_512.jpg", "https://images.meesho.com/images/products/730388217/aqakm_512.jpg", "https://images.meesho.com/images/products/730388217/zwaue_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-bcvmm6",
    slug: "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2",
    name: "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: 100% Premium Polyester\nPrint or Pattern Type: Typography\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft)",
    price: 459,
    originalPrice: 899,
    currency: "₹",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 141,
    inStock: true,
    colors: [{"name": "Dark Brown", "hex": "#451a03"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/686758974/getca_512.jpg", "https://images.meesho.com/images/products/686758974/oshac_512.jpg", "https://images.meesho.com/images/products/686758974/qvmn2_512.jpg", "https://images.meesho.com/images/products/686758974/aygfb_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  }
];

export async function getStorefrontProducts(): Promise<Product[]> {
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
              images: parseJson(p.imagesJson),
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

    return Array.from(combinedMap.values());
  } catch (error) {
    console.error('Failed to load DB products:', error);
    return PRODUCTS_CATALOG.filter(Boolean);
  }
}
