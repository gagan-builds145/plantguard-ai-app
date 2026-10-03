import {
  BarList,
  DemoTag,
  HeroPanel,
  InfoNote,
  Panel,
  Photo,
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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import {
  SCIENTIST_AI_DISCLAIMER,
  SCIENTIST_DATASETS,
  SCIENTIST_DISEASE_TRENDS,
  SCIENTIST_HISTORY,
  SCIENTIST_PLANT_CATEGORIES,
  SCIENTIST_PROJECTS,
  SCIENTIST_VOLUME_SERIES,
} from "@/lib/role-data";
import {
  ArrowRight,
  Database,
  FolderKanban,
  FlaskConical,
  Images,
  Microscope,
  ScanLine,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ACCENT = "#5E35B1";

const volumeConfig = {
  analyses: { label: "Analyses", color: ACCENT },
} satisfies ChartConfig;

export function ScientistDashboard() {
  const { profile } = useFarmerProfile();
  const { user } = useAuth();

  const name = profile?.displayName ?? user?.name ?? "Researcher";
  const institution = profile?.institution ?? "ICAR-IIHR";
  const specialization =
    profile?.specialization ?? "Plant Pathology";

  const totalImages = SCIENTIST_DATASETS.reduce((sum, item) => sum + item.images, 0);
  const totalAnalyses = SCIENTIST_PROJECTS.reduce(
    (sum, item) => sum + item.analyses,
    0,
  );

  return (
    <RolePage
      role="scientist"
      active="home"
      title={`Welcome, ${name}`}
      subtitle={`${specialization} · ${institution} — your research workspace at a glance.`}
    >
      <HeroPanel role="scientist">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EDE7F6] px-3 py-1 text-[11px] font-semibold text-[#4527A0]">
              <Microscope className="size-3" />
              Research workspace
            </span>
            <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
              Analyse plant images, organise datasets and collaborate
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Upload a leaf or canopy image for an AI-assisted reading, then label,
              export and share the result with your project team.
            </p>
          </div>
          <Button
            asChild
            className="h-13 w-full shrink-0 gap-2 rounded-xl text-[15px] font-semibold lg:w-auto lg:px-8"
            style={{ backgroundColor: ACCENT }}
          >
            <Link to="/lab/analysis">
              <ScanLine className="size-4" />
              PLANT IMAGE ANALYSIS
            </Link>
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DemoTag />
          <span className="text-xs text-muted-foreground">{SCIENTIST_AI_DISCLAIMER}</span>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Analyses"
          value={totalAnalyses.toLocaleString("en-IN")}
          note="Across your projects"
          icon={FlaskConical}
          accent={ACCENT}
        />
        <StatTile
          label="Projects"
          value={String(SCIENTIST_PROJECTS.length)}
          note="Active and in review"
          icon={FolderKanban}
          accent={ACCENT}
        />
        <StatTile
          label="Dataset images"
          value={totalImages.toLocaleString("en-IN")}
          note={`${SCIENTIST_DATASETS.length} datasets`}
          icon={Database}
          accent={ACCENT}
        />
        <StatTile
          label="Collaborators"
          value="4"
          note="Across three institutions"
          icon={Users}
          accent={ACCENT}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHead
              title="Analysis volume"
              subtitle="Images analysed each day this week"
            />
            <DemoTag />
          </div>
          <div className="mt-4 h-[240px]">
            <ChartContainer config={volumeConfig} className="h-full w-full">
              <AreaChart data={SCIENTIST_VOLUME_SERIES} margin={{ left: 4, right: 8 }}>
                <defs>
                  <linearGradient id="scientistVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.32} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  dataKey="analyses"
                  type="monotone"
                  stroke={ACCENT}
                  strokeWidth={2.5}
                  fill="url(#scientistVolume)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Disease labels" subtitle="Distribution in sample outputs" />
            <div className="mt-4">
              <BarList accent={ACCENT} items={SCIENTIST_DISEASE_TRENDS} />
            </div>
          </Panel>
          <Panel>
            <SectionHead title="Crops analysed" subtitle="Share of images by plant" />
            <div className="mt-4">
              <BarList
                accent={ACCENT}
                items={SCIENTIST_PLANT_CATEGORIES.map((item) => ({
                  label: item.label,
                  value: item.value,
                  note: `${item.value}%`,
                }))}
              />
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <SectionHead
          title="Recent analyses"
          subtitle="Your latest AI-assisted readings"
          action={
            <Link
              to="/lab/history"
              className="inline-flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: ACCENT }}
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SCIENTIST_HISTORY.slice(0, 4).map((item) => (
            <Panel key={item.id} className="flex flex-col gap-3 p-0">
              <Photo src={item.image} alt={item.plant} ratio="aspect-[4/3]" />
              <div className="flex flex-col gap-2 px-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.plant}</p>
                  <StatusPill label={`${item.confidence}%`} tone="blue" />
                </div>
                <p className="text-[13px] text-muted-foreground">{item.result}</p>
                <p className="text-xs text-muted-foreground">
                  {item.project} · {item.date}
                </p>
              </div>
            </Panel>
          ))}
        </div>
        <div className="mt-4">
          <InfoNote tone="warn">{SCIENTIST_AI_DISCLAIMER}</InfoNote>
        </div>
      </Panel>

      <Panel>
        <SectionHead title="Research projects" subtitle="Where your work is happening" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SCIENTIST_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
                >
                  <Images className="size-4" />
                </span>
                <StatusPill
                  label={project.status}
                  tone={
                    project.status === "Active"
                      ? "green"
                      : project.status === "Archived"
                        ? "gray"
                        : "blue"
                  }
                />
              </div>
              <p className="text-sm font-semibold text-foreground">{project.name}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">
                {project.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {project.analyses} analyses · {project.collaborators} collaborators
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </RolePage>
  );
}

export default ScientistDashboard;
