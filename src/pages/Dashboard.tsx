import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useI18n, type MessageKey } from "@/lib/i18n";
import {
  FARM_SERVICES,
  FARMER_OFFERS,
  HEALTH_META,
  type HealthStatus,
} from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  ScanLine,
  Sparkles,
  ThermometerSun,
  Wheat,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";

function greetingKey(): MessageKey {
  const hour = new Date().getHours();
  if (hour < 12) return "dash.goodMorning";
  if (hour < 17) return "dash.goodAfternoon";
  return "dash.goodEvening";
}

/** Deterministic sample forecast so the demo is stable and clearly labelled. */
function sampleWeather(city: string) {
  let hash = 0;
  for (let i = 0; i < city.length; i += 1) {
    hash = (hash << 5) - hash + city.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const conditions = [
    { label: "Partly cloudy", icon: CloudSun },
    { label: "Light showers", icon: Droplets },
    { label: "Clear", icon: ThermometerSun },
    { label: "Humid", icon: CloudSun },
  ];
  const temp = 24 + (seed % 9);
  const humidity = 52 + (seed % 30);
  const condition = conditions[seed % conditions.length];
  return {
    temp,
    humidity,
    condition,
    days: ["Today", "Tomorrow", "Day 3"].map((day, index) => ({
      day,
      high: temp + ((seed + index) % 4) - 1,
      low: temp - 8 - (index % 3),
    })),
  };
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

function OffersCarousel() {
  const { t } = useI18n();
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;
    const timer = window.setInterval(() => {
      api.scrollNext();
    }, 5200);
    return () => window.clearInterval(timer);
  }, [api, paused]);

  return (
    <section aria-labelledby="offers-heading">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2
            id="offers-heading"
            className="text-lg font-semibold tracking-[-0.01em] text-foreground"
          >
            {t("dash.offers")}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Schemes and inputs relevant to your crops
          </p>
        </div>
        <div className="hidden gap-2 lg:flex">
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Previous offer"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Next offer"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {FARMER_OFFERS.map((offer) => {
              const Icon = offer.icon;
              return (
                <CarouselItem
                  key={offer.key}
                  className="basis-[85%] sm:basis-[60%] lg:basis-1/3"
                >
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(20,40,20,0.06)]">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {offer.category}
                    </span>
                    <h3 className="mt-1 text-[15px] font-semibold text-foreground">
                      {offer.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-6 text-muted-foreground">
                      {offer.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {offer.cta}
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {FARMER_OFFERS.map((offer, index) => (
          <span
            key={offer.key}
            aria-hidden
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === selected ? "w-5 bg-primary" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { profile, isLoading } = useFarmerProfile();
  const { t } = useI18n();
  const recentScans = useQuery(api.scans.listRecentScans, { limit: 4 });

  const weather = useMemo(
    () => sampleWeather(profile?.location?.city ?? "Karnataka"),
    [profile?.location?.city],
  );

  const cropStatuses = useMemo(() => {
    const crops = profile?.crops ?? [];
    return crops.slice(0, 6).map((crop) => {
      const match = recentScans?.find((scan) =>
        scan.plantName.toLowerCase().includes(crop.toLowerCase()),
      );
      return {
        crop,
        status: (match?.healthStatus ?? null) as HealthStatus | null,
      };
    });
  }, [profile?.crops, recentScans]);

  if (isLoading) {
    return (
      <AppShell active="home">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  // A profile carrying only a phone number (saved at sign-up) still needs
  // onboarding; one that already has a name does not.
  const needsOnboarding =
    !profile || (!profile.onboardedAt && !profile.displayName);
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  const where = profile.location
    ? `${profile.location.city}, ${profile.location.state}`
    : null;

  return (
    <AppShell active="home">
      <div className="flex flex-col gap-8">
        {/* Greeting */}
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            {t(greetingKey())}
          </p>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[32px]">
            {profile.displayName?.split(" ")[0] || t("shell.farmer")}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {where ?? t("dash.locationHint")}
          </p>
        </header>

        {/* Check Your Plant hero */}
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
                {t("dash.checkPlant")}
              </h2>
              <p className="mt-2 text-[15px] leading-6 text-white/70">
                {t("dash.scanOrUpload")}
              </p>
            </div>
            <span className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-[15px] font-semibold text-[#1B5E20] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-colors group-hover:bg-[#E8F5E9] sm:w-auto">
              <ScanLine className="size-5" />
              {t("dash.checkPlantBtn")}
            </span>
          </div>
        </Link>

        {/* Offers */}
        <OffersCarousel />

        {/* Farm services */}
        <section aria-labelledby="services-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2
                id="services-heading"
                className="text-lg font-semibold tracking-[-0.01em] text-foreground"
              >
                {t("dash.farmServices")}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Everything you need around the farm
              </p>
            </div>
            <Link
              to="/services"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {FARM_SERVICES.slice(0, 6).map((service) => {
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

        {/* Weather */}
        <section aria-labelledby="weather-heading">
          <div className="mb-4">
            <h2
              id="weather-heading"
              className="text-lg font-semibold tracking-[-0.01em] text-foreground"
            >
              {t("dash.weather")}
            </h2>
          </div>

          {profile.location ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(20,40,20,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                    <CloudSun className="size-6" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold tracking-[-0.02em] text-foreground">
                      {weather.temp}°C
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {weather.condition.label} · {where}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Droplets className="size-4" />
                  {t("dash.humidity")} {weather.humidity}%
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                {weather.days.map((day) => (
                  <div key={day.day} className="px-4 py-3 text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      {day.day}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {day.high}° / {day.low}°
                    </p>
                  </div>
                ))}
              </div>
              <p className="border-t border-border bg-surface-2 px-5 py-2.5 text-xs text-muted-foreground">
                {t("dash.sampleForecast")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {t("dash.locationHint")}
              </p>
              <Button asChild variant="outline" className="h-10 rounded-xl">
                <Link to="/profile">{t("dash.addLocation")}</Link>
              </Button>
            </div>
          )}
        </section>

        {/* My crops */}
        <section aria-labelledby="crops-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2
                id="crops-heading"
                className="text-lg font-semibold tracking-[-0.01em] text-foreground"
              >
                {t("dash.myCrops")}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Health is based on your latest plant checks
              </p>
            </div>
            <Link
              to="/crops"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("common.manage")}
            </Link>
          </div>

          {cropStatuses.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Wheat className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t("dash.noCrops")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("dash.noCropsSub")}
                </p>
              </div>
              <Button asChild size="sm" className="h-10 rounded-xl px-4">
                <Link to="/crops">{t("dash.addCrop")}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cropStatuses.map((item) => (
                <div
                  key={item.crop}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
                      <Leaf className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.crop}
                    </span>
                  </div>
                  <div className="mt-3">
                    {item.status ? (
                      <StatusBadge status={item.status} />
                    ) : (
                      <Badge className="h-7 gap-1.5 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                        {t("dash.notScanned")}
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
                {t("dash.recentChecks")}
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
                  {t("dash.noChecks")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("dash.noChecksSub")}
                </p>
              </div>
              <Button asChild size="sm" className="h-10 rounded-xl px-4">
                <Link to="/scan">
                  <Camera className="size-4" />
                  {t("dash.checkPlant")}
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
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {scan.plantName}
                      </span>
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
