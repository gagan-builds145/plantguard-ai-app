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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  Package,
  Plus,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; icon: typeof Clock }
> = {
  new: {
    label: "New",
    badge: "bg-info-bg text-info",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-warning-bg text-[#8a5a00]",
    icon: CheckCircle2,
  },
  delivered: {
    label: "Delivered",
    badge: "bg-success-bg text-success",
    icon: Truck,
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-danger-bg text-danger",
    icon: XCircle,
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-4" />
      </span>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-bold tracking-[-0.01em] text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function Orders() {
  const sales = useQuery(api.products.listSales, { limit: 100 });
  const products = useQuery(api.products.listProducts);
  const updateSaleStatus = useMutation(api.products.updateSaleStatus);
  const recordSale = useMutation(api.products.recordSale);

  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [qty, setQty] = useState("1");
  const [buyer, setBuyer] = useState("");
  const [saving, setSaving] = useState(false);

  const orders = useMemo(
    () =>
      (sales ?? []).map((sale) => ({
        ...sale,
        status: (sale.status ?? "new") as OrderStatus,
      })),
    [sales],
  );

  const stats = useMemo(() => {
    const open = orders.filter(
      (o) => o.status === "new" || o.status === "confirmed",
    ).length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    return { total: orders.length, open, delivered, revenue };
  }, [orders]);

  const visible =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const selectedProduct = (products ?? []).find((p) => p._id === productId);
  const orderTotal =
    (Math.floor(Number(qty)) || 0) * (selectedProduct?.price ?? 0);

  async function submitOrder() {
    if (!selectedProduct) {
      toast.error("Choose a product for this order.");
      return;
    }
    const quantity = Math.floor(Number(qty));
    if (!Number.isFinite(quantity) || quantity < 1) {
      toast.error("Enter a quantity of at least 1.");
      return;
    }
    setSaving(true);
    try {
      await recordSale({
        productId: selectedProduct._id as Id<"products">,
        quantity,
        buyer: buyer.trim() || undefined,
      });
      toast.success("Order recorded");
      setOpen(false);
      setProductId("");
      setQty("1");
      setBuyer("");
    } catch {
      toast.error("Couldn't record the order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      active="orders"
      title="Orders & enquiries"
      subtitle="Track buyer orders for your listings and move them through fulfilment."
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={ShoppingCart}
            label="Total orders"
            value={String(stats.total)}
          />
          <StatCard icon={Clock} label="Open" value={String(stats.open)} />
          <StatCard
            icon={Truck}
            label="Delivered"
            value={String(stats.delivered)}
          />
          <StatCard
            icon={IndianRupee}
            label="Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-[190px]">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as OrderStatus | "all")}
            >
              <SelectTrigger className="h-11 w-full rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All orders</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="h-11 rounded-xl px-5 font-semibold"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-4" />
            Record order
          </Button>
        </div>

        {sales === undefined ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Package className="size-6" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                {orders.length === 0
                  ? "No orders yet"
                  : "No orders in this view"}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {orders.length === 0
                  ? "Record an order when a buyer picks up stock, and it will appear here."
                  : "Try a different status filter."}
              </p>
            </div>
            {orders.length === 0 ? (
              <Button
                className="h-11 rounded-xl px-5"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-4" />
                Record order
              </Button>
            ) : null}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((order) => {
              const meta = STATUS_META[order.status];
              const Icon = meta.icon;
              return (
                <li
                  key={order._id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-muted-foreground">
                    <Package className="size-6" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {order.productName}
                      </span>
                      <Badge
                        className={cn(
                          "h-6 gap-1 border-transparent px-2 text-[11px]",
                          meta.badge,
                        )}
                      >
                        <Icon className="size-3" />
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.quantity} × ₹{order.unitPrice.toLocaleString()}
                      {order.buyer ? ` · ${order.buyer}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span className="flex items-center text-base font-bold text-primary">
                      <IndianRupee className="size-4" />
                      {order.total.toLocaleString()}
                    </span>
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        void updateSaleStatus({
                          saleId: order._id,
                          status: value as OrderStatus,
                        })
                      }
                    >
                      <SelectTrigger
                        className="h-9 w-[150px] rounded-xl text-xs"
                        aria-label="Order status"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Record order */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record an order</DialogTitle>
            <DialogDescription>
              Log a buyer order against one of your listings.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="h-11 w-full rounded-xl text-sm">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {(products ?? []).map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} · ₹{product.price.toLocaleString()} (
                      {product.stock} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="o-qty" className="text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="o-qty"
                type="number"
                min={1}
                value={qty}
                onChange={(event) => setQty(event.target.value)}
                className="h-11 rounded-xl text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="o-buyer" className="text-sm font-medium">
                Buyer <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="o-buyer"
                value={buyer}
                onChange={(event) => setBuyer(event.target.value)}
                placeholder="e.g. Green Park Landscapes"
                className="h-11 rounded-xl text-sm"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3">
              <span className="text-sm font-medium text-accent-foreground">
                Order total
              </span>
              <span className="flex items-center text-lg font-bold text-accent-foreground">
                <IndianRupee className="size-4" />
                {orderTotal.toLocaleString()}
              </span>
            </div>
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
              onClick={submitOrder}
              disabled={saving || !productId}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Recording…
                </>
              ) : (
                "Record order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
