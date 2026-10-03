import {
  Chip,
  DemoTag,
  InfoNote,
  MiniMap,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { LABOUR_JOBS, SERVICE_RADIUS_OPTIONS } from "@/lib/role-data";
import { useMutation } from "convex/react";
import { Loader2, MapPin, Navigation, Save } from "lucide-react";
import { useCurrentLocation } from "@/lib/actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ACCENT = "#EF6C00";

export function LabourServiceArea() {
  const { profile } = useFarmerProfile();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [radius, setRadius] = useState("20 km");
  const [city, setCity] = useState("Bengaluru");
  const [district, setDistrict] = useState("Bengaluru Urban");
  const [state, setState] = useState("Karnataka");
  const [saving, setSaving] = useState(false);
  const [coords, setCoords] = useState("");

  useEffect(() => {
    const area = profile?.serviceArea;
    if (!area) return;
    if (area.city) setCity(area.city);
    if (area.district) setDistrict(area.district);
    if (area.state) setState(area.state);
    if (area.radius) setRadius(area.radius);
  }, [profile]);

  const limit = Number.parseInt(radius, 10) || 20;
  const withinRadius = LABOUR_JOBS.filter((job) => job.distanceKm <= limit);

  const save = async () => {
    setSaving(true);
    try {
      await saveProfile({ serviceArea: { city, district, state, radius } });
      toast.success("Service area updated");
    } catch {
      toast.error("We couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RolePage
      role="labour"
      active="area"
      title="Service Area"
      subtitle="Choose how far you're willing to travel for work — jobs outside your radius are not shown."
      action={
        <Button
          className="h-11 gap-2 rounded-xl"
          disabled={saving}
          onClick={save}
          style={{ backgroundColor: ACCENT }}
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save area
        </Button>
      }
    >
      <Panel className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <SectionHead title="Area preview" subtitle="Quiet map of where jobs will appear" />
          <DemoTag />
        </div>
        <div className="px-5">
          <MiniMap
            accent={ACCENT}
            serviceLabel={`${city} · ${radius}`}
            markers={[
              { id: "self", x: 50, y: 52, label: "You", tone: "self" },
              ...withinRadius.slice(0, 4).map((job, index) => ({
                id: job.id,
                x: [28, 70, 36, 62][index] ?? 30,
                y: [30, 36, 72, 76][index] ?? 44,
                label: job.workType,
                tone: "request" as const,
              })),
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 p-5">
          <StatusPill
            label={`${withinRadius.length} job${withinRadius.length === 1 ? "" : "s"} inside ${radius}`}
            tone="green"
          />
          <StatusPill
            label={`${LABOUR_JOBS.length - withinRadius.length} outside your radius`}
            tone="gray"
          />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHead title="Travel radius" subtitle="How far will you go for work?" />
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICE_RADIUS_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={radius === option}
                onClick={() => setRadius(option)}
              />
            ))}
          </div>
          <div className="mt-4">
            <InfoNote>
              A larger radius shows more jobs but means longer travel. Start with 10 km and
              widen it when you want more work.
            </InfoNote>
          </div>
        </Panel>

        <Panel>
          <SectionHead title="Your location" subtitle="Used to match nearby jobs" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">City / village</Label>
              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="h-11 rounded-xl"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">District</Label>
              <Input
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="h-11 rounded-xl"
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <Label className="text-[13px] font-medium">State</Label>
              <Input
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="h-11 rounded-xl"
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-3 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {city}, {district}, {state}
          </div>
          <Button
            variant="outline"
            className="mt-4 h-11 w-full gap-2 rounded-xl"
            onClick={() =>
              useCurrentLocation(
                ({ latitude, longitude }) => {
                  setCoords(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                  toast.success("Location captured — check the area name and save.");
                },
                () => setCoords(""),
              )
            }
          >
            <Navigation className="size-4" />
            {coords ? "Update my location" : "Use my current location"}
          </Button>
          {coords ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              Captured {coords}
            </p>
          ) : null}
        </Panel>
      </div>
    </RolePage>
  );
}

export default LabourServiceArea;
