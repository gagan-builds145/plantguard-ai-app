import {
  Banknote,
  BadgeIndianRupee,
  Bug,
  CloudSun,
  Coins,
  Droplets,
  FlaskConical,
  Leaf,
  type LucideIcon,
  Package,
  ShieldCheck,
  Sprout,
  Tractor,
  TrendingUp,
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
};

/** Sample, purpose-written farmer offers — not live commercial data. */
export const FARMER_OFFERS: Offer[] = [
  {
    key: "scheme",
    category: "Government Scheme",
    title: "PM-KISAN income support",
    description:
      "Check whether your land holding qualifies and complete your e-KYC before the next cycle.",
    cta: "View scheme details",
    icon: BadgeIndianRupee,
  },
  {
    key: "insurance",
    category: "Crop Insurance",
    title: "Kharif crop cover window",
    description:
      "Seasonal crop insurance can be applied through your nearest CSC or bank branch.",
    cta: "How to apply",
    icon: ShieldCheck,
  },
  {
    key: "seeds",
    category: "Seeds",
    title: "Certified seed catalogues",
    description:
      "Compare certified varieties suited to your district's soil and rainfall pattern.",
    cta: "Browse catalogues",
    icon: Wheat,
  },
  {
    key: "finance",
    category: "Financial Services",
    title: "Kisan Credit Card review",
    description:
      "Review working capital options for seeds, fertiliser and equipment costs.",
    cta: "Learn more",
    icon: Coins,
  },
  {
    key: "pesticides",
    category: "Agricultural Inputs",
    title: "Integrated pest management",
    description:
      "Practical, lower-chemical guidance for common pests in your selected crops.",
    cta: "Read guidance",
    icon: FlaskConical,
  },
  {
    key: "market",
    category: "Market",
    title: "Local mandi price trends",
    description:
      "Understand recent price direction for your crops before you plan the sale.",
    cta: "See trends",
    icon: TrendingUp,
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
