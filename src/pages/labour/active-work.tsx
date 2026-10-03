import {
  DemoTag,
  InfoNote,
  MetaRow,
  MiniMap,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import { LABOUR_JOBS, LABOUR_UPCOMING, type LabourJob } from "@/lib/role-data";
import { CalendarClock, CheckCircle2, Clock, MapPin, Navigation, Sprout } from "lucide-react";
import { openDirections } from "@/lib/actions";
import { Link } from "react-router";
import { toast } from "sonner";

const ACCENT = "#EF6C00";

export function LabourActiveWork() {
  const [statuses, setStatuses] = useLocalState<Record<string, string>>(
    "labour:job-status",
    {},
  );
  const [activeId, setActiveId] = useLocalState<string>("labour:active-job", "");
  const [started, setStarted] = useLocalState<boolean>("labour:work-started", false);

  const jobs: LabourJob[] = LABOUR_JOBS.map((job) => ({
    ...job,
    status: (statuses[job.id] ?? job.status) as LabourJob["status"],
  }));

  const job =
    jobs.find((item) => item.id === activeId && item.status === "Accepted") ??
    jobs.find((item) => item.status === "Accepted");

  if (!job) {
    return (
      <RolePage
        role="labour"
        active="active"
        title="No active work"
        subtitle="Accept a job to start work."
      >
        <Panel className="py-10 text-center">
          <Sprout className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">You're all caught up</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Accepted jobs appear here with start and complete controls.
          </p>
          <Button asChild className="mt-4 h-11 rounded-xl">
            <Link to="/work/jobs">Browse nearby jobs</Link>
          </Button>
        </Panel>
      </RolePage>
    );
  }

  const complete = () => {
    setStatuses((prev) => ({ ...prev, [job.id]: "Completed" as never }));
    setActiveId("");
    setStarted(false);
    toast.success("Work marked complete and saved to your history");
  };

  return (
    <RolePage
      role="labour"
      active="active"
      title="Active Work"
      subtitle={`${job.workType} · ${job.location}`}
      action={<DemoTag />}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Stage"
          value={started ? "In progress" : "Ready to start"}
          note={job.date}
          icon={Navigation}
          accent={ACCENT}
        />
        <StatTile
          label="Shift window"
          value={job.time}
          note={job.duration}
          icon={Clock}
          accent={ACCENT}
        />
        <StatTile
          label="Distance"
          value={`${job.distanceKm} km`}
          note={job.location}
          icon={MapPin}
          accent={ACCENT}
        />
      </div>

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
              <StatusPill label={started ? "In progress" : "Accepted"} tone="green" />
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">{job.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              {job.skills.map((skill) => (
                <StatusPill key={skill} label={skill} tone="amber" />
              ))}
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <SectionHead title="Getting there" subtitle="Route to the work site" />
            <MiniMap
              accent={ACCENT}
              showControls={false}
              serviceLabel={job.location}
              markers={[
                { id: "self", x: 50, y: 52, label: "You", tone: "self" },
                { id: job.id, x: 70, y: 28, label: job.location, tone: "destination" },
              ]}
            />
            <Button
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl"
              onClick={() => openDirections(job.location)}
            >
              <Navigation className="size-4" />
              Start navigation
            </Button>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Job summary" />
            <div className="mt-3">
              <MetaRow label="Job ID" value={job.id} />
              <MetaRow label="Posted by" value={job.postedBy} />
              <MetaRow label="Date" value={job.date} icon={CalendarClock} />
              <MetaRow label="Time" value={job.time} icon={Clock} />
              <MetaRow label="Crop" value={job.crop} icon={Sprout} />
            </div>
          </Panel>

          <Panel className="flex flex-col gap-3">
            {started ? (
              <Button
                className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
                style={{ backgroundColor: ACCENT }}
                onClick={complete}
              >
                <CheckCircle2 className="size-4" />
                COMPLETE
              </Button>
            ) : (
              <Button
                className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
                style={{ backgroundColor: ACCENT }}
                onClick={() => {
                  setStarted(true);
                  toast.success("Work started");
                }}
              >
                <Navigation className="size-4" />
                START
              </Button>
            )}
            <Button
              variant="outline"
              className="h-13 w-full rounded-xl text-[15px] font-semibold"
              onClick={() => setStarted((prev) => !prev)}
            >
              {started ? "Pause work" : "Resume work"}
            </Button>
            <InfoNote>
              Completing work saves it to your work history with the date, location and
              crop.
            </InfoNote>
          </Panel>

          <Panel>
            <SectionHead title="Next scheduled" subtitle="Other accepted jobs" />
            <div className="mt-3">
              {LABOUR_UPCOMING.slice(0, 2).map((item) => (
                <MetaRow key={item.id} label={item.date} value={item.workType} />
              ))}
            </div>
            <Button variant="outline" asChild className="mt-4 h-11 w-full gap-2 rounded-xl">
              <Link to="/work/upcoming">Open upcoming work</Link>
            </Button>
          </Panel>
        </div>
      </div>
    </RolePage>
  );
}

export default LabourActiveWork;
