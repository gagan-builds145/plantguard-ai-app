import {
  DemoTag,
  FilterPills,
  InfoNote,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
  TableShell,
  Td,
  Th,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import {
  SCIENTIST_AI_DISCLAIMER,
  SCIENTIST_HISTORY,
  SCIENTIST_PLANT_CATEGORIES,
} from "@/lib/role-data";
import { Download, FlaskConical, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { downloadCsv } from "@/lib/csv";
import { toast } from "sonner";

const ACCENT = "#5E35B1";
const FILTERS = ["All", "Healthy", "Needs review", "Flagged"] as const;

const flagged = (result: string) =>
  result.startsWith("Possible") || result === "Needs better image";

export function ScientistHistory() {
  const [filter, setFilter] = useState<string>("All");
  const [plant, setPlant] = useState<string>("All plants");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SCIENTIST_HISTORY.filter((item) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Healthy"
          ? item.result === "Healthy"
          : filter === "Flagged"
            ? flagged(item.result)
            : item.result === "Needs better image");
      const matchesPlant = plant === "All plants" || item.plant === plant;
      const matchesQuery =
        !needle ||
        item.plant.toLowerCase().includes(needle) ||
        item.result.toLowerCase().includes(needle) ||
        item.project.toLowerCase().includes(needle);
      return matchesFilter && matchesPlant && matchesQuery;
    });
  }, [filter, plant, query]);

  const averageConfidence = Math.round(
    SCIENTIST_HISTORY.reduce((sum, item) => sum + item.confidence, 0) /
      SCIENTIST_HISTORY.length,
  );

  return (
    <RolePage
      role="scientist"
      active="history"
      title="Analysis History"
      subtitle="Every image you have analysed, with the model reading, confidence and project."
      action={
        <Button
          variant="outline"
          className="h-11 gap-2 rounded-xl"
          onClick={() => {
            if (!visible.length) {
              toast.error("Nothing to export in this view.");
              return;
            }
            downloadCsv(
              "plantguard-analyses",
              ["Plant", "Model reading", "Confidence", "Project", "Date"],
              visible.map((item) => [
                item.plant,
                item.result,
                `${item.confidence}%`,
                item.project,
                item.date,
              ]),
            );
            toast.success(`Exported ${visible.length} analyses`);
          }}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Analyses"
          value={String(SCIENTIST_HISTORY.length)}
          note="Recorded sample runs"
          icon={FlaskConical}
          accent={ACCENT}
        />
        <StatTile
          label="Average confidence"
          value={`${averageConfidence}%`}
          note="Model agreement score"
          icon={FlaskConical}
          accent={ACCENT}
        />
        <StatTile
          label="Healthy reads"
          value={String(SCIENTIST_HISTORY.filter((item) => item.result === "Healthy").length)}
          note="No symptoms flagged"
          icon={FlaskConical}
          accent={ACCENT}
        />
        <StatTile
          label="Needs review"
          value={String(SCIENTIST_HISTORY.filter((item) => item.result === "Needs better image").length)}
          note="Re-upload recommended"
          icon={FlaskConical}
          accent={ACCENT}
        />
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Past analyses"
            subtitle={`${visible.length} record${visible.length === 1 ? "" : "s"} shown`}
          />
          <DemoTag />
        </div>
        <FilterPills options={FILTERS} value={filter} onChange={setFilter} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search plant, result or project"
              aria-label="Search analyses"
              className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {["All plants", ...SCIENTIST_PLANT_CATEGORIES.map((item) => item.label)].map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={plant === option}
                  onClick={() => setPlant(option)}
                  className={
                    plant === option
                      ? "h-11 shrink-0 rounded-xl border px-4 text-[13px] font-medium"
                      : "h-11 shrink-0 rounded-xl border border-[#EAF0EA] bg-card px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground"
                  }
                  style={
                    plant === option
                      ? { borderColor: ACCENT, color: ACCENT, backgroundColor: `${ACCENT}12` }
                      : undefined
                  }
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </div>
      </Panel>

      <TableShell>
        <thead>
          <tr>
            <Th>Image</Th>
            <Th>Plant</Th>
            <Th>Model reading</Th>
            <Th>Confidence</Th>
            <Th>Project</Th>
            <Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-surface-2">
              <Td>
                <Photo
                  src={item.image}
                  alt={item.plant}
                  ratio="aspect-square"
                  className="size-12 rounded-lg"
                />
              </Td>
              <Td className="font-semibold text-foreground">{item.plant}</Td>
              <Td>{item.result}</Td>
              <Td>
                <StatusPill
                  label={`${item.confidence}%`}
                  tone={item.confidence >= 85 ? "green" : item.confidence >= 70 ? "amber" : "red"}
                />
              </Td>
              <Td className="text-muted-foreground">{item.project}</Td>
              <Td className="text-muted-foreground">{item.date}</Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <div className="flex flex-col gap-3 md:hidden">
        {visible.map((item) => (
          <Panel key={item.id} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Photo
                src={item.image}
                alt={item.plant}
                ratio="aspect-square"
                className="size-14 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.plant}</p>
                <p className="text-[13px] text-muted-foreground">{item.result}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.project} · {item.date}
                </p>
              </div>
              <StatusPill
                label={`${item.confidence}%`}
                tone={item.confidence >= 85 ? "green" : item.confidence >= 70 ? "amber" : "red"}
              />
            </div>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">No analyses found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another filter, or{" "}
            <Link to="/lab/analysis" className="font-semibold" style={{ color: ACCENT }}>
              run a new analysis
            </Link>
            .
          </p>
        </Panel>
      ) : null}

      <InfoNote tone="warn">{SCIENTIST_AI_DISCLAIMER}</InfoNote>
    </RolePage>
  );
}

export default ScientistHistory;
