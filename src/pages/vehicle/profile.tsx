import {
  Chip,
  DemoTag,
  MetaRow,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useLocalState } from "@/hooks/use-local-state";
import {
  SERVICE_RADIUS_OPTIONS,
  VEHICLE_AVAILABILITY,
  VEHICLE_DEMO_FLEET,
} from "@/lib/role-data";
import { useMutation } from "convex/react";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  Globe,
  HelpCircle,
  Loader2,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function VehicleProfile() {
  const { profile } = useFarmerProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [online] = useLocalState<boolean>("vehicle:online", false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [radius, setRadius] = useState("20 km");
  const [availability, setAvailability] = useState("On Demand");
  const [usesVehicle, setUsesVehicle] = useState(true);

  const displayName = profile?.displayName ?? user?.name ?? "Vehicle Owner";
  const area = profile?.serviceArea;
  const city = area?.city ?? profile?.location?.city ?? "Bengaluru";

  const tiles = [
    { key: "requests", label: "Requests", value: "4", to: "/vehicle/requests", icon: ClipboardList },
    { key: "vehicles", label: "Vehicles", value: String(VEHICLE_DEMO_FLEET.length), to: "/vehicle/vehicles", icon: Truck },
    { key: "history", label: "Jobs done", value: "18", to: "/vehicle/history", icon: ClipboardList },
    { key: "insurance", label: "Insurance", value: "2", to: "/vehicle/insurance", icon: ShieldCheck },
  ];

  const settings = [
    { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell },
    { key: "security", label: "Security", to: "/settings", icon: Settings },
    { key: "language", label: "Language", to: "/settings", icon: Globe },
    { key: "help", label: "Help & support", to: "/help", icon: HelpCircle },
  ];

  const saveArea = async () => {
    setSaving(true);
    try {
      await saveProfile({
        availability,
        usesVehicle,
        serviceArea: {
          city,
          district: area?.district ?? city,
          state: area?.state ?? profile?.location?.state ?? "Karnataka",
          radius,
        },
      });
      toast.success("Service area updated");
      setAreaOpen(false);
    } catch {
      toast.error("We couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RolePage
      role="vehicle_owner"
      active="profile"
      title="Profile"
      subtitle="Your driver profile, service area and account settings."
    >
      <Panel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-[#E3F2FD] text-[30px] font-bold text-[#0D47A1]">
            🚜
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                {displayName}
              </p>
              <StatusPill label="Vehicle Owner" tone="blue" />
              <StatusPill
                label={online ? "Online" : "Offline"}
                tone={online ? "green" : "gray"}
              />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {city}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill label={`Radius ${radius}`} tone="gray" />
              <StatusPill label={availability} tone="gray" />
              <DemoTag />
            </div>
          </div>
          <Button
            variant="outline"
            className="h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold"
            onClick={() => setAreaOpen(true)}
          >
            <Pencil className="size-4" />
            Edit Area
          </Button>
        </div>
      </Panel>

      <section>
        <SectionHead title="Your work" subtitle="Quick access to your driver workspace" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.key}
              to={tile.to}
              className="rounded-2xl border border-[#EAF0EA] bg-card p-4 shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#E3F2FD]">
                <tile.icon className="size-5" style={{ color: "#1565C0" }} />
              </span>
              <p className="mt-3 text-lg font-bold text-foreground">{tile.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{tile.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <SectionHead title="Your vehicles" subtitle="Listed on your profile" />
          <div className="mt-3">
            {VEHICLE_DEMO_FLEET.map((vehicle) => (
              <MetaRow
                key={vehicle.id}
                label={vehicle.registration}
                value={`${vehicle.brand} ${vehicle.model}`}
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
          <SectionHead title="Driver status" />
          <div className="mt-3">
            <MetaRow label="Current status" value={online ? "Online" : "Offline"} />
            <MetaRow label="Availability" value={availability} />
            <MetaRow label="Service radius" value={radius} />
            <MetaRow label="Base city" value={city} />
          </div>
        </Panel>
      </div>

      <Panel className="p-2">
        <ul>
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-bg text-danger">
                <LogOut className="size-5" />
              </span>
              <span className="flex-1 text-sm font-semibold text-danger">Log out</span>
            </button>
          </li>
        </ul>
      </Panel>

      <Dialog open={areaOpen} onOpenChange={setAreaOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Service area &amp; availability</DialogTitle>
            <DialogDescription>
              Requests are matched to you based on your radius, availability and whether
              you use a vehicle for work.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">City</Label>
              <Input value={city} readOnly className="h-12 rounded-xl text-[15px]" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Service radius</Label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_RADIUS_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    selected={radius === option}
                    onClick={() => setRadius(option)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Availability</Label>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_AVAILABILITY.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    selected={availability === option}
                    onClick={() => setAvailability(option)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Do you use a vehicle for work?</Label>
              <div className="flex flex-wrap gap-2">
                <Chip label="Yes" selected={usesVehicle} onClick={() => setUsesVehicle(true)} />
                <Chip label="No" selected={!usesVehicle} onClick={() => setUsesVehicle(false)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              disabled={saving}
              onClick={saveArea}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound className="size-3.5" />
        Signed in as {user?.email ?? "your PlantGuard AI account"}
      </p>
    </RolePage>
  );
}

export default VehicleProfile;
