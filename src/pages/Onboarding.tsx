import { PlantGuardLogo } from "@/components/brand";
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
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useI18n } from "@/lib/i18n";
import {
  CROP_GROUPS,
  FARMER_HELP_OPTIONS,
  FARM_SIZES,
  FARMING_TYPES,
  LANGUAGES,
  LOCATIONS,
  NURSERY_CATEGORY_GROUPS,
  NURSERY_HELP_OPTIONS,
  NURSERY_SCALES,
  NURSERY_TYPES,
  WORKSPACE_ROLES,
  type WorkspaceRole,
} from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Leaf,
  Loader2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

// Role · Name · Location · Language · Farm/Nursery · Help
const TOTAL_STEPS = 6;

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {selected ? (
        <Check className="size-3.5 text-primary" strokeWidth={3} />
      ) : null}
      {label}
    </button>
  );
}

function OptionCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-accent"
          : "border-border bg-card hover:border-primary/40",
      )}
    >
      <span className="flex w-full items-center justify-between">
        <span className="text-[15px] font-semibold text-foreground">{label}</span>
        {selected ? (
          <CheckCircle2 className="size-5 text-primary" />
        ) : (
          <span className="size-5 rounded-full border border-border" />
        )}
      </span>
      <span className="text-sm leading-6 text-muted-foreground">
        {description}
      </span>
    </button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useFarmerProfile();
  const { t, setLanguage: setUiLanguage } = useI18n();
  const saveProfile = useMutation(api.farmers.saveProfile);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState<WorkspaceRole | "">("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locationChosen, setLocationChosen] = useState(false);
  const [language, setLanguage] = useState("");
  const [languageQuery, setLanguageQuery] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [farmSize, setFarmSize] = useState("");
  const [farmingType, setFarmingType] = useState("");
  const [nurseryType, setNurseryType] = useState("");
  const [nurseryCategories, setNurseryCategories] = useState<string[]>([]);
  const [nurseryScale, setNurseryScale] = useState("");
  const [helpNeeded, setHelpNeeded] = useState<string[]>([]);
  const [nameError, setNameError] = useState<string | null>(null);

  const isNursery = role === "nursery";

  useEffect(() => {
    if (user?.name && !displayName) setDisplayName(user.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name]);

  const states = country ? Object.keys(LOCATIONS[country] ?? {}) : [];
  const cities = country && state ? (LOCATIONS[country]?.[state] ?? []) : [];

  const filteredLanguages = useMemo(() => {
    const query = languageQuery.trim().toLowerCase();
    if (!query) return LANGUAGES;
    return LANGUAGES.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.native.toLowerCase().includes(query),
    );
  }, [languageQuery]);

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function chooseRole(next: WorkspaceRole) {
    setRole(next);
    // Help options differ by role — start fresh when the role changes.
    setHelpNeeded([]);
  }

  async function persist(patch: Parameters<typeof saveProfile>[0]) {
    setSaving(true);
    try {
      await saveProfile(patch);
    } catch {
      toast.error("We couldn't save that. Please try again.");
      throw new Error("save failed");
    } finally {
      setSaving(false);
    }
  }

  async function next() {
    if (step === 0) {
      if (!role) return;
      try {
        await persist({ role });
      } catch {
        return;
      }
    }

    if (step === 1) {
      if (displayName.trim().length < 2) {
        setNameError("Please enter your name.");
        return;
      }
      setNameError(null);
      try {
        await persist({ displayName: displayName.trim() });
      } catch {
        return;
      }
    }

    if (step === 2) {
      try {
        await persist(
          locationChosen && country && state && city
            ? { location: { country, state, city } }
            : {},
        );
      } catch {
        return;
      }
    }

    if (step === 3) {
      try {
        await persist({ language });
      } catch {
        return;
      }
    }

    if (step === 4) {
      try {
        if (isNursery) {
          await persist({ nurseryType, nurseryCategories, nurseryScale });
        } else {
          await persist({ crops, farmSize, farmingType });
        }
      } catch {
        return;
      }
    }

    setStep((value) => Math.min(value + 1, TOTAL_STEPS));
  }

  async function finish() {
    setSaving(true);
    try {
      await saveProfile({ helpNeeded, onboardedAt: Date.now() });
      toast.success("Profile saved");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("We couldn't save your profile. Please try again.");
      setSaving(false);
    }
  }

  const total = TOTAL_STEPS;
  const isDone = step === total;

  // Every step needs a choice before the user can move on.
  const canContinue = [
    role !== "",
    displayName.trim().length >= 2,
    locationChosen && Boolean(country && state && city),
    language !== "",
    isNursery
      ? nurseryCategories.length > 0 && nurseryType !== "" && nurseryScale !== ""
      : crops.length > 0 && farmSize !== "" && farmingType !== "",
    helpNeeded.length > 0,
  ][step] ?? false;

  const helpOptions = isNursery ? NURSERY_HELP_OPTIONS : FARMER_HELP_OPTIONS;

  // Already set up? Skip profile setup and go to the workspace.
  if (!profileLoading && profile?.onboardedAt) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-2">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <PlantGuardLogo />
          {!isDone && (
            <span className="text-xs font-medium text-muted-foreground">
              Step {step + 1} of {total}
            </span>
          )}
        </div>
        <div className="h-1 w-full bg-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((isDone ? total : step) / total) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {step === 0 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-10">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Leaf className="size-6" />
            </span>
            <h1 className="mt-5 text-[26px] font-bold tracking-[-0.02em] text-foreground">
              Welcome to PlantGuard AI
            </h1>
            <p className="mt-2 max-w-lg text-[15px] leading-7 text-muted-foreground">
              First, tell us how you work with plants. We&apos;ll tailor your
              workspace, services and guidance to match. You can change this
              later from your profile.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {WORKSPACE_ROLES.map((item) => {
                const Icon = item.icon;
                const selected = role === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseRole(item.role)}
                    className={cn(
                      "flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors",
                      selected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-card text-primary">
                        <Icon className="size-6" />
                      </span>
                      {selected ? (
                        <CheckCircle2 className="size-5 text-primary" />
                      ) : (
                        <span className="size-5 rounded-full border border-border" />
                      )}
                    </span>
                    <span>
                      <span className="block text-[17px] font-bold text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-primary">
                        {item.tagline}
                      </span>
                    </span>
                    <span className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-10">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Leaf className="size-6" />
            </span>
            <h1 className="mt-5 text-[26px] font-bold tracking-[-0.02em] text-foreground">
              {isNursery
                ? "Let's set up your nursery"
                : "Let's set up your farm workspace"}
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-7 text-muted-foreground">
              It takes about two minutes, and you can change everything later.
            </p>

            <div className="mt-8 flex max-w-md flex-col gap-2">
              <Label htmlFor="displayName" className="text-sm font-medium">
                What should we call you? <span className="text-danger">*</span>
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                aria-invalid={Boolean(nameError)}
                className="h-12 rounded-xl text-[15px]"
              />
              {nameError ? (
                <p className="text-sm font-medium text-danger" role="alert">
                  {nameError}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  This is how your workspace greets you.
                </p>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-10">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <MapPin className="size-6" />
            </span>
            <h1 className="mt-5 text-[26px] font-bold tracking-[-0.02em] text-foreground">
              Personalize your PlantGuard AI experience
            </h1>
            <p className="mt-2 max-w-lg text-[15px] leading-7 text-muted-foreground">
              Your location helps us provide relevant weather, plant-care, and
              agricultural information. Location is optional.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Country</Label>
                <Select
                  value={country}
                  onValueChange={(value) => {
                    setCountry(value);
                    setState("");
                    setCity("");
                    setLocationChosen(false);
                  }}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(LOCATIONS).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">State</Label>
                <Select
                  value={state}
                  onValueChange={(value) => {
                    setState(value);
                    setCity("");
                    setLocationChosen(false);
                  }}
                  disabled={!country}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">City</Label>
                <Select
                  value={city}
                  onValueChange={(value) => {
                    setCity(value);
                    setLocationChosen(true);
                  }}
                  disabled={!state}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {locationChosen ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-accent px-4 py-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-accent-foreground">
                    Is this location correct?
                  </p>
                  <p className="text-sm text-accent-foreground/80">
                    {city}, {state}, {country}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-surface-2 px-4 py-3 text-xs text-muted-foreground">
                Not now? You can skip this and add your location later from your
                profile. Weather and nearby services stay clearly marked until
                then.
              </p>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-10">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Sparkles className="size-6" />
            </span>
            <h1 className="mt-5 text-[26px] font-bold tracking-[-0.02em] text-foreground">
              Which language would you like to use?
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
              Choose the language you&apos;re most comfortable reading.
            </p>

            <div className="relative mt-6">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={languageQuery}
                onChange={(event) => setLanguageQuery(event.target.value)}
                placeholder="Search languages"
                className="h-12 rounded-xl pl-10 text-[15px]"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {filteredLanguages.map((item) => {
                const selected = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setLanguage(item.code);
                      setUiLanguage(item.code);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors",
                      selected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span>
                      <span className="block text-[15px] font-semibold text-foreground">
                        {item.native}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {item.label}
                      </span>
                    </span>
                    {selected ? (
                      <Check className="size-5 text-primary" strokeWidth={2.5} />
                    ) : null}
                  </button>
                );
              })}
            </div>
            {filteredLanguages.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                No languages found. Try a different search term.
              </p>
            )}
          </section>
        )}

        {step === 4 && !isNursery && (
          <section className="flex flex-col gap-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
              <h1 className="text-[24px] font-bold tracking-[-0.02em] text-foreground">
                Tell us about your farming
              </h1>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                Select the crops you grow. This personalises disease guidance and
                your dashboard.
              </p>

              <div className="mt-6 flex flex-col gap-6">
                {CROP_GROUPS.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {group.group}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.crops.map((crop) => (
                        <Chip
                          key={`${group.group}-${crop}`}
                          label={crop}
                          selected={crops.includes(crop)}
                          onToggle={() => toggle(crops, crop, setCrops)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {crops.length > 0 && (
                <p className="mt-5 text-sm font-medium text-primary">
                  {crops.length} crop{crops.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">Farm size</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {FARM_SIZES.map((size) => (
                  <OptionCard
                    key={size}
                    label={size}
                    description="Approximate total cultivated area"
                    selected={farmSize === size}
                    onSelect={() => setFarmSize(size)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">
                Farming type
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {FARMING_TYPES.map((type) => (
                  <OptionCard
                    key={type}
                    label={type}
                    description="How your farm is currently managed"
                    selected={farmingType === type}
                    onSelect={() => setFarmingType(type)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 4 && isNursery && (
          <section className="flex flex-col gap-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
              <h1 className="text-[24px] font-bold tracking-[-0.02em] text-foreground">
                Tell us about your nursery
              </h1>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                Select the plant categories you grow or stock. This personalises
                stock health tracking and your dashboard.
              </p>

              <div className="mt-6 flex flex-col gap-6">
                {NURSERY_CATEGORY_GROUPS.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {group.group}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Chip
                          key={`${group.group}-${item}`}
                          label={item}
                          selected={nurseryCategories.includes(item)}
                          onToggle={() =>
                            toggle(
                              nurseryCategories,
                              item,
                              setNurseryCategories,
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {nurseryCategories.length > 0 && (
                <p className="mt-5 text-sm font-medium text-primary">
                  {nurseryCategories.length} categor
                  {nurseryCategories.length > 1 ? "ies" : "y"} selected
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">
                Nursery type
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {NURSERY_TYPES.map((type) => (
                  <OptionCard
                    key={type}
                    label={type}
                    description="How your nursery mainly operates"
                    selected={nurseryType === type}
                    onSelect={() => setNurseryType(type)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">
                Nursery scale
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {NURSERY_SCALES.map((scale) => (
                  <OptionCard
                    key={scale}
                    label={scale}
                    description="Approximate plants held at any time"
                    selected={nurseryScale === scale}
                    onSelect={() => setNurseryScale(scale)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-10">
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-foreground">
              Where would you like help?
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
              Pick anything you&apos;d like PlantGuard AI to support you with.
              Select as many as you like.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {helpOptions.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={helpNeeded.includes(option)}
                  onToggle={() => toggle(helpNeeded, option, setHelpNeeded)}
                />
              ))}
            </div>
            {helpNeeded.length === 0 && (
              <p className="mt-5 text-xs text-muted-foreground">
                Select at least one option to continue.
              </p>
            )}
          </section>
        )}

        {isDone && (
          <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-12">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-bg text-success">
              <CheckCircle2 className="size-8" />
            </span>
            <h1 className="mt-6 text-[26px] font-bold tracking-[-0.02em] text-foreground">
              Profile ready
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
              Your PlantGuard AI {isNursery ? "nursery" : "farmer"} experience has
              been personalised based on your role and preferences.
            </p>
            <Button
              className="mt-8 h-12 w-full rounded-xl text-[15px] font-semibold sm:w-auto sm:px-8"
              onClick={finish}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  Go to {isNursery ? "nursery" : "dashboard"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </section>
        )}

        {/* Footer actions */}
        {!isDone && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              className="h-12 rounded-xl px-4 text-[15px] font-medium text-muted-foreground"
              onClick={() => setStep((value) => Math.max(value - 1, 0))}
              disabled={step === 0 || saving}
            >
              <ArrowLeft className="size-4" />
              {t("common.back")}
            </Button>
            <Button
              className="h-12 rounded-xl px-7 text-[15px] font-semibold"
              onClick={step === total - 1 ? finish : next}
              disabled={saving || !canContinue}
            >
              {saving ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {t("common.saving")}
                </>
              ) : step === total - 1 ? (
                "Save and continue"
              ) : (
                t("common.continue")
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
