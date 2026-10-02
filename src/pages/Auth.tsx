import { PlantGuardLogo, PlantGuardMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

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

const HIGHLIGHTS = [
  { icon: Camera, text: "Scan a leaf and get a confidence-scored reading" },
  { icon: Sparkles, text: "Practical next steps written for field use" },
  { icon: ShieldCheck, text: "Every result saved to your scan history" },
];

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [step, setStep] = useState<"identify" | "verify">("identify");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (step !== "verify" || secondsLeft <= 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((value) => Math.max(value - 1, 0)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [step, secondsLeft]);

  async function sendCode(address: string) {
    const formData = new FormData();
    formData.set("email", address);
    await signIn("email-otp", formData);
  }

  async function handleIdentify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const value = email.trim();
    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendCode(value);
      setOtp("");
      setSecondsLeft(30);
      setStep("verify");
    } catch {
      setError(
        "We couldn't send a verification code right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.length !== 6 || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("code", otp);
      await signIn("email-otp", formData);
      navigate(redirect, { replace: true });
    } catch {
      setError("Incorrect verification code. Please try again.");
      setOtp("");
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (secondsLeft > 0 || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      await sendCode(email);
      setOtp("");
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
      navigate(redirect, { replace: true });
    } catch {
      setError("Guest access isn't available right now.");
      setIsLoading(false);
    }
  }

  const maskedEmail = (() => {
    const [name, domain] = email.split("@");
    if (!domain) return email;
    const visible = name.slice(0, 1);
    return `${visible}${"•".repeat(Math.max(name.length - 1, 2))}@${domain}`;
  })();

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
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <PlantGuardLogo />
          </Link>

          {step === "identify" ? (
            <>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Sign in to continue with PlantGuard AI. New here? The same form
                creates your account.
              </p>

              <form onSubmit={handleIdentify} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      aria-invalid={Boolean(error)}
                      className="h-12 rounded-xl pl-10 text-[15px]"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll email you a 6-digit verification code. No password
                    needed.
                  </p>
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
                      Continue
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
                Continue as guest
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Explore with a temporary account. You can add your details later.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">
                Verify your account
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Enter the 6-digit verification code we sent to{" "}
                <span className="font-medium text-foreground">{maskedEmail}</span>
              </p>

              <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-5">
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
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

                {error ? (
                  <p
                    className="text-center text-sm font-medium text-danger"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="h-12 rounded-xl text-[15px] font-semibold"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-5" />
                      Verify code
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
                    onClick={handleResend}
                    disabled={isLoading}
                    className="font-medium text-primary hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setStep("identify");
                    setOtp("");
                    setError(null);
                  }}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Use a different email address
                </button>
              </div>
            </>
          )}
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
