import {
  DemoTag,
  FilterPills,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
  TableShell,
  Td,
  Th,
  type PillTone,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalState } from "@/hooks/use-local-state";
import {
  SELLER_ORDERS,
  SELLER_ORDER_STATUSES,
  type SellerOrderStatus,
} from "@/lib/role-data";
import { Download, Filter, Package, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { downloadCsv } from "@/lib/csv";
import { toast } from "sonner";

const STATUS_TONE: Record<SellerOrderStatus, PillTone> = {
  New: "blue",
  Processing: "amber",
  Shipped: "gray",
  Delivered: "green",
  Cancelled: "red",
};

const FLOW: SellerOrderStatus[] = [
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export function SellerOrders() {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [overrides, setOverrides] = useLocalState<Record<string, SellerOrderStatus>>(
    "seller-order-status",
    {},
  );

  const orders = useMemo(
    () =>
      SELLER_ORDERS.map((order) => ({
        ...order,
        status: overrides[order.id] ?? order.status,
      })),
    [overrides],
  );

  const counts = useMemo(() => {
    const base: Record<string, number> = { All: orders.length };
    for (const status of FLOW) {
      base[status] = orders.filter((order) => order.status === status).length;
    }
    return base;
  }, [orders]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTab = tab === "All" || order.status === tab;
      const matchesQuery =
        !needle ||
        order.id.toLowerCase().includes(needle) ||
        order.customer.toLowerCase().includes(needle) ||
        order.product.toLowerCase().includes(needle);
      return matchesTab && matchesQuery;
    });
  }, [orders, tab, query]);

  const setStatus = (id: string, status: SellerOrderStatus) =>
    setOverrides((prev) => ({ ...prev, [id]: status }));

  return (
    <RolePage
      role="seller"
      active="orders"
      title="Orders"
      subtitle="Track every order from confirmation to delivery, and move each one to its next stage."
      action={
        <Button variant="outline" className="h-11 gap-2 rounded-xl" asChild>
          <Link to="/seller/products">
            <Package className="size-4" />
            View products
          </Link>
        </Button>
      }
    >
      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="All orders"
            subtitle={`${visible.length} order${visible.length === 1 ? "" : "s"} shown`}
          />
          <DemoTag />
        </div>

        <FilterPills
          options={SELLER_ORDER_STATUSES}
          value={tab}
          onChange={setTab}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by order ID, customer or product"
              aria-label="Search orders"
              className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <span className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground">
            <Filter className="size-3.5" />
            {tab} · {counts[tab] ?? 0}
          </span>
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl"
            onClick={() => {
              if (!visible.length) {
                toast.error("Nothing to export in this view.");
                return;
              }
              downloadCsv(
                `plantguard-orders-${tab.toLowerCase().replace(/\s+/g, "-")}`,
                ["Order", "Customer", "Product", "Quantity", "Date", "Status"],
                visible.map((order) => [
                  order.id,
                  order.customer,
                  order.product,
                  order.quantity,
                  order.date,
                  order.status,
                ]),
              );
              toast.success(`Exported ${visible.length} orders`);
            }}
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </Panel>

      <TableShell>
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Product</Th>
            <Th>Qty</Th>
            <Th>Placed</Th>
            <Th>Status</Th>
            <Th>Change status</Th>
          </tr>
        </thead>
        <tbody>
          {visible.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-surface-2">
              <Td className="font-semibold text-foreground">{order.id}</Td>
              <Td>{order.customer}</Td>
              <Td className="max-w-[220px] truncate">{order.product}</Td>
              <Td>{order.quantity}</Td>
              <Td className="text-muted-foreground">{order.date}</Td>
              <Td>
                <StatusPill label={order.status} tone={STATUS_TONE[order.status]} />
              </Td>
              <Td>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    setStatus(order.id, value as SellerOrderStatus)
                  }
                >
                  <SelectTrigger className="h-10 w-[150px] rounded-xl" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLOW.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <div className="flex flex-col gap-3 md:hidden">
        {visible.map((order) => (
          <Panel key={order.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.customer}</p>
              </div>
              <StatusPill label={order.status} tone={STATUS_TONE[order.status]} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3.5 py-3">
              <span className="text-[13px] text-foreground">{order.product}</span>
              <span className="text-[13px] font-semibold text-foreground">
                × {order.quantity}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{order.date}</span>
              <Select
                value={order.status}
                onValueChange={(value) =>
                  setStatus(order.id, value as SellerOrderStatus)
                }
              >
                <SelectTrigger className="h-11 w-[158px] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLOW.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">No orders found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another status tab or clear your search.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default SellerOrders;
