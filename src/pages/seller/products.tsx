import {
  Chip,
  DemoTag,
  FilterPills,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  StatusPill,
  type PillTone,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalState } from "@/hooks/use-local-state";
import { SELLER_CATEGORIES, SELLER_PRODUCTS } from "@/lib/role-data";
import { Boxes, Camera, Plus, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const TABS = ["All", "In Stock", "Low Stock", "Out of Stock", "Drafts"] as const;

const STOCK_TONE: Record<string, PillTone> = {
  "In Stock": "green",
  "Low Stock": "amber",
  "Out of Stock": "red",
};

type Product = (typeof SELLER_PRODUCTS)[number];

type Draft = {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  category: SELLER_CATEGORIES[0],
  price: "",
  stock: "",
  description: "",
};

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function SellerProducts() {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [created, setCreated] = useLocalState<Product[]>(
    "seller-created-products",
    [],
  );
  const [drafts, setDrafts] = useLocalState<string[]>("seller-product-drafts", []);

  const all = useMemo(() => [...created, ...SELLER_PRODUCTS], [created]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return all.filter((product) => {
      const matchesTab =
        tab === "All" ||
        (tab === "Drafts"
          ? product.visibility === "Draft" || drafts.includes(product.name)
          : product.status === tab);
      const matchesQuery =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle);
      return matchesTab && matchesQuery;
    });
  }, [all, tab, query, drafts]);

  const publish = (visibility: "Published" | "Draft") => {
    const price = Number(draft.price) || 0;
    const stock = Number(draft.stock) || 0;
    const product: Product = {
      id: `new-${Date.now()}`,
      name: draft.name.trim() || "Untitled product",
      category: draft.category,
      price,
      stock,
      status: stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "In Stock",
      visibility,
      image: SELLER_PRODUCTS[0].image,
    };
    if (visibility === "Published") {
      setCreated((prev) => [product, ...prev]);
    } else {
      setDrafts((prev) => [...prev, product.name]);
      setCreated((prev) => [product, ...prev]);
    }
    setDraft(EMPTY_DRAFT);
    setOpen(false);
  };

  return (
    <RolePage
      role="seller"
      active="products"
      title="Products"
      subtitle="Manage everything you sell, keep stock accurate, and publish new listings."
      action={
        <Button className="h-11 gap-2 rounded-xl" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add Product
        </Button>
      }
    >
      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Your catalog"
            subtitle={`${visible.length} product${visible.length === 1 ? "" : "s"} shown · ${SELLER_CATEGORIES.length} categories`}
          />
          <DemoTag />
        </div>
        <FilterPills options={TABS} value={tab} onChange={setTab} />
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or categories"
            aria-label="Search products"
            className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((product) => (
          <Panel key={product.id} className="flex flex-col gap-3 p-0">
            <Photo src={product.image} alt={product.name} ratio="aspect-[16/10]" />
            <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <StatusPill label={product.status} tone={STOCK_TONE[product.status]} />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-base font-bold text-foreground">
                  {inr(product.price)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <StatusPill
                  label={product.visibility}
                  tone={product.visibility === "Published" ? "blue" : "gray"}
                />
                <Button variant="ghost" size="sm" className="h-9 rounded-lg text-[13px]">
                  Edit
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <Boxes className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">No products found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a product or try a different filter.
          </p>
        </Panel>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Create a listing. Save it as a draft to finish later, or publish it
              straight to your store.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-foreground">Product name</span>
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="e.g. Snake Plant Sansevieria"
                className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-foreground">Category</span>
              <div className="flex flex-wrap gap-2">
                {SELLER_CATEGORIES.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    selected={draft.category === category}
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, category }))
                    }
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-foreground">Price (₹)</span>
                <input
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, price: event.target.value }))
                  }
                  inputMode="numeric"
                  placeholder="649"
                  className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-foreground">Stock quantity</span>
                <input
                  value={draft.stock}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  inputMode="numeric"
                  placeholder="25"
                  className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-foreground">Description</span>
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, description: event.target.value }))
                }
                rows={3}
                placeholder="Short care and selling notes"
                className="w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="h-11 gap-2 rounded-xl">
                <Camera className="size-4" />
                Camera
              </Button>
              <Button type="button" variant="outline" className="h-11 gap-2 rounded-xl">
                <Upload className="size-4" />
                Gallery
              </Button>
              <Button type="button" variant="outline" className="h-11 gap-2 rounded-xl">
                <Upload className="size-4" />
                File Upload
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl"
              onClick={() => publish("Draft")}
            >
              Save Draft
            </Button>
            <Button type="button" className="h-11 rounded-xl" onClick={() => publish("Published")}>
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RolePage>
  );
}

export default SellerProducts;
