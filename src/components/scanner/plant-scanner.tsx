import { ScanResultCard } from "@/components/scanner/scan-result-card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  analyzePlantImage,
  type ScanResult,
} from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  Camera,
  Check,
  Clock3,
  ImagePlus,
  Loader2,
  RefreshCw,
  ScanLine,
  Sparkles,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type Step = "entry" | "preview" | "analyzing" | "result";

const STAGES = [
  "Uploading image",
  "Preparing image",
  "Identifying plant",
  "Checking for disease",
  "Generating result",
];

const STEP_INTERVAL = 420;
const FIRST_STAGE_DELAY = 220;

export function PlantScanner({
  onSaved,
}: {
  onSaved?: (scanId: string) => void;
}) {
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.scans.generateUploadUrl);
  const createScan = useMutation(api.scans.createScan);

  const [step, setStep] = useState<Step>("entry");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [imageId, setImageId] = useState<Id<"_storage"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Release the object URL when the preview is replaced or the flow resets.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(selected: File | null) {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or HEIC).");
      return;
    }
    setError(null);
    setResult(null);
    setSaved(false);
    setImageId(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStep("preview");
  }

  function startAnalysis() {
    if (!file) return;
    setResult(analyzePlantImage(file));
    setStageIndex(0);
    setStep("analyzing");
  }

  // Staged analysis progress + best-effort image upload.
  useEffect(() => {
    if (step !== "analyzing" || !file) return;
    let cancelled = false;

    const timers = STAGES.map((_, index) =>
      window.setTimeout(
        () => setStageIndex(index + 1),
        FIRST_STAGE_DELAY + index * STEP_INTERVAL,
      ),
    );
    timers.push(
      window.setTimeout(
        () => setStep("result"),
        FIRST_STAGE_DELAY + STAGES.length * STEP_INTERVAL,
      ),
    );

    (async () => {
      try {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!response.ok) throw new Error("Upload failed");
        const payload = (await response.json()) as {
          storageId: Id<"_storage">;
        };
        if (!cancelled) setImageId(payload.storageId);
      } catch {
        // Saving without an image is still allowed.
        if (!cancelled) setImageId(null);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [step, file, generateUploadUrl]);

  function reset() {
    setStep("entry");
    setFile(null);
    setResult(null);
    setStageIndex(0);
    setSaved(false);
    setSaving(false);
    setImageId(null);
    setError(null);
    setPreviewUrl(null);
  }

  async function handleSave() {
    if (!result || saving || saved) return;
    setSaving(true);
    try {
      const scanId = await createScan({
        plantName: result.plantName,
        plantConfidence: result.plantConfidence,
        healthStatus: result.healthStatus,
        observations: result.observations,
        recommendations: result.recommendations,
        isDemo: true,
        ...(result.disease ? { disease: result.disease } : {}),
        ...(result.diseaseConfidence !== undefined
          ? { diseaseConfidence: result.diseaseConfidence }
          : {}),
        ...(imageId ? { imageId } : {}),
      });
      setSaved(true);
      toast.success("Plant check saved to your history");
      onSaved?.(scanId);
      navigate(`/scan/${scanId}`);
    } catch {
      toast.error("Couldn't save this check. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {step === "entry" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-8">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Camera className="size-7" />
            </span>
            <h2 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-foreground">
              Check Your Plant
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Take a clear photo or upload an existing plant image. Our AI model
              looks at the leaf for visible disease patterns and gives you
              guidance on what to do next.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl text-[15px] font-semibold sm:h-12"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="size-5" />
                Take Photo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl text-[15px] font-semibold"
                onClick={() => uploadInputRef.current?.click()}
              >
                <Upload className="size-5" />
                Upload Image
              </Button>
            </div>

            {error ? (
              <p className="mt-3 text-sm font-medium text-danger" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-4 rounded-2xl bg-surface-2 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                For the best result
              </p>
              <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Use even, natural daylight</li>
                <li>Center the affected leaf</li>
                <li>Hold steady — avoid blur</li>
                <li>Fill most of the frame with the leaf</li>
              </ul>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-xl text-[15px] font-medium text-muted-foreground"
          >
            <Link to="/history">
              <Clock3 className="size-4" />
              View Scan History
            </Link>
          </Button>
        </div>
      )}

      {step === "preview" && previewUrl && (
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_4px_12px_rgba(20,40,20,0.08)]">
            <div className="aspect-[4/3] w-full bg-surface-3">
              <img
                src={previewUrl}
                alt="Selected plant"
                className="size-full object-cover"
              />
            </div>
            <div className="flex items-start gap-2 border-t border-border px-4 py-3 text-xs leading-5 text-muted-foreground">
              <ScanLine className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Check that the affected leaf is clearly visible and well lit before
              analysing.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
              onClick={startAnalysis}
            >
              <Sparkles className="size-5" />
              Analyze Plant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
              onClick={() => uploadInputRef.current?.click()}
            >
              <ImagePlus className="size-5" />
              Choose Another Image
            </Button>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_4px_12px_rgba(20,40,20,0.08)]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Analysing plant"
                className="size-full object-cover opacity-70"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <Loader2 className="size-8 animate-spin text-white" />
              </span>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-transparent via-primary/40 to-transparent"
              style={{ animation: "pg-scan 2.2s ease-in-out infinite" }}
            />
          </div>

          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-bold tracking-[-0.01em] text-foreground">
              Analyzing your plant…
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Our AI model is examining the image for plant identity and visible
              disease patterns.
            </p>

            <ul className="mt-5 flex flex-col gap-3" aria-live="polite">
              {STAGES.map((stage, index) => {
                const done = stageIndex > index;
                const active = stageIndex === index;
                return (
                  <li key={stage} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border",
                        done && "border-primary bg-primary text-white",
                        active && "border-primary text-primary",
                        !done && !active && "border-border text-muted-foreground",
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : active ? (
                        <span className="size-2 animate-pulse rounded-full bg-primary" />
                      ) : (
                        <span className="size-2 rounded-full bg-border" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        done || active
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-3">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold text-accent-foreground">
              Analysis complete
            </p>
          </div>

          <ScanResultCard
            result={{ ...result, imageUrl: previewUrl }}
            savedLabel={saved ? "Saved" : undefined}
            actions={
              <>
                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl text-[15px] font-semibold"
                  onClick={handleSave}
                  disabled={saving || saved}
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Saving…
                    </>
                  ) : saved ? (
                    <>
                      <Check className="size-5" />
                      Saved to Scan History
                    </>
                  ) : (
                    <>
                      <Check className="size-5" />
                      Save Result
                    </>
                  )}
                </Button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
                    onClick={reset}
                  >
                    <RefreshCw className="size-4" />
                    Scan Again
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
                  >
                    <Link to="/history">
                      <Clock3 className="size-4" />
                      View History
                    </Link>
                  </Button>
                </div>
              </>
            }
          />
        </div>
      )}

      {/* Hidden inputs — camera capture + gallery/file picker */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
    </div>
  );
}
