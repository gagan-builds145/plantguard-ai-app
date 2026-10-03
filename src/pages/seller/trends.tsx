import {
  BarList,
  DemoTag,
  HeroPanel,
  InfoNote,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SELLER_TRENDING } from "@/lib/role-data";
import { Flame, Leaf, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const demandConfig = {
  demand: { label: "Demand index", color: "#00897B" },
} satisfies ChartConfig;

const DEMAND_SERIES = SELLER_TRENDING.map((item) => ({
  category: item.label.split(" ").slice(0, 2).join(" "),
  demand: item.change * 5,
}));

const SUGGESTIONS = [
  {
    title: "Stock up on indoor foliage",
    body: "Indoor plant demand has held steady for six weeks in this sample. Restocking mid-week reduced stock-outs in the same period.",
  },
  {
    title: "Push organic fertilizer bundles",
    body: "Organic fertilizer requests are rising locally. Bundling with a pot or growing medium lifts basket value in the sample data.",
  },
  {
    title: "Plan for vegetable seed season",
    body: "Seed enquiries are trending up ahead of the season. Publishing early and listing a starter kit can capture the first wave.",
  },
  {
    title: "Prepare irrigation ahead of summer",
    body: "Drip kits show early interest. Featuring them on the home banner before the hot months helps pre-book demand.",
  },
];

export function SellerMarketTrends() {
  return (
    <RolePage
      role="seller"
      active="trends"
      title="Market Trends"
      subtitle="See which categories are moving so you can plan buying, stock and promotions."
    >
      <HeroPanel role="seller">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E0F2F1] px-3 py-1 text-[11px] font-semibold text-[#00695C]">
            <Flame className="size-3" />
            Trending in your market
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Demand is leaning towards indoor plants and organic inputs
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            These signals come from this sample dataset so you can see the shape of
            the tool. Connect your own sales to replace them with real trends.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DemoTag />
            <span className="text-xs text-muted-foreground">
              Sample window: last 30 days
            </span>
          </div>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Top category"
          value="Indoor plants"
          note="18% above baseline"
          icon={Leaf}
          accent="#00897B"
        />
        <StatTile
          label="Fastest riser"
          value="Organic inputs"
          note="14% above baseline"
          icon={TrendingUp}
          accent="#00897B"
        />
        <StatTile
          label="Seasonal signal"
          value="Vegetable seeds"
          note="Demand starting early"
          icon={Flame}
          accent="#00897B"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHead
              title="Demand by category"
              subtitle="Relative index, higher is stronger"
            />
            <DemoTag />
          </div>
          <div className="mt-4 h-[240px]">
            <ChartContainer config={demandConfig} className="h-full w-full">
              <BarChart data={DEMAND_SERIES} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} stroke="#EAF0EA" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#6B7C6B" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tick={{ fontSize: 11, fill: "#6B7C6B" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="demand" fill="#00897B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </Panel>

        <Panel>
          <SectionHead
            title="Trending categories"
            subtitle="Ranked by change against the sample baseline"
          />
          <div className="mt-4">
            <BarList
              accent="#00897B"
              items={SELLER_TRENDING.map((item) => ({
                label: item.label,
                value: item.change,
                note: `+${item.change}%`,
              }))}
            />
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {SELLER_TRENDING.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-3"
              >
                <span className="text-[13px] font-medium text-foreground">{item.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.note}</span>
                  <StatusPill label={`+${item.change}%`} tone="green" />
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionHead
          title="What this means for your store"
          subtitle="Suggested actions based on the sample signals above"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <InfoNote tone="warn">
            These trends are demo data written for this prototype. Connect your store
            catalogue and sales history before treating any of it as market research.
          </InfoNote>
        </div>
      </Panel>
    </RolePage>
  );
}

export default SellerMarketTrends;
