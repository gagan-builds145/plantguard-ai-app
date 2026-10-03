import {
  Chip,
  DemoTag,
  InfoNote,
  MetaRow,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleDetailsForm } from "@/components/vehicle-details";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useLocalState } from "@/hooks/use-local-state";
import {
  LABOUR_SKILLS,
  VEHICLE_AVAILABILITY,
  type VehicleDraft,
} from "@/lib/role-data";
import { useMutation } from "convex/react";
import {
  Bell,
  CalendarClock,
  ChevronRight,
  Globe,
  Hammer,
  HelpCircle,
  History,
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

const ACCENT = "#EF6C00";

export function LabourProfile() {
  const { profile } = useFarmerProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [online] = useLocalState<boolean>("labour:online", false);
  const [editOpen, setEditOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicles, setVehicles] = useLocalState<VehicleDraft[]>("labour:vehicles", []);
  const [usesVehicle, setUsesVehicle] = useState(profile?.usesVehicle ?? false);
  const [availability, setAvailability] = useState(profile?.availability ?? "Full Time");
  const [name, setName] = useState(profile?.displayName ?? user?.name ?? "");
  const [saving, setSaving] = useState(false);

  const displayName = profile?.displayName ?? user?.name ?? "Worker";
  const city = profile?.serviceArea?.city ?? profile?.location?.city ?? "Bengaluru";
  const radius = profile?.serviceArea?.radius ?? "20 km";
  const skills = profile?.skills?.length ? profile.skills : LABOUR_SKILLS.slice(0, 3);

  const tiles = [
    { key: "jobs", label: "Nearby Jobs", value: "6", to: "/work/jobs", icon: Hammer },
    { key: "active", label: "Active Work", value: "1", to: "/work/active", icon: Hammer },
    { key: "upcoming", label: "Upcoming", value: "3", to: "/work/upcoming", icon: CalendarClock },
    { key: "history", label: "History", value: "18", to: "/work/history", icon: History },
  ];

  const settings = [
    { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell },
    { key: "insurance", label: "Insurance", to: "/work/insurance", icon: ShieldCheck },
    { key: "security", label: "Security", to: "/settings", icon: Settings },
    { key: "language", label: "Language", to: "/settings", icon: Globe },
    { key: "help", label: "Help & support", to: "/help", icon: HelpCircle },
  ];

  const saveDetails = async () => {
    setSaving(true);
    try {
      await saveProfile({
        displayName: name.trim(),
        availability,
        usesVehicle,
      });
      toast.success("Profile updated");
      setEditOpen(false);
    } catch {
      toast.error("We couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RolePage
      role="labour"
      active="profile"
      title="Profile"
      subtitle="Your worker profile, availability and account settings."
    >
      <Panel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span
            className="flex size-20 shrink-0 items-center justify-center rounded-3xl text-[30px] font-bold"
            style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
          >
            👷
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                {displayName}
              </p>
              <StatusPill label="Labour" tone="amber" />
              <StatusPill
                label={online ? "Online" : "Offline"}
                tone={online ? "green" : "gray"}
              />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {city} · {radius}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill label={availability} tone="gray" />
              {skills.slice(0, 3).map((skill) => (
                <StatusPill key={skill} label={skill} tone="amber" />
              ))}
              <DemoTag />
            </div>
          </div>
          <Button
            variant="outline"
            className="h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold"
            onClick={() => {
              setName(profile?.displayName ?? user?.name ?? "");
              setEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>
      </Panel>

      <section>
        <SectionHead title="Your work" subtitle="Everything you manage as a worker" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.key}
              to={tile.to}
              className="rounded-2xl border border-[#EAF0EA] bg-card p-4 shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors hover:border-primary/40"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
              >
                <tile.icon className="size-5" />
              </span>
              <p className="mt-3 text-lg font-bold text-foreground">{tile.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{tile.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHead
            title="Do you use a vehicle for work?"
            subtitle="Vehicle details are the same form vehicle owners use"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip label="Yes" selected={usesVehicle} onClick={() => setUsesVehicle(true)} />
            <Chip label="No" selected={!usesVehicle} onClick={() => setUsesVehicle(false)} />
          </div>

          {usesVehicle ? (
            <>
              <div className="mt-4">
                {vehicles.length ? (
                  <>
                    {vehicles.map((vehicle) => (
                      <MetaRow
                        key={vehicle.id || vehicle.registration}
                        label={vehicle.registration || "Vehicle"}
                        value={`${vehicle.brand} ${vehicle.types[0] ?? ""}`.trim()}
                      />
                    ))}
                    <Button
                      variant="outline"
                      className="mt-4 h-11 w-full gap-2 rounded-xl"
                      onClick={() => setVehicleOpen(true)}
                    >
                      <Truck className="size-4" />
                      Edit vehicle details
                    </Button>
                    <Button
                      variant="ghost"
                      className="mt-2 h-11 w-full rounded-xl"
                      onClick={() => setVehicles([])}
                    >
                      Remove vehicle
                    </Button>
                  </>
                ) : (
                  <Button
                    className="mt-4 h-11 w-full gap-2 rounded-xl"
                    style={{ backgroundColor: ACCENT }}
                    onClick={() => setVehicleOpen(true)}
                  >
                    <Truck className="size-4" />
                    Add vehicle details
                  </Button>
                )}
              </div>
              <div className="mt-4">
                <InfoNote>
                  The vehicle form here is the same one used by vehicle owners, so the same
                  fields (type, registration, capacity, services, area) appear either way.
                </InfoNote>
              </div>
            </>
          ) : (
            <div className="mt-4">
              <InfoNote>
                You travel to work on foot, by bus or by shared ride. Jobs are matched on
                distance only.
              </InfoNote>
            </div>
          )}
        </Panel>

        <Panel>
          <SectionHead title="Availability" subtitle="When you're able to take work" />
          <div className="mt-4 flex flex-wrap gap-2">
            {VEHICLE_AVAILABILITY.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={availability === option}
                onClick={() => setAvailability(option)}
              />
            ))}
          </div>
          <div className="mt-4">
            <MetaRow label="Status" value={online ? "Online" : "Offline"} />
            <MetaRow label="Service radius" value={radius} />
            <MetaRow label="Base city" value={city} />
          </div>
          <Link
            to="/work/area"
            className="mt-4 inline-flex text-[13px] font-semibold"
            style={{ color: ACCENT }}
          >
            Change service area
          </Link>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Your name appears to employers on jobs you accept.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Your name</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 rounded-xl text-[15px]"
              />
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
          </div>
          <DialogFooter>
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              disabled={saving}
              onClick={saveDetails}
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

      <Dialog open={vehicleOpen} onOpenChange={setVehicleOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Vehicle details</DialogTitle>
            <DialogDescription>
              Same vehicle form used across PlantGuard — type, registration, capacity,
              services and area.
            </DialogDescription>
          </DialogHeader>
          <VehicleDetailsForm
            initial={vehicles[0]}
            onSave={(vehicle) => {
              setVehicles([{ ...vehicle, id: vehicle.id || `lv-${Date.now()}` }]);
              toast.success("Vehicle details saved");
              setVehicleOpen(false);
            }}
            onCancel={() => setVehicleOpen(false)}
            saveLabel="Save Vehicle"
          />
        </DialogContent>
      </Dialog>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound className="size-3.5" />
        Signed in as {user?.email ?? "your PlantGuard AI account"}
      </p>
    </RolePage>
  );
}

export default LabourProfile;
