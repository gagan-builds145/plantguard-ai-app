import {
  DemoTag,
  InfoNote,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { PlantScanner } from "@/components/scanner/plant-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalState } from "@/hooks/use-local-state";
import { downloadCsv } from "@/lib/csv";
import {
  SCIENTIST_AI_DISCLAIMER,
  SCIENTIST_SPECIALIZATIONS,
} from "@/lib/role-data";
import { Download, FlaskConical, Save, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ACCENT = "#5E35B1";

const LABELS = [
  "Early blight",
  "Leaf spot",
  "Leaf rust",
  "Nutrient deficiency",
  "Healthy",
  "Needs review",
];

export function ScientistAnalyze() {
  const [labels, setLabels] = useLocalState<string[]>(
    "scientist:verified-labels",
    [],
  );
  const [notes, setNotes] = useLocalState<string>("scientist:analysis-notes", "");
  const [specialization, setSpecialization] = useState(SCIENTIST_SPECIALIZATIONS[0]);

  const saveAnnotation = () => {
    if (!labels.length) {
      toast.error("Select at least one verified label first.");
      return;
    }
    toast.success("Annotation saved to your project");
  };

  return (
    <RolePage
      role="scientist"
      active="analysis"
      title="AI Analysis Workspace"
      subtitle="Upload a plant image, review the model's reading, then record your verified label."
      action={<DemoTag />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel className="p-0">
          <PlantScanner
            title="PLANT IMAGE ANALYSIS"
            subtitle="Upload a field image for an AI-assisted reading, or use the camera on a single leaf."
            stages={[
              "Uploading image",
              "Preprocessing",
              "Running model inference",
              "Preparing annotated result",
            ]}
            historyHref="/lab/history"
            historyLabel="Analysis history"
            resultHref={() => "/lab/history"}
          />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead
              title="Verified label"
              subtitle="Your expert judgement, not the model's output"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {LABELS.map((label) => {
                const selected = labels.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setLabels((prev) =>
                        prev.includes(label)
                          ? prev.filter((item) => item !== label)
                          : [...prev, label],
                      )
                    }
                    className={
                      selected
                        ? "h-9 rounded-full border px-3.5 text-[13px] font-medium"
                        : "h-9 rounded-full border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
                    }
                    style={
                      selected
                        ? { borderColor: ACCENT, color: ACCENT, backgroundColor: `${ACCENT}12` }
                        : undefined
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Research notes</Label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Symptom description, sample conditions, next steps"
                className="w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="h-11 flex-1 gap-2 rounded-xl"
                style={{ backgroundColor: ACCENT }}
                onClick={saveAnnotation}
              >
                <Save className="size-4" />
                Save to project
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1 gap-2 rounded-xl"
                onClick={() => {
                  if (!labels.length) {
                    toast.error("Select a verified label before exporting.");
                    return;
                  }
                  downloadCsv(
                    "plantguard-annotation",
                    ["Verified labels", "Specialization", "Notes"],
                    [[labels.join(" / "), specialization, notes || "—"]],
                  );
                  toast.success("Annotation exported");
                }}
              >
                <Download className="size-4" />
                Export
              </Button>
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Analysis context" subtitle="Applies to this session" />
            <div className="mt-4 flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Specialization</Label>
              <Input
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill label="Model: prototype v1" tone="gray" />
              <StatusPill label="Dataset: your uploads" tone="gray" />
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
              >
                <Tag className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Labelling workflow</p>
                <p className="mt-0.5 text-[13px] leading-6 text-muted-foreground">
                  Record the verified label you would publish alongside the model output so
                  dataset quality stays auditable.
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Read before you use results" />
            <div className="mt-3 flex flex-col gap-3">
              <InfoNote tone="warn">{SCIENTIST_AI_DISCLAIMER}</InfoNote>
              <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <FlaskConical className="mt-0.5 size-3.5 shrink-0" />
                Confidence scores describe the model's agreement with its own training data,
                not the accuracy of a diagnosis in your field.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </RolePage>
  );
}

export default ScientistAnalyze;
