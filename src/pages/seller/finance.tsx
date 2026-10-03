import {
  DemoTag,
  HeroPanel,
  InfoNote,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { SELLER_FINANCE } from "@/lib/role-data";
import { EligibilityDialog } from "@/components/role-dialogs";
import {
  ArrowRight,
  Banknote,
  Landmark,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Tractor,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

const ICONS: Record<string, LucideIcon> = {
  loans: Landmark,
  capital: Wallet,
  equipment: Tractor,
  services: Receipt,
};

const SUMMARY = [
  { label: "Sales this month", value: "₹1,86,400", note: "Sample figure", icon: Banknote },
  { label: "Order payouts", value: "₹1,42,900", note: "Settled to bank", icon: PiggyBank },
  { label: "Pending payout", value: "₹28,600", note: "6 orders in transit", icon: Wallet },
  { label: "Credit ready", value: "₹3,00,000", note: "Indicative only", icon: ShieldCheck },
];

export function SellerBusinessFinance() {
  const [checkOpen, setCheckOpen] = useState(false);
  const [checkKey, setCheckKey] = useState(SELLER_FINANCE[0].key);
  const [checkTitle, setCheckTitle] = useState(SELLER_FINANCE[0].title);

  const openCheck = (key: string, title: string) => {
    setCheckKey(key);
    setCheckTitle(title);
    setCheckOpen(true);
  };

  return (
    <RolePage
      role="seller"
      active="finance"
      title="Business Finance"
      subtitle="Understand your money flow and explore credit options built for seasonal plant businesses."
    >
      <HeroPanel role="seller">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E0F2F1] px-3 py-1 text-[11px] font-semibold text-[#00695C]">
            <Landmark className="size-3" />
            Business finance
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Funding that fits the growing season
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Working capital for stock, seasonal repayment schedules and equipment
            finance for irrigation, greenhouses and delivery.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DemoTag />
            <span className="text-xs text-muted-foreground">
              No live lender is connected in this prototype
            </span>
          </div>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY.map((item) => (
          <StatTile
            key={item.label}
            label={item.label}
            value={item.value}
            note={item.note}
            icon={item.icon}
            accent="#00897B"
          />
        ))}
      </div>

      <Panel>
        <SectionHead
          title="Finance options"
          subtitle="Each option explains what it covers and who it suits"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SELLER_FINANCE.map((item) => {
            const Icon = ICONS[item.key] ?? Wallet;
            return (
              <Panel key={item.key} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2F1]">
                    <Icon className="size-4 text-[#00695C]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
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
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00897B]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="mt-1 h-11 w-full gap-2 rounded-xl"
                  onClick={() => openCheck(item.key, item.title)}
                >
                  Check eligibility
                  <ArrowRight className="size-4" />
                </Button>
              </Panel>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <SectionHead
          title="Money flow at a glance"
          subtitle="How an order turns into money in your account"
        />
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Order placed", body: "Customer pays through the platform." },
            { title: "You fulfil", body: "Pack, ship and mark the order as delivered." },
            { title: "Payout scheduled", body: "Settlement runs on your payout cycle." },
            { title: "Bank credit", body: "Funds land in your registered account." },
          ].map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <span className="text-xs font-bold text-[#00695C]">STEP {index + 1}</span>
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <InfoNote tone="warn">
            Amounts, credit limits and eligibility shown here are demo data. Rates,
            terms and approvals come from the lending partner once you apply.
          </InfoNote>
        </div>
      </Panel>

      <EligibilityDialog
        open={checkOpen}
        onOpenChange={setCheckOpen}
        productKey={checkKey}
        title={checkTitle}
        accent="#00897B"
      />
    </RolePage>
  );
}

export default SellerBusinessFinance;
