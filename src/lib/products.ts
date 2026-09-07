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
    id: "prod-5",
    slug: "premium-brown-thermal-blackout-door-curtain",
    name: "Premium Brown Thermal Blackout Door Curtain",
    tagline: "Pack of 1 | Silver Eyelets 100% Light Blocking Thermal Insulated Curtain",
    description: "Transform your bedroom or living room with Teepul Premium Brown Thermal Blackout Curtains. Features heavy-duty silver ring eyelets, 100% noise and light blocking thermal insulation, and rich solid texture.",
    price: 301,
    originalPrice: 699,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Meesho Choice",
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    colors: [{"name": "Premium Dark Brown", "hex": "#3e2723"}, {"name": "Warm Chocolate", "hex": "#4e342e"}],
    sizes: ["7 Feet (Door Curtain)", "9 Feet (Long Door)"],
    fabricSpecs: {"gsm": 320, "material": "Polyester Thermal Fabric", "fit": "Silver Eyelet Grommets", "care": "Hand & Machine Washable"},
    images: ["https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512", "https://images.meesho.com/images/products/1060934359/ibskg_512.avif?width=512", "https://images.meesho.com/images/products/1060934359/z3epy_512.avif?width=512"],
    features: ["100% Light Blocking Thermal Insulation", "Rust-Proof Stainless Steel Eyelet Rings", "Noise & Heat Shield Fabric", "Machine & Hand Washable"]
  },
  {
    id: "meesho-eupceo",
    slug: "stylish-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-eupceo",
    name: "Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 2\nEnhance your home d\u00e9cor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai",
    price: 450,
    originalPrice: 810,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Meesho Seller Choice",
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
    id: "meesho-ho7bot",
    slug: "blue-floral-leaf-printed-curtain-for-window-door-light-filtering-eyelet-curtain-premium-polyester-home-decor-curtain-pack-of-1-ho7bot",
    name: "Blue Floral Leaf Printed Curtain for Window & Door | Light Filtering Eyelet Curtain | Premium Polyester Home Decor Curtain | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Blue Floral Leaf Printed Curtain for Window & Door | Light Filtering Eyelet Curtain | Premium Polyester Home Decor Curtain | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nSize: 7Feet\nNet Quantity (N): 1\nGive your home a fresh and elegantt look with this Blue Floral Leaf Printed Curtain. The attractive blue base with delicate leaf detailing adds a stylish touch to living rooms, bedrooms, windows and doors. Its eyelet design makes hanging simplee, while the fabric helps filter daylight and provides added privacy.\n\nProduct Highlights\n\nPack of 1 Curtain\nBlue floral leaf printed design\nLight-filtering curtain\nEyelet/grommet top\nSuitable for windows and doors\nSuitable for living room, bedroom and home d\u00e9cor\nAvailable in 5, 6, 7 & 9 Feet\nEasy-caree fabric\n Size Information\n\nAvailable Heights:\n5 Feet | 6 Feet | 7 Feet | 9 Feet\n\nPack: 1 Curtain Panel\n\nBlue Curtain, Floral Curtain, Leaf Print Curtain, Window Curtain, Door Curtain\n\nBlue Floral Curtain, Printed Curtain, Eyelet Curtain, Polyester Curtain, Living Room Curtain, Bedroom Curtain, Home Decor Curtain, Light Filtering Curtain\n\nBlue floral curtain for window, blue curtain for bedroom, leaf print curtain for living room, printed eyelet curtain for door, blue home decor curtain",
    price: 347,
    originalPrice: 624,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Meesho Seller Choice",
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
    id: "meesho-hn79yx",
    slug: "grey-eyelet-curtain-premium-polyester-door-window-curtain-for-bedroom-living-room-home-decor-pack-of-1-hn79yx",
    name: "Grey Eyelet Curtain | Premium Polyester Door & Window Curtain for Bedroom, Living Room & Home Decor | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Grey Eyelet Curtain | Premium Polyester Door & Window Curtain for Bedroom, Living Room & Home Decor | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Conversational\nSize: 7Feet\nNet Quantity (N): 1\nPremium Grey Eyelet Curtain \u2013 Pack of 1\n\nGive your home a clean and sophisticated look with this Premium Grey Curtain, designed for modern bedrooms, living rooms and other indoor spaces. Made from polyester fabric, the curtain features a subtle textured finish and silver metal eyelets for a neat, contemporary appearance.\n\nThe single curtain panel is suitable for compatible door and window curtain rods. Its neutral grey colour blends easily with different interior styles, making it a practical choice for every day home d\u00e9cor.\n\nKey Features\nColour: Grey / Silver Grey\nMaterial: Polyester\nPattern: Solid Textured\nCurtain Type: Eyelet Curtain\nEyelet: Silver Metal Eyelets\nPack: 1 Curtain Panel\nSuitable For: Bedroom, Living Room, Door & Window\nStyle: Modern                                                                                                                      Installation: Easy to hang on a compatible curtain rod\nCare: Follow the fabric care instructions\nPerfect For\n\nUse this grey curtain for bedroom d\u00e9cor, living room d\u00e9cor, window covering, door covering and modern home interiors. The neutral grey shade works well with a wide range of furniture and wall colours.\ngrey curtain, curtain, window curtain, door curtain\ngrey eyelet curtain, eyelet curtain, polyester curtain, grey window curtain, grey door curtain\ngrey curtain for bedroom, grey curtain for living room, grey eyel",
    price: 337,
    originalPrice: 606,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Meesho Seller Choice",
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
    id: "meesho-euou2r",
    slug: "trendy-print-curtains-for-home-pack-of-2-euou2r",
    name: "Trendy Print Curtains for Home (Pack of 2)",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trendy Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Floral\nSize: 9Feet\nNet Quantity (N): 2\nEnhance your home d\u00e9cor with premium quality Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur  look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern <warning name='Holme's'>homes</warning> \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric room ko look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai",
    price: 453,
    originalPrice: 815,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Best Seller",
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
    id: "meesho-bazczz",
    slug: "trending-polyester-7-feet-door-curtains-set-of-2-ghar-ke-parde-home-room-parda-bazczz",
    name: "Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trending Polyester 7 Feet Door Curtains (Set of 2) | Ghar Ke Parde / Home Room Parda\nMaterial: Polycotton\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft) \n\n BULLET POINTS\n\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai\n\n PRODUCT DESCRIPTION\n\nEnhance your home d\u00e9cor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern homes \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    price: 362,
    originalPrice: 651,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Best Seller",
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
    id: "meesho-cqurq3",
    slug: "luxury-feather-print-eyelet-curtains-for-living-room-bedroom-set-of-2-7ft-9ft-cqurq3",
    name: "Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Luxury Feather Print Eyelet Curtains for Living Room & Bedroom (Set of 2) - 7ft/9ft\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: 3d Printed\nSize: 9Feet\nNet Quantity (N): 1\nPremium Fabric: Made from high-quality 150 GSM polyester/satin for a good feel and long-lasting durability.\n\nPerfect Size: Available in 5ft (Window), 7ft (Door), and 9ft (Long Door) to fit every corner of your home.\n\nEasy Installation: Features rust-resistant metallic eyelet rings for smooth sliding and a modern look.\n\nLight & Privacy Control: Room darkening/Blackout technology blocks 80-90% of Sun light while ensuring complete privacy.\n\nEasy Maintenance: 100% machine washable; color-fast fabric that doesn't shrink or fade after washing.\n\nbest Design: Modern 3D prints/Botanical patterns that instantly elevate your living room, bedroom, or office decor.\nMain Terms\tCurtains, , Door Curtains, Window Curtains, Pared, Net Curtain\nMaterial\tPolyester, Cotton, Velvet, Net, Satin, Sheer, Jacquard\nFeatures\tBlackout, Room Darkening, Thermal Insulated, Eyelet, Ring , Washable\nStyle/Pattern\t3D Printed, Floral, Solid, Striped, Abstract, Embroidered, Modern\nSizes/Sets\tSet of 2, Pack of 4, 7 Feet, 9 Feet, Long Door, Window Screen",
    price: 601,
    originalPrice: 1081,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Best Seller",
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
    id: "meesho-hmctql",
    slug: "premium-black-door-curtain-light-filtering-privacy-silver-eyelet-polyester-curtain-5-6-7-9-feet-pack-of-1-hmctql",
    name: "Premium Black Door Curtain | Light Filtering & Privacy | Silver Eyelet Polyester Curtain | 5, 6, 7 & 9 Feet | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Premium Black Door Curtain | Light Filtering & Privacy | Silver Eyelet Polyester Curtain | 5, 6, 7 & 9 Feet | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door and Window\nPrint or Pattern Type: Solid\nSize: 7Feet\nNet Quantity (N): 1\nUpgrade your home with this elegant. black door curtain designed for doors and long windows. Made from durable polyester fabric, it offers a clean, sophisticated look while helping provide privacy and control incoming light.\n\nKey Features:\n\nPremium black polyester fabric\nLight-filtering design for comfortable indoor lighting\nHelps enhance privacy\nSilver metal eyelets for easy installation and smooth movement\nSuitable for bedrooms, living rooms, balconies, offices and doors\nAvailable in 5, 6, 7 and 9 feet height options\nEasy to hang and maintain\nSuitable for modern and traditional interiors",
    price: 322,
    originalPrice: 579,
    currency: "\u20b9",
    category: "Ambient Lighting",
    badge: "Best Seller",
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
    id: "meesho-bf04nh",
    slug: "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2-bf04nh",
    name: "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nOpacity: Blackout\nLength: Door\nType: Shoe Rack\nSet: Door\nPrint or Pattern Type: Typography\nSize: Long Door 9 Feet\nNet Quantity (N): 2",
    price: 511,
    originalPrice: 919,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Luxury Drapery",
    rating: 4.3,
    reviewCount: 161,
    inStock: true,
    colors: [{"name": "Royal Blue", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}, {"name": "Classic Black", "hex": "#18181b"}],
    sizes: ["9 Feet", "5 Feet", "6 Feet", "7 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavy Polyester", "fit": "Stainless Steel Silver Grommets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/690328205/5plfv_512.jpg", "https://images.meesho.com/images/products/690328205/app1g_512.jpg", "https://images.meesho.com/images/products/690328205/p4vyx_512.jpg", "https://images.meesho.com/images/products/690328205/atv3z_512.jpg"],
    features: ["Light Filtering & Room Darkening", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Insulation & Noise Reduction", "Wrinkle-Resistant Washable Fabric"]
  },
  {
    id: "meesho-hnjfvf",
    slug: "premium-blue-white-leaf-print-eyelet-curtain-polyester-door-window-curtain-for-bedroom-living-room-pack-of-1",
    name: "Premium Blue & White Leaf Print Eyelet Curtain | Polyester Door & Window Curtain for Bedroom & Living Room | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Premium Blue & White Leaf Print Eyelet Curtain | Polyester Door & Window Curtain for Bedroom & Living Room | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: 3D\nSet: Door and Window\nSize: 7Feet\nNet Quantity (N): 1\nPremium Blue Printed Eyelet Curtain \u2013 Pack of 1\n\nGive your home a stylish and refreshing makeover with this Blue Printed Eyelet Curtain, featuring  combination of royal blue side panels and a white centre panel with blue leaf motifs. The attractive botanical-inspired design adds a modern decorative touch to bedrooms, living rooms, doors and windows.\n\nMade from polyester fabric, this curtain is designed with metal eyelets for easy hanging on a compatible curtain rod. The combination of solid blue and printed panels creates a balanced look that works well with both contemporary and classic interiors.\n\nKey Features\n\nColour: Royal Blue & White\nMaterial: Polyester\nPattern: Leaf / Botanical Print\nCurtain Type: Eyelet Curtain\nDesign: Blue Side Panels with Blue Leaf Print Centre\nPack: 1 Curtain Panel\nSuitable For: Bedroom, Living Room, Door & Window\nStyle: Modern, Elegantt & Decorative\nHanging: Metal Eyelet\n\nPerfect For:\nBedroom curtains, living room curtains, window curtains, door curtains, home d\u00e9cor and modern interior styling.\nblue curtain \u00b7 printed curtain \u00b7 eyelet curtain \u00b7 window curtain \u00b7 door curtain\nblue eyelet curtain \u00b7 blue printed curtain \u00b7 polyester curtain \u00b7 leaf print curtain \u00b7 blue white curtain\nblue curtain for bedroom \u00b7 blue curtain for living room \u00b7 blue leaf print curtain \u00b7 blue eyelet door curtain \u00b7 blue window cu",
    price: 337,
    originalPrice: 606,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Teepul Choice",
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    colors: [{"name": "Royal Blue & White", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1067463195/okexo_512.jpg", "https://images.meesho.com/images/products/1067463195/h6czi_512.jpg", "https://images.meesho.com/images/products/1067463195/yadep_512.jpg", "https://images.meesho.com/images/products/1067463195/c43ue_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-hr66fp",
    slug: "pink-curtain-for-window-door-eyeletgrommet-curtain-for-bedroom-living-room-light-filtering-privacy-curtain-pack-of-1",
    name: "Pink Curtain for Window & Door | Eyelet/Grommet Curtain for Bedroom & Living Room | Light Filtering Privacy Curtain | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Pink Curtain for Window & Door | Eyelet/Grommet Curtain for Bedroom & Living Room | Light Filtering Privacy Curtain | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Solid\nSize: 7Feet\nNet Quantity (N): 1\nAdd a soft and elegantt touch to your home with this Pink Window Curtain, designed for bedrooms, living rooms, guest rooms and other indoor spaces. Its attractive pink colour complements modern and contemporary interiors, while the eyelet/grommet top makes it convenient to hang on a compatible curtain rod.\n\nThe curtain is suitable for every day home d\u00e9cor and helps create a comfortable, private indoor environment while allowing natural light to brighten the room.\n\n\u2728 Key Features\nElegantt Pink Colour \u2013 Gives your room a fresh, soft and stylish appearance.\nLight Filtering \u2013 Allows natural daylight to enterr while helping soften the brightness.\nPrivacy Support \u2013 Helps reduce direct outside visibility for a more comfortable space.\nEyelet/Grommet Top \u2013 Easy to hang on a compatible curtain rod.\nVersatile Home D\u00e9cor \u2013 Suitable for bedrooms, living rooms, guest rooms, study rooms and home offices.\nEasy Every day Styling \u2013 Works well with neutral walls, wooden furniture and contemporary interiors.\nPack of 1 \u2013 Includes one curtain panel.\n Where Can This Pink Curtain Be Used?\n\nThis curtain is suitable for:\n\nBedroom windows\nLiving room windows\nDoorways\nGuest rooms\nStudy rooms\nHome offices\nApartments\nRental home\nModern home interiors\n Product Details\n\nProduct Type: Window Curtain\nColour: Pink\nPack: 1 Curtain Panel\nHanging Style: Eyelet / Grommet\nSuitable For: Windows & Doors\nRecommended Spa",
    price: 448,
    originalPrice: 806,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 53,
    inStock: true,
    colors: [{"name": "Blush Pink", "hex": "#ec4899"}, {"name": "Soft Rose", "hex": "#f43f5e"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1073562901/bsjqf_512.jpg", "https://images.meesho.com/images/products/1073562901/dqmxk_512.jpg", "https://images.meesho.com/images/products/1073562901/ueowl_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-fqgsji",
    slug: "ashank-premium-single-panel-curtain-pack-of-1-solid-eyelet-door-curtain-4x7-ft",
    name: "ASHANK Premium Single Panel Curtain \u2013 Pack of 1 Solid Eyelet Door Curtain 4x7 ft ",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: ASHANK Premium Single Panel Curtain \u2013 Pack of 1 Solid Eyelet Door Curtain 4x7 ft \nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Premium Curtain\nSet: Door\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 1\nPackage Contains: 1 Single Panel (Pack of 1) Curtain with pre-installed rust-resistant eyelets/grommets for smooth sliding.\n\nPremium Fabric & Finish: Crafted from high-quality, durable polyester fabric featuring a sophisticated, wrinkle-resistant texture that drapes beautifully.\n\nLight Control & Privacy: Offers optimal room darkening/light filtering capabilities, softening harsh sun light while ensuring 100% complete indoor privacy.\n\nVersatile Sizing: Available in standard sizes (5 Feet for Windows, 7 Feet for Doors, and 9 Feet for Long Doors) to fit seamlessly across your living room, bedroom, or balcony.\n\nEasy Maintenance: Machine washable in cold water, fade-resistant color, and shrink-proof material designed for long-lasting home styling.\nsingle panel curtain, pack of 1 curtain, single piece curtain, meesho curtain single panel, 1 pc curtain door, window curtain 1 piece\nsolid color curtain, modern minima list drape, premium polyester curtain, textured room darkening curtain, crush fabric curtain 1pc\n5 feet window curtain single, 7 feet door curtain single, 9 feet long door drape, living room single curtain, bedroom single panel curtain",
    price: 256,
    originalPrice: 460,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Teepul Choice",
    rating: 4.7,
    reviewCount: 64,
    inStock: true,
    colors: [{"name": "Royal Blue & White", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/951446142/rz5kg_512.jpg", "https://images.meesho.com/images/products/951446142/qs2gk_512.jpg", "https://images.meesho.com/images/products/951446142/f4cue_512.jpg", "https://images.meesho.com/images/products/951446142/7ofgs_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-ho5hps",
    slug: "green-floral-leaf-printed-curtain-for-window-door-light-filtering-privacy-curtain-eyelet-polyester-curtain-pack-of-1",
    name: "Green Floral Leaf Printed Curtain for Window & Door | Light Filtering Privacy Curtain | Eyelet Polyester Curtain | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Green Floral Leaf Printed Curtain for Window & Door | Light Filtering Privacy Curtain | Eyelet Polyester Curtain | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Botanical\nSize: 7Feet\nNet Quantity (N): 1\nUpgrade your home d\u00e9cor with this elegantt Green Floral Leaf Printed Curtain, designed for windows and doors. The cream base with deep green leafy print creates a modern, natural look that works well in living rooms, bedrooms, balconies and other home spaces.\n\nKey Features:\n\nPack of 1 Curtain\nGreen & cream floral leaf design\nLight filtering for a soft, comfortable ambience\nHelps provide privacy\nEyelet/grommet top for easy hanging\nSuitable for windows and doors\nEasy-caree polyester fabric\nAvailable in 5, 6, 7 & 9 feet height options\n\nAvailable Sizes:\n5 Feet | 6 Feet | 7 Feet | 9 Feet\n\nBest For: Living Room, Bedroom, Window, Door, Home D\u00e9cor, Balcony & Interior Decoration.\ngreen curtain, floral curtain, leaf print curtain, window curtain, door curtain, eyelet curtain, polyester curtain, printed curtain, home decor curtain, privacy curtain, light filtering curtain.",
    price: 347,
    originalPrice: 624,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 75,
    inStock: true,
    colors: [{"name": "Emerald Green", "hex": "#059669"}, {"name": "Sage Green", "hex": "#10b981"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068492016/31zal_512.jpg", "https://images.meesho.com/images/products/1068492016/xczj5_512.jpg", "https://images.meesho.com/images/products/1068492016/1moo5_512.jpg", "https://images.meesho.com/images/products/1068492016/fomya_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-hob973",
    slug: "feather-printed-curtain-for-living-room-bedroom-beige-black-eyelet-door-window-curtain-pack-of-1",
    name: "Feather Printed Curtain for Living Room & Bedroom | Beige & Black Eyelet Door Window Curtain | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Feather Printed Curtain for Living Room & Bedroom | Beige & Black Eyelet Door Window Curtain | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Abstrast\nSize: 7Feet\nNet Quantity (N): 1\nGive your home a clean and elegantt look with this Beige & Black Feather Printed Curtain. The curtain features a stylish feather pattern on a light beige/i vory background, making it suitable for modern and contemporary home interiors.\n\nDesigned with metal eyelets/grommets, the curtain is easy to hang on a compatible curtain rod and creates neat, natural folds when installed.\n\nKey Features:\n\nDesign: Feather Printed\nColor: Beige/I vory with Black & Grey Print\nStyle: Modern & Elegantt\nHanging Type: Eyelet / Grommet\nPack: 1 Curtain Panel\nSuitable For: Living Room, Bedroom, Study Room, Dining Area and Door/Window\nUse: Home D\u00e9cor, Window Curtain, Door Curtain\nPattern: Repeated Feather Print\n\nWhy Choose This Curtain?\nThe neutral beige base with black and grey feather motifs blends easily with a variety of interior d\u00e9cor styles. It can be used to enhance windows or doors while adding a refined decorative touch to your room.\n\nPackage Includes:\n1 \u00d7 Feather Printed Curtain\n\nBeige curtain, black printed curtain, feather print curtain, eyelet curtain, window curtain, door curtain, living room curtain, bedroom curtain, printed home furnishing curtain, modern curtain for home.",
    price: 349,
    originalPrice: 628,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Teepul Choice",
    rating: 4.5,
    reviewCount: 86,
    inStock: true,
    colors: [{"name": "Royal Blue & White", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068760911/gpdcb_512.jpg", "https://images.meesho.com/images/products/1068760911/b3ude_512.jpg", "https://images.meesho.com/images/products/1068760911/gchyh_512.jpg", "https://images.meesho.com/images/products/1068760911/9vd0h_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-hoalhs",
    slug: "maroon-leaf-print-eyelet-curtain-for-door-window-light-filtering-pack-of-1",
    name: "Maroon Leaf Print Eyelet Curtain for Door & Window | Light Filtering | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Maroon Leaf Print Eyelet Curtain for Door & Window | Light Filtering | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nSize: 7Feet\nNet Quantity (N): 1\nRefresh your home d\u00e9cor with this elegantt Maroon Leaf Print Eyelet Curtain, designed to complement living rooms, bedrooms, doors and windows. The curtain features a stylish botanical leaf pattern on a rich maroon base, giving your space a warm and contemporary look.\n\nMade from polyester fabric, this semi-transparent curtain allows natural daylight to filter through while adding a comfortable level of visual privacy. The eyelet hanging design makes installation and opening or closing convenient with a compatible curtain rod.\n\nThe printed leaf pattern works well with modern, contemporary and traditional Indian home interiors. Use it for living room windows, bedroom windows, balcony doors or other suitable door and window spaces.\n\n### Key Features\n\n\u2022 Maroon leaf and botanical print design\n\u2022 Polyester fabric\n\u2022 Semi-transparent, light-filtering construction\n\u2022 Eyelet hanging style\n\u2022 Suitable for door and window use\n\u2022 Pack of 1 curtain panel\n\u2022 Available in 5 Feet, 6 Feet, 7 Feet and 9 Feet sizes\n\u2022 Hand and machine washable\n\n### Ideal For\n\nLiving room curtains, bedroom curtains, window curtains, door curtains, home d\u00e9cor, apartment interiors and everyday home furnishing.\n\n### Product Details\n\nColor: Maroon\nMaterial: Polyester\nPattern: Leaf Print\nHanging Type: Eyelet\nOpacity: Light Filtering\nType: Polyester Semi Transparent\nNet Quantity: 1",
    price: 342,
    originalPrice: 615,
    currency: "\u20b9",
    category: "Window Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 97,
    inStock: true,
    colors: [{"name": "Royal Maroon", "hex": "#881337"}, {"name": "Deep Wine", "hex": "#4c0519"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068730192/cpkmc_512.jpg", "https://images.meesho.com/images/products/1068730192/3kq7a_512.jpg", "https://images.meesho.com/images/products/1068730192/um9mu_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-ho1xzt",
    slug: "magenta-printed-door-curtain-for-home-premium-leaf-design-polyester-curtain-light-filtering-privacy-curtain-pack-of-1",
    name: "Magenta Printed Door Curtain for Home | Premium Leaf Design Polyester Curtain | Light Filtering Privacy Curtain | Pack of 1",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Magenta Printed Door Curtain for Home | Premium Leaf Design Polyester Curtain | Light Filtering Privacy Curtain | Pack of 1\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: Polyester Semi Transparent\nSet: Door and Window\nPrint or Pattern Type: Ethnic Motifs\nSize: 7Feet\nNet Quantity (N): 1\npgrade your home d\u00e9cor with this magenta printed door curtain, designed with ann elegantt leaf pattern and a premium-looking finish. The combination of rich magenta side panels and a contrasting printed center adds a stylish decorative touch to doors, bedrooms and living spaces.\n\nKey Features\nElegantt Leaf Print: Attractive magenta leaf-and-vine pattern creates a modern decorative look.\nPremium Polyester Fabric: Smooth fabric with a neat drape and glossy appearance.\nLight Filtering: Allows soft natural light into the room while helping create a more comfortable indoor space.\nPrivacy Support: Helps reduce direct outside visibility when the curtain is closed.\nSilver Eyelets: Metal eyelets make installation on a compatible curtain rod simplee and convenient.\nVersatile Home D\u00e9cor: Suitable for doors, bedrooms, living rooms and other indoor spaces.\nPack of 1: Includes one curtain panel.\nWhy Choose This Curtain?\n\nIf you are looking for a magenta door curtain, printed curtain for bedroom, leaf design curtain or stylish polyester curtain for home, this design combines decorative appeal with every day functionality. Its vibrant color and botanical-inspired print can complement contemporary and traditional interiors.\n\nProduct Information\n\nProduct Type: Door Curtain\nDesign: Leaf / Floral-Inspired Print\nColor: Magenta & White\nMaterial: Polyester\nPattern: Printed\nLight Control: Light Filter",
    price: 347,
    originalPrice: 624,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Teepul Choice",
    rating: 4.7,
    reviewCount: 108,
    inStock: true,
    colors: [{"name": "Royal Maroon", "hex": "#881337"}, {"name": "Deep Wine", "hex": "#4c0519"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/1068326489/pm2rg_512.jpg", "https://images.meesho.com/images/products/1068326489/iewtk_512.jpg", "https://images.meesho.com/images/products/1068326489/ubves_512.jpg", "https://images.meesho.com/images/products/1068326489/xymkv_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-bcvrz8",
    slug: "stylish-purple-curtains-for-door-windos-5-6-7-9-feet-pack-of-2",
    name: "Stylish Purple Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Purple Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polyester\nPrint or Pattern Type: Floral\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft)",
    price: 534,
    originalPrice: 961,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 119,
    inStock: true,
    colors: [{"name": "Imperial Purple", "hex": "#6b21a8"}, {"name": "Soft Lavender", "hex": "#a855f7"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/686765924/ijjo7_512.jpg", "https://images.meesho.com/images/products/686765924/fhvwh_512.jpg", "https://images.meesho.com/images/products/686765924/bc8tv_512.jpg", "https://images.meesho.com/images/products/686765924/s7og9_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-c2ur5l",
    slug: "trendy-marble-print-curtains-for-home-pack-of-2",
    name: "Trendy Marble Print Curtains for Home (Pack of 2)",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Trendy Marble Print Curtains for Home (Pack of 2)\nMaterial: Polyester\nOpacity: Light Filtering\nLength: Door\nType: 3D\nSet: Door\nPrint or Pattern Type: Floral\nSize: 7Feet\nNet Quantity (N): 2\n\u2714 Premium Tissue Fabric \u2013 Soft, smooth aur lightweight fabric jo room ko elegant look deta hai\n\u2714 Sheer & Light Filtering \u2013 Natural light andar aane deta hai aur privacy bhi maintain karta hai\n\u2714 Multi-Purpose Use \u2013 Living room, bedroom, balcony, office, hotel ke liye perfect\n\u2714 Easy to Wash & Maintain \u2013 Hand wash / gentle machine wash friendly\n\u2714 Perfect Fall & Finish \u2013 Curtain rod pe lagane ke baad classy fall aata hai\nEnhance your home d\u00e9cor with premium quality Tissue Curtains.\nYe curtains soft aur sheer fabric se bane hote hain jo aapke room ko bright aur elegant look dete hain.\nLightweight material hone ki wajah se ye easily hang ho jaate hain aur natural light ko beautifully filter karte hain.\n\nLiving room, bedroom, balcony ya office \u2014 har jagah ke liye suitable. Simple design ke saath modern <warning name='Holme's'>homes</warning> \nke liye perfect choice.\ntissue curtains,\nsheer curtains,\n door curtains,\nwindow curtains,\n lightweight curtains,\n home decor curtains",
    price: 392,
    originalPrice: 705,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Teepul Choice",
    rating: 4.5,
    reviewCount: 130,
    inStock: true,
    colors: [{"name": "Royal Blue & White", "hex": "#1e40af"}, {"name": "Warm Beige", "hex": "#d7c4b7"}],
    sizes: ["5 Feet", "6 Feet", "7 Feet", "9 Feet"],
    fabricSpecs: {"gsm": 280, "material": "100% Premium Heavyweight Polyester", "fit": "Stainless Steel Silver Eyelets", "care": "Hand & Machine Wash Cold"},
    images: ["https://images.meesho.com/images/products/730388217/4miar_512.jpg", "https://images.meesho.com/images/products/730388217/pdhgf_512.jpg", "https://images.meesho.com/images/products/730388217/aqakm_512.jpg", "https://images.meesho.com/images/products/730388217/zwaue_512.jpg"],
    features: ["Light Filtering & Room Darkening Privacy", "Rust-Proof Stainless Steel Eyelet Rings", "Thermal Heat Insulation & Noise Shield", "Easy Maintenance & Machine Washable"]
  },
  {
    id: "meesho-bcvmm6",
    slug: "stylish-brown-curtains-for-door-windos-5-6-7-9-feet-pack-of-2",
    name: "Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2",
    tagline: "Pack of 1/2 | Silver Eyelets Light Filtering & Thermal Insulation",
    description: "Name: Stylish Brown Curtains for Door & Windos 5, 6, 7 & 9 FEET Pack of 2\nMaterial: Polycotton\nPrint or Pattern Type: Typography\nLength: Door\nNet Quantity (N): 2\nSizes:5 Feet (Length Size: 5 ft, Width Size: 4 ft) \n6 Feet (Length Size: 6 ft, Width Size: 4 ft) \n7 Feet (Length Size: 7 ft, Width Size: 4 ft) \n9 Feet (Length Size: 9 ft, Width Size: 4 ft)",
    price: 514,
    originalPrice: 925,
    currency: "\u20b9",
    category: "Door Curtains",
    badge: "Best Seller",
    rating: 4.6,
    reviewCount: 141,
    inStock: true,
    colors: [{"name": "Chocolate Brown", "hex": "#78350f"}, {"name": "Espresso", "hex": "#451a03"}],
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

    // Add catalog items first so the 10 new Meesho seller products are always present
    for (const p of catalog) {
      combinedMap.set(p.slug, p);
    }

    // Add DB items if new ones were added via admin panel
    for (const p of mappedDb) {
      if (!combinedMap.has(p.slug)) {
        combinedMap.set(p.slug, p);
      }
    }

    return Array.from(combinedMap.values());
  } catch (error) {
    console.error('Failed to load DB products:', error);
    return PRODUCTS_CATALOG.filter(Boolean);
  }
}
