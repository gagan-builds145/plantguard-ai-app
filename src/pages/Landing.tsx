import { PlantGuardLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { NEW_ROLES, ROLE_META } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Camera,
  CheckCircle2,
  Clock3,
  Droplets,
  Flower2,
  Languages,
  Leaf,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
  Users,
  Wheat,
} from "lucide-react";
import { Link } from "react-router";

const ROLE_META_LIST = NEW_ROLES.map((id) => ROLE_META[id]);

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

function LeafArt() {
  return (
    <svg
      viewBox="0 0 320 360"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a plant leaf being scanned"
    >
      <defs>
        <linearGradient id="leafFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <path
        d="M160 26c86 0 134 58 134 150 0 96-58 158-134 158S26 272 26 176C26 84 74 26 160 26Z"
        fill="url(#leafFill)"
        opacity="0.16"
      />
      <path
        d="M232 74c-6 108-52 176-146 200 6-104 54-172 146-200Z"
        fill="url(#leafFill)"
      />
      <path
        d="M232 74C150 118 114 190 104 268"
        stroke="#E8F5E9"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <g stroke="#E8F5E9" strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <path d="M196 108l28 22" />
        <path d="M176 142l30 20" />
        <path d="M154 178l30 18" />
        <path d="M134 216l26 16" />
      </g>
      <g fill="#B71C1C" opacity="0.85">
        <circle cx="150" cy="150" r="11" />
        <circle cx="182" cy="196" r="8" />
        <circle cx="128" cy="212" r="6.5" />
      </g>
      <g fill="#FFF8E1" opacity="0.5">
        <circle cx="150" cy="150" r="17" />
        <circle cx="182" cy="196" r="12" />
      </g>
    </svg>
  );
}

const HOW_IT_WORKS = [
  {
    icon: Camera,
    title: "Capture the leaf",
    body: "Take a photo with your phone or upload one you already have. No special equipment needed.",
  },
  {
    icon: ScanLine,
    title: "AI reads the image",
    body: "The model identifies the plant and looks for visible disease patterns, with a confidence score.",
  },
  {
    icon: CheckCircle2,
    title: "Act with guidance",
    body: "Get clear next steps, save the result and track the plant's health over time.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Disease detection",
    body: "Spots, blights, rusts and deficiency patterns flagged from a single photo.",
  },
  {
    icon: Leaf,
    title: "Plant identification",
    body: "Know which plant you're looking at, even before you name it yourself.",
  },
  {
    icon: BadgeCheck,
    title: "Honest confidence",
    body: "Every result shows its confidence — and tells you when a better photo is needed.",
  },
  {
    icon: Clock3,
    title: "Scan history",
    body: "Every check is saved so you can compare a plant's progress over days.",
  },
  {
    icon: Languages,
    title: "Your language",
    body: "Set your language during setup and keep using PlantGuard AI in it.",
  },
  {
    icon: ShieldCheck,
    title: "Advisor-first",
    body: "AI assists your judgement and points you to an expert when it matters.",
  },
];

const SERVICES = [
  { icon: Droplets, label: "Water & irrigation" },
  { icon: Tractor, label: "Vehicle services" },
  { icon: Users, label: "Farm labour" },
  { icon: Banknote, label: "Finance & insurance" },
  { icon: Sprout, label: "Inputs & seeds" },
];

const WORKSPACES = [
  {
    icon: Wheat,
    label: "Farmer workspace",
    body: "Crop health, disease guidance and the everyday services around your field.",
  },
  {
    icon: Flower2,
    label: "Nursery workspace",
    body: "Stock health, bulk buyer leads and the supplies a plant nursery needs.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="PlantGuard AI home">
            <PlantGuardLogo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <a
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              href="#how-it-works"
            >
              How it works
            </a>
            <a
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              href="#features"
            >
              Features
            </a>
            <a
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              href="#services"
            >
              Services
            </a>
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              to="/start"
            >
              Workspaces
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="h-10 rounded-xl px-4">
              <Link to="/auth?mode=signin">Sign in</Link>
            </Button>
            <Button asChild className="h-10 rounded-xl px-4 font-semibold">
              <Link to="/auth?mode=signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-32 size-[520px] rounded-full bg-accent blur-3xl"
        />
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Deep learning based plant disease detection
            </span>
            <h1 className="mt-5 text-[34px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[44px]">
              Know what&apos;s wrong with your crop, before it spreads.
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-muted-foreground">
              PlantGuard AI turns a single photo of a leaf into a clear,
              confidence-scored reading of your plant&apos;s health — with
              practical next steps you can act on today. Built for farmers in
              the field and nursery growers at the bench.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-2xl px-6 text-base font-semibold shadow-[0_8px_24px_rgba(46,125,50,0.24)]"
              >
                <Link to="/auth?mode=signup">
                  <Camera className="size-5" />
                  Check your plant
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl px-6 text-base font-semibold"
              >
                <a href="#how-it-works">
                  See how it works
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Works with your phone camera
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Free to start
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Guidance in your language
              </span>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-[#17351C] to-[#1B5E20] p-6 shadow-[0_16px_40px_rgba(20,40,20,0.18)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                  <ScanLine className="size-4" />
                  Live analysis
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#A5D6A7]" />
                  Scanning
                </span>
              </div>

              <div className="relative mt-4 h-[280px] overflow-hidden rounded-2xl bg-white/[0.06] sm:h-[320px]">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <LeafArt />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-transparent via-[#A5D6A7]/35 to-transparent"
                  style={{ animation: "pg-scan 2.6s ease-in-out infinite" }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/60">
                    Plant
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">Tomato</p>
                  <p className="text-[11px] text-white/60">ID confidence 94%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/60">
                    Health
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#FFCDD2]">
                    Possible Early Blight
                  </p>
                  <p className="text-[11px] text-white/60">Confidence 87%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-card p-3 shadow-[0_8px_24px_rgba(20,40,20,0.1)] sm:block">
              <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                Guidance saved to history
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface-2 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[36px]">
              Three steps from a photo to a decision
            </h2>
            <p className="mt-3 text-[16px] leading-7 text-muted-foreground">
              No sensors, no lab visit. PlantGuard AI works with the phone that
              is already in your pocket.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(20,40,20,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                      <Icon className="size-6" />
                    </span>
                    <span className="text-2xl font-bold text-border">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              What you get
            </p>
            <h2 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[36px]">
              An assistant that stays honest about what it knows
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.04 }}
                  className="group rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)]"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {feature.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workspaces */}
      <section className="border-t border-border bg-surface-2 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              One app, two workspaces
            </p>
            <h2 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[36px]">
              Choose the workspace that matches how you grow
            </h2>
            <p className="mt-3 text-[16px] leading-7 text-muted-foreground">
              Pick Farmer or Nursery during setup and PlantGuard AI tailors the
              dashboard, services and guidance to your work.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {WORKSPACES.map((workspace, index) => {
              const Icon = workspace.icon;
              return (
                <motion.div
                  key={workspace.label}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(20,40,20,0.06)]"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
                      {workspace.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {workspace.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services band */}
      <section id="services" className="border-y border-border bg-ink py-14 text-white lg:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <motion.div {...fadeUp} className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A5D6A7]">
                More than a scanner
              </p>
              <h2 className="mt-3 text-[26px] font-bold tracking-[-0.02em] sm:text-[32px]">
                One place for everything your farm needs
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-white/70">
                Alongside plant checks, PlantGuard AI connects you to the
                everyday services around your farm.
              </p>
            </motion.div>
            <motion.ul {...fadeUp} className="grid gap-3 sm:grid-cols-2 lg:max-w-md">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <li
                    key={service.label}
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 text-sm font-medium backdrop-blur"
                  >
                    <Icon className="size-5 shrink-0 text-[#A5D6A7]" />
                    {service.label}
                  </li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="workspaces" className="border-t border-border bg-surface-2 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <Users className="size-3.5" />
              One platform, five ways to use it
            </span>
            <h2 className="mt-4 text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[36px]">
              Choose the workspace that matches your work
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              Every workspace has its own navigation and tools — a plant community
              for home growers, a storefront for sellers, a service board for
              drivers, a job board for workers and a research bench for scientists.
            </p>
          </motion.div>

          <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLE_META_LIST.map((item) => (
              <motion.li key={item.id} {...fadeUp}>
                <Link
                  to="/start"
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex size-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: item.accentSoft, color: item.accentDark }}
                    >
                      <item.icon className="size-5" />
                    </span>
                    <span className="text-2xl" aria-hidden>
                      {item.emoji}
                    </span>
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-[13px] font-medium text-muted-foreground">
                      {item.tagline}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-primary">
                    Set up {item.short}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.li>
            ))}
            <motion.li {...fadeUp}>
              <Link
                to="/onboarding"
                className="group flex h-full flex-col gap-3 rounded-2xl border border-dashed border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#E8F5E9] text-primary">
                    <Wheat className="size-5" />
                  </span>
                  <span className="text-2xl" aria-hidden>
                    🌾
                  </span>
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-foreground">Farmer &amp; Nursery</p>
                  <p className="mt-1 text-[13px] font-medium text-muted-foreground">
                    Fields, crops, stock and the original farm dashboard.
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-primary">
                  Set up farm workspace
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.li>
          </ul>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="h-14 rounded-2xl px-7 text-base font-semibold">
              <Link to="/start">
                Choose your workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className={cn(
              "relative overflow-hidden rounded-3xl border border-border bg-surface-2 p-8 sm:p-12",
              "text-center",
            )}
          >
            <h2 className="mx-auto max-w-2xl text-[28px] font-bold tracking-[-0.02em] text-foreground sm:text-[36px]">
              Start checking your plants today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-7 text-muted-foreground">
              Create your profile in under two minutes — pick the workspace that
              fits you — and run your first plant check right away.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-2xl px-7 text-base font-semibold"
              >
                <Link to="/auth?mode=signup">
                  Create your account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl px-7 text-base font-semibold"
              >
                <Link to="/auth?mode=signin">Sign in</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-2 py-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <PlantGuardLogo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Deep learning based plant disease detection. AI-assisted guidance —
              always confirm critical decisions with a local agricultural expert.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PlantGuard AI · Farmer &amp; Nursery
            editions
          </p>
        </div>
      </footer>
    </div>
  );
}
