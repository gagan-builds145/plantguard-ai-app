import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { HEALTH_META, type HealthStatus } from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Camera, Leaf, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All results" },
  { value: "healthy", label: "Healthy" },
  { value: "attention", label: "Needs attention" },
  { value: "disease", label: "Disease detected" },
  { value: "inconclusive", label: "Needs better image" },
];

export default function ScanHistory() {
  const scans = useQuery(api.scans.listScans);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const list = scans ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((scan) => {
      const matchesQuery = q ? scan.plantName.toLowerCase().includes(q) : true;
      const matchesStatus = status === "all" ? true : scan.healthStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [scans, query, status]);

  const hasFilters = query.trim().length > 0 || status !== "all";

  return (
    <AppShell
      active="history"
      title="Scan history"
      subtitle="Every AI plant check you've saved, newest first."
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Search + filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by plant name"
              aria-label="Search scans by plant name"
              className="h-12 rounded-xl pl-10 pr-10 text-[15px]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger
              className="h-12 w-full rounded-xl text-[15px] sm:w-[190px]"
              aria-label="Filter by result"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && scans ? (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("all");
              }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        ) : null}

        <div className="mt-5">
          {scans === undefined ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <Leaf className="size-6" />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-foreground">
                  {scans.length === 0
                    ? "No plant checks yet"
                    : "No plants found"}
                </p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {scans.length === 0
                    ? "Run your first plant check and your saved AI results will appear here."
                    : "Try a different search term or clear the filters."}
                </p>
              </div>
              {scans.length === 0 ? (
                <Button asChild className="h-11 rounded-xl px-5">
                  <Link to="/scan">
                    <Camera className="size-4" />
                    Check your plant
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-11 rounded-xl px-5"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filtered.map((scan) => {
                const meta = HEALTH_META[scan.healthStatus as HealthStatus];
                return (
                  <li key={scan._id}>
                    <Link
                      to={`/scan/${scan._id}`}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)] sm:p-4"
                    >
                      <span className="size-16 shrink-0 overflow-hidden rounded-xl bg-surface-3 sm:size-20">
                        {scan.imageUrl ? (
                          <img
                            src={scan.imageUrl}
                            alt={scan.plantName}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-muted-foreground">
                            <Leaf className="size-6" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-foreground">
                          {scan.plantName}
                        </span>
                        {scan.disease ? (
                          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                            {scan.disease}
                          </span>
                        ) : (
                          <span className="mt-0.5 block text-sm text-muted-foreground">
                            No disease pattern detected
                          </span>
                        )}
                        <span className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge
                            className={cn(
                              "h-7 gap-1.5 px-2.5 text-xs",
                              meta.badge,
                            )}
                          >
                            <span
                              className={cn("size-1.5 rounded-full", meta.dot)}
                            />
                            {meta.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(scan.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
