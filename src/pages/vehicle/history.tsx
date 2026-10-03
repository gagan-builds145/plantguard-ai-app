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
import { VEHICLE_HISTORY } from "@/lib/role-data";
import { CalendarDays, CheckCircle2, MapPin, Timer, Truck } from "lucide-react";
import { useMemo, useState } from "react";

const ACCENT = "#1565C0";
const TABS = ["All", "Completed", "Cancelled"] as const;

export function VehicleHistory() {
  const [tab, setTab] = useState<string>("All");

  const visible = useMemo(
    () => VEHICLE_HISTORY.filter((item) => tab === "All" || item.status === tab),
    [tab],
  );

  const completed = VEHICLE_HISTORY.filter((item) => item.status === "Completed").length;
  const water = VEHICLE_HISTORY.filter((item) => item.serviceType === "Water Supply").length;

  return (
    <RolePage
      role="vehicle_owner"
      active="history"
      title="Service History"
      subtitle="Every job you've completed or cancelled, with dates, locations and vehicles."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total jobs"
          value={String(VEHICLE_HISTORY.length)}
          note="Recorded sample jobs"
          icon={CalendarDays}
          accent={ACCENT}
        />
        <StatTile
          label="Completed"
          value={String(completed)}
          note="Successfully finished"
          icon={CheckCircle2}
          accent={ACCENT}
        />
        <StatTile
          label="Cancelled"
          value={String(VEHICLE_HISTORY.length - completed)}
          note="Did not go ahead"
          icon={Timer}
          accent={ACCENT}
        />
        <StatTile
          label="Water supply jobs"
          value={String(water)}
          note="Your most frequent service"
          icon={Truck}
          accent={ACCENT}
        />
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Past services"
            subtitle={`${visible.length} record${visible.length === 1 ? "" : "s"} shown`}
          />
          <DemoTag />
        </div>
        <FilterPills options={TABS} value={tab} onChange={setTab} />
      </Panel>

      <TableShell>
        <thead>
          <tr>
            <Th>Job ID</Th>
            <Th>Service</Th>
            <Th>Date</Th>
            <Th>Location</Th>
            <Th>Vehicle</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-surface-2">
              <Td className="font-semibold text-foreground">{item.id}</Td>
              <Td>{item.serviceType}</Td>
              <Td className="text-muted-foreground">{item.date}</Td>
              <Td className="text-muted-foreground">{item.location}</Td>
              <Td>{item.vehicle}</Td>
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
                <p className="text-sm font-semibold text-foreground">{item.serviceType}</p>
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
              <span className="text-muted-foreground">{item.vehicle}</span>
              <span className="text-muted-foreground">{item.date}</span>
            </div>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">No records yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Completed and cancelled jobs will appear here.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default VehicleHistory;
