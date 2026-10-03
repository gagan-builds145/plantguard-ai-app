import { PlantGuardLogo, PlantGuardMark } from "@/components/brand";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useI18n, type MessageKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Flower2,
  History,
  Home,
  Image as ImageIcon,
  ScanLine,
  ShoppingCart,
  Sprout,
  UserRound,
  Wheat,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

type NavItem = {
  key: string;
  /** Shared, translated label. */
  labelKey?: MessageKey;
  /** Role-specific label kept in English for clarity. */
  label?: string;
  to: string;
  icon: typeof Home;
  emphasized?: boolean;
};

/** Farmer mobile bottom navigation: Home · Services · Check Plant · History · Profile */
const FARMER_MOBILE_NAV: NavItem[] = [
  { key: "home", labelKey: "nav.home", to: "/dashboard", icon: Home },
  { key: "services", labelKey: "nav.services", to: "/services", icon: Sprout },
  { key: "scan", labelKey: "nav.scan", to: "/scan", icon: ScanLine, emphasized: true },
  { key: "history", labelKey: "nav.history", to: "/history", icon: History },
  { key: "profile", labelKey: "nav.profile", to: "/profile", icon: UserRound },
];

/** Nursery mobile bottom navigation: Home · Feed · Check Stock · Stock · Profile */
const NURSERY_MOBILE_NAV: NavItem[] = [
  { key: "home", labelKey: "nav.home", to: "/dashboard", icon: Home },
  { key: "feed", label: "Feed", to: "/feed", icon: ImageIcon },
  { key: "scan", label: "Check", to: "/scan", icon: ScanLine, emphasized: true },
  { key: "sell", label: "Sell", to: "/sell", icon: ShoppingCart },
  { key: "insights", label: "Insights", to: "/insights", icon: BarChart3 },
];

/** Desktop sidebar navigation */
const FARMER_DESKTOP_NAV: NavItem[] = [
  { key: "home", labelKey: "nav.home", to: "/dashboard", icon: Home },
  { key: "scan", labelKey: "nav.checkYourPlant", to: "/scan", icon: ScanLine },
  { key: "services", labelKey: "nav.farmServices", to: "/services", icon: Sprout },
  { key: "crops", labelKey: "nav.crops", to: "/crops", icon: Wheat },
  { key: "history", labelKey: "nav.scanHistory", to: "/history", icon: History },
  { key: "profile", labelKey: "nav.profile", to: "/profile", icon: UserRound },
];

const NURSERY_DESKTOP_NAV: NavItem[] = [
  { key: "home", labelKey: "nav.home", to: "/dashboard", icon: Home },
  { key: "feed", label: "Feed", to: "/feed", icon: ImageIcon },
  { key: "sell", label: "Sell Products", to: "/sell", icon: ShoppingCart },
  { key: "insights", label: "Insights", to: "/insights", icon: BarChart3 },
  { key: "scan", label: "Check Stock", to: "/scan", icon: ScanLine },
  { key: "services", label: "Nursery Services", to: "/services", icon: Sprout },
  { key: "stock", label: "My Stock", to: "/stock", icon: Flower2 },
  { key: "history", label: "Scan History", to: "/history", icon: History },
  { key: "profile", labelKey: "nav.profile", to: "/profile", icon: UserRound },
];

function isActive(pathname: string, to: string) {
  if (to === "/dashboard") return pathname === "/dashboard";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({
  children,
  active,
  title,
  subtitle,
  showBack = false,
}: {
  children: ReactNode;
  active: string;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const { pathname } = useLocation();
  const { profile } = useFarmerProfile();
  const { user } = useAuth();
  const { t } = useI18n();

  const isNursery = profile?.role === "nursery";
  const roleLabel = isNursery ? "Nursery" : t("shell.farmer");
  const desktopNav = isNursery ? NURSERY_DESKTOP_NAV : FARMER_DESKTOP_NAV;
  const mobileNav = isNursery ? NURSERY_MOBILE_NAV : FARMER_MOBILE_NAV;

  const name =
    profile?.displayName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    roleLabel;
  const initials = (profile?.displayName || user?.name || "F")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const navLabel = (item: NavItem) =>
    item.labelKey ? t(item.labelKey) : (item.label ?? "");

  return (
    <div className="min-h-screen bg-surface-2">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link to="/dashboard" aria-label="PlantGuard AI home">
            <PlantGuardLogo />
          </Link>
        </div>

        <div className="mx-4 flex items-center gap-2 rounded-xl bg-accent px-3 py-2.5">
          {isNursery ? (
            <Flower2 className="size-4 text-primary" />
          ) : (
            <Sprout className="size-4 text-primary" />
          )}
          <span className="text-xs font-semibold text-accent-foreground">
            {isNursery ? "Nursery workspace" : t("shell.farmerWorkspace")}
          </span>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3" aria-label="Main">
          {desktopNav.map((item) => {
            const isCurrent = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-colors duration-150",
                  isCurrent
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("size-5", isCurrent && "text-primary")}
                  strokeWidth={isCurrent ? 2.4 : 2}
                />
                {navLabel(item)}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                {profile?.displayName || user?.name || roleLabel}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {profile?.location
                  ? `${profile.location.city}, ${profile.location.state}`
                  : t("shell.locationNotSet")}
              </span>
            </span>
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur lg:hidden">
        <Link to="/dashboard" aria-label="PlantGuard AI home">
          <span className="inline-flex items-center gap-2">
            <PlantGuardMark className="size-8" />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">
              PlantGuard <span className="text-primary">AI</span>
            </span>
          </span>
        </Link>
        <Link
          to="/profile"
          className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          aria-label="Open profile"
        >
          {initials}
        </Link>
      </header>

      <div className="lg:pl-[248px]">
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
          {(title || showBack) && (
            <div className="mb-6">
              {showBack && (
                <Link
                  to="/dashboard"
                  className="mb-3 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  ← Back to dashboard
                </Link>
              )}
              {title && (
                <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1.5 text-sm text-muted-foreground sm:text-[15px]">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid h-[72px] max-w-lg grid-cols-5">
          {mobileNav.map((item) => {
            const isCurrent = active === item.key;
            const Icon = item.icon;
            if (item.emphasized) {
              return (
                <li key={item.key} className="relative">
                  <Link
                    to={item.to}
                    aria-current={isCurrent ? "page" : undefined}
                    className="flex h-full flex-col items-center justify-end gap-1 pb-2.5"
                  >
                    <span
                      className={cn(
                        "-mt-6 flex size-14 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(46,125,50,0.35)] transition-transform active:scale-95",
                        isCurrent && "bg-primary-dark",
                      )}
                    >
                      <Icon className="size-6" strokeWidth={2.2} />
                    </span>
                    <span className="text-[11px] font-semibold text-primary">
                      {navLabel(item)}
                    </span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 pb-2.5 pt-3 text-[11px] font-medium transition-colors",
                    isCurrent ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className="size-6"
                    strokeWidth={isCurrent ? 2.4 : 2}
                  />
                  {navLabel(item)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
