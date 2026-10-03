import { AppShell } from "@/components/app-shell";
import { OffersCarousel } from "@/components/offers-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useI18n } from "@/lib/i18n";
import {
  HEALTH_META,
  NURSERY_OFFERS,
  NURSERY_SERVICES,
  type HealthStatus,
} from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart3,
  Camera,
  Flower2,
  Image as ImageIcon,
  Leaf,
  MapPin,
  ScanLine,
  ShoppingCart,
  Sparkles,
  Upload,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function StatusBadge({ status }: { status: HealthStatus }) {
  const meta = HEALTH_META[status];
  return (
    <Badge className={cn("h-7 gap-1.5 px-2.5 text-xs", meta.badge)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </Badge>
  );
}

export function NurseryDashboard({
  profile,
}: {
  profile: Doc<"farmerProfiles">;
}) {
  const { t } = useI18n();
  const recentScans = useQuery(api.scans.listRecentScans, { limit: 4 });
  const recentPosts = useQuery(api.posts.listFeed, { limit: 8 });

  const categories = useMemo(
    () => profile.nurseryCategories ?? [],
    [profile.nurseryCategories],
  );

  const stockStatuses = useMemo(() => {
    return categories.slice(0, 6).map((category) => {
      const match = recentScans?.find((scan) =>
        scan.plantName.toLowerCase().includes(category.toLowerCase()),
      );
      return {
        category,
        status: (match?.healthStatus ?? null) as HealthStatus | null,
      };
    });
  }, [categories, recentScans]);

  const where = profile.location
    ? `${profile.location.city}, ${profile.location.state}`
    : null;

  return (
    <AppShell active="home">
      <div className="flex flex-col gap-8">
        {/* Greeting */}
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            {greeting()}
          </p>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[32px]">
            {profile.displayName?.split(" ")[0] || "Nursery"}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {where ?? "Nursery location not set"}
            {profile.nurseryType ? (
              <span className="text-muted-foreground/70">
                · {profile.nurseryType}
              </span>
            ) : null}
          </p>
        </header>

        {/* Check nursery stock hero */}
        <Link
          to="/scan"
          className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-[#17351C] to-[#1B5E20] p-6 shadow-[0_16px_40px_rgba(20,40,20,0.16)] transition-transform duration-200 active:scale-[0.995] sm:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[#2E7D32]/40 blur-2xl"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/12 text-[#A5D6A7]">
                <Camera className="size-6" />
              </span>
              <h2 className="mt-4 text-[26px] font-bold uppercase tracking-[-0.01em] text-white sm:text-[30px]">
                Check nursery stock
              </h2>
              <p className="mt-2 text-[15px] leading-6 text-white/70">
                Scan or upload a plant image to spot disease early
              </p>
            </div>
            <span className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-[15px] font-semibold text-[#1B5E20] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-colors group-hover:bg-[#E8F5E9] sm:w-auto">
              <ScanLine className="size-5" />
              Check Stock
            </span>
          </div>
        </Link>

        {/* Offers */}
        <OffersCarousel
          offers={NURSERY_OFFERS}
          title={t("dash.offers")}
          subtitle="Buyer leads, schemes and supplies for your nursery"
        />

        {/* Community feed */}
        {recentPosts && recentPosts.length > 0 ? (
          <section aria-labelledby="community-heading">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2
                  id="community-heading"
                  className="text-lg font-semibold tracking-[-0.01em] text-foreground"
                >
                  Nursery community
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Fresh from nurseries and growers
                </p>
              </div>
              <Link
                to="/feed"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View feed
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recentPosts.map((post) => (
                <Link
                  key={post._id}
                  to="/feed"
                  className="group relative size-32 shrink-0 overflow-hidden rounded-2xl bg-surface-3"
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.caption || "Nursery post"}
                      className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-6" />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-semibold text-white">
                    {post.authorName}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="community-heading">
            <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                  <ImageIcon className="size-5" />
                </span>
                <div>
                  <h2
                    id="community-heading"
                    className="text-[15px] font-semibold text-foreground"
                  >
                    Share your nursery
                  </h2>
                  <p className="mt-0.5 max-w-md text-sm text-muted-foreground">
                    Post photos of your nursery and see what other growers are
                    sharing in the community feed.
                  </p>
                </div>
              </div>
              <Button asChild className="h-11 rounded-xl px-5">
                <Link to="/feed">
                  <Upload className="size-4" />
                  Share a post
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Sell + insights */}
        <section className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/sell"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
              <ShoppingCart className="size-5" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-foreground">
                Sell your products
              </span>
              <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
                List plants and seedlings, track stock and record sales.
              </span>
            </span>
          </Link>
          <Link
            to="/insights"            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
              <BarChart3 className="size-5" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-foreground">
                Insights
              </span>
              <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
                Analyse your post engagement and product sales.
              </span>
            </span>
          </Link>
        </section>

        {/* Nursery services */}
        <section aria-labelledby="services-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2
                id="services-heading"
                className="text-lg font-semibold tracking-[-0.01em] text-foreground"
              >
                Nursery services
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Everything you need around the nursery
              </p>
            </div>
            <Link
              to="/services"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {NURSERY_SERVICES.slice(0, 6).map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.key}
                  to="/services"
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)]"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {service.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {service.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Stock health */}
        <section aria-labelledby="stock-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2
                id="stock-heading"
                className="text-lg font-semibold tracking-[-0.01em] text-foreground"
              >
                Stock health
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Health is based on your latest checks for each category
              </p>
            </div>
            {categories.length > 0 ? (
              <Link
                to="/stock"
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t("common.manage")}
              </Link>
            ) : null}
          </div>

          {stockStatuses.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Flower2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  No stock categories yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add the plant categories your nursery grows to track their
                  health.
                </p>
              </div>
              <Button asChild size="sm" className="h-10 rounded-xl px-4">
                <Link to="/stock">Add stock</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stockStatuses.map((item) => (
                <div
                  key={item.category}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
                      <Leaf className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-3">
                    {item.status ? (
                      <StatusBadge status={item.status} />
                    ) : (
                      <Badge className="h-7 gap-1.5 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                        Not scanned yet
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent plant checks */}
        <section aria-labelledby="recent-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2
                id="recent-heading"
                className="text-lg font-semibold tracking-[-0.01em] text-foreground"
              >
                Recent stock checks
              </h2>
            </div>
            <Link
              to="/history"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          {recentScans === undefined ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          ) : recentScans.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <ScanLine className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  No stock checks yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your saved AI results will appear here.
                </p>
              </div>
              <Button asChild size="sm" className="h-10 rounded-xl px-4">
                <Link to="/scan">
                  <Camera className="size-4" />
                  Check stock
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentScans.map((scan) => (
                <Link
                  key={scan._id}
                  to={`/scan/${scan._id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)]"
                >
                  <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-surface-3">
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt={scan.plantName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-muted-foreground">
                        <Leaf className="size-5" />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {scan.plantName}
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <StatusBadge status={scan.healthStatus} />
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                    {formatDistanceToNow(new Date(scan.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <p className="flex items-center gap-2 pb-2 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" />
          {t("dash.aiNote")}
        </p>
      </div>
    </AppShell>
  );
}
