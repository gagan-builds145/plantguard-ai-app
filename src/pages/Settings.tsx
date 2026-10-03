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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { useI18n } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/plantguard-data";
import { useMutation } from "convex/react";
import {
  AlertTriangle,
  Flower2,
  Globe,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function Row({
  icon: Icon,
  title,
  description,
  trailing,
}: {
  icon: typeof Mail;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4">
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
      {trailing}
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const { profile, isLoading } = useFarmerProfile();
  const { setLanguage: setUiLanguage } = useI18n();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const deleteMyData = useMutation(api.account.deleteMyData);

  const [pwOpen, setPwOpen] = useState(false);
  const [pwStep, setPwStep] = useState<"request" | "verify">("request");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isNursery = profile?.role === "nursery";
  const email = user?.email ?? "your account email";
  const displayName =
    profile?.displayName || user?.name || (isNursery ? "Nursery" : "Farmer");
  const initials = displayName.trim().slice(0, 1).toUpperCase();
  const languageLabel =
    LANGUAGES.find((item) => item.code === profile?.language)?.native ??
    "English";

  function openPassword() {
    setPwStep("request");
    setCode("");
    setNewPassword("");
    setConfirm("");
    setPwError(null);
    setPwOpen(true);
  }

  async function sendResetCode() {
    setPwError(null);
    setPwLoading(true);
    try {
      await signIn("password", { email: user?.email ?? "", flow: "reset" });
      setPwStep("verify");
    } catch {
      setPwError("We couldn't send a reset code right now. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }

  async function submitNewPassword() {
    if (code.length !== 6) {
      setPwError("Enter the 6-digit code we emailed you.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setPwError("Passwords don't match.");
      return;
    }
    setPwError(null);
    setPwLoading(true);
    try {
      await signIn("password", {
        email: user?.email ?? "",
        code,
        newPassword,
        flow: "reset-verification",
      });
      toast.success("Password updated");
      setPwOpen(false);
    } catch {
      setPwError("That code is incorrect or has expired. Please try again.");
      setCode("");
    } finally {
      setPwLoading(false);
    }
  }

  async function setLanguage(code: string) {
    setUiLanguage(code);
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

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMyData();
      toast.success("Your data has been deleted");
      await signOut();
      navigate("/", { replace: true });
    } catch {
      toast.error("Couldn't delete your data. Please try again.");
      setDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell active="settings" title="Settings">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      active="settings"
      title="Settings"
      subtitle="Manage your account, security and preferences."
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* Identity */}
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
                {isNursery ? (
                  <Flower2 className="size-3.5" />
                ) : (
                  <Sprout className="size-3.5" />
                )}
                {isNursery ? "Nursery" : "Farmer"}
              </Badge>
              <span className="truncate text-sm text-muted-foreground">
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Account security */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Account security
          </h2>
          <Row
            icon={KeyRound}
            title="Password"
            description="Change your password. We email a code to verify it's you."
            trailing={
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={openPassword}
              >
                Change
              </Button>
            }
          />
          <Row
            icon={Mail}
            title="Email"
            description={email}
            trailing={
              <Badge className="h-7 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                Verified
              </Badge>
            }
          />
          <Row
            icon={Phone}
            title="Mobile number"
            description={profile?.phone ?? "Not added"}
          />
          <Row
            icon={UserRound}
            title="Full name"
            description={displayName}
          />
        </section>

        {/* Preferences */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Preferences
          </h2>
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

        {/* Session */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Session
          </h2>
          <Row
            icon={ShieldCheck}
            title="Signed in"
            description={`as ${email}`}
            trailing={
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            }
          />
        </section>

        {/* Danger zone */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Danger zone
          </h2>
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-danger/30 bg-danger-bg p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-bg text-danger">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Delete my data
                </p>
                <p className="mt-0.5 max-w-md text-sm text-muted-foreground">
                  Permanently removes your profile, plant checks, posts, listings
                  and orders.
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 shrink-0 rounded-xl text-danger hover:text-danger"
                  disabled={deleting}
                >
                  <Trash2 className="size-4" />
                  Delete data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes your PlantGuard profile, scans,
                    posts, product listings and orders. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-11 rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="h-11 rounded-xl bg-danger text-white hover:bg-[#B71C1C]"
                    onClick={handleDelete}
                  >
                    Delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>

      {/* Change password */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              {pwStep === "request"
                ? `We'll email a 6-digit code to ${email} to verify it's you.`
                : `Enter the code sent to ${email} and choose a new password.`}
            </DialogDescription>
          </DialogHeader>

          {pwError && pwStep === "request" ? (
            <p className="text-sm font-medium text-danger" role="alert">
              {pwError}
            </p>
          ) : null}

          {pwStep === "request" ? (
            <DialogFooter>
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => setPwOpen(false)}
                disabled={pwLoading}
              >
                Cancel
              </Button>
              <Button
                className="h-11 rounded-xl font-semibold"
                onClick={sendResetCode}
                disabled={pwLoading}
              >
                {pwLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    Send code
                  </>
                )}
              </Button>
            </DialogFooter>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <InputOTP
                  value={code}
                  onChange={setCode}
                  maxLength={6}
                  disabled={pwLoading}
                  containerClassName="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-11 rounded-xl border text-base"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-new" className="text-sm font-medium">
                  New password
                </Label>
                <Input
                  id="s-new"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="8+ characters"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="s-confirm" className="text-sm font-medium">
                  Confirm new password
                </Label>
                <Input
                  id="s-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="Repeat new password"
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              {pwError ? (
                <p className="text-sm font-medium text-danger" role="alert">
                  {pwError}
                </p>
              ) : null}

              <DialogFooter>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={() => setPwOpen(false)}
                  disabled={pwLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 rounded-xl font-semibold"
                  onClick={submitNewPassword}
                  disabled={pwLoading || code.length !== 6}
                >
                  {pwLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
