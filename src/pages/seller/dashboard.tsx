import {
  BarList,
  DemoTag,
  FilterPills,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import {
  IMG,
  SELLER_CATEGORY_SHARE,
  SELLER_ORDERS,
  SELLER_PRODUCTS,
  SELLER_SALES_SERIES,
  SELLER_STATS,
} from "@/lib/role-data";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronRight,
  IndianRupee,
  MapPin,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const RANGES = ["7 Days", "30 Days", "3 Months", "1 Year"] as const;
type Range = (typeof RANGES)[number];

const RANGE_KEY: Record<Range, keyof typeof SELLER_SALES_SERIES> = {
  "7 Days": "7d",
  "30 Days": "30d",
  "3 Months": "3m",
  "1 Year": "1y",
};

const salesConfig = {
  sales: { label: "Sales", color: "#2E7D32" },
  orders: { label: "Orders", color: "#A5D6A7" },
} satisfies ChartConfig;

const STATUS_TONE = {
  New: "blue",
  Processing: "amber",
  Shipped: "gray",
  Delivered: "green",
  Cancelled: "red",
} as const;

const STAT_ICONS = [Package, ShoppingBag, Boxes, Users];

export default function SellerDashboard() {
  const { profile } = useFarmerProfile();
  const { user } = useAuth();
  const [range, setRange] = useState<Range>("7 Days");

  const brand = profile?.sellerBrandName || "GreenNest Store";
  const sellerName = profile?.displayName || user?.name || "Seller";
  const series = SELLER_SALES_SERIES[RANGE_KEY[range]];
  const totalSales = series.reduce((sum, point) => sum + point.sales, 0);
  const totalOrders = series.reduce((sum, point) => sum + point.orders, 0);
  const lowStock = SELLER_PRODUCTS.filter((product) => product.status !== "In Stock");

  return (
    <RolePage
      role="seller"
      active="home"
      title={`Welcome back, ${sellerName}`}
      subtitle="Here's how your business is performing today."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#EAF0EA] bg-card px-3.5 text-[13px] font-medium text-muted-foreground">
            <MapPin className="size-3.5" />
            {profile?.location?.city ?? "Bengaluru"}
          </span>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="flex size-11 items-center justify-center rounded-xl border border-[#EAF0EA] bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-4" />
          </Link>
          <Link
            to="/seller/profile"
            className="flex items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-3 py-2 text-[13px] font-semibold text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#E0F2F1] text-xs font-bold text-[#00695C]">
              {brand.slice(0, 1).toUpperCase()}
            </span>
            {brand}
          </Link>
        </div>
      }
    >
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Sales overview"
            subtitle="Orders, products and customers at a glance."
          />
          <DemoTag />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SELLER_STATS.map((stat, index) => (
            <StatTile
              key={stat.key}
              label={stat.label}
              value={stat.value}
              note={stat.note}
              icon={STAT_ICONS[index]}
              accent="#00897B"
            />
          ))}
        </div>
      </section>

      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead title="Sales Overview" subtitle="Gross sales value over time." />
          <FilterPills options={RANGES} value={range} onChange={(next) => setRange(next as Range)} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-foreground">
            <IndianRupee className="size-4 text-primary" />
            ₹{totalSales.toLocaleString("en-IN")}
          </span>
          <span className="text-muted-foreground">
            {totalOrders} orders in this period
          </span>
        </div>
        <ChartContainer config={salesConfig} className="mt-4 h-[260px] w-full">
          <AreaChart data={series} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#EAF0EA" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "#7A857A" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tick={{ fontSize: 12, fill: "#7A857A" }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              fill="var(--color-sales)"
              fillOpacity={0.12}
            />
          </AreaChart>
        </ChartContainer>
        <p className="mt-2 text-xs text-muted-foreground">
          Sample sales data for the PlantGuard AI prototype.
        </p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="p-5">
          <SectionHead
            title="Recent orders"
            subtitle="Latest activity from your store."
            action={
              <Link
                to="/seller/orders"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
              >
                All orders
                <ChevronRight className="size-4" />
              </Link>
            }
          />
          <ul className="mt-4 flex flex-col divide-y divide-[#F1F5F1]">
            {SELLER_ORDERS.slice(0, 5).map((order) => (
              <li key={order.id} className="flex items-center gap-3 py-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#E0F2F1] text-[#00695C]">
                  <Package className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {order.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} · {order.customer} · {order.date}
                  </p>
                </div>
                <StatusPill label={order.status} tone={STATUS_TONE[order.status]} />
              </li>
            ))}
          </ul>
        </Panel>

        <aside className="flex flex-col gap-6">
          <Panel className="p-5">
            <SectionHead title="Inventory alerts" subtitle="Restock soon" />
            <ul className="mt-4 flex flex-col gap-3.5">
              {lowStock.slice(0, 4).map((product) => (
                <li key={product.id} className="flex items-center gap-3">
                  <img src={product.image} alt="" className="size-10 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{product.stock} left</p>
                  </div>
                  <StatusPill
                    label={product.status}
                    tone={product.status === "Out of Stock" ? "red" : "amber"}
                  />
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              className="mt-4 h-11 w-full rounded-xl text-sm font-semibold"
            >
              <Link to="/seller/inventory">Update inventory</Link>
            </Button>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between gap-3">
              <SectionHead title="Sales by category" />
              <BarChart3 className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <BarList items={SELLER_CATEGORY_SHARE} accent="#00897B" />
            </div>
          </Panel>

          <Panel className="overflow-hidden p-0">
            <img
              src={IMG.market}
              alt=""
              className="h-28 w-full object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <SectionHead title="Marketplace picks" subtitle="Buy stock from verified sellers." />
              <Button
                asChild
                className="mt-3 h-11 w-full rounded-xl text-sm font-semibold"
              >
                <Link to="/seller/marketplace">Open marketplace</Link>
              </Button>
            </div>
          </Panel>
        </aside>
      </div>
    </RolePage>
  );
}
