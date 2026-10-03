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
import {
  SCIENTIST_DEPARTMENTS,
  SCIENTIST_RESEARCH_INTERESTS,
  SCIENTIST_SPECIALIZATIONS,
} from "@/lib/role-data";
import { useMutation } from "convex/react";
import {
  Bell,
  ChevronRight,
  Database,
  FlaskConical,
  Globe,
  GraduationCap,
  HelpCircle,
  Library,
  Loader2,
  LogOut,
  Microscope,
  Pencil,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const ACCENT = "#5E35B1";

export function ScientistProfile() {
  const { profile } = useFarmerProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(profile?.displayName ?? "");
  const [institution, setInstitution] = useState(profile?.institution ?? "");
  const [department, setDepartment] = useState(profile?.department ?? SCIENTIST_DEPARTMENTS[0]);
  const [specialization, setSpecialization] = useState(
    profile?.specialization ?? SCIENTIST_SPECIALIZATIONS[0],
  );
  const [yearsExperience, setYearsExperience] = useState(profile?.yearsExperience ?? "");
  const [interests, setInterests] = useState<string[]>(
    profile?.researchInterests ?? SCIENTIST_RESEARCH_INTERESTS.slice(0, 3),
  );

  const displayName = profile?.displayName ?? user?.name ?? "Researcher";
  const location = profile?.location
    ? `${profile.location.city}, ${profile.location.state}`
    : "Location not set";

  const tiles = [
    { key: "projects", label: "Projects", value: "4", to: "/lab/projects", icon: FlaskConical },
    { key: "datasets", label: "Datasets", value: "5", to: "/lab/datasets", icon: Database },
    { key: "library", label: "Library", value: "12", to: "/lab/library", icon: Library },
    { key: "collab", label: "Collaborators", value: "4", to: "/lab/collaboration", icon: Users },
  ];

  const settings = [
    { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell },
    { key: "privacy", label: "Data & privacy", to: "/help", icon: ShieldCheck },
    { key: "security", label: "Security", to: "/settings", icon: Settings },
    { key: "language", label: "Language", to: "/settings", icon: Globe },
    { key: "help", label: "Help & support", to: "/help", icon: HelpCircle },
  ];

  const save = async () => {
    setSaving(true);
    try {
      await saveProfile({
        displayName: name.trim(),
        institution: institution.trim(),
        department,
        specialization,
        yearsExperience: yearsExperience.trim(),
        researchInterests: interests,
      });
      toast.success("Research profile updated");
      setEditOpen(false);
    } catch {
      toast.error("We couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RolePage
      role="scientist"
      active="profile"
      title="Research Profile"
      subtitle="Your institution, field and research interests."
    >
      <Panel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span
            className="flex size-20 shrink-0 items-center justify-center rounded-3xl"
            style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
          >
            <Microscope className="size-9" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                {displayName}
              </p>
              <StatusPill label="Scientist" tone="blue" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.institution ?? "Institution not set"}
            </p>
            <p className="text-sm text-muted-foreground">{location}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill
                label={profile?.specialization ?? SCIENTIST_SPECIALIZATIONS[0]}
                tone="gray"
              />
              {(profile?.researchInterests ?? interests).slice(0, 3).map((item) => (
                <StatusPill key={item} label={item} tone="blue" />
              ))}
              <DemoTag />
            </div>
          </div>
          <Button
            variant="outline"
            className="h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold"
            onClick={() => {
              setName(profile?.displayName ?? user?.name ?? "");
              setInstitution(profile?.institution ?? "");
              setDepartment(profile?.department ?? SCIENTIST_DEPARTMENTS[0]);
              setSpecialization(profile?.specialization ?? SCIENTIST_SPECIALIZATIONS[0]);
              setYearsExperience(profile?.yearsExperience ?? "");
              setInterests(profile?.researchInterests ?? interests);
              setEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>
      </Panel>

      <section>
        <SectionHead title="Your research" subtitle="Workspace shortcuts" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.key}
              to={tile.to}
              className="rounded-2xl border border-[#EAF0EA] bg-card p-4 shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors hover:border-primary/40"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
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
          <SectionHead title="Affiliation" subtitle="Where you work" />
          <div className="mt-3">
            <MetaRow
              label="Institution"
              value={profile?.institution ?? "Institution not set"}
              icon={GraduationCap}
            />
            <MetaRow
              label="Department"
              value={profile?.department ?? "—"}
            />
            <MetaRow
              label="Specialization"
              value={profile?.specialization ?? "—"}
            />
            <MetaRow
              label="Experience"
              value={profile?.yearsExperience ? `${profile.yearsExperience} years` : "—"}
            />
          </div>
        </Panel>

        <Panel>
          <SectionHead title="Research interests" subtitle="Used to suggest datasets and collaborators" />
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile?.researchInterests ?? interests).map((item) => (
              <StatusPill key={item} label={item} tone="blue" />
            ))}
          </div>
          <Link to="/lab/collaboration" className="mt-4 inline-flex text-[13px] font-semibold" style={{ color: ACCENT }}>
            Find collaborators
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit research profile</DialogTitle>
            <DialogDescription>
              This information appears on your projects and shared datasets.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Name</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-xl"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Institution</Label>
              <Input
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                placeholder="ICAR-IIHR"
                className="h-11 rounded-xl"
              />
            </label>
            <div className="flex flex-col gap-2">
              <Label className="text-[13px] font-medium">Department</Label>
              <div className="flex flex-wrap gap-2">
                {SCIENTIST_DEPARTMENTS.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={department === item}
                    onClick={() => setDepartment(item)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-[13px] font-medium">Specialization</Label>
              <div className="flex flex-wrap gap-2">
                {SCIENTIST_SPECIALIZATIONS.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={specialization === item}
                    onClick={() => setSpecialization(item)}
                  />
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Years of experience</Label>
              <Input
                value={yearsExperience}
                onChange={(event) => setYearsExperience(event.target.value)}
                placeholder="8"
                inputMode="numeric"
                className="h-11 rounded-xl"
              />
            </label>
            <div className="flex flex-col gap-2">
              <Label className="text-[13px] font-medium">Research interests</Label>
              <div className="flex flex-wrap gap-2">
                {SCIENTIST_RESEARCH_INTERESTS.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={interests.includes(item)}
                    onClick={() =>
                      setInterests((prev) =>
                        prev.includes(item)
                          ? prev.filter((value) => value !== item)
                          : [...prev, item],
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              disabled={saving}
              onClick={save}
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
    </RolePage>
  );
}

export default ScientistProfile;
