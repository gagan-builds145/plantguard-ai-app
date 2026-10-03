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
import {
  SCIENTIST_AI_DISCLAIMER,
  SCIENTIST_DISEASE_TRENDS,
  SCIENTIST_HISTORY,
  SCIENTIST_OBSERVATIONS,
  SCIENTIST_PLANT_CATEGORIES,
  SCIENTIST_VOLUME_SERIES,
} from "@/lib/role-data";
import { Lightbulb, Microscope, TrendingUp, TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ACCENT = "#5E35B1";

const diseaseConfig = {
  value: { label: "Readings", color: ACCENT },
} satisfies ChartConfig;

const cropConfig = {
  value: { label: "Share of images", color: "#7E57C2" },
} satisfies ChartConfig;

export function ScientistInsights() {
  const lowConfidence = SCIENTIST_HISTORY.filter((item) => item.confidence < 75).length;
  const healthyShare = Math.round(
    (SCIENTIST_HISTORY.filter((item) => item.result === "Healthy").length /
      SCIENTIST_HISTORY.length) *
      100,
  );
  const weekly = SCIENTIST_VOLUME_SERIES.reduce(
    (sum, item) => sum + item.analyses,
    0,
  );

  return (
    <RolePage
      role="scientist"
      active="insights"
      title="Research Insights"
      subtitle="Patterns across your analyses, datasets and observed image conditions."
    >
      <HeroPanel role="scientist">
        <div className="flex max-w-xl flex-col gap-3">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
          >
            <Lightbulb className="size-3" />
            Sample insights
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Disease labels and image quality are your two biggest levers
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            These observations are written from the sample analyses in this workspace so
            you can see the reporting format before connecting your own dataset.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DemoTag />
            <span className="text-xs text-muted-foreground">
              Window: {weekly} sample analyses
            </span>
          </div>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Weekly analyses"
          value={String(weekly)}
          note="Sample volume"
          icon={Microscope}
          accent={ACCENT}
        />
        <StatTile
          label="Healthy readings"
          value={`${healthyShare}%`}
          note="No symptoms flagged"
          icon={TrendingUp}
          accent={ACCENT}
        />
        <StatTile
          label="Low confidence"
          value={String(lowConfidence)}
          note="Below 75% agreement"
          icon={TriangleAlert}
          accent={ACCENT}
        />
        <StatTile
          label="Top crop"
          value={SCIENTIST_PLANT_CATEGORIES[0].label}
          note={`${SCIENTIST_PLANT_CATEGORIES[0].value}% of images`}
          icon={TrendingUp}
          accent={ACCENT}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHead title="Disease label distribution" subtitle="Across sample readings" />
            <DemoTag />
          </div>
          <div className="mt-4 h-[240px]">
            <ChartContainer config={diseaseConfig} className="h-full w-full">
              <BarChart data={SCIENTIST_DISEASE_TRENDS} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} stroke="#EAF0EA" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 10, fill: "#6B7C6B" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tick={{ fontSize: 11, fill: "#6B7C6B" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill={ACCENT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </Panel>

        <Panel>
          <SectionHead title="Images by crop" subtitle="Where your sample data comes from" />
          <div className="mt-4 h-[240px]">
            <ChartContainer config={cropConfig} className="h-full w-full">
              <BarChart data={SCIENTIST_PLANT_CATEGORIES} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} stroke="#EAF0EA" />
                <XAxis
                  dataKey="label"
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
                <Bar dataKey="value" fill="#7E57C2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHead
            title="Observations"
            subtitle="Patterns noticed while reviewing sample analyses"
          />
          <ul className="mt-4 flex flex-col gap-3">
            {SCIENTIST_OBSERVATIONS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
              >
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
                >
                  <Lightbulb className="size-3.5" />
                </span>
                <p className="text-[13px] leading-6 text-muted-foreground">{item}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionHead
            title="Label distribution"
            subtitle="Share of readings by class"
          />
          <div className="mt-4">
            <BarList
              accent={ACCENT}
              items={SCIENTIST_DISEASE_TRENDS.map((item) => ({
                label: item.label,
                value: item.value,
                note: `${item.value}`,
              }))}
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Early blight", "Leaf spot", "Healthy"].map((label) => (
              <StatusPill key={label} label={label} tone="blue" />
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionHead
          title="Next research steps"
          subtitle="Suggested from the observations above"
        />
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Re-balance deficiency classes",
              body: "Nutrient deficiency cases are under-represented compared with leaf spot; collecting more samples would improve the class balance.",
            },
            {
              title: "Standardise capture conditions",
              body: "Single-leaf images on plain backgrounds score above 90% confidence, so a capture protocol is worth documenting.",
            },
            {
              title: "Double-check low-confidence labels",
              body: "Re-review the records below 75% confidence before they enter the training set.",
            },
          ].map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <span className="text-xs font-bold" style={{ color: ACCENT }}>
                STEP {index + 1}
              </span>
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-col gap-3">
          <InfoNote tone="warn">{SCIENTIST_AI_DISCLAIMER}</InfoNote>
          <p className="text-xs text-muted-foreground">
            Want to check the underlying records?{" "}
            <Link to="/lab/history" className="font-semibold" style={{ color: ACCENT }}>
              Open analysis history
            </Link>
            .
          </p>
        </div>
      </Panel>
    </RolePage>
  );
}

export default ScientistInsights;
