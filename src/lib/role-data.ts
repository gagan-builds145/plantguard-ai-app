/**
 * PlantGuard AI — role demo content.
 *
 * Everything in this file is purpose-written sample content used by the role
 * prototypes (Home Grower, Seller, Vehicle Owner, Labour, Scientist). It is the
 * same data you see labelled "Demo data" in the UI, so screens look realistic
 * without presenting invented statistics as real market information.
 */

/** Unsplash photo helper — every ID below was verified to resolve. */
export const photo = (id: string, width = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=60`;

export const DEMO_NOTE =
  "Demo data — sample content for the PlantGuard AI prototype.";

export const IMG = {
  monstera: photo("1485955900006-10f4d324d411"),
  leafy: photo("1509423350716-97f9360b4e09"),
  herbs: photo("1512428813834-c702c7702b78"),
  shop: photo("1518843875459-f738682238a6"),
  watering: photo("1533038590840-1cde6e668a91"),
  vegetables: photo("1585320806297-9794b3e4eeae"),
  tomatoes: photo("1558618666-fcd25c85cd64"),
  tools: photo("1518977676601-b53f82aba655"),
  greenhouse: photo("1466692476868-aef1dfb1e735"),
  seedling: photo("1464226184884-fa280b87c399"),
  growing: photo("1526304640581-d334cdbbf45e"),
  parcels: photo("1586528116311-ad8dd3c8310d"),
  market: photo("1560472354-b33ff0c44a43"),
  tractor: photo("1592982537447-7440770cbfc9"),
  seeds: photo("1595246140625-573b715d11dc"),
  finance: photo("1554224155-6726b3ff858f"),
  nursery: photo("1416879595882-3373a0480b5b"),
  spraying: photo("1523348837708-15d4a09cfac2"),
  farmMarket: photo("1542838132-92c53300491e"),
  field: photo("1574943320219-553eb213f72d"),
  lab: photo("1532187863486-abf9dbad1b69"),
  labScope: photo("1581093588401-fbb62a02f120"),
  labSample: photo("1576091160399-112ba8d25d1d"),
  logistics: photo("1566576912321-d58ddd7a6088"),
  packages: photo("1607346256330-dee7af15f7c5"),
  tractorVillage: photo("1553413077-190dd305871c"),
  avatarAnanya: photo("1494790108377-be9c29b29330", 200),
  avatarRahul: photo("1500648767791-00dcc994a43e", 200),
  avatarMeera: photo("1534528741775-53994a69daeb", 200),
  avatarArun: photo("1507003211169-0a1dd7228f2d", 200),
  avatarKavya: photo("1517841905240-472988babdf9", 200),
  avatarIshaan: photo("1502685104226-ee32379fefbe", 200),
  avatarPriya: photo("1544005313-94ddf0286df2", 200),
  avatarDevan: photo("1506794778202-cad84cf45f1d", 200),
  avatarFarah: photo("1547425260-76bcadfb4f2c", 200),
  avatarNikhil: photo("1531123897727-8f129e1688ce", 200),
};

/* ------------------------------------------------------------------ *
 * HOME GROWER
 * ------------------------------------------------------------------ */

export const GROWER_SPACES = [
  "Balcony",
  "Terrace",
  "Backyard",
  "Garden",
  "Indoor",
  "Kitchen garden",
  "Community garden",
];

export const GROWER_INTERESTS = [
  "Indoor plants",
  "Flowering plants",
  "Succulents",
  "Herbs",
  "Vegetables",
  "Medicinal plants",
  "Bonsai",
  "Fruit plants",
];

export type GrowerHealth = "Healthy" | "Needs Attention" | "Check Soon";

export type GrowerPlant = {
  id: string;
  name: string;
  variety: string;
  image: string;
  health: GrowerHealth;
  lastChecked: string;
  watering: string;
  light: string;
  soil: string;
  tip: string;
};

export const GROWER_PLANTS: GrowerPlant[] = [
  {
    id: "monstera",
    name: "Monstera",
    variety: "Monstera deliciosa",
    image: IMG.monstera,
    health: "Healthy",
    lastChecked: "Today",
    watering: "Water in 2 days",
    light: "Bright, indirect light",
    soil: "Well-draining potting mix",
    tip: "Rotate the pot weekly so the leaves grow evenly.",
  },
  {
    id: "rose",
    name: "Rose",
    variety: "Rosa × hybrida",
    image: IMG.leafy,
    health: "Needs Attention",
    lastChecked: "Yesterday",
    watering: "Water today",
    light: "Morning sun, afternoon shade",
    soil: "Loamy soil with compost",
    tip: "Remove faded blooms to encourage fresh buds.",
  },
  {
    id: "basil",
    name: "Basil",
    variety: "Ocimum basilicum",
    image: IMG.herbs,
    health: "Healthy",
    lastChecked: "3 days ago",
    watering: "Water tomorrow",
    light: "5–6 hours of sun",
    soil: "Moist, well-drained mix",
    tip: "Pinch the top leaves to keep the plant bushy.",
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    variety: "Dracaena trifasciata",
    image: IMG.shop,
    health: "Healthy",
    lastChecked: "4 days ago",
    watering: "Water in 6 days",
    light: "Tolerates low light",
    soil: "Cactus mix",
    tip: "Let the soil dry completely between waterings.",
  },
  {
    id: "tomato-pot",
    name: "Cherry Tomato",
    variety: "Solanum lycopersicum",
    image: IMG.tomatoes,
    health: "Check Soon",
    lastChecked: "6 days ago",
    watering: "Water today",
    light: "Full sun",
    soil: "Rich compost mix",
    tip: "Support the stem with a stake as it grows.",
  },
  {
    id: "succulent",
    name: "Echeveria",
    variety: "Echeveria elegans",
    image: IMG.growing,
    health: "Healthy",
    lastChecked: "Today",
    watering: "Water in 9 days",
    light: "Bright light",
    soil: "Gritty succulent mix",
    tip: "Water the soil, never the rosette, to avoid rot.",
  },
];

export const GROWER_CATEGORIES = [
  { key: "indoor", label: "Indoor Plants", icon: "🏠", image: IMG.monstera },
  { key: "balcony", label: "Balcony Gardening", icon: "🌇", image: IMG.growing },
  { key: "terrace", label: "Terrace Gardening", icon: "🏙️", image: IMG.leafy },
  { key: "flowers", label: "Flowers", icon: "🌸", image: IMG.shop },
  { key: "herbs", label: "Herbs", icon: "🌿", image: IMG.herbs },
  { key: "vegetables", label: "Vegetables", icon: "🥕", image: IMG.vegetables },
  { key: "succulents", label: "Succulents", icon: "🌵", image: IMG.growing },
  { key: "medicinal", label: "Medicinal Plants", icon: "🍃", image: IMG.leafy },
  { key: "care", label: "Plant Care", icon: "💧", image: IMG.watering },
  { key: "ideas", label: "Gardening Ideas", icon: "💡", image: IMG.tools },
];

export type GrowerPost = {
  id: string;
  author: string;
  avatar: string;
  location: string;
  image: string;
  caption: string;
  plant: string;
  likes: number;
  comments: number;
  saves: number;
  timeAgo: string;
  following: boolean;
};

export const GROWER_FEED: GrowerPost[] = [
  {
    id: "p1",
    author: "Ananya",
    avatar: IMG.avatarAnanya,
    location: "Bengaluru",
    image: IMG.monstera,
    caption: "My monstera finally grew a new leaf! 🌱",
    plant: "Monstera",
    likes: 128,
    comments: 14,
    saves: 22,
    timeAgo: "2h ago",
    following: true,
  },
  {
    id: "p2",
    author: "Rahul",
    avatar: IMG.avatarRahul,
    location: "Pune",
    image: IMG.herbs,
    caption: "First herb harvest from the balcony — basil and mint.",
    plant: "Herb garden",
    likes: 96,
    comments: 11,
    saves: 18,
    timeAgo: "4h ago",
    following: false,
  },
  {
    id: "p3",
    author: "Meera",
    avatar: IMG.avatarMeera,
    location: "Mysuru",
    image: IMG.vegetables,
    caption: "Terrace vegetables are ready earlier than last season.",
    plant: "Mixed vegetables",
    likes: 214,
    comments: 27,
    saves: 41,
    timeAgo: "Yesterday",
    following: true,
  },
  {
    id: "p4",
    author: "Arun",
    avatar: IMG.avatarArun,
    location: "Chennai",
    image: IMG.shop,
    caption: "Repotted my snake plant today — roots were very healthy.",
    plant: "Snake Plant",
    likes: 74,
    comments: 8,
    saves: 12,
    timeAgo: "Yesterday",
    following: false,
  },
  {
    id: "p5",
    author: "Kavya",
    avatar: IMG.avatarKavya,
    location: "Hyderabad",
    image: IMG.growing,
    caption: "Succulent tray update after three weeks of neglect 💚",
    plant: "Echeveria",
    likes: 152,
    comments: 19,
    saves: 30,
    timeAgo: "2 days ago",
    following: false,
  },
  {
    id: "p6",
    author: "Ishaan",
    avatar: IMG.avatarIshaan,
    location: "Kochi",
    image: IMG.watering,
    caption: "Rainy week, so I skipped watering entirely. Plants are happy.",
    plant: "Mixed indoor plants",
    likes: 88,
    comments: 9,
    saves: 15,
    timeAgo: "3 days ago",
    following: true,
  },
];

export type GrowerTip = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
};

export const GROWER_TIPS: GrowerTip[] = [
  {
    id: "t1",
    title: "Watering rules that work in humid weather",
    category: "Plant Care",
    readTime: "4 min read",
    image: IMG.watering,
  },
  {
    id: "t2",
    title: "Reading light in a balcony through the day",
    category: "Balcony Gardening",
    readTime: "6 min read",
    image: IMG.growing,
  },
  {
    id: "t3",
    title: "Repotting without shocking the plant",
    category: "Plant Care",
    readTime: "5 min read",
    image: IMG.shop,
  },
  {
    id: "t4",
    title: "Starting a herb box in a small space",
    category: "Herbs",
    readTime: "3 min read",
    image: IMG.herbs,
  },
  {
    id: "t5",
    title: "Six vegetables that thrive on a terrace",
    category: "Vegetables",
    readTime: "7 min read",
    image: IMG.vegetables,
  },
  {
    id: "t6",
    title: "Preventing fungus on indoor leaves",
    category: "Plant Health",
    readTime: "5 min read",
    image: IMG.leafy,
  },
];

export const GROWER_COMMUNITIES = [
  { id: "c1", name: "Bengaluru Balcony Growers", members: "2,480", distance: "1.2 km" },
  { id: "c2", name: "Terrace Garden Collective", members: "1,760", distance: "3.8 km" },
  { id: "c3", name: "Indoor Plant Parents", members: "5,120", distance: "6.0 km" },
  { id: "c4", name: "Organic Kitchen Gardens", members: "980", distance: "9.4 km" },
];

export type GrowerReminder = {
  id: string;
  type: string;
  plant: string;
  when: string;
  tone: "today" | "upcoming" | "done";
};

export const GROWER_REMINDER_TYPES = [
  "Water Plant",
  "Fertilize",
  "Repot",
  "Prune",
  "Check Plant Health",
  "Move Plant",
  "Clean Leaves",
];

export const GROWER_REMINDERS: GrowerReminder[] = [
  { id: "r1", type: "Water Plant", plant: "Monstera", when: "Today · 6:00 PM", tone: "today" },
  { id: "r2", type: "Check Plant Health", plant: "Cherry Tomato", when: "Today · 7:00 PM", tone: "today" },
  { id: "r3", type: "Water Plant", plant: "Rose", when: "Tomorrow · 7:30 AM", tone: "upcoming" },
  { id: "r4", type: "Fertilize", plant: "Basil", when: "Tomorrow · 5:00 PM", tone: "upcoming" },
  { id: "r5", type: "Clean Leaves", plant: "Snake Plant", when: "Saturday · 10:00 AM", tone: "upcoming" },
  { id: "r6", type: "Repot", plant: "Echeveria", when: "Sunday · 9:00 AM", tone: "upcoming" },
  { id: "r7", type: "Prune", plant: "Rose", when: "Next week · Tuesday", tone: "upcoming" },
  { id: "r8", type: "Move Plant", plant: "Monstera", when: "Completed yesterday", tone: "done" },
];

export const GROWER_SHOP_CATEGORIES = [
  "Plants",
  "Seeds",
  "Pots",
  "Soil",
  "Fertilizers",
  "Gardening Tools",
  "Organic Products",
];

export type GrowerProduct = {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  availability: string;
  image: string;
  organic?: boolean;
};

export const GROWER_SHOP: GrowerProduct[] = [
  { id: "g1", name: "Monstera Deliciosa", seller: "GreenNest Nursery", category: "Plants", price: 649, unit: "per plant", rating: 4.8, reviews: 212, availability: "In stock", image: IMG.monstera },
  { id: "g2", name: "Cherry Tomato Seeds", seller: "Sahaja Seeds", category: "Seeds", price: 120, unit: "per pack", rating: 4.6, reviews: 486, availability: "In stock", image: IMG.seeds, organic: true },
  { id: "g3", name: "Terracotta Pot 8 in", seller: "ClayCraft", category: "Pots", price: 240, unit: "each", rating: 4.5, reviews: 154, availability: "In stock", image: IMG.tools },
  { id: "g4", name: "Cocopeat Potting Mix", seller: "SoilWorks", category: "Soil", price: 310, unit: "per 5 kg", rating: 4.7, reviews: 320, availability: "In stock", image: IMG.growing, organic: true },
  { id: "g5", name: "Organic Vermicompost", seller: "SoilWorks", category: "Fertilizers", price: 260, unit: "per 5 kg", rating: 4.6, reviews: 198, availability: "Low stock", image: IMG.growing, organic: true },
  { id: "g6", name: "Hand Trowel & Fork Set", seller: "FarmKit", category: "Gardening Tools", price: 420, unit: "per set", rating: 4.4, reviews: 96, availability: "In stock", image: IMG.tools },
  { id: "g7", name: "Basil Live Plant", seller: "HerbHouse", category: "Plants", price: 180, unit: "per plant", rating: 4.7, reviews: 268, availability: "In stock", image: IMG.herbs },
  { id: "g8", name: "Neem Oil Spray", seller: "BioCare", category: "Organic Products", price: 340, unit: "per 500 ml", rating: 4.5, reviews: 143, availability: "In stock", image: IMG.spraying, organic: true },
  { id: "g9", name: "Echeveria Succulent", seller: "GreenNest Nursery", category: "Plants", price: 220, unit: "per plant", rating: 4.6, reviews: 132, availability: "In stock", image: IMG.growing },
  { id: "g10", name: "Marigold Seed Mix", seller: "Sahaja Seeds", category: "Seeds", price: 90, unit: "per pack", rating: 4.3, reviews: 205, availability: "In stock", image: IMG.seeds },
  { id: "g11", name: "Watering Can 2 L", seller: "FarmKit", category: "Gardening Tools", price: 380, unit: "each", rating: 4.4, reviews: 88, availability: "Out of stock", image: IMG.watering },
  { id: "g12", name: "Self-Watering Planter", seller: "ClayCraft", category: "Pots", price: 560, unit: "each", rating: 4.6, reviews: 117, availability: "In stock", image: IMG.shop },
];

export const GROWER_CARE_GUIDES = [
  {
    key: "water",
    title: "Watering",
    summary: "Check the top 2 cm of soil before watering — most houseplants prefer slightly dry soil over wet roots.",
    icon: "💧",
  },
  {
    key: "light",
    title: "Light",
    summary: "Leafy tropicals want bright indirect light; flowering and fruiting plants need direct sun for part of the day.",
    icon: "☀️",
  },
  {
    key: "soil",
    title: "Soil & nutrients",
    summary: "Loosen the top soil monthly and feed lightly during the growing season instead of all year.",
    icon: "🪴",
  },
  {
    key: "pests",
    title: "Pests & disease",
    summary: "Inspect the underside of leaves weekly — catching pests early avoids most treatment.",
    icon: "🐛",
  },
  {
    key: "repot",
    title: "Repotting",
    summary: "Move up one pot size when roots circle the base or water runs straight through.",
    icon: "📦",
  },
  {
    key: "air",
    title: "Air & humidity",
    summary: "Group plants together to raise humidity, and keep them away from direct air-conditioning.",
    icon: "🌬️",
  },
];

/* ------------------------------------------------------------------ *
 * SELLER
 * ------------------------------------------------------------------ */

export const SELLER_CATEGORIES = [
  "Plants",
  "Seeds",
  "Saplings",
  "Flower Plants",
  "Fruit Plants",
  "Vegetable Plants",
  "Fertilizers",
  "Pesticides",
  "Plant Pots",
  "Soil/Growing Media",
  "Gardening Supplies",
  "Organic Products",
  "Agricultural Products",
  "Other",
];

export const SELLER_BUSINESS_TYPES = [
  "Retail shop",
  "Nursery / garden centre",
  "Wholesale supplier",
  "Online store",
  "Agri-input dealer",
  "Seed supplier",
];

export const SELLER_ORDER_STATUSES = [
  "All",
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type SellerOrderStatus =
  | "New"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type SellerOrder = {
  id: string;
  customer: string;
  product: string;
  quantity: string;
  date: string;
  status: SellerOrderStatus;
};

export const SELLER_ORDERS: SellerOrder[] = [
  { id: "PG-2481", customer: "Ananya Rao", product: "Monstera Deliciosa", quantity: "2", date: "Today", status: "New" },
  { id: "PG-2480", customer: "Rahul Menon", product: "Cherry Tomato Seeds", quantity: "10 packs", date: "Today", status: "New" },
  { id: "PG-2478", customer: "Meera Iyer", product: "Cocopeat Potting Mix", quantity: "6 bags", date: "Yesterday", status: "Processing" },
  { id: "PG-2475", customer: "GreenLeaf Cafe", product: "Basil Live Plant", quantity: "24", date: "Yesterday", status: "Processing" },
  { id: "PG-2471", customer: "Arun Kumar", product: "Terracotta Pot 8 in", quantity: "8", date: "2 days ago", status: "Shipped" },
  { id: "PG-2468", customer: "Kavya Reddy", product: "Echeveria Succulent", quantity: "4", date: "3 days ago", status: "Shipped" },
  { id: "PG-2462", customer: "Sunrise School", product: "Marigold Seed Mix", quantity: "50 packs", date: "5 days ago", status: "Delivered" },
  { id: "PG-2459", customer: "Ishaan Nair", product: "Neem Oil Spray", quantity: "2", date: "6 days ago", status: "Delivered" },
  { id: "PG-2455", customer: "Priya Sharma", product: "Self-Watering Planter", quantity: "3", date: "1 week ago", status: "Delivered" },
  { id: "PG-2450", customer: "Devan Pillai", product: "Watering Can 2 L", quantity: "1", date: "1 week ago", status: "Cancelled" },
];

export type SellerProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  visibility: "Published" | "Draft";
  image: string;
};

export const SELLER_PRODUCTS: SellerProduct[] = [
  { id: "sp1", name: "Monstera Deliciosa", category: "Plants", price: 649, stock: 42, status: "In Stock", visibility: "Published", image: IMG.monstera },
  { id: "sp2", name: "Cherry Tomato Seeds", category: "Seeds", price: 120, stock: 8, status: "Low Stock", visibility: "Published", image: IMG.seeds },
  { id: "sp3", name: "Terracotta Pot 8 in", category: "Plant Pots", price: 240, stock: 126, status: "In Stock", visibility: "Published", image: IMG.tools },
  { id: "sp4", name: "Cocopeat Potting Mix", category: "Soil/Growing Media", price: 310, stock: 64, status: "In Stock", visibility: "Published", image: IMG.growing },
  { id: "sp5", name: "Organic Vermicompost", category: "Fertilizers", price: 260, stock: 12, status: "Low Stock", visibility: "Published", image: IMG.growing },
  { id: "sp6", name: "Basil Live Plant", category: "Plants", price: 180, stock: 0, status: "Out of Stock", visibility: "Published", image: IMG.herbs },
  { id: "sp7", name: "Neem Oil Spray", category: "Organic Products", price: 340, stock: 38, status: "In Stock", visibility: "Published", image: IMG.spraying },
  { id: "sp8", name: "Mango Sapling (Grafted)", category: "Fruit Plants", price: 480, stock: 21, status: "In Stock", visibility: "Published", image: IMG.nursery },
  { id: "sp9", name: "Marigold Seed Mix", category: "Seeds", price: 90, stock: 204, status: "In Stock", visibility: "Draft", image: IMG.seeds },
  { id: "sp10", name: "Drip Irrigation Starter Kit", category: "Agricultural Products", price: 1850, stock: 6, status: "Low Stock", visibility: "Published", image: IMG.field },
];

export type SellerCustomer = {
  id: string;
  name: string;
  location: string;
  orders: number;
  lastActivity: string;
  type: "Retail" | "Wholesale" | "Institution";
};

export const SELLER_CUSTOMERS: SellerCustomer[] = [
  { id: "sc1", name: "Ananya Rao", location: "Bengaluru, Karnataka", orders: 14, lastActivity: "Today", type: "Retail" },
  { id: "sc2", name: "GreenLeaf Cafe", location: "Bengaluru, Karnataka", orders: 9, lastActivity: "Yesterday", type: "Wholesale" },
  { id: "sc3", name: "Sunrise School", location: "Mysuru, Karnataka", orders: 4, lastActivity: "5 days ago", type: "Institution" },
  { id: "sc4", name: "Rahul Menon", location: "Pune, Maharashtra", orders: 7, lastActivity: "Today", type: "Retail" },
  { id: "sc5", name: "Meera Iyer", location: "Coimbatore, Tamil Nadu", orders: 11, lastActivity: "Yesterday", type: "Retail" },
  { id: "sc6", name: "FarmFresh Collective", location: "Nashik, Maharashtra", orders: 22, lastActivity: "3 days ago", type: "Wholesale" },
  { id: "sc7", name: "Kavya Reddy", location: "Hyderabad, Telangana", orders: 5, lastActivity: "3 days ago", type: "Retail" },
  { id: "sc8", name: "City Park Trust", location: "Chennai, Tamil Nadu", orders: 6, lastActivity: "1 week ago", type: "Institution" },
];

export type SalesPoint = { label: string; sales: number; orders: number };

export const SELLER_SALES_SERIES: Record<
  "7d" | "30d" | "3m" | "1y",
  SalesPoint[]
> = {
  "7d": [
    { label: "Mon", sales: 6400, orders: 9 },
    { label: "Tue", sales: 8100, orders: 12 },
    { label: "Wed", sales: 7300, orders: 10 },
    { label: "Thu", sales: 9600, orders: 15 },
    { label: "Fri", sales: 11400, orders: 18 },
    { label: "Sat", sales: 14200, orders: 24 },
    { label: "Sun", sales: 12800, orders: 21 },
  ],
  "30d": [
    { label: "Week 1", sales: 48200, orders: 68 },
    { label: "Week 2", sales: 52400, orders: 74 },
    { label: "Week 3", sales: 61900, orders: 88 },
    { label: "Week 4", sales: 57400, orders: 81 },
  ],
  "3m": [
    { label: "Month 1", sales: 186400, orders: 262 },
    { label: "Month 2", sales: 208900, orders: 291 },
    { label: "Month 3", sales: 231700, orders: 318 },
  ],
  "1y": [
    { label: "Q1", sales: 512000, orders: 720 },
    { label: "Q2", sales: 604000, orders: 848 },
    { label: "Q3", sales: 571000, orders: 802 },
    { label: "Q4", sales: 688000, orders: 964 },
  ],
};

export const SELLER_STATS = [
  { key: "orders", label: "Orders", value: "124", note: "Last 30 days" },
  { key: "products", label: "Products", value: "48", note: "18 categories" },
  { key: "inventory", label: "Inventory", value: "Good", note: "6 low-stock items" },
  { key: "customers", label: "Customers", value: "1,284", note: "42 this month" },
];

export const SELLER_TRENDING = [
  { label: "Indoor plants", change: 18, note: "Steady demand" },
  { label: "Organic fertilizers", change: 14, note: "Growing locally" },
  { label: "Vegetable seeds", change: 11, note: "Season start" },
  { label: "Grafted fruit saplings", change: 9, note: "Planting season" },
  { label: "Drip irrigation kits", change: 6, note: "Summer prep" },
];

export const SELLER_CATEGORY_SHARE = [
  { label: "Plants", value: 34 },
  { label: "Seeds", value: 21 },
  { label: "Pots & media", value: 18 },
  { label: "Fertilizers", value: 15 },
  { label: "Tools", value: 12 },
];

export const SELLER_INVENTORY_MOVEMENT = [
  { label: "Added", value: 186 },
  { label: "Sold", value: 142 },
  { label: "Returned", value: 9 },
  { label: "Damaged", value: 6 },
];

export const SELLER_MARKETPLACE_LISTINGS = [
  { id: "m1", title: "Bulk Monstera — 40 plants", seller: "GreenNest Nursery", price: "₹480 / plant", location: "Bengaluru", image: IMG.monstera },
  { id: "m2", title: "Cocopeat blocks — 500 kg", seller: "SoilWorks", price: "₹18 / kg", location: "Coimbatore", image: IMG.growing },
  { id: "m3", title: "Marigold seedlings — trays", seller: "Bloom Farm", price: "₹9 / seedling", location: "Pune", image: IMG.seeds },
  { id: "m4", title: "Vermicompost — monthly supply", seller: "SoilWorks", price: "₹22 / kg", location: "Nashik", image: IMG.field },
];

export const SELLER_FINANCE = [
  {
    key: "loans",
    title: "Business Loans",
    summary: "Working capital for seeds, stock and seasonal buying.",
    points: ["Tenure up to 36 months", "Seasonal repayment options", "Collateral-free tiers available"],
  },
  {
    key: "capital",
    title: "Working Capital",
    summary: "Short-term credit that moves with your order cycle.",
    points: ["Limit based on monthly sales", "Draw only what you need", "Interest on used amount"],
  },
  {
    key: "equipment",
    title: "Equipment Financing",
    summary: "Fund greenhouses, irrigation, cold storage and delivery vehicles.",
    points: ["Up to 80% of equipment cost", "Quarterly repayment plans", "Subsidy-linked options"],
  },
  {
    key: "services",
    title: "Financial Services",
    summary: "Payments, invoicing and settlement support for agri sellers.",
    points: ["Fast settlements", "Digital invoices", "Order-linked receipts"],
  },
];

export const SELLER_INSURANCE = [
  {
    key: "business",
    title: "Business Insurance",
    summary: "Cover for your shop, godown and business interruption.",
    points: ["Fire and natural events", "Business interruption cover", "Optional employee cover"],
  },
  {
    key: "inventory",
    title: "Inventory Protection",
    summary: "Protect stored stock including plants, seeds and growing media.",
    points: ["Theft and damage cover", "Perishable stock options", "Seasonal sum insured"],
  },
  {
    key: "equipment",
    title: "Equipment Protection",
    summary: "Cover for irrigation systems, tools, and delivery vehicles.",
    points: ["Breakdown and damage", "Theft cover", "Replacement support"],
  },
  {
    key: "seller",
    title: "Seller Protection",
    summary: "Guards against order disputes, returns and logistics losses.",
    points: ["Return shipping cover", "Dispute assistance", "Transit cover"],
  },
];

/* ------------------------------------------------------------------ *
 * VEHICLE OWNER + shared vehicle details options
 * ------------------------------------------------------------------ */

export const VEHICLE_TYPES = [
  "Tractor",
  "Tractor with Trailer",
  "Water Tanker",
  "Irrigation Vehicle",
  "Mini Truck",
  "Pickup Truck",
  "Harvester",
  "Power Tiller",
  "Agricultural Utility Vehicle",
  "Other",
];

export const VEHICLE_SERVICES = [
  "Water Supply",
  "Irrigation",
  "Agricultural Transport",
  "Field Preparation",
  "Harvesting Support",
  "Crop Transport",
  "Equipment Transport",
  "Nursery Support",
  "Other",
];

export const VEHICLE_CAPACITY_WATER = [
  "1,000 L",
  "2,000 L",
  "5,000 L",
  "10,000 L",
  "15,000 L",
  "20,000+ L",
  "Custom",
];

export const VEHICLE_CAPACITY_TRANSPORT = [
  "Under 1 Ton",
  "1–2 Tons",
  "2–5 Tons",
  "5–10 Tons",
  "10+ Tons",
  "Custom",
];

export const VEHICLE_CAPACITY_NOT_APPLICABLE = "Not Applicable";

export const VEHICLE_AVAILABILITY = [
  "Full Time",
  "Part Time",
  "Seasonal",
  "On Demand",
];

export const SERVICE_RADIUS_OPTIONS = ["5 km", "10 km", "20 km", "30 km", "50+ km"];

export const MANUFACTURING_YEARS = Array.from(
  { length: 31 },
  (_, index) => String(new Date().getFullYear() - index),
);

export type VehicleDraft = {
  id: string;
  types: string[];
  registration: string;
  brand: string;
  model: string;
  year: string;
  capacity: string;
  capacityKind: "water" | "transport" | "na";
  services: string[];
  area: { city: string; district: string; state: string; radius: string };
  availability: string;
  image: string;
};

export const emptyVehicleDraft = (): VehicleDraft => ({
  id: "",
  types: [],
  registration: "",
  brand: "",
  model: "",
  year: "",
  capacity: "",
  capacityKind: "na",
  services: [],
  area: { city: "", district: "", state: "", radius: "20 km" },
  availability: "",
  image: "",
});

export const VEHICLE_DEMO_FLEET: VehicleDraft[] = [
  {
    id: "v1",
    types: ["Tractor", "Tractor with Trailer"],
    registration: "KA 01 AB 1234",
    brand: "Mahindra",
    model: "575 DI",
    year: "2024",
    capacity: "2–5 Tons",
    capacityKind: "transport",
    services: ["Field Preparation", "Agricultural Transport", "Harvesting Support"],
    area: { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", radius: "20 km" },
    availability: "Full Time",
    image: IMG.tractor,
  },
  {
    id: "v2",
    types: ["Water Tanker"],
    registration: "KA 05 CD 7788",
    brand: "Ashok Leyland",
    model: "Ecomet 1615",
    year: "2023",
    capacity: "10,000 L",
    capacityKind: "water",
    services: ["Water Supply", "Irrigation", "Nursery Support"],
    area: { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", radius: "30 km" },
    availability: "Seasonal",
    image: IMG.tractorVillage,
  },
];

export const VEHICLE_SERVICE_TYPES = [
  "Water Supply",
  "Irrigation",
  "Agricultural Transport",
  "Field Preparation",
  "Harvesting Support",
  "Crop Transport",
  "Equipment Transport",
];

export type ServiceRequest = {
  id: string;
  serviceType: string;
  requester: string;
  requesterType: string;
  location: string;
  distanceKm: number;
  etaMinutes: number;
  description: string;
  requestedFor: string;
  status: "New" | "Accepted" | "Declined" | "Completed";
  vehicleFit: string[];
  crop?: string;
};

export const VEHICLE_REQUESTS: ServiceRequest[] = [
  {
    id: "REQ-1042",
    serviceType: "Water Supply",
    requester: "Ravi Kumar",
    requesterType: "Farmer · 4 acres",
    location: "Doddaballapur, Bengaluru Rural",
    distanceKm: 6.2,
    etaMinutes: 18,
    description: "Two tanker loads for the tomato block before noon.",
    requestedFor: "Today · 11:00 AM",
    status: "New",
    vehicleFit: ["Water Tanker"],
    crop: "Tomato",
  },
  {
    id: "REQ-1039",
    serviceType: "Field Preparation",
    requester: "Suresh Patil",
    requesterType: "Farmer · 6 acres",
    location: "Hoskote, Bengaluru Rural",
    distanceKm: 11.4,
    etaMinutes: 32,
    description: "Deep ploughing plus rotavator pass for the ragi field.",
    requestedFor: "Tomorrow · 7:00 AM",
    status: "New",
    vehicleFit: ["Tractor", "Tractor with Trailer"],
    crop: "Ragi",
  },
  {
    id: "REQ-1036",
    serviceType: "Crop Transport",
    requester: "Lakshmi Devi",
    requesterType: "Farmer · 2 acres",
    location: "Nelamangala, Bengaluru Rural",
    distanceKm: 18.9,
    etaMinutes: 44,
    description: "Transport 40 crates of vegetables to the mandi yard.",
    requestedFor: "Tomorrow · 5:30 AM",
    status: "New",
    vehicleFit: ["Mini Truck", "Pickup Truck"],
    crop: "Vegetables",
  },
  {
    id: "REQ-1031",
    serviceType: "Irrigation",
    requester: "Anil Gowda",
    requesterType: "Farmer · 3 acres",
    location: "Devanahalli, Bengaluru Rural",
    distanceKm: 24.1,
    etaMinutes: 52,
    description: "Sprinkler support for the nursery beds.",
    requestedFor: "Today · 4:00 PM",
    status: "Accepted",
    vehicleFit: ["Irrigation Vehicle", "Water Tanker"],
    crop: "Nursery stock",
  },
];

export type ServiceHistoryItem = {
  id: string;
  serviceType: string;
  date: string;
  location: string;
  status: "Completed" | "Cancelled";
  vehicle: string;
};

export const VEHICLE_HISTORY: ServiceHistoryItem[] = [
  { id: "SV-8841", serviceType: "Water Supply", date: "28 Sep 2026", location: "Doddaballapur", status: "Completed", vehicle: "KA 05 CD 7788" },
  { id: "SV-8834", serviceType: "Field Preparation", date: "26 Sep 2026", location: "Hoskote", status: "Completed", vehicle: "KA 01 AB 1234" },
  { id: "SV-8829", serviceType: "Agricultural Transport", date: "24 Sep 2026", location: "Nelamangala", status: "Completed", vehicle: "KA 01 AB 1234" },
  { id: "SV-8817", serviceType: "Irrigation", date: "21 Sep 2026", location: "Devanahalli", status: "Completed", vehicle: "KA 05 CD 7788" },
  { id: "SV-8806", serviceType: "Harvesting Support", date: "19 Sep 2026", location: "Doddaballapur", status: "Completed", vehicle: "KA 01 AB 1234" },
  { id: "SV-8798", serviceType: "Crop Transport", date: "16 Sep 2026", location: "Bengaluru Rural", status: "Cancelled", vehicle: "KA 01 AB 1234" },
  { id: "SV-8790", serviceType: "Water Supply", date: "14 Sep 2026", location: "Hoskote", status: "Completed", vehicle: "KA 05 CD 7788" },
  { id: "SV-8781", serviceType: "Equipment Transport", date: "11 Sep 2026", location: "Nelamangala", status: "Completed", vehicle: "KA 01 AB 1234" },
];

export const VEHICLE_INSURANCE = [
  {
    key: "vehicle",
    title: "Vehicle Insurance",
    summary: "Comprehensive cover for tractors, tankers and transport vehicles.",
    points: ["Own damage cover", "Third-party liability", "Add-on for attached implements"],
  },
  {
    key: "accident",
    title: "Accident Protection",
    summary: "Personal accident cover for the driver and helpers.",
    points: ["Accidental death cover", "Hospitalisation support", "Daily allowance option"],
  },
  {
    key: "agri",
    title: "Agricultural Vehicle Protection",
    summary: "Cover designed for machines used only during farm seasons.",
    points: ["Seasonal cover options", "Implement damage cover", "Off-road usage covered"],
  },
];

/* ------------------------------------------------------------------ *
 * LABOUR
 * ------------------------------------------------------------------ */

export const LABOUR_SKILLS = [
  "Planting",
  "Harvesting",
  "Weeding",
  "Irrigation",
  "Spraying",
  "Pruning",
  "Field Preparation",
  "Nursery Work",
  "Crop Maintenance",
  "Post-Harvest Work",
  "Loading/Unloading",
  "Agricultural Transport",
];

export const LABOUR_EQUIPMENT = [
  "Tractor",
  "Power Tiller",
  "Sprayer",
  "Water Pump",
  "Irrigation Equipment",
  "Harvester",
  "Thresher",
  "Cultivator",
  "Plough",
  "Seed Drill",
  "Agricultural Machinery",
];

export const LABOUR_EXPERIENCE_LEVELS = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

export const LABOUR_CROP_EXPERIENCE = [
  "Rice",
  "Wheat",
  "Maize",
  "Millets",
  "Pulses",
  "Vegetables",
  "Fruits",
  "Flowers",
  "Sugarcane",
  "Cotton",
  "Spices",
  "Plantation crops",
];

export type LabourJob = {
  id: string;
  workType: string;
  location: string;
  distanceKm: number;
  date: string;
  time: string;
  skills: string[];
  crop: string;
  description: string;
  duration: string;
  postedBy: string;
  status: "New" | "Accepted" | "Declined";
};

export const LABOUR_JOBS: LabourJob[] = [
  {
    id: "JOB-3320",
    workType: "Weeding Work",
    location: "Bengaluru, Karnataka",
    distanceKm: 2.4,
    date: "Tomorrow",
    time: "7:00 AM – 12:00 PM",
    skills: ["Weeding", "Crop Maintenance"],
    crop: "Ragi",
    description: "Manual weeding between rows across one acre.",
    duration: "About 5 hours",
    postedBy: "Ravi Kumar",
    status: "New",
  },
  {
    id: "JOB-3316",
    workType: "Harvesting Support",
    location: "Hoskote, Karnataka",
    distanceKm: 8.1,
    date: "Tomorrow",
    time: "6:30 AM – 1:00 PM",
    skills: ["Harvesting", "Loading/Unloading"],
    crop: "Tomato",
    description: "Harvest and crate tomatoes for transport.",
    duration: "About 6 hours",
    postedBy: "Suresh Patil",
    status: "New",
  },
  {
    id: "JOB-3309",
    workType: "Nursery Work",
    location: "Devanahalli, Karnataka",
    distanceKm: 12.6,
    date: "Saturday",
    time: "8:00 AM – 3:00 PM",
    skills: ["Nursery Work", "Planting"],
    crop: "Vegetable seedlings",
    description: "Fill trays and shift seedlings to the hardening area.",
    duration: "About 7 hours",
    postedBy: "GreenNest Nursery",
    status: "New",
  },
  {
    id: "JOB-3302",
    workType: "Spraying",
    location: "Nelamangala, Karnataka",
    distanceKm: 15.3,
    date: "Sunday",
    time: "6:00 AM – 10:00 AM",
    skills: ["Spraying", "Crop Maintenance"],
    crop: "Grapes",
    description: "Assist with scheduled spray rounds; safety gear provided.",
    duration: "About 4 hours",
    postedBy: "Anil Gowda",
    status: "New",
  },
  {
    id: "JOB-3298",
    workType: "Irrigation Support",
    location: "Doddaballapur, Karnataka",
    distanceKm: 18.7,
    date: "Monday",
    time: "5:30 AM – 11:00 AM",
    skills: ["Irrigation", "Field Preparation"],
    crop: "Vegetables",
    description: "Lay and adjust drip lines before the watering cycle.",
    duration: "About 5 hours",
    postedBy: "Lakshmi Devi",
    status: "New",
  },
  {
    id: "JOB-3291",
    workType: "Post-Harvest Work",
    location: "Anekal, Karnataka",
    distanceKm: 22.4,
    date: "Tuesday",
    time: "9:00 AM – 4:00 PM",
    skills: ["Post-Harvest Work", "Loading/Unloading"],
    crop: "Millets",
    description: "Cleaning, grading and bagging harvested millet.",
    duration: "About 7 hours",
    postedBy: "FarmFresh Collective",
    status: "New",
  },
];

export const LABOUR_UPCOMING = [
  {
    id: "JOB-3288",
    workType: "Planting",
    date: "Wed · 7:00 AM",
    location: "Hoskote, Karnataka",
    crop: "Tomato",
    status: "Confirmed",
  },
  {
    id: "JOB-3284",
    workType: "Weeding Work",
    date: "Sat · 6:30 AM",
    location: "Anekal, Karnataka",
    crop: "Ragi",
    status: "Confirmed",
  },
  {
    id: "JOB-3279",
    workType: "Nursery Work",
    date: "Next Mon · 8:00 AM",
    location: "Devanahalli, Karnataka",
    crop: "Flower seedlings",
    status: "Awaiting confirmation",
  },
];

export type LabourHistoryItem = {
  id: string;
  workType: string;
  date: string;
  location: string;
  crop: string;
  status: "Completed" | "Cancelled";
};

export const LABOUR_HISTORY: LabourHistoryItem[] = [
  { id: "W-2210", workType: "Harvesting Support", date: "29 Sep 2026", location: "Hoskote", crop: "Tomato", status: "Completed" },
  { id: "W-2204", workType: "Weeding Work", date: "27 Sep 2026", location: "Bengaluru", crop: "Ragi", status: "Completed" },
  { id: "W-2198", workType: "Irrigation Support", date: "25 Sep 2026", location: "Doddaballapur", crop: "Vegetables", status: "Completed" },
  { id: "W-2190", workType: "Nursery Work", date: "23 Sep 2026", location: "Devanahalli", crop: "Seedlings", status: "Completed" },
  { id: "W-2184", workType: "Planting", date: "20 Sep 2026", location: "Anekal", crop: "Millets", status: "Completed" },
  { id: "W-2177", workType: "Spraying", date: "18 Sep 2026", location: "Nelamangala", crop: "Grapes", status: "Cancelled" },
  { id: "W-2170", workType: "Post-Harvest Work", date: "15 Sep 2026", location: "Anekal", crop: "Millets", status: "Completed" },
];

export const LABOUR_INSURANCE = [
  {
    key: "life",
    title: "Life Insurance",
    summary: "Cover for your family with affordable rural plan options.",
    points: ["Term cover options", "Low yearly premium", "Nominee support"],
  },
  {
    key: "health",
    title: "Health Insurance",
    summary: "Hospitalisation cover for you and your family.",
    points: ["Cashless hospitals", "Day-care procedures", "Family floater option"],
  },
  {
    key: "accident",
    title: "Accident Protection",
    summary: "Personal accident cover for agricultural work injuries.",
    points: ["Accident cover", "Hospitalisation support", "Disability benefits"],
  },
];

/* ------------------------------------------------------------------ *
 * SCIENTIST
 * ------------------------------------------------------------------ */

/**
 * Shown on every AI output a researcher sees. Prototype model output only —
 * never a confirmed diagnosis or a substitute for laboratory verification.
 */
export const SCIENTIST_AI_DISCLAIMER =
  "AI analysis is advisory only. Results come from a prototype model and must be verified against laboratory testing or an extension officer's diagnosis before use in research or practice. Do not use these outputs for treatment decisions.";

export const SCIENTIST_SPECIALIZATIONS = [
  "Plant Pathology",
  "Crop Science",
  "Plant Biotechnology",
  "Soil Science",
  "Plant Genetics",
  "Precision Agriculture",
  "Crop Protection",
  "Agricultural AI",
];

export const SCIENTIST_DEPARTMENTS = [
  "Plant Pathology",
  "Crop Physiology",
  "Agronomy",
  "Plant Biotechnology",
  "Soil Science",
  "Agricultural Engineering",
];

export const SCIENTIST_RESEARCH_INTERESTS = [
  "Plant disease detection",
  "Computer vision",
  "Crop health datasets",
  "Plant pathology",
  "Climate-resilient crops",
  "Precision agriculture",
  "Plant genetics",
  "Soil health",
];

export const SCIENTIST_LIBRARY_CATEGORIES = [
  "Plant Pathology",
  "Crop Science",
  "Plant Disease",
  "Agricultural AI",
  "Computer Vision",
  "Plant Biotechnology",
  "Soil Science",
  "Precision Agriculture",
  "Plant Genetics",
  "Crop Protection",
];

export type ResearchProject = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Analysis" | "Review" | "Archived";
  updated: string;
  analyses: number;
  collaborators: number;
};

export const SCIENTIST_PROJECTS: ResearchProject[] = [
  {
    id: "pr1",
    name: "Tomato Disease Classification",
    description: "Classifying early blight and leaf spot from field images.",
    status: "Active",
    updated: "Today",
    analyses: 412,
    collaborators: 4,
  },
  {
    id: "pr2",
    name: "Crop Health Dataset",
    description: "Curating a balanced multi-crop health image dataset.",
    status: "Analysis",
    updated: "Yesterday",
    analyses: 268,
    collaborators: 3,
  },
  {
    id: "pr3",
    name: "Plant Pathology Study",
    description: "Comparing symptom patterns across tomato and chilli.",
    status: "Review",
    updated: "3 days ago",
    analyses: 154,
    collaborators: 5,
  },
  {
    id: "pr4",
    name: "Soil Nutrient Deficiency Signatures",
    description: "Visual signatures of common nutrient deficiencies.",
    status: "Active",
    updated: "1 week ago",
    analyses: 96,
    collaborators: 2,
  },
];

export type Dataset = {
  id: string;
  name: string;
  images: number;
  plants: string;
  diseases: string;
  updated: string;
  status: "Ready" | "Processing" | "Needs review";
};

export const SCIENTIST_DATASETS: Dataset[] = [
  { id: "ds1", name: "Tomato Leaf Health v3", images: 4820, plants: "Tomato", diseases: "Early blight, Leaf spot, Healthy", updated: "Today", status: "Ready" },
  { id: "ds2", name: "Chilli Symptom Set", images: 2140, plants: "Chilli", diseases: "Leaf curl, Leaf spot", updated: "Yesterday", status: "Processing" },
  { id: "ds3", name: "Cereal Crop Health", images: 6310, plants: "Rice, Wheat, Maize", diseases: "Rust, Blast, Healthy", updated: "4 days ago", status: "Ready" },
  { id: "ds4", name: "Nutrient Deficiency Signs", images: 1180, plants: "Sugarcane, Cotton", diseases: "Deficiency classes", updated: "1 week ago", status: "Needs review" },
  { id: "ds5", name: "Field Condition Survey", images: 3260, plants: "Mixed", diseases: "Unlabelled", updated: "2 weeks ago", status: "Ready" },
];

export const SCIENTIST_HISTORY = [
  { id: "an1", image: IMG.tomatoes, plant: "Tomato", result: "Possible Early Blight", confidence: 92, date: "Today", project: "Tomato Disease Classification" },
  { id: "an2", image: IMG.leafy, plant: "Chilli", result: "Possible Leaf Spot", confidence: 78, date: "Yesterday", project: "Plant Pathology Study" },
  { id: "an3", image: IMG.field, plant: "Rice", result: "Healthy", confidence: 94, date: "Yesterday", project: "Crop Health Dataset" },
  { id: "an4", image: IMG.growing, plant: "Sugarcane", result: "Possible Nutrient Deficiency", confidence: 68, date: "2 days ago", project: "Nutrient Deficiency Signs" },
  { id: "an5", image: IMG.shop, plant: "Cotton", result: "Possible Leaf Rust", confidence: 84, date: "3 days ago", project: "Cereal Crop Health" },
  { id: "an6", image: IMG.herbs, plant: "Basil", result: "Healthy", confidence: 91, date: "4 days ago", project: "Crop Health Dataset" },
  { id: "an7", image: IMG.vegetables, plant: "Brinjal", result: "Needs better image", confidence: 61, date: "5 days ago", project: "Plant Pathology Study" },
  { id: "an8", image: IMG.monstera, plant: "Tomato", result: "Possible Early Blight", confidence: 87, date: "1 week ago", project: "Tomato Disease Classification" },
];

export const SCIENTIST_COLLABORATORS = [
  { id: "col1", name: "Dr. Priya Nair", role: "Plant Pathologist", institution: "ICAR-IIHR", projects: 3, shared: 42, avatar: IMG.avatarPriya },
  { id: "col2", name: "Dr. Devan Pillai", role: "Agri AI Researcher", institution: "IIT Madras", projects: 2, shared: 31, avatar: IMG.avatarDevan },
  { id: "col3", name: "Dr. Farah Siddiqui", role: "Crop Scientist", institution: "UAS Bengaluru", projects: 2, shared: 18, avatar: IMG.avatarFarah },
  { id: "col4", name: "Nikhil Verma", role: "Research Assistant", institution: "ICAR-IIHR", projects: 1, shared: 12, avatar: IMG.avatarNikhil },
];

export const SCIENTIST_SHARED_ANALYSES = [
  { id: "sh1", title: "Tomato — Early Blight sample set", by: "Dr. Priya Nair", date: "Today", items: 24 },
  { id: "sh2", title: "Chilli leaf curl progression", by: "Dr. Farah Siddiqui", date: "Yesterday", items: 16 },
  { id: "sh3", title: "Rice blast vs healthy comparison", by: "Nikhil Verma", date: "3 days ago", items: 32 },
];

export const SCIENTIST_SHARED_DATASETS = [
  { id: "sd1", name: "Tomato Leaf Health v3", by: "Dr. Priya Nair", images: 4820 },
  { id: "sd2", name: "Cereal Crop Health", by: "Dr. Farhan Ali", images: 6310 },
  { id: "sd3", name: "Nutrient Deficiency Signs", by: "Dr. Farah Siddiqui", images: 1180 },
];

export type LibraryResource = {
  id: string;
  title: string;
  category: string;
  source: string;
  year: string;
  type: "Review" | "Dataset" | "Guide" | "Paper";
  saved?: boolean;
};

export const SCIENTIST_LIBRARY: LibraryResource[] = [
  { id: "l1", title: "Early blight identification in tomato: visual markers", category: "Plant Pathology", source: "Plant Health Review", year: "2025", type: "Review", saved: true },
  { id: "l2", title: "Field imaging standards for crop disease datasets", category: "Computer Vision", source: "AgriVision Notes", year: "2026", type: "Guide" },
  { id: "l3", title: "Leaf spot vs nutrient deficiency: a comparison", category: "Plant Disease", source: "Crop Science Digest", year: "2024", type: "Paper" },
  { id: "l4", title: "Benchmark imagery for rice blast detection", category: "Agricultural AI", source: "Open Agri Datasets", year: "2026", type: "Dataset" },
  { id: "l5", title: "Soil health indicators from canopy imagery", category: "Soil Science", source: "Soil Letters", year: "2025", type: "Review" },
  { id: "l6", title: "Tissue culture and disease-free planting material", category: "Plant Biotechnology", source: "BioAgri Review", year: "2024", type: "Paper" },
  { id: "l7", title: "Variable rate spraying with vision models", category: "Precision Agriculture", source: "Field Systems", year: "2026", type: "Guide" },
  { id: "l8", title: "Marker-assisted selection for disease resistance", category: "Plant Genetics", source: "Genome Crops", year: "2023", type: "Paper" },
  { id: "l9", title: "Integrated pest management decision trees", category: "Crop Protection", source: "Protection Handbook", year: "2025", type: "Guide", saved: true },
  { id: "l10", title: "Yield response to balanced nutrient plans", category: "Crop Science", source: "Agronomy Today", year: "2024", type: "Review" },
  { id: "l11", title: "Label noise in plant disease image sets", category: "Agricultural AI", source: "AgriVision Notes", year: "2026", type: "Paper" },
  { id: "l12", title: "Leaf anatomy reference for symptom scoring", category: "Plant Pathology", source: "Plant Health Review", year: "2023", type: "Dataset" },
];

export const SCIENTIST_DISEASE_TRENDS = [
  { label: "Early blight", value: 42 },
  { label: "Leaf spot", value: 28 },
  { label: "Leaf rust", value: 19 },
  { label: "Nutrient deficiency", value: 14 },
  { label: "Healthy", value: 61 },
];

export const SCIENTIST_VOLUME_SERIES = [
  { label: "Mon", analyses: 18 },
  { label: "Tue", analyses: 24 },
  { label: "Wed", analyses: 21 },
  { label: "Thu", analyses: 32 },
  { label: "Fri", analyses: 28 },
  { label: "Sat", analyses: 14 },
  { label: "Sun", analyses: 9 },
];

export const SCIENTIST_PLANT_CATEGORIES = [
  { label: "Tomato", value: 38 },
  { label: "Chilli", value: 22 },
  { label: "Rice", value: 18 },
  { label: "Cotton", value: 12 },
  { label: "Sugarcane", value: 10 },
];

export const SCIENTIST_OBSERVATIONS = [
  "Early blight samples are most frequent in the current dataset.",
  "Leaf spot images are often captured under uneven lighting.",
  "Nutrient deficiency cases are the most commonly mislabelled.",
  "Confidence above 90% correlates with single-leaf, plain-background images.",
];
