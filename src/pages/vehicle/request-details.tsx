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
import {
  VEHICLE_DEMO_FLEET,
  VEHICLE_REQUESTS,
  type ServiceRequest,
} from "@/lib/role-data";
import {
  CalendarClock,
  Check,
  MapPin,
  Navigation,
  Phone,
  Route,
  Timer,
  Truck,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

const ACCENT = "#1565C0";

const TONE = {
  New: "blue",
  Accepted: "green",
  Declined: "red",
  Completed: "gray",
} as const;

export function VehicleRequestDetails() {
  const { id = "" } = useParams();
  const [statuses, setStatuses] = useLocalState<Record<string, string>>(
    "vehicle:request-status",
    {},
  );
  const [activeId, setActiveId] = useLocalState<string>("vehicle:active-request", "");

  const base = VEHICLE_REQUESTS.find((request) => request.id === id);
  const request: ServiceRequest | undefined = base
    ? { ...base, status: (statuses[base.id] ?? base.status) as ServiceRequest["status"] }
    : undefined;

  if (!request) {
    return (
      <RolePage
        role="vehicle_owner"
        active="requests"
        title="Request not found"
        subtitle="This service request is no longer available."
      >
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">We couldn't find that request</p>
          <Button asChild className="mt-4 h-11 rounded-xl">
            <Link to="/vehicle/requests">Back to requests</Link>
          </Button>
        </Panel>
      </RolePage>
    );
  }

  const matching = VEHICLE_DEMO_FLEET.filter((vehicle) =>
    request.vehicleFit.some((fit) => vehicle.types.includes(fit)),
  );

  const accept = () => {
    setStatuses((prev) => ({ ...prev, [request.id]: "Accepted" }));
    setActiveId(request.id);
    toast.success("Request accepted — it's now your active service");
  };

  const decline = () => {
    setStatuses((prev) => ({ ...prev, [request.id]: "Declined" }));
    toast("Request declined");
  };

  return (
    <RolePage
      role="vehicle_owner"
      active="requests"
      title={request.serviceType}
      subtitle={`${request.id} · requested by ${request.requester}`}
      action={<DemoTag />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[18px] font-semibold tracking-[-0.01em] text-foreground">
                  {request.serviceType}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {request.requester} · {request.requesterType}
                </p>
              </div>
              <StatusPill label={request.status} tone={TONE[request.status]} />
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">
              {request.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={`${request.distanceKm} km away`} tone="blue" />
              <StatusPill label={`${request.etaMinutes} min drive`} tone="gray" />
              {request.crop ? (
                <StatusPill label={`Crop: ${request.crop}`} tone="green" />
              ) : null}
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <SectionHead title="Route" subtitle="Quiet map of the pickup point" />
            <MiniMap
              accent={ACCENT}
              showControls={false}
              serviceLabel={request.location}
              markers={[
                { id: "self", x: 50, y: 52, label: "You", tone: "self" },
                {
                  id: request.id,
                  x: 68,
                  y: 30,
                  label: request.location,
                  tone: "destination",
                },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-11 flex-1 gap-2 rounded-xl">
                <Navigation className="size-4" />
                Start navigation
              </Button>
              <Button variant="ghost" className="h-11 flex-1 gap-2 rounded-xl">
                <Phone className="size-4" />
                Call requester
              </Button>
            </div>
          </Panel>

          <Panel>
            <SectionHead
              title="Your vehicles that fit"
              subtitle="Matched against the requested vehicle types"
            />
            <ul className="mt-4 flex flex-col gap-3">
              {matching.map((vehicle) => (
                <li
                  key={vehicle.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAF0EA] bg-surface-2 px-4 py-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {vehicle.brand} {vehicle.types[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.registration} · {vehicle.capacity}
                    </p>
                  </div>
                  <StatusPill label="Best match" tone="green" />
                </li>
              ))}
              {matching.length === 0 ? (
                <li className="rounded-2xl bg-surface-2 px-4 py-6 text-center text-sm text-muted-foreground">
                  None of your listed vehicles match this request type.
                </li>
              ) : null}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Request details" />
            <div className="mt-3">
              <MetaRow
                label="Requested for"
                value={request.requestedFor}
                icon={CalendarClock}
              />
              <MetaRow label="Pickup" value={request.location} icon={MapPin} />
              <MetaRow label="Distance" value={`${request.distanceKm} km`} icon={Route} />
              <MetaRow label="Est. drive" value={`${request.etaMinutes} min`} icon={Timer} />
              <MetaRow
                label="Vehicle needed"
                value={request.vehicleFit.join(", ")}
                icon={Truck}
              />
            </div>
          </Panel>

          <Panel className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Respond</p>
            {request.status === "New" ? (
              <Button className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold" onClick={accept}>
                <Check className="size-4" />
                ACCEPT
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
              onClick={decline}
              disabled={request.status === "Completed"}
            >
              <X className="size-4" />
              {request.status === "Accepted" ? "CANCEL" : "DECLINE"}
            </Button>
            {request.status === "Accepted" ? (
              <Button asChild className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold">
                <Link to="/vehicle/active">Open active service</Link>
              </Button>
            ) : null}
            <InfoNote tone="warn">
              Declining keeps the request open for other drivers nearby and does not
              affect your acceptance rate history.
            </InfoNote>
          </Panel>
        </div>
      </div>
    </RolePage>
  );
}

export default VehicleRequestDetails;
