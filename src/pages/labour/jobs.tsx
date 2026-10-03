import {
  DemoTag,
  FilterPills,
  MiniMap,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import { LABOUR_JOBS, LABOUR_SKILLS, type LabourJob } from "@/lib/role-data";
import { ArrowRight, Clock, MapPin, Route, Sprout, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const ACCENT = "#EF6C00";
const TABS = ["All", "New", "Accepted", "Declined"] as const;
const SORTS = ["Nearest first", "Soonest first", "Farthest first"] as const;
type Sort = (typeof SORTS)[number];

const TONE = { New: "amber", Accepted: "green", Declined: "gray" } as const;

export function LabourJobs() {
  const [tab, setTab] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("Nearest first");
  const [skill, setSkill] = useState<string>("All skills");
  const [statuses, setStatuses] = useLocalState<Record<string, string>>(
    "labour:job-status",
    {},
  );

  const jobs: LabourJob[] = useMemo(
    () =>
      LABOUR_JOBS.map((job) => ({
        ...job,
        status: (statuses[job.id] ?? job.status) as LabourJob["status"],
      })),
    [statuses],
  );

  const visible = useMemo(() => {
    const list = jobs.filter((job) => {
      const matchesTab = tab === "All" || job.status === tab;
      const matchesSkill =
        skill === "All skills" || job.skills.includes(skill) || job.crop === skill;
      return matchesTab && matchesSkill;
    });
    const sorted = [...list];
    if (sort === "Nearest first") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === "Farthest first") sorted.sort((a, b) => b.distanceKm - a.distanceKm);
    if (sort === "Soonest first") sorted.sort((a, b) => a.time.localeCompare(b.time));
    return sorted;
  }, [jobs, tab, sort, skill]);

  const decide = (id: string, status: "Accepted" | "Declined") => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    toast.success(status === "Accepted" ? "Job accepted" : "Job declined");
  };

  return (
    <RolePage
      role="labour"
      active="jobs"
      title="Nearby Jobs"
      subtitle="Work posted near you, matched to your skills and service radius."
    >
      <Panel className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <SectionHead
            title="Open work nearby"
            subtitle={`${visible.length} job${visible.length === 1 ? "" : "s"} in this view`}
          />
          <DemoTag />
        </div>
        <div className="px-5">
          <MiniMap
            accent={ACCENT}
            serviceLabel="Your service area"
            markers={[
              { id: "self", x: 50, y: 52, label: "You", tone: "self" },
              ...visible.slice(0, 4).map((job, index) => ({
                id: job.id,
                x: [26, 72, 36, 64][index] ?? 30,
                y: [30, 36, 74, 76][index] ?? 44,
                label: job.workType,
                tone: "request" as const,
              })),
            ]}
          />
        </div>
        <div className="flex flex-col gap-4 p-5">
          <FilterPills options={TABS} value={tab} onChange={setTab} />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All skills", ...LABOUR_SKILLS.slice(0, 7)].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={skill === option}
                onClick={() => setSkill(option)}
                className={
                  skill === option
                    ? "h-9 shrink-0 rounded-full border border-primary bg-accent px-3.5 text-[13px] font-medium text-accent-foreground"
                    : "h-9 shrink-0 rounded-full border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
                }
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Route className="size-4 text-muted-foreground" />
            {SORTS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={sort === option}
                onClick={() => setSort(option)}
                className={
                  sort === option
                    ? "h-9 rounded-full border border-primary bg-accent px-3.5 text-[13px] font-medium text-accent-foreground"
                    : "h-9 rounded-full border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-3">
        {visible.map((job) => (
          <Panel key={job.id} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-foreground">{job.workType}</p>
                  <StatusPill label={job.status} tone={TONE[job.status]} />
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {job.location}
                </p>
                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  {job.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <StatusPill label={`${job.distanceKm} km`} tone="amber" />
                <StatusPill label={job.duration} tone="gray" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-3">
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Clock className="size-3.5" />
                {job.date} · {job.time}
              </span>
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Sprout className="size-3.5" />
                {job.crop}
              </span>
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <UserRound className="size-3.5" />
                {job.postedBy}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((item) => (
                <StatusPill key={item} label={item} tone="gray" />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button asChild className="h-11 flex-1 gap-2 rounded-xl sm:flex-none">
                <Link to={`/work/jobs/${job.id}`}>
                  View details
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              {job.status === "New" ? (
                <>
                  <Button
                    variant="outline"
                    className="h-11 flex-1 rounded-xl sm:flex-none"
                    onClick={() => decide(job.id, "Accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-11 flex-1 rounded-xl sm:flex-none"
                    onClick={() => decide(job.id, "Declined")}
                  >
                    Decline
                  </Button>
                </>
              ) : null}
            </div>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">No jobs here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Go online to receive new work, or try another filter.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default LabourJobs;
