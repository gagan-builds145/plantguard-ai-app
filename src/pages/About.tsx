import { AppShell } from "@/components/app-shell";
import { PlantGuardMark } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Flower2,
  Heart,
  Languages,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Wheat,
} from "lucide-react";
import { Link } from "react-router";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Honest by default",
    body: "Every result carries a confidence score, and we never dress up a guess as a diagnosis.",
  },
  {
    icon: Languages,
    title: "Built for the field",
    body: "Plain-language guidance in the languages growers actually read, on the phone already in their pocket.",
  },
  {
    icon: Heart,
    title: "Farmer and nursery first",
    body: "Two tailored workspaces — one for the land you cultivate, one for the plants you grow and sell.",
  },
];

const HOW = [
  { icon: Camera, title: "Capture", body: "Take or upload a photo of a leaf." },
  { icon: ScanLine, title: "Analyse", body: "The model reads the plant and its symptoms." },
  { icon: Sparkles, title: "Act", body: "Get practical next steps and save the result." },
];

export default function About() {
  return (
    <AppShell
      active="about"
      title="About PlantGuard AI"
      subtitle="AI-assisted plant disease detection for farmers and nurseries."
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#17351C] to-[#1B5E20] p-7 sm:p-9">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[#2E7D32]/40 blur-2xl"
          />
          <div className="relative">
            <PlantGuardMark className="size-12 bg-white/15 text-white" />
            <h2 className="mt-5 max-w-lg text-[26px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[30px]">
              Know what&apos;s wrong with your crop, before it spreads.
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/75">
              PlantGuard AI turns a single photo of a leaf into a clear,
              confidence-scored reading of a plant&apos;s health — with practical
              next steps, plus the everyday services and analytics around growing
              and selling plants.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-12 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#1B5E20] hover:bg-[#E8F5E9]"
              >
                <Link to="/scan">
                  <Camera className="size-5" />
                  Check a plant
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/25 bg-white/10 px-6 text-[15px] font-semibold text-white hover:bg-white/20 hover:text-white"
              >
                <Link to="/help">Visit help centre</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Workspaces */}
        <section className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Wheat,
              title: "Farmer workspace",
              body: "Crop health, disease guidance and farm services.",
            },
            {
              icon: Flower2,
              title: "Nursery workspace",
              body: "Stock health, buyer leads, listings and sales analytics.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* How it works */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
            How it works
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {HOW.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl bg-surface-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xl font-bold text-border">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Values */}
        <section className="flex flex-col gap-3">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Legal / version */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="h-7 border-transparent bg-secondary px-2.5 text-xs text-muted-foreground">
              Version 1.0
            </Badge>
            <Badge className="h-7 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
              Prototype
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            AI-assisted guidance — always confirm critical decisions with a local
            agricultural expert. Sample weather and some offer content are marked
            as illustrative and are not live commercial data.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} PlantGuard AI · Farmer &amp; Nursery
            editions
          </p>
        </section>
      </div>
    </AppShell>
  );
}
