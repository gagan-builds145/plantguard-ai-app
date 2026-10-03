import {
  BarList,
  DemoTag,
  FilterPills,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  TableShell,
  Td,
  Th,
} from "@/components/role-ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  SELLER_CATEGORY_SHARE,
  SELLER_ORDERS,
  SELLER_PRODUCTS,
  SELLER_SALES_SERIES,
} from "@/lib/role-data";
import { IndianRupee, Package, Receipt, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = ["7 Days", "30 Days", "3 Months", "1 Year"] as const;
type Range = (typeof RANGES)[number];

const RANGE_KEY: Record<Range, keyof typeof SELLER_SALES_SERIES> = {
  "7 Days": "7d",
  "30 Days": "30d",
  "3 Months": "3m",
  "1 Year": "1y",
};

const revenueConfig = {
  sales: { label: "Revenue", color: "#00897B" },
} satisfies ChartConfig;

const ordersConfig = {
  orders: { label: "Orders", color: "#00897B" },
} satisfies ChartConfig;

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function SellerAnalytics() {
  const [range, setRange] = useState<Range>("30 Days");
  const series = SELLER_SALES_SERIES[RANGE_KEY[range]];

  const revenue = useMemo(
    () => series.reduce((sum, point) => sum + point.sales, 0),
    [series],
  );
  const orderCount = useMemo(
    () => series.reduce((sum, point) => sum + point.orders, 0),
    [series],
  );
  const averageOrder = orderCount ? Math.round(revenue / orderCount) : 0;

  const topProducts = useMemo(
    () =>
      [...SELLER_PRODUCTS]
        .filter((product) => product.visibility === "Published")
        .sort((a, b) => b.price * b.stock - a.price * a.stock)
        .slice(0, 5),
    [],
  );

  const stockValueSeries = useMemo(
    () =>
      topProducts.map((product) => ({
        label: product.name.split(" ").slice(0, 2).join(" "),
        value: product.price * product.stock,
      })),
    [topProducts],
  );

  const delivered = SELLER_ORDERS.filter((order) => order.status === "Delivered").length;
  const completion = Math.round((delivered / SELLER_ORDERS.length) * 100);

  return (
    <RolePage
      role="seller"
      active="analytics"
      title="Analytics"
      subtitle="Understand revenue, order volume and product performance across any time range."
    >
      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead title="Performance range" subtitle="Switch the window for every chart below" />
          <DemoTag />
        </div>
        <FilterPills options={RANGES} value={range} onChange={(value) => setRange(value as Range)} />
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={`Revenue · ${range}`}
          value={inr(revenue)}
          note="Sample figures"
          icon={IndianRupee}
          accent="#00897B"
        />
        <StatTile
          label={`Orders · ${range}`}
          value={orderCount.toLocaleString("en-IN")}
          note="Across all statuses"
          icon={Receipt}
          accent="#00897B"
        />
        <StatTile
          label="Average order value"
          value={inr(averageOrder)}
          note="Revenue ÷ orders"
          icon={TrendingUp}
          accent="#00897B"
        />
        <StatTile
          label="Fulfilment rate"
          value={`${completion}%`}
          note="Delivered orders in sample list"
          icon={Package}
          accent="#00897B"
        />
      </div>

      <Panel>
        <SectionHead title="Revenue over time" subtitle={`${range} · sample revenue series`} />
        <div className="mt-4 h-[260px]">
          <ChartContainer config={revenueConfig} className="h-full w-full">
            <AreaChart data={series} margin={{ left: 4, right: 8 }}>
              <defs>
                <linearGradient id="sellerRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00897B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00897B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EAF0EA" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6B7C6B" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fontSize: 11, fill: "#6B7C6B" }}
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="sales"
                type="monotone"
                stroke="#00897B"
                strokeWidth={2.5}
                fill="url(#sellerRevenue)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHead title="Order volume" subtitle={`${range} · orders per period`} />
          <div className="mt-4 h-[220px]">
            <ChartContainer config={ordersConfig} className="h-full w-full">
              <LineChart data={series} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} stroke="#EAF0EA" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#6B7C6B" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tick={{ fontSize: 11, fill: "#6B7C6B" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  dataKey="orders"
                  type="monotone"
                  stroke="#00897B"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#00897B" }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </Panel>

        <Panel>
          <SectionHead title="Revenue by category" subtitle="Share of sample sales" />
          <div className="mt-4">
            <BarList
              accent="#00897B"
              items={SELLER_CATEGORY_SHARE.map((item) => ({
                label: item.label,
                value: item.value,
                note: `${item.value}%`,
              }))}
            />
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionHead
          title="Top products by stock value"
          subtitle="Units on hand multiplied by current price"
          action={
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Users className="size-3.5" />
              48 products
            </span>
          }
        />
        <div className="mt-4">
          <ChartContainer
            config={{
              value: { label: "Stock value", color: "#00897B" },
            }}
            className="h-[220px] w-full"
          >
            <BarChart data={stockValueSeries} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#EAF0EA" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 10, fill: "#6B7C6B" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                tick={{ fontSize: 11, fill: "#6B7C6B" }}
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#00897B" />
            </BarChart>
          </ChartContainer>
        </div>
      </Panel>

      <TableShell>
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Stock value</Th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-surface-2">
              <Td className="font-semibold text-foreground">{product.name}</Td>
              <Td className="text-muted-foreground">{product.category}</Td>
              <Td>{inr(product.price)}</Td>
              <Td>{product.stock}</Td>
              <Td className="font-semibold text-foreground">
                {inr(product.price * product.stock)}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </RolePage>
  );
}

export default SellerAnalytics;
