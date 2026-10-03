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
import { SELLER_INSURANCE } from "@/lib/role-data";
import { CoverDialog } from "@/components/role-dialogs";
import {
  ArrowRight,
  Boxes,
  FileCheck2,
  PackageSearch,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

const ICONS: Record<string, LucideIcon> = {
  business: Warehouse,
  inventory: Boxes,
  equipment: Truck,
  seller: PackageSearch,
};

const POLICIES = [
  { label: "Shop & building", insurer: "Sample insurer", status: "Active", renews: "12 Mar" },
  { label: "Stored stock", insurer: "Sample insurer", status: "Active", renews: "12 Mar" },
  { label: "Delivery vehicle", insurer: "Not selected", status: "Not active", renews: "—" },
];

export function SellerBusinessInsurance() {
  const [coverOpen, setCoverOpen] = useState(false);
  const [activeCover, setActiveCover] = useState<(typeof SELLER_INSURANCE)[number] | null>(
    null,
  );

  const openCover = (cover: (typeof SELLER_INSURANCE)[number]) => {
    setActiveCover(cover);
    setCoverOpen(true);
  };

  return (
    <RolePage
      role="seller"
      active="insurance"
      title="Business Insurance"
      subtitle="Protect your shop, stock, equipment and orders against the risks that affect plant businesses."
    >
      <HeroPanel role="seller">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E0F2F1] px-3 py-1 text-[11px] font-semibold text-[#00695C]">
            <ShieldCheck className="size-3" />
            Business protection
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Cover that matches how you store and ship
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Plants, seeds and growing media need different cover from tools and
            vehicles. Pick the policies that match your setup.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DemoTag />
            <span className="text-xs text-muted-foreground">
              Coverage details are illustrative sample content
            </span>
          </div>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Active policies"
          value="2"
          note="Shop building and stored stock"
          icon={ShieldCheck}
          accent="#00897B"
        />
        <StatTile
          label="Cover to review"
          value="1"
          note="Delivery vehicle not selected"
          icon={FileCheck2}
          accent="#00897B"
        />
        <StatTile
          label="Documents ready"
          value="4"
          note="Stored on your profile"
          icon={FileCheck2}
          accent="#00897B"
        />
      </div>

      <Panel>
        <SectionHead title="Cover types" subtitle="What each policy protects" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SELLER_INSURANCE.map((item) => {
            const Icon = ICONS[item.key] ?? ShieldCheck;
            return (
              <Panel key={item.key} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2F1]">
                    <Icon className="size-4 text-[#00695C]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{item.summary}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[13px] text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00897B]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="mt-1 h-11 w-full gap-2 rounded-xl"
                  onClick={() => openCover(item)}
                >
                  Explore cover
                  <ArrowRight className="size-4" />
                </Button>
              </Panel>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <SectionHead
          title="Your policies"
          subtitle="Sample policy records attached to this business"
        />
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
            prototype. Buy a policy only after confirming terms with the insurer.
          </InfoNote>
        </div>
      </Panel>

      <CoverDialog
        open={coverOpen}
        onOpenChange={setCoverOpen}
        cover={activeCover}
        accent="#00897B"
      />
    </RolePage>
  );
}

export default SellerBusinessInsurance;
