import { AppShell } from "@/components/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { LANGUAGES, LOCATIONS } from "@/lib/plantguard-data";
import { useMutation } from "convex/react";
import {
  ChevronRight,
  Globe,
  HelpCircle,
  Leaf,
  Loader2,
  LogOut,
  MapPin,
  Pencil,
  ShieldCheck,
  Sprout,
  Wheat,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

function Row({
  icon: Icon,
  title,
  description,
  onClick,
  trailing,
  to,
  disabled,
}: {
  icon: typeof Leaf;
  title: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  to?: string;
  disabled?: boolean;
}) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ?? (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  const className =
    "flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors" +
    (disabled ? " opacity-60" : " hover:border-primary/30");

  if (to && !disabled) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, isLoading } = useFarmerProfile();
  const saveProfile = useMutation(api.farmers.saveProfile);

  const [nameOpen, setNameOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.displayName) setNameDraft(profile.displayName);
    if (profile?.location) {
      setCountry(profile.location.country);
      setState(profile.location.state);
      setCity(profile.location.city);
    }
  }, [profile?.displayName, profile?.location]);

  const states = country ? Object.keys(LOCATIONS[country] ?? {}) : [];
  const cities = country && state ? (LOCATIONS[country]?.[state] ?? []) : [];

  const displayName = profile?.displayName || user?.name || "Farmer";
  const initials = displayName.trim().slice(0, 1).toUpperCase();
  const languageLabel =
    LANGUAGES.find((item) => item.code === profile?.language)?.native ??
    "English";

  async function saveName() {
    if (nameDraft.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ displayName: nameDraft.trim() });
      toast.success("Profile saved");
      setNameOpen(false);
    } catch {
      toast.error("Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function saveLocation() {
    setSaving(true);
    try {
      if (country && state && city) {
        await saveProfile({ location: { country, state, city } });
      } else {
        await saveProfile({ clearLocation: true });
      }
      toast.success("Location updated");
      setLocationOpen(false);
    } catch {
      toast.error("Couldn't update your location. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function setLanguage(code: string) {
    try {
      await saveProfile({ language: code });
      toast.success("Language preference saved");
    } catch {
      toast.error("Couldn't save your language. Please try again.");
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  if (isLoading) {
    return (
      <AppShell active="profile" title="Profile">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell active="profile">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* Identity card */}
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(20,40,20,0.06)] sm:p-6">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-[-0.01em] text-foreground">
              {displayName}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge className="h-7 gap-1.5 border-transparent bg-accent px-2.5 text-xs text-accent-foreground">
                <Sprout className="size-3.5" />
                Farmer
              </Badge>
              <span className="text-sm text-muted-foreground">
                {profile?.location
                  ? `${profile.location.city}, ${profile.location.state}`
                  : "Location not set"}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-10 shrink-0 rounded-xl"
            onClick={() => {
              setNameDraft(displayName);
              setNameOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        </div>

        {/* Account */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Account
          </h2>
          <Row
            icon={Pencil}
            title="Display name"
            description={displayName}
            onClick={() => {
              setNameDraft(displayName);
              setNameOpen(true);
            }}
          />
          <Row
            icon={Leaf}
            title="My crops"
            description={
              profile?.crops.length
                ? `${profile.crops.length} crop${profile.crops.length > 1 ? "s" : ""} selected`
                : "No crops added yet"
            }
            to="/crops"
          />
          <Row
            icon={MapPin}
            title="Location"
            description={
              profile?.location
                ? `${profile.location.city}, ${profile.location.state}, ${profile.location.country}`
                : "Add your location to personalize this information."
            }
            onClick={() => setLocationOpen(true)}
          />
          <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Globe className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                Language
              </span>
              <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                {languageLabel}
              </span>
            </span>
            <div className="w-[150px]">
              <Select
                value={profile?.language ?? "en"}
                onValueChange={setLanguage}
              >
                <SelectTrigger
                  className="h-10 w-full rounded-xl text-sm"
                  aria-label="Choose language"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.native}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Security + support */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Security &amp; support
          </h2>
          <Row
            icon={ShieldCheck}
            title="Account security"
            description="Change password and sessions — coming soon"
            disabled
            trailing={
              <Badge className="h-7 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                Coming soon
              </Badge>
            }
          />
          <Row
            icon={HelpCircle}
            title="Help centre"
            description="Guides on scanning and crop care"
            disabled
            trailing={
              <Badge className="h-7 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                Coming soon
              </Badge>
            }
          />
          <Row
            icon={Wheat}
            title="About PlantGuard AI"
            description="Deep learning based plant disease detection · Farmer edition"
            disabled
            trailing={<span />}
          />
        </section>

        {/* Logout */}
        <section className="flex flex-col gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl justify-start gap-3 px-4 text-[15px] font-semibold text-danger hover:text-danger"
              >
                <LogOut className="size-5" />
                Log out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Log out of PlantGuard AI?</AlertDialogTitle>
                <AlertDialogDescription>
                  You&apos;ll need to sign in again to check your plants and see
                  your scan history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-11 rounded-xl">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="h-11 rounded-xl bg-danger text-white hover:bg-[#B71C1C]"
                  onClick={handleLogout}
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="px-1 text-xs text-muted-foreground">
            Signed in as {user?.email ?? user?.name ?? "your account"}
          </p>
        </section>
      </div>

      {/* Edit name dialog */}
      <Dialog open={nameOpen} onOpenChange={setNameOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Display name</DialogTitle>
            <DialogDescription>
              This is how your workspace greets you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name" className="text-sm font-medium">
              Full name
            </Label>
            <Input
              id="profile-name"
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder="Enter your full name"
              className="h-12 rounded-xl text-[15px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setNameOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl font-semibold"
              onClick={saveName}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit location dialog */}
      <Dialog open={locationOpen} onOpenChange={setLocationOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your location</DialogTitle>
            <DialogDescription>
              Used for weather and location-relevant guidance. Optional.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Country</Label>
              <Select
                value={country}
                onValueChange={(value) => {
                  setCountry(value);
                  setState("");
                  setCity("");
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
                onValueChange={setCity}
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
          <DialogFooter>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setLocationOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl font-semibold"
              onClick={saveLocation}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save location"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
