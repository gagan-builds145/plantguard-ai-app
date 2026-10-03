import {
  DemoTag,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import { LABOUR_UPCOMING } from "@/lib/role-data";
import { CalendarClock, CalendarDays, MapPin, Sprout, Users } from "lucide-react";
import { Link } from "react-router";

const ACCENT = "#EF6C00";

export function LabourUpcoming() {
  const [confirmed, setConfirmed] = useLocalState<string[]>(
    "labour:confirmed-upcoming",
    [],
  );

  const confirmedCount = LABOUR_UPCOMING.filter((item) =>
    confirmed.includes(item.id),
  ).length;

  return (
    <RolePage
      role="labour"
      active="upcoming"
      title="Upcoming Work"
      subtitle="Jobs you've accepted, with the dates and places you need to be there."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Accepted jobs"
          value={String(LABOUR_UPCOMING.length)}
          note="On your schedule"
          icon={CalendarDays}
          accent={ACCENT}
        />
        <StatTile
          label="Confirmed"
          value={String(confirmedCount || LABOUR_UPCOMING.length - 1)}
          note="Poster confirmed the shift"
          icon={CalendarClock}
          accent={ACCENT}
        />
        <StatTile
          label="Crop types"
          value={String(new Set(LABOUR_UPCOMING.map((item) => item.crop)).size)}
          note="Across scheduled jobs"
          icon={Sprout}
          accent={ACCENT}
        />
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Your schedule"
            subtitle="Confirm a shift once the poster replies"
          />
          <DemoTag />
        </div>

        <ul className="mt-4 flex flex-col gap-3">
          {LABOUR_UPCOMING.map((item) => {
            const isConfirmed = confirmed.includes(item.id);
            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold text-foreground">{item.workType}</p>
                    <StatusPill
                      label={isConfirmed ? "Confirmed" : item.status}
                      tone={isConfirmed ? "green" : "amber"}
                    />
                  </div>
                  <p className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="size-3.5" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sprout className="size-3.5" />
                      {item.crop}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Job ID {item.id}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {!isConfirmed ? (
                    <Button
                      variant="outline"
                      className="h-11 gap-2 rounded-xl"
                      onClick={() => setConfirmed((prev) => [...prev, item.id])}
                    >
                      <Users className="size-4" />
                      Confirm shift
                    </Button>
                  ) : null}
                  <Button asChild variant="ghost" className="h-11 rounded-xl">
                    <Link to="/work/jobs">Find more work</Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </RolePage>
  );
}

export default LabourUpcoming;
