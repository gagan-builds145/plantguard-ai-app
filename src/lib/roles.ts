import {
  BarChart3,
  Bell,
  Bookmark,
  Boxes,
  Briefcase,
  CalendarClock,
  ClipboardList,
  Compass,
  Database,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  History,
  Home,
  Landmark,
  LayoutDashboard,
  Library,
  LifeBuoy,
  type LucideIcon,
  MapPinned,
  MapPin,
  Microscope,
  Navigation,
  Package,
  Route,
  ScanLine,
  Settings as SettingsIcon,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Store,
  Truck,
  UserRound,
  Users,
  Users2,
  Wheat,
  Wrench,
} from "lucide-react";

/**
 * The five role experiences added on top of the existing Farmer / Nursery
 * workspaces. Each role keeps the PlantGuard AI shell (brand, typography,
 * cards, buttons, scanner) and swaps only its information architecture.
 */
export type NewRoleId =
  | "home_grower"
  | "seller"
  | "vehicle_owner"
  | "labour"
  | "scientist";

export type RoleId = "farmer" | "nursery" | NewRoleId;

export type NavEntry = {
  key: string;
  label: string;
  to: string;
  icon: LucideIcon;
  /** Visually emphasised item (the core action for that role). */
  emphasized?: boolean;
};

export type RoleMeta = {
  id: NewRoleId;
  /** Full role name, e.g. "Home Grower". */
  label: string;
  /** Short label used on compact UI such as the sidebar workspace chip. */
  short: string;
  emoji: string;
  tagline: string;
  description: string;
  /** Subtle secondary accent — PlantGuard green stays the primary colour. */
  accent: string;
  accentDark: string;
  /** Very light tint of the accent for chips and icon tiles. */
  accentSoft: string;
  /** Route prefix for the role. */
  base: string;
  home: string;
  icon: LucideIcon;
  desktopNav: NavEntry[];
  mobileNav: NavEntry[];
  /** Onboarding help options offered at the end of role setup. */
  helpOptions: string[];
};

export const ROLE_META: Record<NewRoleId, RoleMeta> = {
  home_grower: {
    id: "home_grower",
    label: "Home Grower",
    short: "Home Grower",
    emoji: "🏡",
    tagline: "Grow plants at home, share them, and keep them healthy.",
    description:
      "A plant community, discovery, shopping and AI plant care — built for balconies, terraces, backyards and indoor gardens.",
    accent: "#43A047",
    accentDark: "#2E7D32",
    accentSoft: "#EAF6EA",
    base: "/grower",
    home: "/grower",
    icon: Sprout,
    desktopNav: [
      { key: "home", label: "Home", to: "/grower", icon: Home },
      { key: "feed", label: "Feed", to: "/community", icon: Users2 },
      { key: "discover", label: "Discover", to: "/grower/discover", icon: Compass },
      {
        key: "scan",
        label: "Plant Scanner",
        to: "/grower/scan",
        icon: ScanLine,
      },
      { key: "plants", label: "My Plants", to: "/grower/plants", icon: Sprout },
      { key: "care", label: "Plant Care", to: "/grower/care", icon: ClipboardList },
      {
        key: "reminders",
        label: "Reminders",
        to: "/grower/reminders",
        icon: CalendarClock,
      },
      { key: "shop", label: "Shop", to: "/grower/shop", icon: ShoppingBag },
      { key: "saved", label: "Saved", to: "/grower/saved", icon: Bookmark },
      { key: "profile", label: "Profile", to: "/grower/profile", icon: UserRound },
    ],
    mobileNav: [
      { key: "home", label: "Home", to: "/grower", icon: Home },
      { key: "feed", label: "Feed", to: "/community", icon: Users2 },
      { key: "discover", label: "Discover", to: "/grower/discover", icon: Compass },
      {
        key: "scan",
        label: "Scan",
        to: "/grower/scan",
        icon: ScanLine,
        emphasized: true,
      },
      { key: "shop", label: "Shop", to: "/grower/shop", icon: ShoppingBag },
      { key: "profile", label: "Profile", to: "/grower/profile", icon: UserRound },
    ],
    helpOptions: [
      "Plant Health Checks",
      "Plant Care Reminders",
      "Plant Identification",
      "Buying Plants & Supplies",
      "Community & Tips",
      "Local Plant Events",
    ],
  },

  seller: {
    id: "seller",
    label: "Seller",
    short: "Seller",
    emoji: "🛍️",
    tagline: "Run your plant and agri business from one place.",
    description:
      "Orders, products, inventory, customers and market trends for shops, growers and agri-input sellers.",
    accent: "#00897B",
    accentDark: "#00695C",
    accentSoft: "#E0F2F1",
    base: "/seller",
    home: "/seller",
    icon: Store,
    desktopNav: [
      { key: "home", label: "Dashboard", to: "/seller", icon: LayoutDashboard },
      { key: "feed", label: "Community Feed", to: "/community", icon: Users2 },
      { key: "orders", label: "Orders", to: "/seller/orders", icon: Package },
      { key: "products", label: "Products", to: "/seller/products", icon: ShoppingBag },
      { key: "inventory", label: "Inventory", to: "/seller/inventory", icon: Boxes },
      { key: "customers", label: "Customers", to: "/seller/customers", icon: Users },
      {
        key: "trends",
        label: "Market Trends",
        to: "/seller/trends",
        icon: BarChart3,
      },
      { key: "analytics", label: "Analytics", to: "/seller/analytics", icon: Route },
      { key: "marketplace", label: "Marketplace", to: "/seller/marketplace", icon: Store },
      {
        key: "finance",
        label: "Business Finance",
        to: "/seller/finance",
        icon: Landmark,
      },
      {
        key: "insurance",
        label: "Business Insurance",
        to: "/seller/insurance",
        icon: ShieldCheck,
      },
      { key: "profile", label: "Profile", to: "/seller/profile", icon: UserRound },
    ],
    mobileNav: [
      { key: "home", label: "Home", to: "/seller", icon: Home },
      { key: "feed", label: "Feed", to: "/community", icon: Users2 },
      { key: "orders", label: "Orders", to: "/seller/orders", icon: Package },
      { key: "products", label: "Products", to: "/seller/products", icon: ShoppingBag },
      { key: "analytics", label: "Analytics", to: "/seller/analytics", icon: BarChart3 },
      { key: "profile", label: "Profile", to: "/seller/profile", icon: UserRound },
    ],
    helpOptions: [
      "Orders & Fulfilment",
      "Inventory Planning",
      "Product Listings",
      "Market Trends",
      "Business Finance",
      "Business Insurance",
      "Customer Support",
    ],
  },

  vehicle_owner: {
    id: "vehicle_owner",
    label: "Vehicle Owner",
    short: "Vehicle Owner",
    emoji: "🚚",
    tagline: "Offer your tractor, tanker or transport to nearby farms.",
    description:
      "Go online, accept agricultural service requests, navigate to the field and track every completed job.",
    accent: "#1565C0",
    accentDark: "#0D47A1",
    accentSoft: "#E3F0FB",
    base: "/vehicle",
    home: "/vehicle",
    icon: Truck,
    desktopNav: [
      { key: "home", label: "Home", to: "/vehicle", icon: Home },
      { key: "feed", label: "Community Feed", to: "/community", icon: Users2 },
      {
        key: "requests",
        label: "Service Requests",
        to: "/vehicle/requests",
        icon: ClipboardList,
      },
      { key: "active", label: "Active Service", to: "/vehicle/active", icon: Navigation },
      { key: "vehicles", label: "Vehicles", to: "/vehicle/vehicles", icon: Truck },
      { key: "history", label: "Service History", to: "/vehicle/history", icon: History },
      {
        key: "insurance",
        label: "Vehicle Insurance",
        to: "/vehicle/insurance",
        icon: ShieldCheck,
      },
      { key: "profile", label: "Profile", to: "/vehicle/profile", icon: UserRound },
    ],
    mobileNav: [
      { key: "home", label: "Home", to: "/vehicle", icon: Home },
      { key: "feed", label: "Feed", to: "/community", icon: Users2 },
      { key: "requests", label: "Requests", to: "/vehicle/requests", icon: ClipboardList },
      { key: "active", label: "Active", to: "/vehicle/active", icon: Navigation },
      { key: "vehicles", label: "Vehicles", to: "/vehicle/vehicles", icon: Truck },
      { key: "profile", label: "Profile", to: "/vehicle/profile", icon: UserRound },
    ],
    helpOptions: [
      "Service Requests",
      "Route & Navigation",
      "Vehicle Documents",
      "Vehicle Insurance",
      "Fuel & Maintenance",
      "Payments & Settlements",
    ],
  },

  labour: {
    id: "labour",
    label: "Labour",
    short: "Labour",
    emoji: "👷",
    tagline: "Find agricultural work near you and manage your day.",
    description:
      "Availability, nearby jobs, upcoming work, skills and equipment experience for agricultural workers.",
    accent: "#EF6C00",
    accentDark: "#E65100",
    accentSoft: "#FFF3E0",
    base: "/work",
    home: "/work",
    icon: Briefcase,
    desktopNav: [
      { key: "home", label: "Home", to: "/work", icon: Home },
      { key: "feed", label: "Community Feed", to: "/community", icon: Users2 },
      { key: "jobs", label: "Jobs", to: "/work/jobs", icon: Briefcase },
      { key: "active", label: "Active Work", to: "/work/active", icon: Wrench },
      { key: "upcoming", label: "Upcoming Work", to: "/work/upcoming", icon: CalendarClock },
      { key: "skills", label: "Skills", to: "/work/skills", icon: ClipboardList },
      { key: "area", label: "Service Area", to: "/work/area", icon: MapPinned },
      { key: "history", label: "Work History", to: "/work/history", icon: History },
      { key: "insurance", label: "Insurance", to: "/work/insurance", icon: ShieldCheck },
      { key: "profile", label: "Profile", to: "/work/profile", icon: UserRound },
    ],
    mobileNav: [
      { key: "home", label: "Home", to: "/work", icon: Home },
      { key: "feed", label: "Feed", to: "/community", icon: Users2 },
      { key: "jobs", label: "Jobs", to: "/work/jobs", icon: Briefcase },
      { key: "active", label: "Active", to: "/work/active", icon: Wrench },
      { key: "skills", label: "Skills", to: "/work/skills", icon: ClipboardList },
      { key: "profile", label: "Profile", to: "/work/profile", icon: UserRound },
    ],
    helpOptions: [
      "Nearby Work",
      "Skills & Equipment",
      "Work Preferences",
      "Service Area",
      "Insurance",
      "Work History",
    ],
  },

  scientist: {
    id: "scientist",
    label: "Scientist",
    short: "Scientist",
    emoji: "🔬",
    tagline: "Analyse plant images, build datasets and run research.",
    description:
      "An AI research workspace with plant analysis, projects, datasets, a research library and insights.",
    accent: "#5E35B1",
    accentDark: "#4527A0",
    accentSoft: "#EDE7F6",
    base: "/lab",
    home: "/lab",
    icon: Microscope,
    desktopNav: [
      { key: "home", label: "Dashboard", to: "/lab", icon: LayoutDashboard },
      { key: "feed", label: "Community Feed", to: "/community", icon: Users2 },
      { key: "analysis", label: "Plant Analysis", to: "/lab/analysis", icon: ScanLine },
      {
        key: "projects",
        label: "Research Projects",
        to: "/lab/projects",
        icon: FolderKanban,
      },
      { key: "datasets", label: "Datasets", to: "/lab/datasets", icon: Database },
      { key: "library", label: "Research Library", to: "/lab/library", icon: Library },
      { key: "history", label: "Analysis History", to: "/lab/history", icon: History },
      {
        key: "collaboration",
        label: "Collaboration",
        to: "/lab/collaboration",
        icon: Users2,
      },
      {
        key: "insights",
        label: "Research Insights",
        to: "/lab/insights",
        icon: FlaskConical,
      },
      { key: "profile", label: "Profile", to: "/lab/profile", icon: UserRound },
    ],
    mobileNav: [
      { key: "home", label: "Home", to: "/lab", icon: Home },
      { key: "feed", label: "Feed", to: "/community", icon: Users2 },
      { key: "analysis", label: "Analysis", to: "/lab/analysis", icon: ScanLine },
      { key: "projects", label: "Projects", to: "/lab/projects", icon: FolderKanban },
      { key: "library", label: "Library", to: "/lab/library", icon: Library },
      { key: "profile", label: "Profile", to: "/lab/profile", icon: UserRound },
    ],
    helpOptions: [
      "Plant Image Analysis",
      "Research Datasets",
      "Research Library",
      "Collaboration",
      "Analysis History",
      "Institutional Profile",
    ],
  },
};

export const NEW_ROLES: NewRoleId[] = [
  "home_grower",
  "seller",
  "vehicle_owner",
  "labour",
  "scientist",
];

export function isNewRole(role: string | undefined | null): role is NewRoleId {
  return (
    role === "home_grower" ||
    role === "seller" ||
    role === "vehicle_owner" ||
    role === "labour" ||
    role === "scientist"
  );
}

export function roleMeta(role: NewRoleId): RoleMeta {
  return ROLE_META[role];
}

/** Where a role's own workspace lives. Legacy roles keep `/dashboard`. */
export function roleHomePath(role: string | undefined | null): string {
  return isNewRole(role) ? ROLE_META[role].home : "/dashboard";
}

export const ROLE_SETUP_ROLES = NEW_ROLES.map((id) => ROLE_META[id]);

/** Shared secondary navigation for every role (settings, help, about). */
export const SHELL_SECONDARY_NAV: NavEntry[] = [
  { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell },
  { key: "settings", label: "Settings", to: "/settings", icon: SettingsIcon },
  { key: "help", label: "Help centre", to: "/help", icon: LifeBuoy },
  { key: "about", label: "About", to: "/about", icon: GraduationCap },
];

export const ROLE_ICON = {
  home_grower: Sprout,
  seller: Store,
  vehicle_owner: Truck,
  labour: Briefcase,
  scientist: Microscope,
};

export const MAP_ICON = MapPin;
export const WHEAT_ICON = Wheat;
