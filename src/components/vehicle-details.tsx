import { Chip, MetaRow, Panel, StatusPill } from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MANUFACTURING_YEARS,
  SERVICE_RADIUS_OPTIONS,
  VEHICLE_AVAILABILITY,
  VEHICLE_CAPACITY_NOT_APPLICABLE,
  VEHICLE_CAPACITY_TRANSPORT,
  VEHICLE_CAPACITY_WATER,
  VEHICLE_SERVICES,
  VEHICLE_TYPES,
  emptyVehicleDraft,
  IMG,
  type VehicleDraft,
} from "@/lib/role-data";
import { cn } from "@/lib/utils";
import {
  Camera,
  Check,
  FolderOpen,
  ImagePlus,
  Pencil,
  Plus,
  Truck,
} from "lucide-react";
import { useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * SHARED VEHICLE DETAILS
 *
 * The same component, ordering, icons and validation are used by the
 * Vehicle Owner workspace and by Labour when vehicle usage is switched on.
 * ------------------------------------------------------------------ */

type FieldKey =
  | "types"
  | "registration"
  | "brand"
  | "model"
  | "year"
  | "capacity"
  | "services"
  | "area"
  | "availability";

type Errors = Partial<Record<FieldKey, string>>;

export function validateVehicle(draft: VehicleDraft): Errors {
  const errors: Errors = {};
  if (draft.types.length === 0) errors.types = "Select at least one vehicle type.";
  if (draft.registration.trim().length < 4)
    errors.registration = "Enter the registration number.";
  if (draft.brand.trim().length < 2) errors.brand = "Enter the vehicle brand.";
  if (draft.model.trim().length < 1) errors.model = "Enter the vehicle model.";
  if (!draft.year) errors.year = "Select the manufacturing year.";
  if (!draft.capacity && draft.capacityKind !== "na")
    errors.capacity = "Select the vehicle capacity.";
  if (draft.services.length === 0)
    errors.services = "Select at least one vehicle service.";
  if (!draft.area.city.trim() || !draft.area.state.trim())
    errors.area = "Add the city and state for your service area.";
  if (!draft.availability) errors.availability = "Choose availability.";
  return errors;
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function Step({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-xs font-bold text-primary">
        {index}
      </span>
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
    </div>
  );
}

export function VehicleDetailsForm({
  initial,
  onSave,
  onCancel,
  saveLabel = "Save Vehicle",
  addAnother = false,
}: {
  initial?: VehicleDraft;
  onSave: (vehicle: VehicleDraft) => void;
  onCancel?: () => void;
  saveLabel?: string;
  /** Show the shared "+ Add Another Vehicle" action. */
  addAnother?: boolean;
}) {
  const [draft, setDraft] = useState<VehicleDraft>(initial ?? emptyVehicleDraft());
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  function patch(next: Partial<VehicleDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function toggleType(value: string) {
    const exists = draft.types.includes(value);
    patch({
      types: exists
        ? draft.types.filter((item) => item !== value)
        : [...draft.types, value],
    });
  }

  function toggleService(value: string) {
    const exists = draft.services.includes(value);
    patch({
      services: exists
        ? draft.services.filter((item) => item !== value)
        : [...draft.services, value],
    });
  }

  function handleImage(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    patch({ image: URL.createObjectURL(file) });
  }

  function submit(keepOpen: boolean) {
    const nextErrors = validateVehicle(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave({
      ...draft,
      id: draft.id || `vehicle-${Date.now()}`,
      registration: draft.registration.trim().toUpperCase(),
    });
    if (keepOpen) {
      setSaved(draft.registration.trim().toUpperCase());
      setDraft(emptyVehicleDraft());
      setErrors({});
    }
  }

  const capacityOptions =
    draft.capacityKind === "water"
      ? VEHICLE_CAPACITY_WATER
      : draft.capacityKind === "transport"
        ? VEHICLE_CAPACITY_TRANSPORT
        : [VEHICLE_CAPACITY_NOT_APPLICABLE];

  return (
    <div className="flex flex-col gap-5">
      <Panel className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
            <Truck className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
              🚚 VEHICLE DETAILS
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Tell us about the vehicle you use for your agricultural services.
            </p>
          </div>
        </div>
        {saved ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-success-bg px-3.5 py-2.5 text-xs font-medium text-success">
            <Check className="size-3.5" />
            {saved} added. You can add another vehicle below.
          </p>
        ) : null}
      </Panel>

      {/* 1 — Vehicle type */}
      <Panel className="p-6">
        <Step index={1} title="Vehicle Type" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Select every type that applies to this vehicle.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              selected={draft.types.includes(type)}
              onClick={() => toggleType(type)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              patch({
                types: draft.types.includes("Other")
                  ? draft.types
                  : [...draft.types, "Other"],
              })
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-dashed border-border px-4 text-sm font-medium text-primary hover:bg-accent"
          >
            <Plus className="size-3.5" />
            Add Other Vehicle Type
          </button>
        </div>
        {errors.types ? (
          <p className="mt-2 text-xs font-medium text-danger" role="alert">
            {errors.types}
          </p>
        ) : null}
      </Panel>

      {/* 2–5 — Identity */}
      <Panel className="flex flex-col gap-5 p-6">
        <Step index={2} title="Vehicle Identity" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Registration Number"
            hint="Example: KA 01 AB 1234"
            error={errors.registration}
          >
            <Input
              value={draft.registration}
              onChange={(event) => patch({ registration: event.target.value })}
              placeholder="Enter registration number"
              className="h-12 rounded-xl text-[15px] uppercase"
            />
          </Field>
          <Field label="Vehicle Make / Brand" hint="Example: Mahindra" error={errors.brand}>
            <Input
              value={draft.brand}
              onChange={(event) => patch({ brand: event.target.value })}
              placeholder="Enter vehicle brand"
              className="h-12 rounded-xl text-[15px]"
            />
          </Field>
          <Field label="Vehicle Model" hint="Example: 575 DI" error={errors.model}>
            <Input
              value={draft.model}
              onChange={(event) => patch({ model: event.target.value })}
              placeholder="Enter vehicle model"
              className="h-12 rounded-xl text-[15px]"
            />
          </Field>
          <Field label="Manufacturing Year" error={errors.year}>
            <Select
              value={draft.year}
              onValueChange={(value) => patch({ year: value })}
            >
              <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {MANUFACTURING_YEARS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Panel>

      {/* 6 — Capacity */}
      <Panel className="p-6">
        <Step index={6} title="Vehicle Capacity" />
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              { key: "water", label: "Water capacity" },
              { key: "transport", label: "Transport capacity" },
              { key: "na", label: VEHICLE_CAPACITY_NOT_APPLICABLE },
            ] as const
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={draft.capacityKind === option.key}
              onClick={() =>
                patch({ capacityKind: option.key, capacity: "" })
              }
              className={cn(
                "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                draft.capacityKind === option.key
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {draft.capacityKind !== "na" ? (
          <div className="mt-4">
            <Label className="text-sm font-medium">
              {draft.capacityKind === "water"
                ? "Water capacity"
                : "Transport capacity"}
            </Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {capacityOptions.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={draft.capacity === option}
                  onClick={() => patch({ capacity: option })}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-surface-2 px-3.5 py-3 text-xs text-muted-foreground">
            Capacity is not applicable for this vehicle type.
          </p>
        )}
        {errors.capacity ? (
          <p className="mt-2 text-xs font-medium text-danger" role="alert">
            {errors.capacity}
          </p>
        ) : null}
      </Panel>

      {/* 7 — Services */}
      <Panel className="p-6">
        <Step index={7} title="Vehicle Services" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          What can this vehicle be booked for?
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {VEHICLE_SERVICES.map((service) => (
            <Chip
              key={service}
              label={service}
              selected={draft.services.includes(service)}
              onClick={() => toggleService(service)}
            />
          ))}
        </div>
        {errors.services ? (
          <p className="mt-2 text-xs font-medium text-danger" role="alert">
            {errors.services}
          </p>
        ) : null}
      </Panel>

      {/* 8 — Service area */}
      <Panel className="flex flex-col gap-5 p-6">
        <Step index={8} title="Service Area" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City" error={errors.area}>
            <Input
              value={draft.area.city}
              onChange={(event) =>
                patch({ area: { ...draft.area, city: event.target.value } })
              }
              placeholder="Enter city"
              className="h-12 rounded-xl text-[15px]"
            />
          </Field>
          <Field label="District">
            <Input
              value={draft.area.district}
              onChange={(event) =>
                patch({ area: { ...draft.area, district: event.target.value } })
              }
              placeholder="Enter district"
              className="h-12 rounded-xl text-[15px]"
            />
          </Field>
          <Field label="State">
            <Input
              value={draft.area.state}
              onChange={(event) =>
                patch({ area: { ...draft.area, state: event.target.value } })
              }
              placeholder="Enter state"
              className="h-12 rounded-xl text-[15px]"
            />
          </Field>
        </div>
        <div>
          <Label className="text-sm font-medium">Radius</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {SERVICE_RADIUS_OPTIONS.map((radius) => (
              <Chip
                key={radius}
                label={radius}
                selected={draft.area.radius === radius}
                onClick={() => patch({ area: { ...draft.area, radius } })}
              />
            ))}
          </div>
        </div>
      </Panel>

      {/* 9 — Availability */}
      <Panel className="p-6">
        <Step index={9} title="Availability" />
        <div className="mt-4 flex flex-wrap gap-2">
          {VEHICLE_AVAILABILITY.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={draft.availability === option}
              onClick={() => patch({ availability: option })}
            />
          ))}
        </div>
        {errors.availability ? (
          <p className="mt-2 text-xs font-medium text-danger" role="alert">
            {errors.availability}
          </p>
        ) : null}
      </Panel>

      {/* 10 — Vehicle image */}
      <Panel className="p-6">
        <Step index={10} title="Vehicle Image" />
        <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-[#EAF0EA] bg-surface-3">
            {draft.image ? (
              <img
                src={draft.image}
                alt="Selected vehicle"
                className="h-[150px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[150px] flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImagePlus className="size-6" />
                <span className="text-xs font-medium">No image yet</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-4 text-sm font-semibold"
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="size-4" />
              Camera
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-4 text-sm font-semibold"
              onClick={() => galleryRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              Gallery
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-4 text-sm font-semibold"
              onClick={() => uploadRef.current?.click()}
            >
              <FolderOpen className="size-4" />
              File Upload
            </Button>
            <p className="mt-1 w-full text-xs text-muted-foreground">
              A clear side photo helps requesters recognise your vehicle.
            </p>
          </div>
        </div>
      </Panel>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          handleImage(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleImage(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleImage(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="h-12 rounded-xl px-6 text-[15px] font-semibold"
          onClick={() => submit(false)}
        >
          <Check className="size-4" />
          {saveLabel}
        </Button>
        {addAnother ? (
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-xl px-6 text-[15px] font-semibold"
            onClick={() => submit(true)}
          >
            <Plus className="size-4" />
            Add Another Vehicle
          </Button>
        ) : null}
        {onCancel ? (
          <Button
            size="lg"
            variant="ghost"
            className="h-12 rounded-xl px-6 text-[15px] font-medium text-muted-foreground"
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/** Vehicle card used in fleet lists — same layout for every role. */
export function VehicleCard({
  vehicle,
  onView,
  onEdit,
}: {
  vehicle: VehicleDraft;
  onView?: () => void;
  onEdit?: () => void;
}) {
  const title = [vehicle.brand, vehicle.types[0]].filter(Boolean).join(" ");
  const available = vehicle.availability === "Full Time" || vehicle.availability === "Seasonal";
  return (
    <Panel className="p-4">
      <div className="overflow-hidden rounded-xl bg-surface-3">
        <img
          src={vehicle.image || IMG.tractor}
          alt={title}
          loading="lazy"
          className="h-[150px] w-full object-cover"
        />
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-foreground">
            🚜 {title}
          </p>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">
            {vehicle.registration}
          </p>
          <p className="text-xs text-muted-foreground">
            {vehicle.model} · {vehicle.year}
          </p>
        </div>
        <StatusPill
          label={vehicle.availability || "Not set"}
          tone={available ? "green" : "gray"}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-10 rounded-xl px-3.5 text-[13px] font-semibold"
          onClick={onView}
        >
          View Details
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-10 rounded-xl px-3.5 text-[13px] font-semibold text-muted-foreground"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>
    </Panel>
  );
}

/** Detail rows for a single vehicle — shared across roles. */
export function VehicleDetailRows({ vehicle }: { vehicle: VehicleDraft }) {
  return (
    <div className="flex flex-col">
      <MetaRow label="Vehicle type" value={vehicle.types.join(", ") || "—"} />
      <MetaRow label="Registration number" value={vehicle.registration || "—"} />
      <MetaRow label="Make / brand" value={vehicle.brand || "—"} />
      <MetaRow label="Model" value={vehicle.model || "—"} />
      <MetaRow label="Manufacturing year" value={vehicle.year || "—"} />
      <MetaRow
        label="Capacity"
        value={vehicle.capacity || VEHICLE_CAPACITY_NOT_APPLICABLE}
      />
      <MetaRow label="Services" value={vehicle.services.join(", ") || "—"} />
      <MetaRow
        label="Service area"
        value={
          [vehicle.area.city, vehicle.area.district, vehicle.area.state]
            .filter(Boolean)
            .join(", ") || "—"
        }
      />
      <MetaRow label="Radius" value={vehicle.area.radius} />
      <MetaRow label="Availability" value={vehicle.availability || "—"} />
    </div>
  );
}
