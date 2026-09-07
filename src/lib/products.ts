import prisma from './db';

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
    id: 'prod-5',
    slug: 'premium-brown-thermal-blackout-door-curtain',
    name: 'Premium Brown Thermal Blackout Door Curtain',
    tagline: 'Pack of 1 | Silver Eyelets 100% Light Blocking Thermal Insulated Curtain',
    description: 'Transform your bedroom or living room with Teepul Premium Brown Thermal Blackout Curtains. Features heavy-duty silver ring eyelets, 100% noise and light blocking thermal insulation, and rich solid texture.',
    price: 301,
    originalPrice: 699,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Meesho Choice',
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    colors: [
      { name: 'Premium Dark Brown', hex: '#3e2723' },
      { name: 'Warm Chocolate', hex: '#4e342e' },
    ],
    sizes: ['7 Feet (Door Curtain)', '9 Feet (Long Door)'],
    fabricSpecs: {
      gsm: 320,
      material: 'Polyester Thermal Fabric',
      fit: 'Silver Eyelet Grommets',
      care: 'Hand & Machine Washable',
    },
    images: [
      'https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512',
      'https://images.meesho.com/images/products/1060934359/ibskg_512.avif?width=512',
      'https://images.meesho.com/images/products/1060934359/z3epy_512.avif?width=512',
    ],
    features: [
      '100% Light Blocking Thermal Insulation',
      'Rust-Proof Stainless Steel Eyelet Rings',
      'Noise & Heat Shield Fabric',
      'Machine & Hand Washable',
    ],
  },,
  {
    id: 'meesho-eupceo',
    slug: 'stylish-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-eupceo',
    name: "Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home d\u00e9cor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai",
    price: 450,
    originalPrice: 810,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Meesho Seller Choice',
    rating: 4.2,
    reviewCount: 35,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/898097424/wz7fn_512.jpg", "https://images.meesho.com/images/products/898097424/ihoaz_512.jpg", "https://images.meesho.com/images/products/898097424/g2ks9_512.jpg", "https://images.meesho.com/images/products/898097424/drcoz_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-ho7bot',
    slug: 'blue-floral-leaf-printed-curtain-for-window-door-light-filtering-eyelet-curtain-premium-polyester-home-decor-curtain-pack-of-1-ho7bot',
    name: "Blue Floral Leaf Printed Curtain for Window & Door | Light Filtering Eyelet Curtain | Premium Polyester Home Decor Curtain | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Blue Floral Leaf Printed Curtain for Window & Door | Light Filtering Eyelet Curtain | Premium Polyester Home Decor Curtain | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nSize: 7Feet\nNet Quantity (N): 1\nGive your home a fresh and elegantt look with this Blue Floral Leaf Printed Curtain. The attractive blue base with delicate leaf detailing adds a stylish touch to living rooms, bedrooms, windows and doors. Its eyelet design makes hanging simplee, while the fabric helps filter daylight and provides added privacy.\n\nProduct Highlights\n\nPack of 1 Curtain\nBlue floral leaf printed design\nLight-filtering curtain\nEyelet/grommet top\nSuitable for windows and doors\nSuitable for living room, bedroom and home d\u00e9cor\nAvailable in 5, 6, 7 & 9 Feet\nEasy-caree fabric\n Size Information\n\nAvailable Heights:\n5 Feet | 6 Feet | 7 Feet | 9 Feet\n\nPack: 1 Curtain Panel\n\nBlue Curtain, Floral Curtain, Leaf Print Curtain, Window Curtain, Door Curtain\n\nBlue Floral Curtain, Printed Curtain, Eyelet Curtain, Polyester Curtain, Living Room Curtain, Bedroom Curtain, Home Decor Curtain, Light Filtering Curtain\n\nBlue floral curtain for window, blue curtain for bedroom, leaf print curtain for living room, printed eyelet curtain for door, blue home decor curtain",
    price: 347,
    originalPrice: 624,
    currency: '₹',
    category: 'Window Curtains',
    badge: 'Meesho Seller Choice',
    rating: 4.3,
    reviewCount: 53,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068577517/dwkky_512.jpg", "https://images.meesho.com/images/products/1068577517/7d95j_512.jpg", "https://images.meesho.com/images/products/1068577517/t94in_512.jpg", "https://images.meesho.com/images/products/1068577517/6xs5w_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-hn79yx',
    slug: 'grey-eyelet-curtain-premium-polyester-door-window-curtain-for-bedroom-living-room-home-decor-pack-of-1-hn79yx',
    name: "Grey Eyelet Curtain | Premium Polyester Door & Window Curtain for Bedroom, Living Room & Home Decor | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Grey Eyelet Curtain | Premium Polyester Door & Window Curtain for Bedroom, Living Room & Home Decor | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Conversational\nSize: 7Feet\nNet Quantity (N): 1\nPremium Grey Eyelet Curtain \u2013 Pack of 1\n\nGive your home a clean and sophisticated look with this Premium Grey Curtain, designed for modern bedrooms, living rooms and other indoor spaces. Made from polyester fabric, the curtain features a subtle textured finish and silver metal eyelets for a neat, contemporary appearance.\n\nThe single curtain panel is suitable for compatible door and window curtain rods. Its neutral grey colour blends easily with different interior styles, making it a practical choice for every day home d\u00e9cor.\n\nKey Features\nColour: Grey / Silver Grey\nMaterial: Polyester\nPattern: Solid Textured\nCurtain Type: Eyelet Curtain\nEyelet: Silver Metal Eyelets\nPack: 1 Curtain Panel\nSuitable For: Bedroom, Living Room, Door & Window\nStyle: Modern                                                                                                                      Installation: Easy to hang on a compatible curtain rod\nCare: Follow the fabric care instructions\nPerfect For\n\nUse this grey curtain for bedroom d\u00e9cor, living room d\u00e9cor, window covering, door covering and modern home interiors. The neutral grey shade works well with a wide range of furniture and wall colours.\ngrey curtain, curtain, window curtain, door curtain\ngrey eyelet curtain, eyelet curtain, polyester curtain, grey window curtain, grey door curtain\ngrey curtain for bedroom, grey curtain for living room, grey eyel",
    price: 337,
    originalPrice: 606,
    currency: '₹',
    category: 'Window Curtains',
    badge: 'Meesho Seller Choice',
    rating: 4.4,
    reviewCount: 71,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["7 Feet", "9 Feet", "5 Feet", "6 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1066895673/jv7gh_512.jpg", "https://images.meesho.com/images/products/1066895673/j0wld_512.jpg", "https://images.meesho.com/images/products/1066895673/8wzrf_512.jpg", "https://images.meesho.com/images/products/1066895673/sg049_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-euou2r',
    slug: 'trendy-print-curtains-for-home-pack-of-2-euou2r',
    name: "Trendy Print Curtains for Home (Pack of 2)",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trendy Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Floral\nSize: 9Feet\nNet Quantity (N): 2\nEnhance your home d\u00e9cor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur  look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern <warning name='Holme's'>homes</warning> \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric room ko look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai",
    price: 453,
    originalPrice: 815,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Best Seller',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["6 Feet", "7 Feet", "9 Feet", "5 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/898073667/pfe5s_512.jpg", "https://images.meesho.com/images/products/898073667/cqiah_512.jpg", "https://images.meesho.com/images/products/898073667/db7dt_512.jpg", "https://images.meesho.com/images/products/898073667/moxae_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-bazczz',
    slug: 'trending-polyester-7-feet-door-curtains-set-of-2-ghar-ke-parde-home-room-parda-bazczz',
    name: "Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda\nMaterial: Polycotton\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft) \n\n BULLET POINTS\n\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai\n\n PRODUCT DESCRIPTION\n\nEnhance your home d\u00e9cor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    price: 362,
    originalPrice: 651,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Best Seller',
    rating: 4.6,
    reviewCount: 107,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/683573903/vnzkz_512.jpg", "https://images.meesho.com/images/products/683573903/um7nh_512.jpg", "https://images.meesho.com/images/products/683573903/qdd0t_512.jpg", "https://images.meesho.com/images/products/683573903/q8yqh_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-cqurq3',
    slug: 'luxury-feather-print-eyelet-curtains-for-living-room-bedroom-set-of-2-7ft-9ft-cqurq3',
    name: "Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: 3d Printed\nSize: 9Feet\nNet Quantity (N): 1\nPremium Fabric: Made from high-quality 150 GSM polyester/satin for a good feel and long-lasting durability.\n\nPerfect Size: Available in 5ft (Window), 7ft (Door), and 9ft (Long Door) to fit every corner of your home.\n\nEasy Installation: Features rust-resistant metallic eyelet rings for smooth sliding and a modern look.\n\nLight & Privacy Control: Room darkening/Blackout technology blocks 80-90% of Sun light while ensuring complete privacy.\n\nEasy Maintenance: 100% machine washable; color-fast fabric that doesn't shrink or fade after washing.\n\nbest Design: Modern 3D prints/Botanical patterns that instantly elevate your living room, bedroom, or office decor.\nMain Terms\tCurtains, , Door Curtains, Window Curtains, Pared, Net Curtain\nMaterial\tPolyester, Cotton, Velvet, Net, Satin, Sheer, Jacquard\nFeatures\tBlackout, Room Darkening, Thermal Insulated, Eyelet, Ring , Washable\nStyle/Pattern\t3D Printed, Floral, Solid, Striped, Abstract, Embroidered, Modern\nSizes/Sets\tSet of 2, Pack of 4, 7 Feet, 9 Feet, Long Door, Window Screen",
    price: 601,
    originalPrice: 1081,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Best Seller',
    rating: 4.7,
    reviewCount: 125,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["6 Feet", "7 Feet", "9 Feet", "5 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/770699739/ow9uo_512.jpg", "https://images.meesho.com/images/products/770699739/wdklh_512.jpg", "https://images.meesho.com/images/products/770699739/jgo5w_512.jpg", "https://images.meesho.com/images/products/770699739/wzcpa_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-hmctql',
    slug: 'premium-black-door-curtain-light-filtering-privacy-silver-eyelet-polyester-curtain-5-6-7-9-feet-pack-of-1-hmctql',
    name: "Premium Black Door Curtain | Light Filtering & Privacy | Silver Eyelet Polyester Curtain | 5, 6, 7 & 9 Feet | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Premium Black Door Curtain | Light Filtering & Privacy | Silver Eyelet Polyester Curtain | 5, 6, 7 & 9 Feet | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Solid\nSize: 7Feet\nNet Quantity (N): 1\nUpgrade your home with this elegant. black door curtain designed for doors and long windows. Made from durable polyester fabric, it offers a clean, sophisticated look while helping provide privacy and control incoming light.\n\nKey Features:\n\nPremium black polyester fabric\nLight-filtering design for comfortable indoor lighting\nHelps enhance privacy\nSilver metal eyelets for easy installation and smooth movement\nSuitable for bedrooms, living rooms, balconies, offices and doors\nAvailable in 5, 6, 7 and 9 feet height options\nEasy to hang and maintain\nSuitable for modern and traditional interiors",
    price: 322,
    originalPrice: 579,
    currency: '₹',
    category: 'Ambient Lighting',
    badge: 'Best Seller',
    rating: 4.2,
    reviewCount: 143,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1065474957/iilfa_512.jpg", "https://images.meesho.com/images/products/1065474957/otnrr_512.jpg", "https://images.meesho.com/images/products/1065474957/dvozh_512.jpg", "https://images.meesho.com/images/products/1065474957/mrfcs_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: 'meesho-bf04nh',
    slug: 'stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bf04nh',
    name: "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
    price: 511,
    originalPrice: 919,
    currency: '₹',
    category: 'Door Curtains',
    badge: 'Luxury Drapery',
    rating: 4.3,
    reviewCount: 161,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/690328205/5plfv_512.jpg", "https://images.meesho.com/images/products/690328205/app1g_512.jpg", "https://images.meesho.com/images/products/690328205/p4vyx_512.jpg", "https://images.meesho.com/images/products/690328205/atv3z_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  }
];

export async function getStorefrontProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!dbProducts || dbProducts.length === 0) {
      return PRODUCTS_CATALOG;
    }

    const mapped = dbProducts.map((p) => {
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

    return mapped.length > 0 ? mapped : PRODUCTS_CATALOG;
  } catch (error) {
    console.error('Failed to load DB products:', error);
    return PRODUCTS_CATALOG;
  }
}
