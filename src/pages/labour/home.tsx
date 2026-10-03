import {
  AvailabilityPanel,
  DemoTag,
  MetaRow,
  MiniMap,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useLocalState } from "@/hooks/use-local-state";
import { LABOUR_JOBS, LABOUR_SKILLS, LABOUR_UPCOMING } from "@/lib/role-data";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Hammer,
  MapPin,
  Sprout,
  Timer,
} from "lucide-react";
import { Link } from "react-router";

const ACCENT = "#EF6C00";

export function LabourHome() {
  const { user } = useAuth();
  const { profile } = useFarmerProfile();
  const [online, setOnline] = useLocalState<boolean>("labour:online", false);

  const name = profile?.displayName ?? user?.name ?? "Worker";
  const skills = profile?.skills ?? [LABOUR_SKILLS[0], LABOUR_SKILLS[2]];
  const jobs = LABOUR_JOBS.filter((job) => job.status === "New").slice(0, 3);
  const city = profile?.serviceArea?.city ?? profile?.location?.city ?? "Bengaluru";

  return (
    <RolePage
      role="labour"
      active="home"
      title={`Find work, ${name}`}
      subtitle="Go online to see work near you, or review the jobs you already have."
      action={
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      }
    >
      <AvailabilityPanel
        online={online}
        onToggle={setOnline}
        offLabel="YOU ARE OFFLINE"
        ctaLabel="GO ONLINE"
        onLabel="YOU ARE ONLINE"
        waitingText={
          jobs.length
            ? `${jobs.length} new job${jobs.length === 1 ? "" : "s"} within your service area.`
            : "No new jobs right now. We'll notify you when work is posted nearby."
        }
        accent={ACCENT}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Jobs near you"
          value={String(LABOUR_JOBS.length)}
          note="Open in your area"
          icon={Hammer}
          accent={ACCENT}
        />
        <StatTile
          label="Upcoming"
          value={String(LABOUR_UPCOMING.length)}
          note="Accepted or pending"
          icon={CalendarClock}
          accent={ACCENT}
        />
        <StatTile
          label="Your skills"
          value={String(skills.length)}
          note="Used for matching"
          icon={Sprout}
          accent={ACCENT}
        />
        <StatTile
          label="Avg. shift"
          value="5–6 hrs"
          note="Sample job duration"
          icon={Timer}
          accent={ACCENT}
        />
      </div>

      <Panel className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <SectionHead title="Work around you" subtitle="A quiet view of nearby openings" />
          <DemoTag />
        </div>
        <div className="px-5 pb-5">
          <MiniMap
            accent={ACCENT}
            showControls={false}
            serviceLabel={`${city} · 20 km radius`}
            markers={[
              { id: "self", x: 50, y: 52, label: "You", tone: "self" },
              ...LABOUR_JOBS.slice(0, 4).map((job, index) => ({
                id: job.id,
                x: [24, 70, 34, 66][index] ?? 28,
                y: [30, 34, 74, 78][index] ?? 44,
                label: job.workType,
                tone: "request" as const,
              })),
            ]}
          />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <SectionHead
            title="Nearby jobs"
            subtitle="Matched to your skills and radius"
            action={
              <Link
                to="/work/jobs"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#EF6C00]"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <ul className="mt-4 flex flex-col gap-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  to={`/work/jobs/${job.id}`}
                  className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4 transition-colors hover:border-[#EF6C00]/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{job.workType}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {job.location} · {job.distanceKm} km
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {job.date} · {job.time} · {job.crop}
                    </p>
                  </div>
                  <StatusPill label={job.duration} tone="amber" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Upcoming work" subtitle="Jobs you've taken on" />
            <div className="mt-3">
              {LABOUR_UPCOMING.map((item) => (
                <MetaRow key={item.id} label={item.date} value={item.workType} />
              ))}
            </div>
            <Button variant="outline" asChild className="mt-4 h-11 w-full gap-2 rounded-xl">
              <Link to="/work/upcoming">
                <CalendarClock className="size-4" />
                Open upcoming work
              </Link>
            </Button>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${ACCENT}1A` }}
              >
                <Sprout className="size-4" style={{ color: ACCENT }} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Skills &amp; experience</p>
                <p className="mt-0.5 text-[13px] leading-6 text-muted-foreground">
                  Keep your skills, equipment and crop experience current so the right
                  jobs reach you first.
                </p>
                <Link
                  to="/work/skills"
                  className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#EF6C00]"
                >
                  Update skills
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </RolePage>
  );
}

export default LabourHome;
