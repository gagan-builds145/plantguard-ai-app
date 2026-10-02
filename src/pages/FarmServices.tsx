import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FARM_SERVICES } from "@/lib/plantguard-data";
import { ArrowRight, Camera, Info } from "lucide-react";
import { Link } from "react-router";

export default function FarmServices() {
  return (
    <AppShell
      active="services"
      title="Farm services"
      subtitle="Water, irrigation, labour, inputs and finance — organised for your farm."
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-info-bg p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-info" />
          <div>
            <p className="text-sm font-semibold text-info">
              Service requests are coming soon
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Version 1 focuses on AI plant checks. Browse what will be available
              from your farmer workspace.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FARM_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.key}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                  {service.label}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
                <Badge className="mt-4 h-7 w-fit border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                  Coming soon
                </Badge>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-4 rounded-3xl bg-linear-to-br from-[#17351C] to-[#1B5E20] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em] text-white">
              While you wait, check your plant
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-6 text-white/70">
              The AI plant scanner is ready now. Scan a leaf and get practical
              next steps.
            </p>
          </div>
          <Button
            asChild
            className="h-12 w-full rounded-xl bg-white px-6 text-[15px] font-semibold text-[#1B5E20] hover:bg-[#E8F5E9] sm:w-auto"
          >
            <Link to="/scan">
              <Camera className="size-5" />
              Check Plant
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
