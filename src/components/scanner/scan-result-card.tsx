import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  HEALTH_META,
  PROTOTYPE_MODEL_NOTE,
  type ScanResult,
} from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Leaf,
  ScanSearch,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";

export type ScanResultCardData = ScanResult & {
  imageUrl?: string | null;
};

function ConfidenceBar({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "muted";
}) {
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full",
          tone === "primary" ? "bg-primary" : "bg-info",
        )}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function ObservationIcon({ index }: { index: number }) {
  const icons = [Leaf, ScanSearch, Stethoscope];
  const Icon = icons[index % icons.length];
  return (
    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
      <Icon className="size-3.5" />
    </span>
  );
}

export function ScanResultCard({
  result,
  actions,
  savedLabel,
  className,
}: {
  result: ScanResultCardData;
  actions?: ReactNode;
  savedLabel?: string;
  className?: string;
}) {
  const meta = HEALTH_META[result.healthStatus];
  const isInconclusive = result.healthStatus === "inconclusive";

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="overflow-hidden rounded-3xl border-border p-0 shadow-[0_4px_12px_rgba(20,40,20,0.08)]">
        <div className="relative aspect-[16/10] w-full bg-surface-3">
          {result.imageUrl ? (
            <img
              src={result.imageUrl}
              alt={`Scanned ${result.plantName}`}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Leaf className="size-8" />
              <span className="text-xs font-medium">No image attached</span>
            </div>
          )}
          <span className="absolute left-3 top-3">
            <Badge className={cn("h-7 gap-1.5 px-2.5 text-xs", meta.badge)}>
              <span className={cn("size-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </Badge>
          </span>
          {savedLabel ? (
            <span className="absolute right-3 top-3">
              <Badge className="h-7 gap-1 border-transparent bg-ink/85 px-2.5 text-xs text-white backdrop-blur">
                <CheckCircle2 className="size-3.5" />
                {savedLabel}
              </Badge>
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Identified plant
              </span>
              <span className="text-xl font-bold tracking-[-0.02em] text-foreground">
                {result.plantName}
              </span>
              <span className="text-xs text-muted-foreground">
                Plant ID confidence {result.plantConfidence}%
              </span>
              <ConfidenceBar value={result.plantConfidence} />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Health status
              </span>
              <span className={cn("text-xl font-bold tracking-[-0.02em]", meta.text)}>
                {meta.label}
              </span>
              {!isInconclusive && result.diseaseConfidence !== undefined ? (
                <>
                  <span className="text-xs text-muted-foreground">
                    Disease confidence {result.diseaseConfidence}%
                  </span>
                  <ConfidenceBar value={result.diseaseConfidence} />
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {isInconclusive
                    ? "Confidence too low to name a disease"
                    : "No disease pattern detected"}
                </span>
              )}
            </div>
          </div>

          {result.disease ? (
            <div
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4",
                isInconclusive
                  ? "border-info/20 bg-info-bg"
                  : "border-danger/15 bg-danger-bg",
              )}
            >
              {isInconclusive ? (
                <Info className="mt-0.5 size-5 shrink-0 text-info" />
              ) : (
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Possible finding
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[15px] font-semibold",
                    isInconclusive ? "text-info" : "text-danger",
                  )}
                >
                  {result.disease}
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              What we observed
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {result.observations.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <ObservationIcon index={index} />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Recommended next steps
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {result.recommendations.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            {PROTOTYPE_MODEL_NOTE} If the problem spreads, consult a local
            agricultural expert.
          </p>
        </div>
      </Card>

      {actions ? <div className="flex flex-col gap-3">{actions}</div> : null}
    </div>
  );
}
