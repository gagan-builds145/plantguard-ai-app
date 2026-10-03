import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Image as ImageIcon, ScanLine, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";

const KIND_META = {
  scan: { icon: ScanLine, className: "bg-accent text-primary" },
  order: { icon: ShoppingCart, className: "bg-success-bg text-success" },
  post: { icon: ImageIcon, className: "bg-info-bg text-info" },
} as const;

export default function Notifications() {
  const navigate = useNavigate();
  const items = useQuery(api.notifications.listNotifications, { limit: 40 });

  return (
    <AppShell
      active="notifications"
      title="Notifications"
      subtitle="Recent activity across your checks, orders and posts."
    >
      <div className="mx-auto w-full max-w-3xl">
        {items === undefined ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Bell className="size-6" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                You&apos;re all caught up
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Plant checks, recorded orders and posts you share will show up
                here.
              </p>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => {
              const meta = KIND_META[item.kind];
              const Icon = meta.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigate(item.to)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(20,40,20,0.08)]"
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${meta.className}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {item.title}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
