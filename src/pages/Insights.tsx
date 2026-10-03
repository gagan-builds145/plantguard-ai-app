import { AppShell } from "@/components/app-shell";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BarChart3,
  Heart,
  Image as ImageIcon,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const postsConfig = {
  likes: { label: "Likes", color: "#2E7D32" },
  posts: { label: "Posts", color: "#A5D6A7" },
} satisfies ChartConfig;

const salesConfig = {
  revenue: { label: "Revenue", color: "#2E7D32" },
} satisfies ChartConfig;

const productConfig = {
  revenue: { label: "Revenue", color: "#66BB6A" },
} satisfies ChartConfig;

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart;
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

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(20,40,20,0.06)]">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function Insights() {
  const data = useQuery(api.insights.getOverview);

  if (data === undefined) {
    return (
      <AppShell
        active="insights"
        title="Insights"
        subtitle="How your posts and sales are performing."
      >
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (data === null) {
    return (
      <AppShell active="insights" title="Insights">
        <p className="text-sm text-muted-foreground">
          Sign in to see your analytics.
        </p>
      </AppShell>
    );
  }

  const hasPosts = data.posts.total > 0;
  const hasSales = data.sales.totalOrders > 0;

  return (
    <AppShell
      active="insights"
      title="Insights"
      subtitle="How your posts and sales are performing."
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5">
        <Tabs defaultValue="posts">
          <TabsList className="h-11 rounded-xl">
            <TabsTrigger value="posts" className="gap-2 rounded-lg px-4">
              <BarChart3 className="size-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2 rounded-lg px-4">
              <ShoppingCart className="size-4" />
              Sales
            </TabsTrigger>
          </TabsList>

          {/* ---------------------------------------------------------- */}
          <TabsContent value="posts" className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={ImageIcon}
                label="Posts"
                value={String(data.posts.total)}
              />
              <StatCard
                icon={Heart}
                label="Total likes"
                value={data.posts.totalLikes.toLocaleString()}
              />
              <StatCard
                icon={TrendingUp}
                label="Avg likes / post"
                value={data.posts.avgLikes.toLocaleString()}
              />
            </div>

            <SectionCard
              title="Likes over the last 14 days"
              subtitle="Engagement on your nursery posts"
            >
              {hasPosts ? (
                <ChartContainer
                  config={postsConfig}
                  className="aspect-auto h-[260px] w-full"
                >
                  <BarChart data={data.posts.byDay}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={16}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="likes"
                      fill="var(--color-likes)"
                      radius={5}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <EmptyHint
                  message="Share a post to start tracking likes."
                  to="/feed"
                  cta="Go to feed"
                />
              )}
            </SectionCard>

            <SectionCard title="Top posts" subtitle="Your most-liked posts">
              {data.posts.topPosts.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {data.posts.topPosts.map((post, index) => (
                    <li
                      key={`${post.caption}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="size-12 shrink-0 overflow-hidden rounded-xl bg-surface-3">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-muted-foreground">
                            <ImageIcon className="size-5" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {post.caption}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Heart className="size-4 fill-[#E53935] text-[#E53935]" />
                        {post.likes}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyHint
                  message="No posts yet."
                  to="/feed"
                  cta="Share a post"
                />
              )}
            </SectionCard>
          </TabsContent>

          {/* ---------------------------------------------------------- */}
          <TabsContent value="sales" className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                icon={IndianRupee}
                label="Revenue"
                value={`₹${data.sales.totalRevenue.toLocaleString()}`}
              />
              <StatCard
                icon={Package}
                label="Units sold"
                value={data.sales.totalUnits.toLocaleString()}
              />
              <StatCard
                icon={ShoppingCart}
                label="Sales"
                value={String(data.sales.totalOrders)}
              />
              <StatCard
                icon={TrendingUp}
                label="Avg sale"
                value={`₹${data.sales.avgOrder.toLocaleString()}`}
              />
            </div>

            <SectionCard
              title="Revenue over the last 14 days"
              subtitle="Recorded product sales"
            >
              {hasSales ? (
                <ChartContainer
                  config={salesConfig}
                  className="aspect-auto h-[260px] w-full"
                >
                  <AreaChart data={data.sales.byDay}>
                    <defs>
                      <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={16}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="revenue"
                      type="monotone"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      fill="url(#fillRevenue)"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <EmptyHint
                  message="Record a sale from your listings to see revenue trends."
                  to="/sell"
                  cta="Go to listings"
                />
              )}
            </SectionCard>

            <SectionCard title="Revenue by product" subtitle="Your best sellers">
              {data.sales.byProduct.length > 0 ? (
                <ChartContainer
                  config={productConfig}
                  className="aspect-auto h-[240px] w-full"
                >
                  <BarChart
                    data={data.sales.byProduct}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={120}
                    />
                    <XAxis type="number" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={5} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <EmptyHint
                  message="No sales recorded yet."
                  to="/sell"
                  cta="Record a sale"
                />
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function EmptyHint({
  message,
  to,
  cta,
}: {
  message: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface-2 px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link
        to={to}
        className="text-sm font-semibold text-primary hover:underline"
      >
        {cta}
      </Link>
    </div>
  );
}
