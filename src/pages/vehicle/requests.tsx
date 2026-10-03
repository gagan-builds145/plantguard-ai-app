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
import { VEHICLE_REQUESTS, type ServiceRequest } from "@/lib/role-data";
import { ArrowRight, CalendarClock, MapPin, Navigation, Route, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const ACCENT = "#1565C0";
const TABS = ["All", "New", "Accepted", "Declined", "Completed"] as const;
const SORTS = ["Nearest first", "Soonest first", "Farthest first"] as const;
type Sort = (typeof SORTS)[number];

const TONE = {
  New: "blue",
  Accepted: "green",
  Declined: "red",
  Completed: "gray",
} as const;

export function VehicleRequests() {
  const [tab, setTab] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("Nearest first");
  const [statuses, setStatuses] = useLocalState<Record<string, string>>(
    "vehicle:request-status",
    {},
  );

  const requests: ServiceRequest[] = useMemo(
    () =>
      VEHICLE_REQUESTS.map((request) => ({
        ...request,
        status: (statuses[request.id] ?? request.status) as ServiceRequest["status"],
      })),
    [statuses],
  );

  const visible = useMemo(() => {
    const list = requests.filter((request) => tab === "All" || request.status === tab);
    const sorted = [...list];
    if (sort === "Nearest first") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === "Farthest first") sorted.sort((a, b) => b.distanceKm - a.distanceKm);
    if (sort === "Soonest first") sorted.sort((a, b) => a.etaMinutes - b.etaMinutes);
    return sorted;
  }, [requests, tab, sort]);

  const decide = (id: string, status: "Accepted" | "Declined") => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    toast.success(status === "Accepted" ? "Request accepted" : "Request declined");
  };

  return (
    <RolePage
      role="vehicle_owner"
      active="requests"
      title="Service Requests"
      subtitle="Requests matched to your vehicles, services and service radius."
    >
      <Panel className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <SectionHead
            title="Requests near you"
            subtitle={`${visible.length} request${visible.length === 1 ? "" : "s"} in this view`}
          />
          <DemoTag />
        </div>
        <div className="px-5">
          <MiniMap
            accent={ACCENT}
            serviceLabel="Your service area"
            markers={[
              { id: "self", x: 50, y: 52, label: "You", tone: "self" },
              ...visible.slice(0, 4).map((request, index) => ({
                id: request.id,
                x: [28, 70, 36, 64][index] ?? 30,
                y: [28, 34, 72, 78][index] ?? 44,
                label: request.serviceType,
                tone: "request" as const,
              })),
            ]}
          />
        </div>
        <div className="flex flex-col gap-4 p-5">
          <FilterPills options={TABS} value={tab} onChange={setTab} />
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
        {visible.map((request) => (
          <Panel key={request.id} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-foreground">
                    {request.serviceType}
                  </p>
                  <StatusPill label={request.status} tone={TONE[request.status]} />
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {request.location}
                </p>
                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  {request.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <StatusPill label={`${request.distanceKm} km`} tone="blue" />
                <StatusPill label={`${request.etaMinutes} min drive`} tone="gray" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-3">
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <CalendarClock className="size-3.5" />
                {request.requestedFor}
              </span>
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Navigation className="size-3.5" />
                {request.requester} · {request.requesterType}
              </span>
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Timer className="size-3.5" />
                Fits: {request.vehicleFit.join(", ")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button asChild className="h-11 flex-1 gap-2 rounded-xl sm:flex-none">
                <Link to={`/vehicle/requests/${request.id}`}>
                  View details
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              {request.status === "New" ? (
                <>
                  <Button
                    variant="outline"
                    className="h-11 flex-1 gap-2 rounded-xl sm:flex-none"
                    onClick={() => decide(request.id, "Accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-11 flex-1 rounded-xl sm:flex-none"
                    onClick={() => decide(request.id, "Declined")}
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
          <p className="text-sm font-medium text-foreground">No requests here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Go online to receive new requests, or check another filter.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default VehicleRequests;
