import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlantGuardMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground",
        "shadow-[0_2px_6px_rgba(20,40,20,0.14)]",
        className,
      )}
      aria-hidden="true"
    >
      <Leaf className="size-[55%]" strokeWidth={2.2} />
    </span>
  );
}

export function PlantGuardLogo({
  className,
  subtitle,
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PlantGuardMark />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
          PlantGuard <span className="text-primary">AI</span>
        </span>
        {subtitle ? (
          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
