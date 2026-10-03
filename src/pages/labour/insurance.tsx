import {
  DemoTag,
  HeroPanel,
  InfoNote,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { LABOUR_INSURANCE } from "@/lib/role-data";
import {
  ArrowRight,
  FileCheck2,
  HeartPulse,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ACCENT = "#EF6C00";
const ICONS: Record<string, LucideIcon> = {
  life: ShieldCheck,
  health: HeartPulse,
  accident: Users,
};

const POLICIES = [
  { label: "Health cover (self + family)", insurer: "Sample insurer", status: "Active", renews: "09 Apr" },
  { label: "Personal accident cover", insurer: "Not selected", status: "Not active", renews: "—" },
];

export function LabourInsurance() {
  return (
    <RolePage
      role="labour"
      active="insurance"
      title="Insurance"
      subtitle="Affordable protection for you and your family, built around agricultural work."
    >
      <HeroPanel role="labour">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFF1E3] px-3 py-1 text-[11px] font-semibold text-[#B45309]">
            <ShieldCheck className="size-3" />
            Worker protection
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Cover that doesn't depend on how much you earn
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Term life, hospitalisation and accident cover designed for agricultural
            workers and their families.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DemoTag />
            <span className="text-xs text-muted-foreground">
              Cover details are illustrative sample content
            </span>
          </div>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Active policies"
          value="1"
          note="Health cover for your family"
          icon={ShieldCheck}
          accent={ACCENT}
        />
        <StatTile
          label="Cover to add"
          value="1"
          note="Personal accident cover"
          icon={HeartPulse}
          accent={ACCENT}
        />
        <StatTile
          label="Documents stored"
          value="2"
          note="On your profile"
          icon={FileCheck2}
          accent={ACCENT}
        />
      </div>

      <Panel>
        <SectionHead title="Cover options" subtitle="Choose what protects you best" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LABOUR_INSURANCE.map((item) => {
            const Icon = ICONS[item.key] ?? ShieldCheck;
            return (
              <Panel key={item.key} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${ACCENT}1A` }}
                  >
                    <Icon className="size-4" style={{ color: ACCENT }} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[13px] text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                      {point}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-1 h-11 w-full gap-2 rounded-xl">
                  Explore cover
                  <ArrowRight className="size-4" />
                </Button>
              </Panel>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <SectionHead title="Your policies" subtitle="Sample records on your profile" />
        <ul className="mt-4 flex flex-col gap-3">
          {POLICIES.map((policy) => (
            <li
              key={policy.label}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAF0EA] bg-surface-2 px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{policy.label}</p>
                <p className="text-xs text-muted-foreground">
                  {policy.insurer} · renews {policy.renews}
                </p>
              </div>
              <StatusPill
                label={policy.status}
                tone={policy.status === "Active" ? "green" : "gray"}
              />
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <InfoNote tone="warn">
            Policy names, renewal dates and cover details are demo data for this
            prototype. Confirm premiums and exclusions with the insurer before you buy.
          </InfoNote>
        </div>
      </Panel>
    </RolePage>
  );
}

export default LabourInsurance;
