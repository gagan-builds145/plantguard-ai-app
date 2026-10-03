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
import { VEHICLE_DEMO_FLEET, VEHICLE_REQUESTS } from "@/lib/role-data";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  ClipboardList,
  Gauge,
  MapPin,
  Timer,
  Truck,
} from "lucide-react";
import { Link } from "react-router";

const ACCENT = "#1565C0";

export function VehicleHome() {
  const { user } = useAuth();
  const { profile } = useFarmerProfile();
  const [online, setOnline] = useLocalState<boolean>("vehicle:online", false);
  const [statuses] = useLocalState<Record<string, string>>(
    "vehicle:request-status",
    {},
  );

  const name = profile?.displayName ?? user?.name ?? "Driver";
  const requests = VEHICLE_REQUESTS.map((request) => ({
    ...request,
    status: (statuses[request.id] ?? request.status) as typeof request.status,
  }));
  const nearby = requests.filter((request) => request.status === "New").slice(0, 3);
  const fleet = VEHICLE_DEMO_FLEET;

  return (
    <RolePage
      role="vehicle_owner"
      active="home"
      title={`Ready, ${name}?`}
      subtitle="Go online to receive service requests in your area, or review today's work."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground">
            <MapPin className="size-3.5" />
            {profile?.location?.city ?? "Bengaluru"}
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
          nearby.length
            ? `${nearby.length} new request${nearby.length === 1 ? "" : "s"} within your service area.`
            : "No new requests right now. We'll notify you when one comes in."
        }
        accent={ACCENT}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="New requests"
          value={String(nearby.length)}
          note="Within your radius"
          icon={ClipboardList}
          accent={ACCENT}
        />
        <StatTile
          label="Vehicles listed"
          value={String(fleet.length)}
          note="Active in your fleet"
          icon={Truck}
          accent={ACCENT}
        />
        <StatTile
          label="Services this month"
          value="18"
          note="Sample activity"
          icon={Gauge}
          accent={ACCENT}
        />
        <StatTile
          label="Avg. response time"
          value="6 min"
          note="Sample figure"
          icon={Timer}
          accent={ACCENT}
        />
      </div>

      <Panel className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <SectionHead
            title="Your service area"
            subtitle="A quiet view of where you take work"
          />
          <DemoTag />
        </div>
        <div className="px-5 pb-5">
          <MiniMap
            accent={ACCENT}
            showControls={false}
            serviceLabel={`${profile?.location?.city ?? "Bengaluru"} · 20 km radius`}
            markers={[
              { id: "self", x: 50, y: 52, label: "You", tone: "self" },
              ...nearby.map((request, index) => ({
                id: request.id,
                x: [26, 72, 34][index] ?? 24,
                y: [30, 36, 76][index] ?? 40,
                label: request.serviceType,
                tone: "request" as const,
              })),
            ]}
          />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <SectionHead
            title="Nearby requests"
            subtitle="Matched to your vehicle types and radius"
            action={
              <Link
                to="/vehicle/requests"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1565C0]"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <ul className="mt-4 flex flex-col gap-3">
            {nearby.map((request) => (
              <li key={request.id}>
                <Link
                  to={`/vehicle/requests/${request.id}`}
                  className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4 transition-colors hover:border-[#1565C0]/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {request.serviceType}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {request.requester} · {request.location}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {request.requestedFor} · {request.distanceKm} km away
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusPill label={`${request.etaMinutes} min`} tone="blue" />
                    <StatusPill label={request.status} tone="green" />
                  </div>
                </Link>
              </li>
            ))}
            {nearby.length === 0 ? (
              <li className="rounded-2xl bg-surface-2 px-4 py-8 text-center text-sm text-muted-foreground">
                No new requests. Go online to be matched with nearby work.
              </li>
            ) : null}
          </ul>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Next job" subtitle="Accepted and not yet started" />
            <div className="mt-3">
              {requests.find((request) => request.status === "Accepted") ? (
                (() => {
                  const next = requests.find((request) => request.status === "Accepted")!;
                  return (
                    <>
                      <MetaRow label="Service" value={next.serviceType} />
                      <MetaRow label="Where" value={next.location} />
                      <MetaRow label="When" value={next.requestedFor} />
                      <Button asChild className="mt-4 h-11 w-full gap-2 rounded-xl">
                        <Link to="/vehicle/active">
                          Open active service
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </>
                  );
                })()
              ) : (
                <p className="py-4 text-sm text-muted-foreground">
                  Nothing scheduled. Accept a request to see it here.
                </p>
              )}
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Your fleet" subtitle="Vehicles receiving requests" />
            <div className="mt-3">
              {fleet.map((vehicle) => (
                <MetaRow
                  key={vehicle.id}
                  label={vehicle.registration}
                  value={vehicle.types[0]}
                />
              ))}
            </div>
            <Button variant="outline" asChild className="mt-4 h-11 w-full gap-2 rounded-xl">
              <Link to="/vehicle/vehicles">
                <Truck className="size-4" />
                Manage vehicles
              </Link>
            </Button>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD]">
                <CalendarClock className="size-4" style={{ color: ACCENT }} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Service history</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  Every completed trip is recorded with dates, locations and vehicle
                  numbers.
                </p>
                <Link
                  to="/vehicle/history"
                  className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#1565C0]"
                >
                  Open history
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

export default VehicleHome;
