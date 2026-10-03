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
import {
  VEHICLE_DEMO_FLEET,
  VEHICLE_REQUESTS,
  type ServiceRequest,
} from "@/lib/role-data";
import { CalendarClock, CheckCircle2, MapPin, Navigation, Phone, Truck } from "lucide-react";
import { callContact, openDirections } from "@/lib/actions";
import { Link } from "react-router";
import { toast } from "sonner";

const ACCENT = "#1565C0";

export function VehicleActiveService() {
  const [statuses, setStatuses] = useLocalState<Record<string, string>>(
    "vehicle:request-status",
    {},
  );
  const [activeId, setActiveId] = useLocalState<string>("vehicle:active-request", "");
  const [started, setStarted] = useLocalState<boolean>("vehicle:service-started", false);

  const requests: ServiceRequest[] = VEHICLE_REQUESTS.map((request) => ({
    ...request,
    status: (statuses[request.id] ?? request.status) as ServiceRequest["status"],
  }));

  const request =
    requests.find((item) => item.id === activeId && item.status !== "Completed") ??
    requests.find((item) => item.status === "Accepted");

  if (!request) {
    return (
      <RolePage
        role="vehicle_owner"
        active="active"
        title="No active service"
        subtitle="Accept a request to start a service."
      >
        <Panel className="py-10 text-center">
          <Truck className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">You're all caught up</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Accepted requests appear here with start and complete controls.
          </p>
          <Button asChild className="mt-4 h-11 rounded-xl">
            <Link to="/vehicle/requests">Browse requests</Link>
          </Button>
        </Panel>
      </RolePage>
    );
  }

  const vehicle = VEHICLE_DEMO_FLEET.find((item) =>
    request.vehicleFit.some((fit) => item.types.includes(fit)),
  );

  const complete = () => {
    setStatuses((prev) => ({ ...prev, [request.id]: "Completed" }));
    setActiveId("");
    setStarted(false);
    toast.success("Service completed and added to your history");
  };

  return (
    <RolePage
      role="vehicle_owner"
      active="active"
      title="Active Service"
      subtitle={`${request.serviceType} · ${request.requester}`}
      action={<DemoTag />}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Stage"
          value={started ? "In progress" : "Ready to start"}
          note={request.requestedFor}
          icon={Navigation}
          accent={ACCENT}
        />
        <StatTile
          label="Drive time"
          value={`${request.etaMinutes} min`}
          note={`${request.distanceKm} km to pickup`}
          icon={MapPin}
          accent={ACCENT}
        />
        <StatTile
          label="Vehicle"
          value={vehicle?.registration ?? "Not set"}
          note={vehicle ? `${vehicle.brand} ${vehicle.types[0]}` : "Assign a vehicle"}
          icon={Truck}
          accent={ACCENT}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[18px] font-semibold tracking-[-0.01em] text-foreground">
                  {request.serviceType}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{request.location}</p>
              </div>
              <StatusPill label={started ? "In progress" : "Accepted"} tone="green" />
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">
              {request.description}
            </p>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <SectionHead title="Route to pickup" subtitle="Navigation stays secondary" />
            <MiniMap
              accent={ACCENT}
              showControls={false}
              serviceLabel={request.location}
              markers={[
                { id: "self", x: 50, y: 52, label: "You", tone: "self" },
                { id: request.id, x: 70, y: 28, label: request.location, tone: "destination" },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="h-11 flex-1 gap-2 rounded-xl"
                onClick={() => openDirections(request.location)}
              >
                <Navigation className="size-4" />
                Start navigation
              </Button>
              <Button
                variant="ghost"
                className="h-11 flex-1 gap-2 rounded-xl"
                onClick={() => callContact(request.requester)}
              >
                <Phone className="size-4" />
                Call requester
              </Button>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Job summary" />
            <div className="mt-3">
              <MetaRow label="Request ID" value={request.id} />
              <MetaRow label="Requested by" value={request.requester} />
              <MetaRow
                label="Requested for"
                value={request.requestedFor}
                icon={CalendarClock}
              />
              <MetaRow label="Pickup" value={request.location} icon={MapPin} />
              <MetaRow label="Vehicle needed" value={request.vehicleFit.join(", ")} icon={Truck} />
            </div>
          </Panel>

          <Panel className="flex flex-col gap-3">
            {started ? (
              <Button
                className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
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
                  toast.success("Service started");
                }}
              >
                <Navigation className="size-4" />
                START
              </Button>
            )}
            <Button
              variant="outline"
              className="h-13 w-full gap-2 rounded-xl text-[15px] font-semibold"
              onClick={() => setStarted((prev) => !prev)}
            >
              {started ? "Pause job" : "Resume job"}
            </Button>
            <InfoNote>
              Completing a service saves it to your service history with the date,
              location and vehicle number.
            </InfoNote>
          </Panel>
        </div>
      </div>
    </RolePage>
  );
}

export default VehicleActiveService;
