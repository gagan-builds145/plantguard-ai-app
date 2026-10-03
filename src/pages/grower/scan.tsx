import { Panel, RolePage, SectionHead, StatusPill } from "@/components/role-ui";
import { PlantScanner } from "@/components/scanner/plant-scanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { HEALTH_META, type HealthStatus } from "@/lib/plantguard-data";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Clock3, FileImage, Leaf } from "lucide-react";
import { Link } from "react-router";

const TONE: Record<HealthStatus, "green" | "amber" | "red" | "blue"> = {
  healthy: "green",
  attention: "amber",
  disease: "red",
  inconclusive: "blue",
};

export function GrowerScan() {
  return (
    <RolePage
      role="home_grower"
      active="scan"
      title="Plant Scanner"
      subtitle="Check any plant in your home garden with PlantGuard AI."
    >
      <PlantScanner
        title="Check Your Plant"
        subtitle="Take or upload a clear plant image for AI analysis."
        stages={[
          "Processing image",
          "Identifying plant",
          "Checking for possible disease symptoms",
        ]}
        historyHref="/grower/history"
        historyLabel="Scan History"
        resultHref={() => "/grower/history"}
      />
    </RolePage>
  );
}

export function GrowerHistory() {
  const scans = useQuery(api.scans.listScans);

  return (
    <RolePage
      role="home_grower"
      active="history"
      title="Scan History"
      subtitle="Every plant check you saved, newest first."
      action={
        <Button
          asChild
          size="lg"
          className="h-12 rounded-xl px-5 text-[15px] font-semibold"
        >
          <Link to="/grower/scan">
            <Leaf className="size-4" />
            New scan
          </Link>
        </Button>
      }
    >
      {scans === undefined ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : scans.length === 0 ? (
        <Panel className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EAF6EA] text-primary">
            <FileImage className="size-6" />
          </span>
          <SectionHead
            title="No plant checks yet"
            subtitle="Your saved AI analyses will appear here."
          />
          <Button
            asChild
            size="lg"
            className="mt-2 h-12 rounded-xl px-6 text-[15px] font-semibold"
          >
            <Link to="/grower/scan">Scan your first plant</Link>
          </Button>
        </Panel>
      ) : (
        <div className="flex flex-col gap-3">
          {scans.map((scan) => {
            const meta = HEALTH_META[scan.healthStatus as HealthStatus];
            return (
              <Panel key={scan._id} className="flex items-center gap-4 p-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-surface-3">
                  {scan.imageUrl ? (
                    <img
                      src={scan.imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <Leaf className="size-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-foreground">
                    {scan.plantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Plant ID {scan.plantConfidence}%
                    {scan.disease ? ` · ${scan.disease}` : ""}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="size-3" />
                    {formatDistanceToNow(new Date(scan.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusPill label={meta.label} tone={TONE[scan.healthStatus as HealthStatus]} />
                  <Link
                    to={`/scan/${scan._id}`}
                    className="text-[13px] font-semibold text-primary hover:underline"
                  >
                    View result
                  </Link>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </RolePage>
  );
}
