import { AppShell } from "@/components/app-shell";
import { ScanResultCard } from "@/components/scanner/scan-result-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function ScanResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const removeScan = useMutation(api.scans.removeScan);
  const [deleting, setDeleting] = useState(false);

  const scan = useQuery(
    api.scans.getScan,
    id ? { id: id as Id<"scans"> } : "skip",
  );

  async function handleDelete() {
    if (!id || deleting) return;
    setDeleting(true);
    try {
      await removeScan({ id: id as Id<"scans"> });
      toast.success("Plant check deleted");
      navigate("/history", { replace: true });
    } catch {
      toast.error("Couldn't delete this check. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <AppShell active="history">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/history"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to scan history
        </Link>

        {scan === undefined ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        ) : scan === null ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              We couldn&apos;t find that plant check
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              It may have been deleted, or it belongs to another account.
            </p>
            <Button asChild className="mt-5 h-11 rounded-xl">
              <Link to="/history">Back to scan history</Link>
            </Button>
          </div>
        ) : (
          <ScanResultCard
            result={{
              plantName: scan.plantName,
              plantConfidence: scan.plantConfidence,
              healthStatus: scan.healthStatus,
              disease: scan.disease,
              diseaseConfidence: scan.diseaseConfidence,
              observations: scan.observations,
              recommendations: scan.recommendations,
              imageUrl: scan.imageUrl,
            }}
            actions={
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
                  >
                    <Link to="/scan">
                      <Camera className="size-5" />
                      Check Another Plant
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 rounded-xl text-[15px] font-semibold text-danger hover:text-danger sm:flex-1"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this plant check?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This removes the scan and its image from your history.
                          This action can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-11 rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="h-11 rounded-xl bg-danger text-white hover:bg-[#B71C1C]"
                          onClick={handleDelete}
                        >
                          {deleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
