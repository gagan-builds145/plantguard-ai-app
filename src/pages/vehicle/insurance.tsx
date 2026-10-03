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
import { VEHICLE_INSURANCE } from "@/lib/role-data";
import {
  ArrowRight,
  FileCheck2,
  HeartPulse,
  ShieldCheck,
  Tractor,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  vehicle: Tractor,
  accident: HeartPulse,
  agri: ShieldCheck,
};

const POLICIES = [
  {
    label: "Mahindra 575 DI",
    insurer: "Sample insurer",
    status: "Active",
    renews: "18 Jan 2027",
  },
  {
    label: "Ashok Leyland Ecomet 1615",
    insurer: "Not selected",
    status: "Not active",
    renews: "—",
  },
  {
    label: "Driver personal accident",
    insurer: "Sample insurer",
    status: "Active",
    renews: "02 Mar 2027",
  },
];

export function VehicleInsurance() {
  return (
    <RolePage
      role="vehicle_owner"
      active="insurance"
      title="Vehicle Insurance"
      subtitle="Cover for your vehicles, your implements and the people who drive them."
    >
      <HeroPanel role="vehicle_owner">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E3F2FD] px-3 py-1 text-[11px] font-semibold text-[#0D47A1]">
            <ShieldCheck className="size-3" />
            Vehicle protection
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Stay covered between jobs
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Agricultural vehicles are used seasonally and driven hard. Cover your own
            damage, third-party liability and the driver at the same time.
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
          value="2"
          note="Vehicle and driver cover"
          icon={ShieldCheck}
          accent="#1565C0"
        />
        <StatTile
          label="Vehicles to cover"
          value="1"
          note="Tanker has no policy yet"
          icon={Tractor}
          accent="#1565C0"
        />
        <StatTile
          label="Documents stored"
          value="3"
          note="On your profile"
          icon={FileCheck2}
          accent="#1565C0"
        />
      </div>

      <Panel>
        <SectionHead title="Cover types" subtitle="What each policy protects" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {VEHICLE_INSURANCE.map((item) => {
            const Icon = ICONS[item.key] ?? ShieldCheck;
            return (
              <Panel key={item.key} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD]">
                    <Icon className="size-4" style={{ color: "#1565C0" }} />
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
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#1565C0]" />
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
        <SectionHead title="Your policies" subtitle="Sample records for this fleet" />
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
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-start gap-3 rounded-2xl bg-surface-2 px-4 py-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E3F2FD]">
              <UserRound className="size-4" style={{ color: "#1565C0" }} />
            </span>
            <p className="text-[13px] leading-6 text-muted-foreground">
              Add every helper who drives your vehicle so personal accident cover reaches
              the whole crew.
            </p>
          </div>
          <InfoNote tone="warn">
            Policy names, renewal dates and cover details are demo data for this
            prototype. Confirm terms with the insurer before you buy.
          </InfoNote>
        </div>
      </Panel>
    </RolePage>
  );
}

export default VehicleInsurance;
