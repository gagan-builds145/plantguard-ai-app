import {
  DemoTag,
  FilterPills,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
  TableShell,
  Td,
  Th,
} from "@/components/role-ui";
import { LABOUR_HISTORY } from "@/lib/role-data";
import { CalendarDays, CheckCircle2, MapPin, Sprout, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

const ACCENT = "#EF6C00";
const TABS = ["All", "Completed", "Cancelled"] as const;

export function LabourHistory() {
  const [tab, setTab] = useState<string>("All");

  const visible = useMemo(
    () => LABOUR_HISTORY.filter((item) => tab === "All" || item.status === tab),
    [tab],
  );

  const completed = LABOUR_HISTORY.filter((item) => item.status === "Completed").length;

  return (
    <RolePage
      role="labour"
      active="history"
      title="Work History"
      subtitle="Every shift you have completed or cancelled, with dates, places and crops."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total shifts"
          value={String(LABOUR_HISTORY.length)}
          note="Recorded sample work"
          icon={CalendarDays}
          accent={ACCENT}
        />
        <StatTile
          label="Completed"
          value={String(completed)}
          note="Finished as planned"
          icon={CheckCircle2}
          accent={ACCENT}
        />
        <StatTile
          label="Cancelled"
          value={String(LABOUR_HISTORY.length - completed)}
          note="Did not go ahead"
          icon={XCircle}
          accent={ACCENT}
        />
        <StatTile
          label="Crop types"
          value={String(new Set(LABOUR_HISTORY.map((item) => item.crop)).size)}
          note="Worked with so far"
          icon={Sprout}
          accent={ACCENT}
        />
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Past work"
            subtitle={`${visible.length} record${visible.length === 1 ? "" : "s"} shown`}
          />
          <DemoTag />
        </div>
        <FilterPills options={TABS} value={tab} onChange={setTab} />
      </Panel>

      <TableShell>
        <thead>
          <tr>
            <Th>Work ID</Th>
            <Th>Work type</Th>
            <Th>Date</Th>
            <Th>Location</Th>
            <Th>Crop</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-surface-2">
              <Td className="font-semibold text-foreground">{item.id}</Td>
              <Td>{item.workType}</Td>
              <Td className="text-muted-foreground">{item.date}</Td>
              <Td className="text-muted-foreground">{item.location}</Td>
              <Td>{item.crop}</Td>
              <Td>
                <StatusPill
                  label={item.status}
                  tone={item.status === "Completed" ? "green" : "red"}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <div className="flex flex-col gap-3 md:hidden">
        {visible.map((item) => (
          <Panel key={item.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.workType}</p>
                <p className="text-xs text-muted-foreground">{item.id}</p>
              </div>
              <StatusPill
                label={item.status}
                tone={item.status === "Completed" ? "green" : "red"}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-2 px-3.5 py-3 text-[13px]">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5" />
                {item.location}
              </span>
              <span className="text-muted-foreground">{item.crop}</span>
              <span className="text-muted-foreground">{item.date}</span>
            </div>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">No records yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Completed and cancelled shifts will appear here.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default LabourHistory;
