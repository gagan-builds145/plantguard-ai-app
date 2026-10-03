import { PlantGuardLogo, PlantGuardMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useI18n } from "@/lib/i18n";
import { useMutation } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;
const MIN_PASSWORD = 8;

function normalizePhone(value: string) {
  return value.replace(/[\s\-()]/g, "");
}

const HIGHLIGHTS = [
  { icon: Camera, text: "Scan a leaf and get a confidence-scored reading" },
  { icon: Sparkles, text: "Practical next steps written for field use" },
  { icon: ShieldCheck, text: "Every result saved to your scan history" },
];

type AuthMode = "signin" | "signup";
/** `forgot` asks for the email; `reset` verifies the code and sets a new password. */
type View = AuthMode | "forgot" | "reset";

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const { profile, isLoading: profileLoading } = useFarmerProfile();
  const { t } = useI18n();
  const navigate = useNavigate();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [searchParams] = useSearchParams();
  const mode: AuthMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const returnTo = searchParams.get("returnTo");
  const redirect = resolveRedirectAfterAuth(returnTo, redirectAfterAuth);

  const authHref = (target: AuthMode) =>
    `/auth?mode=${target}${
      returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""
    }`;

  const [view, setView] = useState<View>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Keep the visible view in sync with the ?mode= link unless mid reset.
  useEffect(() => {
    setView((current) =>
      current === "forgot" || current === "reset" ? current : mode,
    );
  }, [mode]);

  // Send signed-in users to the right place: not-yet-onboarded accounts go into
  // profile setup; everyone else continues to their intended destination.
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (profileLoading) return;
    const needsOnboarding =
      !profile || (!profile.onboardedAt && !profile.displayName);
    navigate(needsOnboarding ? "/onboarding" : redirect, { replace: true });
  }, [
    authLoading,
    isAuthenticated,
    profileLoading,
    profile,
    navigate,
    redirect,
  ]);

  useEffect(() => {
    if (view !== "reset" || secondsLeft <= 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((value) => Math.max(value - 1, 0)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [view, secondsLeft]);

  function goTo(next: View) {
    setError(null);
    setPassword("");
    setConfirm("");
    setNewPassword("");
    setCode("");
    setView(next);
  }

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setIsLoading(true);
    try {
      await signIn("password", {
        email: email.trim(),
        password,
        flow: "signIn",
      });
      // Routing handled by the effect above.
    } catch {
      setError("Incorrect email or password.");
      setIsLoading(false);
    }
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!PHONE_RE.test(normalizePhone(phone))) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      await signIn("password", {
        email: email.trim(),
        password,
        name: name.trim(),
        flow: "signUp",
      });
      try {
        await saveProfile({ phone: normalizePhone(phone) });
      } catch {
        toast.error(
          "Account created, but we couldn't save your mobile number. You can add it later from your profile.",
        );
      }
      // Routing handled by the effect above.
    } catch {
      setError(
        "We couldn't create your account. That email may already be registered.",
      );
      setIsLoading(false);
    }
  }

  async function sendResetCode(address: string) {
    await signIn("password", { email: address, flow: "reset" });
  }

  async function handleForgot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    try {
      await sendResetCode(email.trim());
      setCode("");
      setSecondsLeft(30);
      setView("reset");
    } catch {
      setError("We couldn't send a reset code right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (code.length !== 6) {
      setError("Enter the 6-digit code we emailed you.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      await signIn("password", {
        email: email.trim(),
        code,
        newPassword,
        flow: "reset-verification",
      });
      toast.success("Password updated");
      // Routing handled by the effect above.
    } catch {
      setError("That code is incorrect or has expired. Please try again.");
      setCode("");
      setIsLoading(false);
    }
  }

  async function handleResendReset() {
    if (secondsLeft > 0 || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      await sendResetCode(email.trim());
      setCode("");
      setSecondsLeft(30);
    } catch {
      setError("Couldn't resend the code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuest() {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      // Routing handled by the effect above.
    } catch {
      setError("Guest access isn't available right now.");
      setIsLoading(false);
    }
  }

  if (!authLoading && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-2">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">Taking you to your workspace…</p>
        </div>
      </div>
    );
  }

  const maskedEmail = (() => {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const visible = local.slice(0, 1);
    return `${visible}${"•".repeat(Math.max(local.length - 1, 2))}@${domain}`;
  })();

  const isResetFlow = view === "forgot" || view === "reset";

  return (
    <div className="min-h-screen bg-surface-2 lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-[#17351C] to-[#1B5E20] p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-white">
          <PlantGuardMark className="bg-white/15 text-white" />
          <span className="text-[15px] font-semibold">
            PlantGuard <span className="text-[#A5D6A7]">AI</span>
          </span>
        </Link>

        <div>
          <h2 className="max-w-md text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-white">
            Your crop, read from a single photo.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.text}
                  className="flex items-center gap-3 text-[15px] text-white/85"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="size-4 text-[#A5D6A7]" />
                  </span>
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs text-white/50">
          AI-assisted analysis — confirm critical decisions with an agricultural
          expert.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <PlantGuardLogo />
          </Link>

          {/* ---------------------------------------------------------- */}
          {view === "signin" && (
            <>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">
                {t("auth.welcomeBack")}
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Sign in with your email and password to continue with PlantGuard
                AI.
              </p>

              <form onSubmit={handleSignIn} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => goTo("forgot")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-sm font-medium text-danger" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="h-12 rounded-xl text-[15px] font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      {t("auth.signIn")}
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl text-[15px] font-semibold"
                onClick={handleGuest}
                disabled={isLoading}
              >
                {t("auth.continueGuest")}
              </Button>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to PlantGuard AI?{" "}
                <Link
                  to={authHref("signup")}
                  onClick={() => goTo("signup")}
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "signup" && (
            <>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">
                {t("auth.createAccount")}
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Create your PlantGuard AI account with an email and password.
              </p>

              <form onSubmit={handleSignUp} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </Label>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t("auth.mobile")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder={`${MIN_PASSWORD}+ characters`}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirm" className="text-sm font-medium">
                      Confirm
                    </Label>
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl text-[15px]"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-sm font-medium text-danger" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="h-12 rounded-xl text-[15px] font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      {t("auth.createAccount")}
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={authHref("signin")}
                  onClick={() => goTo("signin")}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "forgot" && (
            <>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">
                Reset your password
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Enter your email and we&apos;ll send a 6-digit code to reset your
                password.
              </p>

              <form onSubmit={handleForgot} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium">
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-sm font-medium text-danger" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="h-12 rounded-xl text-[15px] font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Sending code…
                    </>
                  ) : (
                    <>
                      <KeyRound className="size-4" />
                      Send reset code
                    </>
                  )}
                </Button>
              </form>

              <button
                type="button"
                onClick={() => goTo("signin")}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back to sign in
              </button>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "reset" && (
            <>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">
                Choose a new password
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Enter the code we sent to{" "}
                <span className="font-medium text-foreground">{maskedEmail}</span>{" "}
                and pick a new password.
              </p>

              <form onSubmit={handleReset} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col items-center gap-2">
                  <InputOTP
                    value={code}
                    onChange={setCode}
                    maxLength={6}
                    disabled={isLoading}
                    containerClassName="gap-2"
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="size-12 rounded-xl border text-base"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder={`${MIN_PASSWORD}+ characters`}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl text-[15px]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reset-confirm" className="text-sm font-medium">
                    Confirm new password
                  </Label>
                  <Input
                    id="reset-confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl text-[15px]"
                  />
                </div>

                {error ? (
                  <p className="text-sm font-medium text-danger" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="h-12 rounded-xl text-[15px] font-semibold"
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-5" />
                      Reset password
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 flex flex-col items-center gap-2 text-sm">
                {secondsLeft > 0 ? (
                  <p className="text-muted-foreground">
                    Resend available in {secondsLeft}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendReset}
                    disabled={isLoading}
                    className="font-medium text-primary hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => goTo("signin")}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Back to sign in
                </button>
              </div>
            </>
          )}

          {!isResetFlow ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Passwords keep your account secure. Codes are only used to reset a
              forgotten password.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
