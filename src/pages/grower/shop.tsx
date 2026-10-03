import {
  DemoTag,
  FilterPills,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  Stars,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useLocalState } from "@/hooks/use-local-state";
import {
  GROWER_FEED,
  GROWER_SHOP,
  GROWER_SHOP_CATEGORIES,
  type GrowerProduct,
} from "@/lib/role-data";
import { Bookmark, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

function ProductCard({
  product,
  saved,
  onToggleSave,
  onAdd,
  inCart,
}: {
  product: GrowerProduct;
  saved: boolean;
  onToggleSave: () => void;
  onAdd: () => void;
  inCart: boolean;
}) {
  const out = product.availability === "Out of stock";
  return (
    <Panel className="flex flex-col overflow-hidden p-0">
      <div className="relative">
        <Photo src={product.image} alt={product.name} ratio="aspect-[4/3]" />
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save product"}
          aria-pressed={saved}
          onClick={onToggleSave}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-[#EAF0EA] bg-white/95 text-muted-foreground transition-colors hover:text-primary"
        >
          <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} />
        </button>
        {product.organic ? (
          <span className="absolute left-3 top-3">
            <StatusPill label="Organic" tone="green" className="bg-white/95" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground">
          {product.category} · {product.seller}
        </p>
        <p className="text-[15px] font-semibold leading-6 text-foreground">
          {product.name}
        </p>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="text-[15px] font-bold text-foreground">
          ₹{product.price}
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            {product.unit}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{product.availability}</p>
        <Button
          variant={inCart ? "outline" : "default"}
          disabled={out}
          onClick={onAdd}
          className="mt-auto h-11 rounded-xl text-sm font-semibold"
        >
          {out ? "Out of stock" : inCart ? "Added to cart" : "Add to cart"}
        </Button>
      </div>
    </Panel>
  );
}

export function GrowerShop() {
  const [cart, setCart] = useLocalState<string[]>("grower:cart", []);
  const [saved, setSaved] = useLocalState<string[]>("grower:saved-products", []);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    const term = query.trim().toLowerCase();
    return GROWER_SHOP.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category === category ||
        (category === "Organic Products" && product.organic);
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.seller.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [category, query]);

  const cartTotal = GROWER_SHOP.filter((product) => cart.includes(product.id)).reduce(
    (sum, product) => sum + product.price,
    0,
  );

  return (
    <RolePage
      role="home_grower"
      active="shop"
      title="Shop"
      subtitle="Plants, seeds and supplies from verified sellers."
      action={
        <span className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-4 text-sm font-semibold text-foreground">
          <ShoppingBag className="size-4 text-primary" />
          {cart.length} item{cart.length === 1 ? "" : "s"}
        </span>
      }
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search plants and supplies"
          className="h-13 rounded-xl pl-11 text-[15px]"
        />
      </div>

      <FilterPills
        options={["All", ...GROWER_SHOP_CATEGORIES]}
        value={category}
        onChange={setCategory}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              saved={saved.includes(product.id)}
              inCart={cart.includes(product.id)}
              onToggleSave={() =>
                setSaved((list) =>
                  list.includes(product.id)
                    ? list.filter((id) => id !== product.id)
                    : [...list, product.id],
                )
              }
              onAdd={() => {
                setCart((list) =>
                  list.includes(product.id) ? list : [...list, product.id],
                );
                toast.success(`${product.name} added to cart`);
              }}
            />
          ))}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <Panel className="p-5">
            <SectionHead title="Your cart" subtitle="Peer-to-peer checkout" />
            {cart.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing in the cart yet. Add a plant or a supply to get started.
              </p>
            ) : (
              <>
                <ul className="mt-3 flex flex-col gap-3">
                  {GROWER_SHOP.filter((product) => cart.includes(product.id)).map(
                    (product) => (
                      <li key={product.id} className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="size-10 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{product.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() =>
                            setCart((list) =>
                              list.filter((id) => id !== product.id),
                            )
                          }
                          className="text-muted-foreground hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </li>
                    ),
                  )}
                </ul>
                <p className="mt-4 flex items-center justify-between border-t border-[#EAF0EA] pt-3 text-sm font-semibold text-foreground">
                  Estimated total
                  <span>₹{cartTotal}</span>
                </p>
                <Button
                  size="lg"
                  className="mt-3 h-12 w-full rounded-xl text-[15px] font-semibold"
                  onClick={() => toast.success("Demo checkout — no payment taken")}
                >
                  Checkout
                </Button>
              </>
            )}
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between gap-3">
              <SectionHead title="Seller note" />
              <DemoTag />
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sellers on PlantGuard AI list live stock; delivery windows vary by
              city. Ratings come from completed orders.
            </p>
          </Panel>
        </aside>
      </div>
    </RolePage>
  );
}

export function GrowerSaved() {
  const [savedPosts, setSavedPosts] = useLocalState<string[]>("grower:saved-posts", []);
  const [savedProducts, setSavedProducts] = useLocalState<string[]>(
    "grower:saved-products",
    [],
  );

  const posts = GROWER_FEED.filter((post) => savedPosts.includes(post.id));
  const products = GROWER_SHOP.filter((product) => savedProducts.includes(product.id));

  return (
    <RolePage
      role="home_grower"
      active="saved"
      title="Saved"
      subtitle="Posts and products you kept for later."
    >
      <Tabs defaultValue="posts">
        <TabsList className="h-11 rounded-xl">
          <TabsTrigger value="posts" className="rounded-lg px-4 text-sm font-semibold">
            Posts · {posts.length}
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg px-4 text-sm font-semibold">
            Products · {products.length}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-5">
          {posts.length === 0 ? (
            <Panel className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                You haven't saved any posts yet.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 h-11 rounded-xl text-sm font-semibold"
              >
                <Link to="/grower">Browse the community feed</Link>
              </Button>
            </Panel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Panel key={post.id} className="overflow-hidden p-0">
                  <Photo src={post.image} alt={post.caption} ratio="aspect-[4/3]" />
                  <div className="flex flex-col gap-2 p-4">
                    <p className="text-xs text-muted-foreground">
                      {post.author} · {post.location}
                    </p>
                    <p className="text-sm leading-6 text-foreground">{post.caption}</p>
                    <Button
                      variant="ghost"
                      className="mt-1 h-10 justify-start rounded-xl px-2 text-[13px] font-semibold text-muted-foreground"
                      onClick={() =>
                        setSavedPosts((list) => list.filter((id) => id !== post.id))
                      }
                    >
                      <Trash2 className="size-3.5" />
                      Remove from saved
                    </Button>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-5">
          {products.length === 0 ? (
            <Panel className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No saved products yet — save something from the shop.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 h-11 rounded-xl text-sm font-semibold"
              >
                <Link to="/grower/shop">Open shop</Link>
              </Button>
            </Panel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  saved
                  inCart={false}
                  onToggleSave={() =>
                    setSavedProducts((list) =>
                      list.filter((id) => id !== product.id),
                    )
                  }
                  onAdd={() => toast.success(`${product.name} added to cart`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </RolePage>
  );
}
