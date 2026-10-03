import {
  DemoTag,
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
import { GROWER_PLANTS, IMG, type GrowerPlant } from "@/lib/role-data";
import { useMutation } from "convex/react";
import {
  Bell,
  Bookmark,
  CalendarClock,
  ChevronRight,
  Globe,
  HelpCircle,
  History,
  Leaf,
  Loader2,
  LogOut,
  Pencil,
  ShieldCheck,
  Sprout,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function GrowerProfile() {
  const { profile } = useFarmerProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [plants] = useLocalState<GrowerPlant[]>("grower:plants", GROWER_PLANTS);
  const [savedPosts] = useLocalState<string[]>("grower:saved-posts", []);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(
    profile?.displayName ?? user?.name ?? "Home Grower",
  );

  const displayName = profile?.displayName ?? user?.name ?? "Home Grower";
  const location = profile?.location
    ? `${profile.location.city}, ${profile.location.state}`
    : "Location not set";

  const tiles = [
    { key: "plants", label: "My Plants", value: `${plants.length}`, to: "/grower/plants", icon: Sprout },
    { key: "posts", label: "My Posts", value: "12", to: "/grower", icon: Leaf },
    { key: "saved", label: "Saved", value: `${savedPosts.length}`, to: "/grower/saved", icon: Bookmark },
    { key: "history", label: "Scan History", value: "—", to: "/grower/history", icon: History },
    { key: "reminders", label: "Reminders", value: "—", to: "/grower/reminders", icon: CalendarClock },
  ];

  const settings = [
    { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell },
    { key: "privacy", label: "Privacy", action: () => setPrivacyOpen(true), icon: ShieldCheck },
    { key: "security", label: "Security", to: "/settings", icon: ShieldCheck },
    { key: "language", label: "Language", to: "/settings", icon: Globe },
    { key: "help", label: "Help", to: "/help", icon: HelpCircle },
  ];

  return (
    <RolePage
      role="home_grower"
      active="profile"
      title="Profile"
      subtitle="Your home growing profile and preferences."
    >
      <Panel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            src={IMG.avatarAnanya}
            alt=""
            className="size-20 shrink-0 rounded-3xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                {displayName}
              </p>
              <StatusPill label="Home Grower" tone="green" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{location}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span>
                <span className="font-semibold text-foreground">{plants.length}</span>{" "}
                <span className="text-muted-foreground">plants</span>
              </span>
              <span>
                <span className="font-semibold text-foreground">12</span>{" "}
                <span className="text-muted-foreground">posts</span>
              </span>
              <span>
                <span className="font-semibold text-foreground">486</span>{" "}
                <span className="text-muted-foreground">followers</span>
              </span>
              <DemoTag />
            </div>
          </div>
          <Button
            variant="outline"
            className="h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold"
            onClick={() => {
              setName(displayName);
              setEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>
      </Panel>

      <section>
        <SectionHead title="Your garden" subtitle="Everything you have collected." />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map((tile) => (
            <Link
              key={tile.key}
              to={tile.to}
              className="rounded-2xl border border-[#EAF0EA] bg-card p-4 shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF6EA] text-primary">
                <tile.icon className="size-5" />
              </span>
              <p className="mt-3 text-lg font-bold text-foreground">{tile.value}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {tile.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Panel className="p-2">
        <ul>
          {settings.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </>
            );
            return (
              <li key={item.key}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2"
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.action}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
                  >
                    {content}
                  </button>
                )}
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
              <span className="flex-1 text-sm font-semibold text-danger">
                Log out
              </span>
            </button>
          </li>
        </ul>
      </Panel>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Privacy</DialogTitle>
            <DialogDescription>
              Your garden stays yours. Plant photos and scan results are only
              visible to you unless you share them to the community feed.
            </DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-2 py-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Location is shown as city only.
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="size-4 text-primary" />
              You can delete any post or scan from its menu.
            </li>
          </ul>
          <DialogFooter>
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              onClick={() => setPrivacyOpen(false)}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              This is the name shown on your posts and in your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Label className="text-sm font-medium">Display name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-xl text-[15px]"
            />
          </div>
          <DialogFooter>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await saveProfile({ displayName: name.trim() });
                  toast.success("Profile updated");
                  setEditOpen(false);
                } catch {
                  toast.error("We couldn't save that. Please try again.");
                } finally {
                  setSaving(false);
                }
              }}
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

export default GrowerProfile;
