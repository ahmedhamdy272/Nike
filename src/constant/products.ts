export interface Product {
  id: number;
  title: string;
  category: "Running" | "Basketball" | "Lifestyle" | "Training";
  color: string; // Legacy string description e.g. "1 COLOR"
  price: string; // e.g. "$134.98"
  rating: number;
  reviews: number;
  image: string; // Main image path
  images: string[]; // Image gallery paths
  colors: { name: string; hex: string }[];
  sizes: number[];
  description: string;
  features: string[];
}

export const shoesCatalog: Product[] = [
  {
    id: 1,
    title: "Nike Air Force",
    category: "Lifestyle",
    color: "3 COLORS AVAILABLE",
    price: "$134.98",
    rating: 4.3,
    reviews: 123,
    image: "/images/image_20.png",
    images: ["/images/image_20.png", "/images/image_21.png", "/images/image_18.png"],
    colors: [
      { name: "Classic White", hex: "#FFFFFF" },
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Varsity Royal", hex: "#1A365D" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description: "The Nike Air Force 1 is a classic design that remains one of the most recognizable sneakers in history. Its leather upper and Air-Sole cushioning keep you comfortable all day long.",
    features: [
      "Premium leather upper for long-lasting durability.",
      "Encapsulated Nike Air-Sole unit provides lightweight cushioning.",
      "Non-marking rubber outsole offers traction on court and street."
    ]
  },
  {
    id: 2,
    title: "Nike Air Max 90",
    category: "Running",
    color: "2 COLORS AVAILABLE",
    price: "$134.98",
    rating: 4.5,
    reviews: 145,
    image: "/images/image_12.png",
    images: ["/images/image_12.png", "/images/image_13.png", "/images/image_15.png"],
    colors: [
      { name: "Infrared Gray", hex: "#718096" },
      { name: "Crimson Red", hex: "#E53E3E" },
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays, and classic TPU accents.",
    features: [
      "Max Air unit in the heel adds unbelievable cushioning.",
      "Stitched overlays and TPU accents add durability and heritage style.",
      "Padded, low-cut collar feels soft and looks sleek."
    ]
  },
  {
    id: 3,
    title: "Nike Air Force Spider",
    category: "Lifestyle",
    color: "1 COLOR AVAILABLE",
    price: "$134.98",
    rating: 4.6,
    reviews: 98,
    image: "/images/image_4.png",
    images: ["/images/image_4.png", "/images/image_21.png", "/images/image_18.png"],
    colors: [
      { name: "Spider Black", hex: "#1A202C" },
    ],
    sizes: [7.5, 8.5, 9.5, 10.5, 11.5],
    description: "An edgy spin on a global legend, the Air Force Spider features custom graphic details and a striking silhouette that ensures you stand out from the crowd.",
    features: [
      "Custom graphic accents on the quarter panels.",
      "Supple leather overlays for support and visual depth.",
      "Foam midsole provides responsive spring and cushion."
    ]
  },
  {
    id: 4,
    title: "Nike Air Max",
    category: "Running",
    color: "2 COLORS AVAILABLE",
    price: "$144.98",
    rating: 4.5,
    reviews: 156,
    image: "/images/image_16.png",
    images: ["/images/image_16.png", "/images/image_15.png", "/images/image_12.png"],
    colors: [
      { name: "Cyber Neon", hex: "#CCFF00" },
      { name: "Gunmetal Gray", hex: "#4A5568" },
    ],
    sizes: [7, 8, 9, 10, 11],
    description: "Engineered for maximum endurance and performance, the Nike Air Max features open-mesh paneling for high breathability and an upgraded bubble cushioning system.",
    features: [
      "Engineered mesh upper conforms to your foot for support.",
      "Large-volume Air unit delivers smooth heel-to-toe transitions.",
      "Flex grooves in the sole allow your foot to move naturally."
    ]
  },
  {
    id: 5,
    title: "Nike Running Shoes",
    category: "Running",
    color: "3 COLORS AVAILABLE",
    price: "$129.99",
    rating: 4.4,
    reviews: 142,
    image: "/images/image_15.png",
    images: ["/images/image_15.png", "/images/image_16.png", "/images/image_13.png"],
    colors: [
      { name: "Aqua Teal", hex: "#319795" },
      { name: "Sunset Orange", hex: "#DD6B20" },
      { name: "All Black", hex: "#1A202C" },
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "Built for daily miles, the Nike Running Shoes offer a soft, cushioned feel underfoot. A lightweight upper keeps things breathable, while reliable traction keeps you moving forward.",
    features: [
      "Breathable textile upper helps keep feet cool.",
      "Soft foam midsole absorbs impact on pavements.",
      "Full rubber outsole delivers durable grip."
    ]
  },
  {
    id: 6,
    title: "Nike Sport Edition",
    category: "Training",
    color: "2 COLORS AVAILABLE",
    price: "$139.99",
    rating: 4.6,
    reviews: 178,
    image: "/images/image_19.png",
    images: ["/images/image_19.png", "/images/image_18.png", "/images/image_20.png"],
    colors: [
      { name: "Electric Blue", hex: "#3182CE" },
      { name: "Volt Green", hex: "#48BB78" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description: "Designed for high-intensity training, this sport edition shoe offers lateral stability, superior arch support, and lightweight traction for dynamic movements.",
    features: [
      "Lateral outriggers keep your foot secure during cuts.",
      "Lightweight foam provides high energy return.",
      "Strap closure system locks in the midfoot."
    ]
  },
  {
    id: 7,
    title: "Nike Air Force Elite",
    category: "Lifestyle",
    color: "1 COLOR AVAILABLE",
    price: "$149.99",
    rating: 4.7,
    reviews: 165,
    image: "/images/image_10.png",
    images: ["/images/image_10.png", "/images/image_21.png", "/images/image_18.png"],
    colors: [
      { name: "Desert Sand", hex: "#EDF2F7" },
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "An elevated premium model, the Air Force Elite utilizes hand-selected nubuck leather and customized hardware detailing for the ultimate lifestyle expression.",
    features: [
      "Soft premium nubuck leather panels.",
      "Perforations on the toe box enhance breathability.",
      "Custom lace lock detail adds high-end refinement."
    ]
  },
  {
    id: 8,
    title: "Nike Free Run",
    category: "Running",
    color: "2 COLORS AVAILABLE",
    price: "$124.99",
    rating: 4.4,
    reviews: 134,
    image: "/images/image_7.png",
    images: ["/images/image_7.png", "/images/image_13.png", "/images/image_15.png"],
    colors: [
      { name: "Neon Lime", hex: "#A0AEC0" },
      { name: "Midnight Navy", hex: "#2B6CB0" },
    ],
    sizes: [7, 8, 9, 10, 11],
    description: "A sock-like fit that feels like running barefoot. The Nike Free Run features a highly flexible sole that expands and contracts with every strike, allowing natural foot mechanics.",
    features: [
      "Flyknit-like stretch upper holds your foot securely.",
      "Laser-cut grooves in the sole enable 360-degree flexibility.",
      "Super lightweight design decreases leg fatigue."
    ]
  },
  {
    id: 9,
    title: "Nike Air Jordan",
    category: "Basketball",
    color: "1 COLOR AVAILABLE",
    price: "$119.99",
    rating: 4.8,
    reviews: 112,
    image: "/images/image_14.png",
    images: ["/images/image_14.png", "/images/image_21.png", "/images/image_18.png"],
    colors: [
      { name: "Gym Red/Black", hex: "#C53030" },
    ],
    sizes: [8, 9, 10, 11, 12, 13],
    description: "Pay homage to court heritage. The Nike Air Jordan combines premium basketball structure with a high-top design that delivers exceptional ankle support and unmatched street credit.",
    features: [
      "High-top padded ankle support.",
      "Stitched rubber cupsole construction.",
      "Circular pivot traction pattern on the outsole."
    ]
  },
  {
    id: 10,
    title: "Nike Pegasus 41",
    category: "Running",
    color: "2 COLORS AVAILABLE",
    price: "$139.99",
    rating: 4.6,
    reviews: 184,
    image: "/images/image_200.png",
    images: ["/images/image_200.png", "/images/image_21.png", "/images/image_18.png"],
    colors: [
      { name: "Volt Lime", hex: "#CCFF00" },
      { name: "Classic White", hex: "#FFFFFF" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description: "Meet the Nike Pegasus 41. Responsive cushioning in the Pegasus provides an energized ride for everyday road running. Experience lighter-weight energy return with dual Air Zoom units.",
    features: [
      "Dual Air Zoom units in the heel and forefoot.",
      "Engineered mesh upper reduces weight and increases breathability.",
      "Waffle-inspired rubber outsole provides durable traction."
    ]
  },
  {
    id: 11,
    title: "Nike Invincible 3",
    category: "Running",
    color: "1 COLOR AVAILABLE",
    price: "$179.99",
    rating: 4.7,
    reviews: 110,
    image: "/images/image_2 (7).png",
    images: ["/images/image_2 (7).png", "/images/image_15.png", "/images/image_13.png"],
    colors: [
      { name: "Electric Blue", hex: "#3182CE" },
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "With maximum cushioning to support every mile, the Nike Invincible 3 gives you our highest level of comfort underfoot. Its plush ZoomX foam helps you stay on your feet today, tomorrow and beyond.",
    features: [
      "Nike ZoomX foam cushioning is responsive and lightweight.",
      "Evolved Flyknit upper zones provide breathability where your foot heats up most.",
      "Wider midsole offers more stability than the previous version."
    ]
  },
  {
    id: 12,
    title: "Nike Court Legacy",
    category: "Lifestyle",
    color: "2 COLORS AVAILABLE",
    price: "$99.99",
    rating: 4.4,
    reviews: 92,
    image: "/images/image_21.png",
    images: ["/images/image_21.png", "/images/image_20.png", "/images/image_18.png"],
    colors: [
      { name: "Midnight Navy", hex: "#1A365D" },
      { name: "Summit White", hex: "#EDF2F7" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description: "Honoring a history rooted in tennis culture, the Nike Court Legacy blends classic style with a modern, street-worthy design. Made with crisp leather and heritage stitching, it bridges sport and fashion.",
    features: [
      "Crisp leather upper is easy to clean and style.",
      "Full-length rubber outsole with herringbone traction pattern.",
      "Plush foam insole delivers lightweight cushioning."
    ]
  },
  {
    id: 13,
    title: "Nike Jordan 4 Retro",
    category: "Basketball",
    color: "1 COLOR AVAILABLE",
    price: "$209.99",
    rating: 4.9,
    reviews: 204,
    image: "/images/AIR+JORDAN+4+RETRO.avif",
    images: ["/images/AIR+JORDAN+4+RETRO.avif", "/images/AIR+JORDAN+4+RETRO (1).avif", "/images/AIR+JORDAN+4+RETRO (2).avif"],
    colors: [
      { name: "University Blue", hex: "#63B3ED" },
    ],
    sizes: [8, 9, 10, 11, 12, 13],
    description: "One of the most coveted retro profiles. The Air Jordan 4 Retro delivers lightweight cushioning with breathable mesh panels and signature wings to lock in your laces.",
    features: [
      "Premium full-grain leather and nubuck upper panels.",
      "Visible Air-Sole unit in the heel for responsive impact absorption.",
      "Modified rubber herringbone outsole for historic multi-directional traction."
    ]
  },
  {
    id: 14,
    title: "Nike Wildhorse 10",
    category: "Running",
    color: "1 COLOR AVAILABLE",
    price: "$149.99",
    rating: 4.7,
    reviews: 86,
    image: "/images/NIKE+REACTX+WILDHORSE+10.avif",
    images: ["/images/NIKE+REACTX+WILDHORSE+10.avif", "/images/NIKE+REACTX+WILDHORSE+10 (1).avif", "/images/NIKE+REACTX+WILDHORSE+10 (2).avif"],
    colors: [
      { name: "Canyon Trail Orange", hex: "#DD6B20" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description: "Run technical trails with absolute cushioning. The Nike ReactX Wildhorse 10 features a dual-density reactive midsole with an integrated rock plate to shield your stride.",
    features: [
      "ReactX foam midsole offers premium energy return.",
      "High-abrasion mesh upper shields against dirt and debris.",
      "Lugged rubber outsole grips loose dirt, gravel, and mud easily."
    ]
  },
  {
    id: 15,
    title: "Nike Vapor 17 Elite",
    category: "Training",
    color: "1 COLOR AVAILABLE",
    price: "$259.99",
    rating: 4.8,
    reviews: 142,
    image: "/images/VAPOR+17+ELITE+FG+T.avif",
    images: ["/images/VAPOR+17+ELITE+FG+T.avif", "/images/ZM+SUPERFLY+11+ELITE+FG+T.avif", "/images/image_17.png"],
    colors: [
      { name: "Volt Green", hex: "#CCFF00" },
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "Built for elite athletic acceleration. The Vapor 17 Elite features aerodynamically positioned blades on a lightweight frame for explosive velocity shifts.",
    features: [
      "Ultralight Flyknit upper wraps your foot like a second skin.",
      "Sparsely placed firm-ground blades deliver quick takeoff grip.",
      "Aerodynamic upper textures optimize ball touch during sprints."
    ]
  },
  {
    id: 16,
    title: "Nike Air Max 90 Premium",
    category: "Running",
    color: "2 COLORS AVAILABLE",
    price: "$159.99",
    rating: 4.6,
    reviews: 118,
    image: "/images/AIR+MAX+90+PRM.avif",
    images: ["/images/AIR+MAX+90+PRM.avif", "/images/AIR+MAX+90.avif", "/images/AIR+MAX+90+SE.avif"],
    colors: [
      { name: "Midnight Obsidian", hex: "#1A202C" },
      { name: "Summit Gray", hex: "#718096" }
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "An upscale iteration of the legendary running profile. Stitched heavy-duty suede overlays and premium leather paneling redefine a street-style masterpiece.",
    features: [
      "Textured premium suede panels for structured support.",
      "Max Air cushioning in the heel delivers signature walking comfort.",
      "Rubber Waffle outsole offers historic running traction."
    ]
  },
  {
    id: 17,
    title: "Nike ACG Ultrafly",
    category: "Running",
    color: "1 COLOR AVAILABLE",
    price: "$219.99",
    rating: 4.7,
    reviews: 64,
    image: "/images/NIKE+ACG+ULTRAFLY+TRAIL.avif",
    images: ["/images/NIKE+ACG+ULTRAFLY+TRAIL.avif", "/images/NIKE+ACG+ULTRAFLY+TRAIL (1).avif", "/images/NIKE+ACG+ULTRAFLY+TRAIL (2).avif"],
    colors: [
      { name: "Volt Lime/Teal", hex: "#319795" },
    ],
    sizes: [8, 9, 10, 11, 12],
    description: "Nike All Conditions Gear engineered for ultimate off-road racing. The ACG Ultrafly embeds a carbon-fiber flyplate inside a responsive ZoomX core to maximize mountain speed.",
    features: [
      "Carbon-fiber flyplate yields high-efficiency forward momentum.",
      "Vibram rubber outsole with traction lugs yields excellent wet grip.",
      "Vaporweave wrapping provides durable weather protection."
    ]
  },
  {
    id: 18,
    title: "Nike Superfly 11 Elite",
    category: "Training",
    color: "1 COLOR AVAILABLE",
    price: "$269.99",
    rating: 4.8,
    reviews: 95,
    image: "/images/ZM+SUPERFLY+11+ELITE+FG+T.avif",
    images: ["/images/ZM+SUPERFLY+11+ELITE+FG+T.avif", "/images/ZM+SUPERFLY+11+ELITE+FG+T (1).avif", "/images/VAPOR+17+ELITE+FG+T.avif"],
    colors: [
      { name: "Varsity Crimson", hex: "#E53E3E" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description: "Designed for track-level response and explosive multi-directional cuts. Features lightweight matrix fiber upper weaving and specialized springy Zoom plates.",
    features: [
      "Specialized Zoom fiber plates deliver immediate springback action.",
      "Ultralight matrix structure minimizes drag on speed runs.",
      "Molded traction studs provide optimal grip on firm artificial pitches."
    ]
  }
];
