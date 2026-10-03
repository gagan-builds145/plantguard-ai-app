import { GrowerPostCard } from "@/components/grower-feed";
import {
  DemoTag,
  HeroPanel,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useAuth } from "@/hooks/use-auth";
import {
  GROWER_COMMUNITIES,
  GROWER_FEED,
  GROWER_PLANTS,
  GROWER_REMINDERS,
} from "@/lib/role-data";
import {
  Bell,
  CalendarClock,
  Camera,
  ChevronRight,
  Leaf,
  MapPin,
  ScanLine,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { Link } from "react-router";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function GrowerHome() {
  const { profile } = useFarmerProfile();
  const { user } = useAuth();
  const name =
    profile?.displayName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "Grower";
  const city = profile?.location?.city ?? "Bengaluru";

  const todayReminders = GROWER_REMINDERS.filter((item) => item.tone === "today");

  return (
    <RolePage
      role="home_grower"
      active="home"
      title={`${greeting()}, ${name}`}
      subtitle="Keep your plants happy, healthy and growing."
      action={
        <div className="flex items-center gap-2">
          <span className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground">
            <MapPin className="size-3.5" />
            {city}
          </span>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="flex size-11 items-center justify-center rounded-xl border border-[#EAF0EA] bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-4" />
          </Link>
          <Link
            to="/grower/profile"
            aria-label="Your profile"
            className="flex size-11 items-center justify-center rounded-xl bg-[#EAF6EA] text-sm font-bold text-primary"
          >
            {name.slice(0, 1).toUpperCase()}
          </Link>
        </div>
      }
    >
      {/* Scanner — the heart of PlantGuard AI for this role */}
      <HeroPanel role="home_grower" className="mt-1">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
              <Sparkles className="size-3.5" />
              AI plant scanner
            </span>
            <h2 className="mt-3 flex items-center gap-2 text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
              <ScanLine className="size-6 text-primary" />
              SCAN YOUR PLANT
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Identify your plant and check for possible health issues.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-xl px-6 text-[15px] font-semibold"
              >
                <Link to="/grower/scan">
                  <Camera className="size-5" />
                  Take Photo
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-xl px-6 text-[15px] font-semibold"
              >
                <Link to="/grower/scan">
                  <Upload className="size-5" />
                  Upload Image
                </Link>
              </Button>
            </div>
          </div>
          <span className="hidden size-24 shrink-0 items-center justify-center rounded-3xl bg-white/70 lg:flex">
            <Leaf className="size-12 text-primary" />
          </span>
        </div>
      </HeroPanel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <SectionHead
            title="Plant community"
            subtitle="Updates from growers near you."
            action={
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-xl px-3 text-[13px] font-semibold text-primary"
              >
                <Link to="/grower/discover">
                  Discover
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            }
          />
          {GROWER_FEED.slice(0, 4).map((post) => (
            <GrowerPostCard key={post.id} post={post} />
          ))}
        </div>

        <aside className="flex flex-col gap-6">
          <Panel className="p-5">
            <SectionHead
              title="My plants"
              action={
                <Link
                  to="/grower/plants"
                  className="text-[13px] font-semibold text-primary hover:underline"
                >
                  View all
                </Link>
              }
            />
            <ul className="mt-4 flex flex-col gap-3">
              {GROWER_PLANTS.slice(0, 3).map((plant) => (
                <li key={plant.id} className="flex items-center gap-3">
                  <img
                    src={plant.image}
                    alt=""
                    className="size-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {plant.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Checked {plant.lastChecked.toLowerCase()}
                    </p>
                  </div>
                  <StatusPill
                    label={plant.health}
                    tone={plant.health === "Healthy" ? "green" : "amber"}
                  />
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              className="mt-4 h-11 w-full rounded-xl text-sm font-semibold"
            >
              <Link to="/grower/plants">+ Add Plant</Link>
            </Button>
          </Panel>

          <Panel className="p-5">
            <SectionHead
              title="Today's reminders"
              action={
                <Link
                  to="/grower/reminders"
                  className="text-[13px] font-semibold text-primary hover:underline"
                >
                  All
                </Link>
              }
            />
            <ul className="mt-4 flex flex-col gap-3.5">
              {todayReminders.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <CalendarClock className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.type} · {item.plant}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between gap-3">
              <SectionHead title="Nearby communities" />
              <DemoTag />
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {GROWER_COMMUNITIES.slice(0, 3).map((community) => (
                <li key={community.id} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#EAF6EA] text-primary">
                    <Users className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {community.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {community.members} members · {community.distance}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </RolePage>
  );
}

export default GrowerHome;
