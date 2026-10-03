import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_META, NEW_ROLES, type NewRoleId } from "@/lib/roles";
import { ArrowRight, Check, Flower2, Wheat } from "lucide-react";

/** Every role PlantGuard offers, in one list. */
export type ChooserRoleId = "farmer" | "nursery" | NewRoleId;

export type ChooserRole = {
  id: ChooserRoleId;
  /** Value persisted on the profile. */
  profileRole: ChooserRoleId;
  label: string;
  emoji: string;
  tagline: string;
  description: string;
  icon: typeof Wheat;
  accent: string;
  accentDark: string;
  accentSoft: string;
  /** Setup destination for this role. */
  setupTo: string;
};

const FARM_ROLES: ChooserRole[] = [
  {
    id: "farmer",
    profileRole: "farmer",
    label: "Farmer",
    emoji: "🌾",
    tagline: "I grow crops in the field",
    description:
      "Disease checks, crop health and farm services for the land you cultivate.",
    icon: Wheat,
    accent: "#2E7D32",
    accentDark: "#1B5E20",
    accentSoft: "#E8F5E9",
    setupTo: "/onboarding",
  },
  {
    id: "nursery",
    profileRole: "nursery",
    label: "Nursery",
    emoji: "🌿",
    tagline: "I grow and sell plants",
    description:
      "Stock health, bulk buyers and supplies for a plant nursery or garden centre.",
    icon: Flower2,
    accent: "#2E7D32",
    accentDark: "#1B5E20",
    accentSoft: "#E8F5E9",
    setupTo: "/onboarding",
  },
];

/** One ordered list of all seven roles — no separate farmer/nursery group. */
export const ALL_ROLES: ChooserRole[] = [
  ...FARM_ROLES,
  ...NEW_ROLES.map((id) => {
    const meta = ROLE_META[id];
    return {
      id,
      profileRole: id,
      label: meta.label,
      emoji: meta.emoji,
      tagline: meta.tagline,
      description: meta.description,
      icon: meta.icon,
      accent: meta.accent,
      accentDark: meta.accentDark,
      accentSoft: meta.accentSoft,
      setupTo: `/setup/${id}`,
    };
  }),
];

export function getChooserRole(id: string | undefined | null): ChooserRole | undefined {
  return ALL_ROLES.find((role) => role.id === id);
}

/**
 * The single role block used by sign-up step 1, the `/start` picker and the
 * landing page. All roles render together in one grid.
 */
export function RoleChooser({
  value,
  onSelect,
  columns = "sm:grid-cols-2",
  className,
}: {
  value?: string;
  onSelect: (role: ChooserRole) => void;
  columns?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", columns, className)}>
      {ALL_ROLES.map((role) => {
        const Icon = role.icon;
        const selected = value === role.id;
        return (
          <button
            key={role.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(role)}
            className={cn(
              "flex flex-col gap-3 rounded-2xl border p-5 text-left transition-colors",
              selected
                ? "border-primary bg-accent"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span
                className="flex size-11 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: role.accentSoft,
                  color: role.accentDark,
                }}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-2xl" aria-hidden>
                {role.emoji}
              </span>
            </span>
            <span>
              <span className="flex items-center gap-2 text-[17px] font-bold text-foreground">
                {role.label}
                {selected ? (
                  <Check className="size-4 text-primary" strokeWidth={3} />
                ) : null}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
                {role.tagline}
              </span>
            </span>
            <span className="text-sm leading-6 text-muted-foreground">
              {role.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Read-only variant for the landing page: every role links into `/start`. */
export function RoleGrid({
  columns = "sm:grid-cols-2 lg:grid-cols-3",
  onSelect,
  className,
}: {
  columns?: string;
  onSelect: (role: ChooserRole) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", columns, className)}>
      {ALL_ROLES.map((role) => {
        const Icon = role.icon;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role)}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex items-center justify-between gap-3">
              <span
                className="flex size-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: role.accentSoft, color: role.accentDark }}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-2xl" aria-hidden>
                {role.emoji}
              </span>
            </span>
            <span>
              <span className="block text-[16px] font-semibold text-foreground">
                {role.label}
              </span>
              <span className="mt-1 block text-[13px] font-medium text-muted-foreground">
                {role.tagline}
              </span>
            </span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-primary">
              Set up {role.label}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
