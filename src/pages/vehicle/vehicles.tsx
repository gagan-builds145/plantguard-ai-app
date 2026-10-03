import {
  DemoTag,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { VehicleCard } from "@/components/vehicle-details";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useLocalState } from "@/hooks/use-local-state";
import { VEHICLE_DEMO_FLEET, type VehicleDraft } from "@/lib/role-data";
import { Gauge, Plus, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router";

const ACCENT = "#1565C0";

export function VehicleFleet() {
  const { profile } = useFarmerProfile();
  const navigate = useNavigate();
  const [added] = useLocalState<VehicleDraft[]>("vehicle:added", []);
  const fleet = [...added, ...VEHICLE_DEMO_FLEET];

  const capacity = fleet.filter((vehicle) => vehicle.capacityKind !== "na").length;

  return (
    <RolePage
      role="vehicle_owner"
      active="vehicles"
      title="My Vehicles"
      subtitle="Every vehicle you list, the services it supports and the area it covers."
      action={
        <Link
          to="/vehicle/vehicles/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          Add Vehicle
        </Link>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Vehicles"
          value={String(fleet.length)}
          note="Listed and receiving work"
          icon={Truck}
          accent={ACCENT}
        />
        <StatTile
          label="With capacity"
          value={String(capacity)}
          note="Water or load capacity set"
          icon={Gauge}
          accent={ACCENT}
        />
        <StatTile
          label="Base city"
          value={profile?.location?.city ?? "Bengaluru"}
          note="Service area centre"
          icon={Truck}
          accent={ACCENT}
        />
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Your fleet"
            subtitle="Tap a vehicle to see full details or edit it"
          />
          <DemoTag />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {fleet.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onView={() => navigate(`/vehicle/vehicles/${vehicle.id}`)}
              onEdit={() => navigate(`/vehicle/vehicles/${vehicle.id}`)}
            />
          ))}
          <Link
            to="/vehicle/vehicles/new"
            className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C9D8C9] bg-surface-2 text-center transition-colors hover:border-[#1565C0]/50"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#E3F2FD]">
              <Plus className="size-5" style={{ color: ACCENT }} />
            </span>
            <span className="text-sm font-semibold text-foreground">Add another vehicle</span>
            <span className="text-xs text-muted-foreground">
              Type, registration, capacity, services and area
            </span>
          </Link>
        </div>
      </Panel>

      <Panel>
        <SectionHead
          title="How vehicles are matched"
          subtitle="Requests are matched against these fields"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Vehicle type",
            "Services offered",
            "Service radius",
            "Availability",
            "Capacity",
          ].map((field) => (
            <StatusPill key={field} label={field} tone="blue" />
          ))}
        </div>
      </Panel>
    </RolePage>
  );
}

export default VehicleFleet;
