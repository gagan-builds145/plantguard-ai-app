import {
  DemoTag,
  InfoNote,
  MetaRow,
  MiniMap,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import { LABOUR_JOBS, type LabourJob } from "@/lib/role-data";
import {
  CalendarClock,
  Check,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Route,
  Sprout,
  UserRound,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

const ACCENT = "#EF6C00";
const TONE = { New: "amber", Accepted: "green", Declined: "gray" } as const;

export function LabourJobDetails() {
  const { id = "" } = useParams();
  const [statuses, setStatuses] = useLocalState<Record<string, string>>(
    "labour:job-status",
    {},
  );

  const base = LABOUR_JOBS.find((job) => job.id === id);
  const job: LabourJob | undefined = base
    ? { ...base, status: (statuses[base.id] ?? base.status) as LabourJob["status"] }
    : undefined;

  if (!job) {
    return (
      <RolePage
        role="labour"
        active="jobs"
        title="Job not found"
        subtitle="This job is no longer available."
      >
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">We couldn't find that job</p>
          <Button asChild className="mt-4 h-11 rounded-xl">
            <Link to="/work/jobs">Back to nearby jobs</Link>
          </Button>
        </Panel>
      </RolePage>
    );
  }

  return (
    <RolePage
      role="labour"
      active="jobs"
      title={job.workType}
      subtitle={`${job.id} · posted by ${job.postedBy}`}
      action={<DemoTag />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[18px] font-semibold tracking-[-0.01em] text-foreground">
                  {job.workType}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
              </div>
              <StatusPill label={job.status} tone={TONE[job.status]} />
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">{job.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={`${job.distanceKm} km away`} tone="amber" />
              <StatusPill label={job.duration} tone="gray" />
              <StatusPill label={`Crop: ${job.crop}`} tone="green" />
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <SectionHead title="How to reach the work" subtitle="Navigation stays secondary" />
            <MiniMap
              accent={ACCENT}
              showControls={false}
              serviceLabel={job.location}
              markers={[
                { id: "self", x: 50, y: 52, label: "You", tone: "self" },
                { id: job.id, x: 70, y: 30, label: job.location, tone: "destination" },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-11 flex-1 gap-2 rounded-xl">
                <Navigation className="size-4" />
                Start navigation
              </Button>
              <Button variant="ghost" className="h-11 flex-1 gap-2 rounded-xl">
                <Phone className="size-4" />
                Contact poster
              </Button>
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Skills required" subtitle="Matched against your profile" />
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <StatusPill key={skill} label={skill} tone="blue" />
              ))}
            </div>
            <Link
              to="/work/skills"
              className="mt-3 inline-flex text-[13px] font-semibold text-[#EF6C00]"
            >
              Update my skills
            </Link>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Job details" />
            <div className="mt-3">
              <MetaRow label="Job ID" value={job.id} />
              <MetaRow label="Posted by" value={job.postedBy} icon={UserRound} />
              <MetaRow label="Date" value={job.date} icon={CalendarClock} />
              <MetaRow label="Time" value={job.time} icon={Clock} />
              <MetaRow label="Location" value={job.location} icon={MapPin} />
              <MetaRow label="Distance" value={`${job.distanceKm} km`} icon={Route} />
              <MetaRow label="Duration" value={job.duration} icon={Clock} />
              <MetaRow label="Crop" value={job.crop} icon={Sprout} />
            </div>
          </Panel>

          <Panel className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Respond</p>
            {job.status === "New" ? (
              <Button
                className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
                style={{ backgroundColor: ACCENT }}
                onClick={() => {
                  setStatuses((prev) => ({ ...prev, [job.id]: "Accepted" }));
                  toast.success("Job accepted");
                }}
              >
                <Check className="size-4" />
                ACCEPT
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
              onClick={() => {
                setStatuses((prev) => ({ ...prev, [job.id]: "Declined" }));
                toast("Job declined");
              }}
              disabled={job.status !== "New"}
            >
              <X className="size-4" />
              {job.status === "Accepted" ? "DROP JOB" : "DECLINE"}
            </Button>
            {job.status === "Accepted" ? (
              <Button asChild className="h-13 w-full rounded-xl text-[15px] font-semibold">
                <Link to="/work/active">Open active work</Link>
              </Button>
            ) : null}
            <InfoNote tone="warn">
              Wages and payment terms are agreed directly with the job poster. PlantGuard
              AI does not display or hold any payment amounts for work jobs.
            </InfoNote>
          </Panel>
        </div>
      </div>
    </RolePage>
  );
}

export default LabourJobDetails;
