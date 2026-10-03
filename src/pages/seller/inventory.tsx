import {
  BarList,
  DemoTag,
  FilterPills,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
  type PillTone,
} from "@/components/role-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SELLER_CATEGORIES,
  SELLER_INVENTORY_MOVEMENT,
  SELLER_PRODUCTS,
} from "@/lib/role-data";
import { AlertTriangle, ArrowDownUp, Boxes, PackageCheck, Search } from "lucide-react";
import { useMemo, useState } from "react";

const TABS = ["In Stock", "Low Stock", "Out of Stock", "Recently Added"] as const;
const SORTS = [
  "Name (A–Z)",
  "Stock: low to high",
  "Stock: high to low",
  "Price: high to low",
] as const;

type Sort = (typeof SORTS)[number];

const STOCK_TONE: Record<string, PillTone> = {
  "In Stock": "green",
  "Low Stock": "amber",
  "Out of Stock": "red",
};

const RECENT = 3;

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function SellerInventory() {
  const [tab, setTab] = useState<string>("In Stock");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState<Sort>("Name (A–Z)");
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const recentIds = SELLER_PRODUCTS.slice(-RECENT).map((product) => product.id);

    const filtered = SELLER_PRODUCTS.filter((product) => {
      const matchesTab =
        tab === "Recently Added" ? recentIds.includes(product.id) : product.status === tab;
      const matchesCategory =
        category === "All categories" || product.category === category;
      const matchesQuery =
        !needle || product.name.toLowerCase().includes(needle);
      return matchesTab && matchesCategory && matchesQuery;
    });

    const sorted = [...filtered];
    if (sort === "Name (A–Z)") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Stock: low to high") sorted.sort((a, b) => a.stock - b.stock);
    if (sort === "Stock: high to low") sorted.sort((a, b) => b.stock - a.stock);
    if (sort === "Price: high to low") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [tab, category, sort, query]);

  const totalUnits = SELLER_PRODUCTS.reduce((sum, item) => sum + item.stock, 0);
  const stockValue = SELLER_PRODUCTS.reduce(
    (sum, item) => sum + item.stock * item.price,
    0,
  );

  return (
    <RolePage
      role="seller"
      active="inventory"
      title="Inventory"
      subtitle="Know exactly what you have on hand, what is running low, and what needs reordering."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total units"
          value={totalUnits.toLocaleString("en-IN")}
          note="Across all products"
          icon={Boxes}
        />
        <StatTile
          label="Stock value"
          value={inr(stockValue)}
          note="At current prices"
          icon={PackageCheck}
        />
        <StatTile
          label="Low stock"
          value={String(SELLER_PRODUCTS.filter((item) => item.status === "Low Stock").length)}
          note="Reorder soon"
          icon={AlertTriangle}
        />
        <StatTile
          label="Out of stock"
          value={String(
            SELLER_PRODUCTS.filter((item) => item.status === "Out of Stock").length,
          )}
          note="Unavailable to buyers"
          icon={AlertTriangle}
        />
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Stock levels"
            subtitle={`${products.length} item${products.length === 1 ? "" : "s"} in this view`}
          />
          <DemoTag />
        </div>

        <FilterPills options={TABS} value={tab} onChange={setTab} />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search inventory"
              aria-label="Search inventory"
              className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 w-full rounded-xl lg:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All categories">All categories</SelectItem>
              {SELLER_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <ArrowDownUp className="size-4 shrink-0 text-muted-foreground" />
            <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
              <SelectTrigger className="h-11 w-full rounded-xl lg:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <Panel key={product.id} className="flex items-center gap-4 p-4">
              <Photo
                src={product.image}
                alt={product.name}
                ratio="aspect-square"
                className="size-16 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category} · {inr(product.price)}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, product.stock * 3)}%`,
                      backgroundColor:
                        product.status === "In Stock"
                          ? "#2E7D32"
                          : product.status === "Low Stock"
                            ? "#F9A825"
                            : "#C62828",
                    }}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <StatusPill label={product.status} tone={STOCK_TONE[product.status]} />
                <span className="text-sm font-bold text-foreground">{product.stock}</span>
              </div>
            </Panel>
          ))}

          {products.length === 0 ? (
            <Panel className="py-10 text-center">
              <Boxes className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">Nothing here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This stock group is currently empty.
              </p>
            </Panel>
          ) : null}
        </div>

        <Panel className="h-fit">
          <SectionHead title="Stock movement" subtitle="Last 30 days" />
          <div className="mt-4">
            <BarList items={SELLER_INVENTORY_MOVEMENT} />
          </div>
        </Panel>
      </div>
    </RolePage>
  );
}

export default SellerInventory;
