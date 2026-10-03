import {
  Banknote,
  BadgeCheck,
  BadgeIndianRupee,
  Boxes,
  Bug,
  ClipboardList,
  CloudSun,
  Coins,
  Droplets,
  FlaskConical,
  Flower2,
  Leaf,
  type LucideIcon,
  Megaphone,
  Microscope,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Tractor,
  TrendingUp,
  Truck,
  Users,
  Wheat,
} from "lucide-react";

export type HealthStatus =
  | "healthy"
  | "attention"
  | "disease"
  | "inconclusive";

export const HEALTH_META: Record<
  HealthStatus,
  { label: string; badge: string; dot: string; text: string }
> = {
  healthy: {
    label: "Healthy",
    badge: "bg-success-bg text-success border-transparent",
    dot: "bg-success",
    text: "text-success",
  },
  attention: {
    label: "Needs Attention",
    badge: "bg-warning-bg text-[#8a5a00] border-transparent",
    dot: "bg-warning",
    text: "text-[#8a5a00]",
  },
  disease: {
    label: "Disease Detected",
    badge: "bg-danger-bg text-danger border-transparent",
    dot: "bg-danger",
    text: "text-danger",
  },
  inconclusive: {
    label: "Needs Better Image",
    badge: "bg-info-bg text-info border-transparent",
    dot: "bg-info",
    text: "text-info",
  },
};

/* ------------------------------------------------------------------ *
 * Farmer onboarding options
 * ------------------------------------------------------------------ */

export const CROP_GROUPS: { group: string; crops: string[] }[] = [
  {
    group: "Food Crops",
    crops: [
      "Rice",
      "Wheat",
      "Maize",
      "Millets",
      "Pulses",
      "Vegetables",
      "Fruits",
      "Spices",
      "Other",
    ],
  },
  {
    group: "Commercial / Industrial",
    crops: ["Cotton", "Sugarcane", "Tobacco", "Rubber", "Jute", "Oilseeds", "Other"],
  },
  {
    group: "Flowers",
    crops: ["Rose", "Jasmine", "Marigold", "Chrysanthemum", "Lotus", "Other"],
  },
];

export const ALL_CROPS = CROP_GROUPS.flatMap((g) => g.crops);

export const FARM_SIZES = [
  "Less than 1 acre",
  "1–2 acres",
  "2–5 acres",
  "5–10 acres",
  "More than 10 acres",
];

export const FARMING_TYPES = [
  "Organic",
  "Conventional",
  "Natural",
  "Mixed",
  "Other",
];

export const FARMER_HELP_OPTIONS = [
  "Plant Disease Detection",
  "Crop Care",
  "Weather",
  "Irrigation",
  "Fertilizers",
  "Pesticides",
  "Seeds",
  "Government Schemes",
  "Crop Insurance",
  "Financial Services",
  "Labour",
  "Agricultural Equipment",
];

/* ------------------------------------------------------------------ *
 * Location + language
 * ------------------------------------------------------------------ */

export const LOCATIONS: Record<string, Record<string, string[]>> = {
  India: {
    Karnataka: ["Bengaluru", "Mysuru", "Belagavi", "Hubballi", "Tumakuru"],
    Maharashtra: ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Warangal"],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur"],
    Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  },
  Bangladesh: {
    Dhaka: ["Dhaka", "Gazipur", "Narayanganj"],
    Khulna: ["Khulna", "Jessore"],
    Rajshahi: ["Rajshahi", "Bogura"],
  },
  "Sri Lanka": {
    Western: ["Colombo", "Negombo", "Gampaha"],
    Central: ["Kandy", "Matale"],
    Southern: ["Galle", "Matara"],
  },
  Kenya: {
    Nairobi: ["Nairobi", "Ruiru"],
    Kisumu: ["Kisumu", "Kakamega"],
    Nakuru: ["Nakuru", "Naivasha"],
  },
  Nigeria: {
    Lagos: ["Lagos", "Ikeja"],
    Kano: ["Kano", "Kaduna"],
    Oyo: ["Ibadan", "Ogbomosho"],
  },
};

export const LANGUAGES: { code: string; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "sw", label: "Swahili", native: "Kiswahili" },
];

/* ------------------------------------------------------------------ *
 * Farm services + offers
 * ------------------------------------------------------------------ */

export type FarmService = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const FARM_SERVICES: FarmService[] = [
  {
    key: "water",
    label: "Water Supply",
    description: "Book a water tanker to your field",
    icon: Droplets,
  },
  {
    key: "irrigation",
    label: "Irrigation",
    description: "Irrigation vehicles and equipment",
    icon: Sprout,
  },
  {
    key: "vehicle",
    label: "Vehicle Service",
    description: "Tractors, transport and field prep",
    icon: Tractor,
  },
  {
    key: "labour",
    label: "Labour Services",
    description: "Find skilled farm workers nearby",
    icon: Users,
  },
  {
    key: "weather",
    label: "Weather Report",
    description: "Local forecast and advisories",
    icon: CloudSun,
  },
  {
    key: "finance",
    label: "Financial Services",
    description: "Loans, insurance and schemes",
    icon: Banknote,
  },
  {
    key: "seeds",
    label: "Seeds",
    description: "Certified seeds for your crops",
    icon: Wheat,
  },
  {
    key: "fertilizers",
    label: "Fertilizers",
    description: "Soil nutrients and growing media",
    icon: Package,
  },
  {
    key: "pesticides",
    label: "Pesticides",
    description: "Crop protection and pest control",
    icon: Bug,
  },
];

export type Offer = {
  key: string;
  category: string;
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  /** Photo shown on the offer card. */
  image: string;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=60`;

/** Sample, purpose-written farmer offers — not live commercial data. */
export const FARMER_OFFERS: Offer[] = [
  {
    key: "scheme",
    image: unsplash("1592982537447-7440770cbfc9"),
    category: "Government Scheme",
    title: "PM-KISAN income support",
    description:
      "Check whether your land holding qualifies and complete your e-KYC before the next cycle.",
    cta: "View scheme details",
    icon: BadgeIndianRupee,
  },
  {
    key: "insurance",
    image: unsplash("1574943320219-553eb213f72d"),
    category: "Crop Insurance",
    title: "Kharif crop cover window",
    description:
      "Seasonal crop insurance can be applied through your nearest CSC or bank branch.",
    cta: "How to apply",
    icon: ShieldCheck,
  },
  {
    key: "seeds",
    image: unsplash("1595246140625-573b715d11dc"),
    category: "Seeds",
    title: "Certified seed catalogues",
    description:
      "Compare certified varieties suited to your district's soil and rainfall pattern.",
    cta: "Browse catalogues",
    icon: Wheat,
  },
  {
    key: "finance",
    image: unsplash("1554224155-6726b3ff858f"),
    category: "Financial Services",
    title: "Kisan Credit Card review",
    description:
      "Review working capital options for seeds, fertiliser and equipment costs.",
    cta: "Learn more",
    icon: Coins,
  },
  {
    key: "pesticides",
    image: unsplash("1523348837708-15d4a09cfac2"),
    category: "Agricultural Inputs",
    title: "Integrated pest management",
    description:
      "Practical, lower-chemical guidance for common pests in your selected crops.",
    cta: "Read guidance",
    icon: FlaskConical,
  },
  {
    key: "market",
    image: unsplash("1542838132-92c53300491e"),
    category: "Market",
    title: "Local mandi price trends",
    description:
      "Understand recent price direction for your crops before you plan the sale.",
    cta: "See trends",
    icon: TrendingUp,
  },
];

/* ------------------------------------------------------------------ *
 * Nursery workspace options
 * ------------------------------------------------------------------ */

export type WorkspaceRole = "farmer" | "nursery";

export const NURSERY_TYPES = [
  "Retail / Garden centre",
  "Wholesale nursery",
  "Propagation nursery",
  "Landscaping nursery",
  "Plant rental",
  "Other",
];

export const NURSERY_CATEGORY_GROUPS: { group: string; items: string[] }[] = [
  {
    group: "Ornamental & Flowering",
    items: [
      "Indoor plants",
      "Flowering plants",
      "Ornamental foliage",
      "Cacti & succulents",
      "Bonsai & topiary",
    ],
  },
  {
    group: "Fruit & Timber",
    items: [
      "Fruit saplings",
      "Timber saplings",
      "Grafted plants",
      "Rootstock",
    ],
  },
  {
    group: "Field & Plantation",
    items: [
      "Vegetable seedlings",
      "Paddy seedlings",
      "Spice plants",
      "Medicinal plants",
    ],
  },
  {
    group: "Propagation inputs",
    items: [
      "Seeds",
      "Bulbs & tubers",
      "Tissue-culture plants",
      "Other",
    ],
  },
];

export const ALL_NURSERY_CATEGORIES = NURSERY_CATEGORY_GROUPS.flatMap(
  (group) => group.items,
);

export const NURSERY_SCALES = [
  "Under 1,000 plants",
  "1,000–5,000 plants",
  "5,000–25,000 plants",
  "More than 25,000 plants",
];

export const NURSERY_HELP_OPTIONS = [
  "Plant Disease Detection",
  "Stock Health Monitoring",
  "Bulk Order Leads",
  "Delivery & Logistics",
  "Soil & Growing Media",
  "Nursery Supplies",
  "Labour",
  "Licensing & Certification",
  "Financial Services",
  "Marketing & Catalogue",
];

export const NURSERY_SERVICES: FarmService[] = [
  {
    key: "bulk",
    label: "Bulk Order Leads",
    description: "Buyer enquiries for wholesale stock",
    icon: ShoppingCart,
  },
  {
    key: "logistics",
    label: "Delivery & Logistics",
    description: "Move plants and bulk orders safely",
    icon: Truck,
  },
  {
    key: "media",
    label: "Soil & Growing Media",
    description: "Potting mix, cocopeat and nutrients",
    icon: Boxes,
  },
  {
    key: "supplies",
    label: "Nursery Supplies",
    description: "Pots, trays, shade nets and tools",
    icon: Package,
  },
  {
    key: "labour",
    label: "Labour Services",
    description: "Find nursery workers nearby",
    icon: Users,
  },
  {
    key: "certification",
    label: "Licensing & Certification",
    description: "Plant health and export certificates",
    icon: BadgeCheck,
  },
  {
    key: "finance",
    label: "Financial Services",
    description: "Loans, insurance and schemes",
    icon: Banknote,
  },
  {
    key: "marketing",
    label: "Marketing & Catalogue",
    description: "List your stock and reach buyers",
    icon: Megaphone,
  },
  {
    key: "advisory",
    label: "Plant Health Advisory",
    description: "Expert help for stock problems",
    icon: Microscope,
  },
];

/** Sample, purpose-written nursery offers — not live commercial data. */
export const NURSERY_OFFERS: Offer[] = [
  {
    key: "wholesale",
    image: unsplash("1466692476868-aef1dfb1e735"),
    category: "Wholesale",
    title: "Publish your stock catalogue",
    description:
      "List the varieties and quantities you can supply so bulk buyers can find you.",
    cta: "Set up catalogue",
    icon: ClipboardList,
  },
  {
    key: "greenhouse",
    image: unsplash("1416879595882-3373a0480b5b"),
    category: "Government Scheme",
    title: "Protected cultivation subsidy",
    description:
      "Support for greenhouses, shade nets and drip irrigation is available in many states.",
    cta: "Check eligibility",
    icon: Sprout,
  },
  {
    key: "certification",
    image: unsplash("1464226184884-fa280b87c399"),
    category: "Certification",
    title: "Plant health certification",
    description:
      "Phytosanitary certificates can open up inter-state and export orders for your stock.",
    cta: "How to apply",
    icon: BadgeCheck,
  },
  {
    key: "media",
    image: unsplash("1526304640581-d334cdbbf45e"),
    category: "Growing Media",
    title: "Cocopeat & potting mix supply",
    description:
      "Compare bulk prices for growing media without leaving the nursery to source it.",
    cta: "Compare suppliers",
    icon: Boxes,
  },
  {
    key: "logistics",
    image: unsplash("1586528116311-ad8dd3c8310d"),
    category: "Logistics",
    title: "Plant-safe transport",
    description:
      "Book vehicles equipped for live plants, with guidance on packing stock for transit.",
    cta: "Book transport",
    icon: Truck,
  },
  {
    key: "market",
    image: unsplash("1560472354-b33ff0c44a43"),
    category: "Market",
    title: "Seasonal demand trends",
    description:
      "Understand which plant categories buyers are asking for before you propagate.",
    cta: "See trends",
    icon: TrendingUp,
  },
];

export const PRODUCT_UNITS = [
  "per plant",
  "per tray",
  "per bundle",
  "per kg",
  "per lot",
];

export const NURSERY_ICON = Flower2;
export const FARMER_ICON = Wheat;

/** Role card copy used on the onboarding role step. */
export const WORKSPACE_ROLES: {
  role: WorkspaceRole;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    role: "farmer",
    label: "Farmer",
    tagline: "I grow crops in the field",
    description:
      "Disease checks, crop health and farm services for the land you cultivate.",
    icon: Wheat,
  },
  {
    role: "nursery",
    label: "Nursery",
    tagline: "I grow and sell plants",
    description:
      "Stock health, bulk buyers and supplies for a plant nursery or garden centre.",
    icon: Flower2,
  },
];

export const PRODUCT_ICON = Leaf;

/* ------------------------------------------------------------------ *
 * Prototype AI analysis
 * ------------------------------------------------------------------ *
 * Version 1 ships with a deterministic on-device stub so the full flow —
 * upload, analyse, result, save, history — is demonstrable without a
 * trained model endpoint. Results are clearly labelled as prototype output
 * in the UI and are never presented as a confirmed diagnosis.
 * ------------------------------------------------------------------ */

export type ScanResult = {
  plantName: string;
  plantConfidence: number;
  healthStatus: HealthStatus;
  disease?: string;
  diseaseConfidence?: number;
  observations: string[];
  recommendations: string[];
};

const ANALYSIS_LIBRARY: ScanResult[] = [
  {
    plantName: "Tomato",
    plantConfidence: 94,
    healthStatus: "disease",
    disease: "Possible Early Blight (Alternaria solani)",
    diseaseConfidence: 87,
    observations: [
      "Dark brown spots with faint concentric rings on lower leaves",
      "Yellowing around the affected areas",
      "Spots appear concentrated towards the base of the plant",
    ],
    recommendations: [
      "Remove and safely dispose of the most affected lower leaves",
      "Avoid overhead watering so the foliage stays dry",
      "Improve spacing so air can move through the plants",
      "Consult your local agricultural extension officer before spraying",
    ],
  },
  {
    plantName: "Rice",
    plantConfidence: 92,
    healthStatus: "healthy",
    disease: undefined,
    observations: [
      "Leaf colour and blade shape look uniform",
      "No obvious lesions, spots or lesions detected in the frame",
      "Tillering stage appears normal for the crop",
    ],
    recommendations: [
      "Keep monitoring the field every few days",
      "Maintain the recommended water level for this growth stage",
      "Scan again if you notice colour or spot changes",
    ],
  },
  {
    plantName: "Chilli",
    plantConfidence: 89,
    healthStatus: "attention",
    disease: "Possible Leaf Spot",
    diseaseConfidence: 72,
    observations: [
      "Small, scattered circular spots on the leaf surface",
      "Slight leaf curling observed at the edges",
      "Confidence is moderate — a closer photo would help",
    ],
    recommendations: [
      "Photograph a single affected leaf against a plain background",
      "Check the underside of leaves for pests",
      "Monitor whether the spots are spreading over the next few days",
      "Ask an extension officer if spread continues",
    ],
  },
  {
    plantName: "Sugarcane",
    plantConfidence: 88,
    healthStatus: "attention",
    disease: "Possible Nutrient Deficiency",
    diseaseConfidence: 68,
    observations: [
      "Uniform yellowing between the leaf veins",
      "Older leaves affected more than new growth",
      "Pattern is more consistent with a nutrient issue than an infection",
    ],
    recommendations: [
      "Get a soil test before applying additional nutrients",
      "Avoid over-applying nitrogen on assumption",
      "Compare affected and healthy rows for drainage differences",
    ],
  },
  {
    plantName: "Cotton",
    plantConfidence: 90,
    healthStatus: "disease",
    disease: "Possible Leaf Rust",
    diseaseConfidence: 81,
    observations: [
      "Orange-brown powdery pustules on the underside of leaves",
      "Some leaves showing premature drying at the margins",
    ],
    recommendations: [
      "Remove severely affected leaves where practical",
      "Keep the canopy dry and improve airflow between rows",
      "Confirm with a local plant protection expert before treatment",
    ],
  },
  {
    plantName: "Brinjal",
    plantConfidence: 61,
    healthStatus: "inconclusive",
    disease: undefined,
    observations: [
      "Image is slightly blurred, so surface detail is limited",
      "The affected area is not clearly in the frame",
      "The model could not separate disease from natural leaf variation",
    ],
    recommendations: [
      "Retake the photo in even, natural daylight",
      "Center the affected leaf or plant part in the frame",
      "Hold steady and avoid shadow — the leaf should fill most of the image",
    ],
  },
];

/** Deterministic hash so the same image always yields the same result. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function analyzePlantImage(file: {
  name: string;
  size: number;
  lastModified?: number;
}): ScanResult {
  const seed = hashString(
    `${file.name}:${file.size}:${file.lastModified ?? 0}`,
  );
  return ANALYSIS_LIBRARY[seed % ANALYSIS_LIBRARY.length];
}

export const PROTOTYPE_MODEL_NOTE =
  "Prototype model output — not a confirmed diagnosis.";
