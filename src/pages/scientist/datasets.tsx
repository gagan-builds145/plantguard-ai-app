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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalState } from "@/hooks/use-local-state";
import { SCIENTIST_DATASETS, type Dataset } from "@/lib/role-data";
import { downloadCsv } from "@/lib/csv";
import { Database, Download, HardDrive, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ACCENT = "#5E35B1";

const STATUS_TONE: Record<string, PillTone> = {
  Ready: "green",
  Processing: "blue",
  "Needs review": "amber",
};

export function ScientistDatasets() {
  const [created, setCreated] = useLocalState<Dataset[]>(
    "scientist:created-datasets",
    [],
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", plants: "", diseases: "" });

  const datasets = [...created, ...SCIENTIST_DATASETS];

  const totalImages = datasets.reduce((sum, item) => sum + item.images, 0);
  const totalDiseases = datasets.reduce(
    (sum, item) => sum + item.diseases.split(",").length,
    0,
  );

  const createDataset = () => {
    if (!draft.name.trim() || !draft.plants.trim()) {
      toast.error("A dataset needs a name and at least one plant.");
      return;
    }
    setCreated((prev) => [
      {
        id: `ds-${Date.now()}`,
        name: draft.name.trim(),
        images: 0,
        plants: draft.plants.trim(),
        diseases: draft.diseases.trim() || "Unlabelled",
        updated: "Just now",
        status: "Processing" as const,
      },
      ...prev,
    ]);
    setDraft({ name: "", plants: "", diseases: "" });
    setCreateOpen(false);
    toast.success("Dataset created — it starts processing now.");
  };

  return (
    <RolePage
      role="scientist"
      active="datasets"
      title="Datasets"
      subtitle="Curate the image collections your models train and validate on."
      action={
        <Button
          className="h-11 gap-2 rounded-xl"
          style={{ backgroundColor: ACCENT }}
          onClick={() => setCreateOpen(true)}
        >
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
          {datasets.map((item) => (
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
        {datasets.map((item) => (
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
        <Button
          variant="outline"
          className="mt-4 h-11 gap-2 rounded-xl"
          onClick={() => {
            downloadCsv(
              "plantguard-dataset-manifest",
              ["Dataset", "Images", "Plants", "Disease classes", "Updated", "Status"],
              datasets.map((item) => [
                item.name,
                item.images,
                item.plants,
                item.diseases,
                item.updated,
                item.status,
              ]),
            );
            toast.success(`Manifest exported for ${datasets.length} datasets`);
          }}
        >
          <Download className="size-4" />
          Export dataset manifest
        </Button>
      </Panel>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>New dataset</DialogTitle>
            <DialogDescription>
              Describe the collection now — you can upload labelled images from the
              analysis workspace afterwards.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-1">
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Dataset name</Label>
              <Input
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="e.g. Brinjal Leaf Health v1"
                className="h-11 rounded-xl"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Plants covered</Label>
              <Input
                value={draft.plants}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, plants: event.target.value }))
                }
                placeholder="Brinjal, Tomato"
                className="h-11 rounded-xl"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Disease classes (optional)</Label>
              <Input
                value={draft.diseases}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, diseases: event.target.value }))
                }
                placeholder="Little leaf, Wilt, Healthy"
                className="h-11 rounded-xl"
              />
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl"
              style={{ backgroundColor: ACCENT }}
              onClick={createDataset}
            >
              Create dataset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RolePage>
  );
}

export default ScientistDatasets;
