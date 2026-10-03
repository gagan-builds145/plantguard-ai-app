import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useFarmerProfile } from "@/hooks/use-farmer";
import {
  HEALTH_META,
  NURSERY_CATEGORY_GROUPS,
  type HealthStatus,
} from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Camera, Check, Flower2, Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { toast } from "sonner";

export default function NurseryStock() {
  const { profile, isLoading } = useFarmerProfile();
  const scans = useQuery(api.scans.listScans);
  const saveProfile = useMutation(api.farmers.saveProfile);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const categories = profile?.nurseryCategories ?? [];

  const statusFor = useMemo(() => {
    const map = new Map<string, HealthStatus>();
    (scans ?? []).forEach((scan) => {
      const key = scan.plantName.toLowerCase();
      if (!map.has(key)) map.set(key, scan.healthStatus);
    });
    return (category: string) => {
      const needle = category.toLowerCase();
      for (const [key, value] of map.entries()) {
        if (key.includes(needle) || needle.includes(key)) return value;
      }
      return null;
    };
  }, [scans]);

  function openDialog() {
    setDraft(categories);
    setOpen(true);
  }

  function toggle(value: string) {
    setDraft((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveProfile({ nurseryCategories: draft });
      toast.success("Stock updated");
      setOpen(false);
    } catch {
      toast.error("Couldn't save your stock. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Legacy farmer profiles have no explicit role; send them to crops.
  if (profile && profile.role !== "nursery") {
    return <Navigate to="/crops" replace />;
  }

  return (
    <AppShell active="home" showBack>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
              My stock
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Health is based on your latest plant checks for each category.
            </p>
          </div>
          <Button
            className="h-11 rounded-xl px-5 font-semibold"
            onClick={openDialog}
          >
            <Plus className="size-4" />
            Add category
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Flower2 className="size-6" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                No stock categories yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Add the plant categories your nursery grows so PlantGuard AI can
                tailor stock health guidance and your dashboard.
              </p>
            </div>
            <Button className="h-11 rounded-xl px-5" onClick={openDialog}>
              <Plus className="size-4" />
              Add category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((category) => {
              const status = statusFor(category);
              const meta = status ? HEALTH_META[status] : null;
              return (
                <div
                  key={category}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Flower2 className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {category}
                    </p>
                    <div className="mt-2">
                      {meta ? (
                        <Badge
                          className={cn("h-7 gap-1.5 px-2.5 text-xs", meta.badge)}
                        >
                          <span
                            className={cn("size-1.5 rounded-full", meta.dot)}
                          />
                          {meta.label}
                        </Badge>
                      ) : (
                        <Badge className="h-7 gap-1.5 border-transparent bg-surface-3 px-2.5 text-xs text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                          Not scanned yet
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Spot a problem on a plant? Scan it straight away.
            </p>
            <Button asChild variant="outline" className="h-10 rounded-xl">
              <Link to="/scan">
                <Camera className="size-4" />
                Check stock
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add stock categories</DialogTitle>
            <DialogDescription>
              Select every plant category your nursery grows or stocks. You can
              change this at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {NURSERY_CATEGORY_GROUPS.map((group) => (
              <div key={group.group}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {group.group}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const selected = draft.includes(item);
                    return (
                      <button
                        key={`${group.group}-${item}`}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggle(item)}
                        className={cn(
                          "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        {selected ? (
                          <Check className="size-3.5 text-primary" strokeWidth={3} />
                        ) : null}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl font-semibold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save stock"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
