import {
  DemoTag,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
  TableShell,
  Td,
  Th,
  type PillTone,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { SCIENTIST_DATASETS } from "@/lib/role-data";
import { Database, Download, HardDrive, Plus, RefreshCw } from "lucide-react";

const ACCENT = "#5E35B1";

const STATUS_TONE: Record<string, PillTone> = {
  Ready: "green",
  Processing: "blue",
  "Needs review": "amber",
};

export function ScientistDatasets() {
  const totalImages = SCIENTIST_DATASETS.reduce((sum, item) => sum + item.images, 0);
  const totalDiseases = SCIENTIST_DATASETS.reduce(
    (sum, item) => sum + item.diseases.split(",").length,
    0,
  );

  return (
    <RolePage
      role="scientist"
      active="datasets"
      title="Datasets"
      subtitle="Curate the image collections your models train and validate on."
      action={
        <Button className="h-11 gap-2 rounded-xl" style={{ backgroundColor: ACCENT }}>
          <Plus className="size-4" />
          New dataset
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Datasets"
          value={String(SCIENTIST_DATASETS.length)}
          note="Curated collections"
          icon={Database}
          accent={ACCENT}
        />
        <StatTile
          label="Labelled images"
          value={totalImages.toLocaleString("en-IN")}
          note="Sample totals"
          icon={HardDrive}
          accent={ACCENT}
        />
        <StatTile
          label="Disease classes"
          value={String(totalDiseases)}
          note="Across all datasets"
          icon={Database}
          accent={ACCENT}
        />
        <StatTile
          label="Needs review"
          value={String(
            SCIENTIST_DATASETS.filter((item) => item.status === "Needs review").length,
          )}
          note="Label quality checks"
          icon={RefreshCw}
          accent={ACCENT}
        />
      </div>

      <TableShell>
        <thead>
          <tr>
            <Th>Dataset</Th>
            <Th>Images</Th>
            <Th>Plants</Th>
            <Th>Disease classes</Th>
            <Th>Updated</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {SCIENTIST_DATASETS.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-surface-2">
              <Td className="font-semibold text-foreground">{item.name}</Td>
              <Td>{item.images.toLocaleString("en-IN")}</Td>
              <Td className="text-muted-foreground">{item.plants}</Td>
              <Td className="text-muted-foreground">{item.diseases}</Td>
              <Td className="text-muted-foreground">{item.updated}</Td>
              <Td>
                <StatusPill label={item.status} tone={STATUS_TONE[item.status]} />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 md:hidden">
        {SCIENTIST_DATASETS.map((item) => (
          <Panel key={item.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <StatusPill label={item.status} tone={STATUS_TONE[item.status]} />
            </div>
            <div className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
              <span>{item.images.toLocaleString("en-IN")} images</span>
              <span>{item.plants}</span>
              <span>{item.diseases}</span>
              <span>Updated {item.updated}</span>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Dataset hygiene"
            subtitle="Three checks keep a collection usable"
          />
          <DemoTag />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Label balance",
              body: "Check that healthy and diseased classes are comparably represented.",
            },
            {
              title: "Image conditions",
              body: "Flag images with blur, glare or uneven lighting before training.",
            },
            {
              title: "Duplicates",
              body: "Remove repeated frames captured from the same plant.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 h-11 gap-2 rounded-xl" type="button">
          <Download className="size-4" />
          Export dataset manifest
        </Button>
      </Panel>
    </RolePage>
  );
}

export default ScientistDatasets;
