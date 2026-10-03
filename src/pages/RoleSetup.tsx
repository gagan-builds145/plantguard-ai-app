import { PlantGuardLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import {
  GROWER_INTERESTS,
  GROWER_SPACES,
  LABOUR_EQUIPMENT,
  LABOUR_EXPERIENCE_LEVELS,
  LABOUR_SKILLS,
  SELLER_BUSINESS_TYPES,
  SELLER_CATEGORIES,
  SCIENTIST_DEPARTMENTS,
  SCIENTIST_RESEARCH_INTERESTS,
  SCIENTIST_SPECIALIZATIONS,
  SERVICE_RADIUS_OPTIONS,
  VEHICLE_AVAILABILITY,
  VEHICLE_SERVICES,
} from "@/lib/role-data";
import {
  isNewRole,
  NEW_ROLES,
  ROLE_META,
  roleHomePath,
  type NewRoleId,
} from "@/lib/roles";
import { useMutation } from "convex/react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const STEP_LABELS = ["Your role", "About you", "Your details", "What you need"];

/** Short helper label above each multi-select group. */
function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-foreground">{title}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        selected
          ? "inline-flex h-10 items-center gap-1.5 rounded-full border border-primary bg-accent px-4 text-sm font-medium text-accent-foreground"
          : "inline-flex h-10 items-center rounded-full border border-[#E6EFE6] bg-white px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
      {label}
    </button>
  );
}

/**
 * One wizard for all five new roles. It persists the role-specific profile
 * fields already accepted by `farmers.saveProfile`, then lands the user in
 * that role's workspace.
 */
export function RoleSetup() {
  const { role: roleParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useFarmerProfile();
  const saveProfile = useMutation(api.farmers.saveProfile);

  const role: NewRoleId | null = isNewRole(roleParam) ? roleParam : null;

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [helpNeeded, setHelpNeeded] = useState<string[]>([]);

  // Role-specific field state
  const [spaces, setSpaces] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [brandName, setBrandName] = useState("");
  const [businessType, setBusinessType] = useState(SELLER_BUSINESS_TYPES[0]);
  const [sellerCategories, setSellerCategories] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [radius, setRadius] = useState(SERVICE_RADIUS_OPTIONS[2]);
  const [availability, setAvailability] = useState(VEHICLE_AVAILABILITY[0]);
  const [skills, setSkills] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [experience, setExperience] = useState(LABOUR_EXPERIENCE_LEVELS[1]);
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState(SCIENTIST_DEPARTMENTS[0]);
  const [specialization, setSpecialization] = useState(SCIENTIST_SPECIALIZATIONS[0]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [researchInterests, setResearchInterests] = useState<string[]>([]);

  const meta = role ? ROLE_META[role] : null;

  const toggle = (
    value: string,
    current: string[],
    setter: (next: string[]) => void,
  ) =>
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  const location = useMemo(() => {
    const city = profile?.location?.city ?? "";
    return {
      city,
      district: profile?.location?.city ?? "",
      state: profile?.location?.state ?? "",
    };
  }, [profile]);

  const detailsComplete = useMemo(() => {
    if (!role) return false;
    if (role === "home_grower") return spaces.length > 0 && interests.length > 0;
    if (role === "seller")
      return brandName.trim().length >= 2 && sellerCategories.length > 0;
    if (role === "vehicle_owner") return services.length > 0;
    if (role === "labour") return skills.length > 0;
    return institution.trim().length >= 2 && researchInterests.length > 0;
  }, [role, spaces, interests, brandName, sellerCategories, services, skills, institution, researchInterests]);

  if (!role || !meta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F6FAF6] p-6 text-center">
        <h1 className="text-xl font-bold text-foreground">That role doesn't exist</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Choose one of the PlantGuard roles to finish setting up your workspace.
        </p>
        <Button asChild className="h-11 rounded-xl">
          <Link to="/start">Choose a role</Link>
        </Button>
      </div>
    );
  }

  const nameValid = displayName.trim().length >= 2;

  async function persistStep() {
    if (!role) return false;
    setSaving(true);
    try {
      if (step === 0) {
        await saveProfile({ role });
      } else if (step === 1) {
        await saveProfile({ displayName: displayName.trim() });
      } else if (step === 2) {
        if (role === "home_grower") {
          await saveProfile({ growerSpace: spaces[0], growerInterests: interests });
        } else if (role === "seller") {
          await saveProfile({
            sellerBrandName: brandName.trim(),
            sellerCategories,
          });
        } else if (role === "vehicle_owner") {
          await saveProfile({
            availability,
            usesVehicle: true,
            serviceArea: {
              city: location.city,
              district: location.district,
              state: location.state,
              radius,
            },
          });
        } else if (role === "labour") {
          await saveProfile({
            skills,
            equipment,
            experience,
            availability,
            usesVehicle: false,
            serviceArea: {
              city: location.city,
              district: location.district,
              state: location.state,
              radius,
            },
          });
        } else {
          await saveProfile({
            institution: institution.trim(),
            department,
            specialization,
            yearsExperience: yearsExperience.trim(),
            researchInterests,
          });
        }
      } else {
        await saveProfile({ helpNeeded, onboardedAt: Date.now() });
      }
      return true;
    } catch {
      toast.error("We couldn't save that. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function next() {
    const ok = await persistStep();
    if (!ok) return;
    if (step < STEP_LABELS.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    toast.success("Setup complete");
    navigate(roleHomePath(role), { replace: true });
  }

  const canContinue = [true, nameValid, detailsComplete, helpNeeded.length > 0][step];

  return (
    <div className="min-h-screen bg-[#F6FAF6]">
      <header className="border-b border-[#E6EFE6] bg-white">
        <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-5 py-4">
          <Link to="/">
            <PlantGuardLogo />
          </Link>
          <Link to="/start">
            <Button variant="ghost" className="h-10 rounded-xl text-[13px]">
              Change role
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-5 py-8 sm:py-12">
        <div className="flex items-center gap-3">
          <span
            className="flex size-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: meta.accentSoft, color: meta.accentDark }}
          >
            <meta.icon className="size-5" />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-foreground">
              {meta.emoji} {meta.label} setup
            </p>
            <p className="text-[13px] text-muted-foreground">{meta.tagline}</p>
          </div>
        </div>

        <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STEP_LABELS.map((label, index) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-xl border border-[#E6EFE6] bg-white px-3 py-2.5"
            >
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{
                  backgroundColor: index <= step ? meta.accentSoft : "#F1F5F1",
                  color: index <= step ? meta.accentDark : "#8A978A",
                }}
              >
                {index < step ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span className="text-[13px] font-medium text-foreground">{label}</span>
            </li>
          ))}
        </ol>

        <section className="mt-6 rounded-2xl border border-[#E6EFE6] bg-white p-5 shadow-[0_1px_3px_rgba(20,40,20,0.06)] sm:p-7">
          {step === 0 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
                You're setting up {meta.label}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {meta.description}
              </p>
              <ul className="flex flex-col gap-2">
                {meta.helpOptions.map((option) => (
                  <li
                    key={option}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: meta.accent }}
                    />
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
                About you
              </h2>
              <label className="flex flex-col gap-1.5">
                <Label className="text-[13px] font-medium">
                  {role === "scientist" ? "Your name" : "Display name"}
                </Label>
                <Input
                  value={displayName || user?.name || ""}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  className="h-12 rounded-xl text-[15px]"
                />
              </label>
              {role === "seller" ? (
                <label className="flex flex-col gap-1.5">
                  <Label className="text-[13px] font-medium">Store / brand name</Label>
                  <Input
                    value={brandName}
                    onChange={(event) => setBrandName(event.target.value)}
                    placeholder="GreenNest Store"
                    className="h-12 rounded-xl text-[15px]"
                  />
                </label>
              ) : null}
              {role === "vehicle_owner" || role === "labour" ? (
                <Group title="Availability" hint="When you're usually able to take work">
                  {VEHICLE_AVAILABILITY.map((option) => (
                    <Pill
                      key={option}
                      label={option}
                      selected={availability === option}
                      onClick={() => setAvailability(option)}
                    />
                  ))}
                </Group>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
                Your details
              </h2>

              {role === "home_grower" ? (
                <>
                  <Group title="Where do you grow?" hint="Pick the space that fits you best">
                    {GROWER_SPACES.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={spaces.includes(option)}
                        onClick={() =>
                          setSpaces(
                            spaces.includes(option)
                              ? spaces.filter((item) => item !== option)
                              : [option],
                          )
                        }
                      />
                    ))}
                  </Group>
                  <Group title="What are you interested in?">
                    {GROWER_INTERESTS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={interests.includes(option)}
                        onClick={() => toggle(option, interests, setInterests)}
                      />
                    ))}
                  </Group>
                </>
              ) : null}

              {role === "seller" ? (
                <>
                  <Group title="Business type">
                    {SELLER_BUSINESS_TYPES.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={businessType === option}
                        onClick={() => setBusinessType(option)}
                      />
                    ))}
                  </Group>
                  <Group title="What do you sell?">
                    {SELLER_CATEGORIES.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={sellerCategories.includes(option)}
                        onClick={() =>
                          toggle(option, sellerCategories, setSellerCategories)
                        }
                      />
                    ))}
                  </Group>
                </>
              ) : null}

              {role === "vehicle_owner" ? (
                <>
                  <Group
                    title="Which services does your vehicle support?"
                    hint="Requests are matched on these"
                  >
                    {VEHICLE_SERVICES.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={services.includes(option)}
                        onClick={() => toggle(option, services, setServices)}
                      />
                    ))}
                  </Group>
                  <Group title="Service radius" hint="You can add vehicle details after setup">
                    {SERVICE_RADIUS_OPTIONS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={radius === option}
                        onClick={() => setRadius(option)}
                      />
                    ))}
                  </Group>
                </>
              ) : null}

              {role === "labour" ? (
                <>
                  <Group title="Your skills">
                    {LABOUR_SKILLS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={skills.includes(option)}
                        onClick={() => toggle(option, skills, setSkills)}
                      />
                    ))}
                  </Group>
                  <Group title="Equipment you can use">
                    {LABOUR_EQUIPMENT.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={equipment.includes(option)}
                        onClick={() => toggle(option, equipment, setEquipment)}
                      />
                    ))}
                  </Group>
                  <Group title="Work experience">
                    {LABOUR_EXPERIENCE_LEVELS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={experience === option}
                        onClick={() => setExperience(option)}
                      />
                    ))}
                  </Group>
                  <Group title="Service radius">
                    {SERVICE_RADIUS_OPTIONS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={radius === option}
                        onClick={() => setRadius(option)}
                      />
                    ))}
                  </Group>
                </>
              ) : null}

              {role === "scientist" ? (
                <>
                  <label className="flex flex-col gap-1.5">
                    <Label className="text-[13px] font-medium">Institution</Label>
                    <Input
                      value={institution}
                      onChange={(event) => setInstitution(event.target.value)}
                      placeholder="ICAR-IIHR"
                      className="h-12 rounded-xl text-[15px]"
                    />
                  </label>
                  <Group title="Department">
                    {SCIENTIST_DEPARTMENTS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={department === option}
                        onClick={() => setDepartment(option)}
                      />
                    ))}
                  </Group>
                  <Group title="Specialization">
                    {SCIENTIST_SPECIALIZATIONS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={specialization === option}
                        onClick={() => setSpecialization(option)}
                      />
                    ))}
                  </Group>
                  <label className="flex flex-col gap-1.5">
                    <Label className="text-[13px] font-medium">Years of experience</Label>
                    <Input
                      value={yearsExperience}
                      onChange={(event) => setYearsExperience(event.target.value)}
                      inputMode="numeric"
                      placeholder="8"
                      className="h-12 rounded-xl text-[15px]"
                    />
                  </label>
                  <Group title="Research interests">
                    {SCIENTIST_RESEARCH_INTERESTS.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        selected={researchInterests.includes(option)}
                        onClick={() =>
                          toggle(option, researchInterests, setResearchInterests)
                        }
                      />
                    ))}
                  </Group>
                </>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
                  What do you need help with?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll tailor the help section in your workspace to these.
                </p>
              </div>
              <Group title="Pick at least one">
                {meta.helpOptions.map((option) => (
                  <Pill
                    key={option}
                    label={option}
                    selected={helpNeeded.includes(option)}
                    onClick={() => toggle(option, helpNeeded, setHelpNeeded)}
                  />
                ))}
              </Group>
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF3EE] pt-5">
            <Button
              variant="ghost"
              className="h-11 gap-2 rounded-xl"
              disabled={step === 0 || saving}
              onClick={() => setStep((value) => Math.max(0, value - 1))}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-muted-foreground">
                Step {step + 1} of {STEP_LABELS.length}
              </span>
              <Button
                className="h-11 gap-2 rounded-xl px-6"
                disabled={!canContinue || saving}
                style={{ backgroundColor: meta.accentDark }}
                onClick={next}
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : step === STEP_LABELS.length - 1 ? (
                  "Finish setup"
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          You can change any of this later in your profile.
        </p>
      </main>
    </div>
  );
}

export default RoleSetup;
