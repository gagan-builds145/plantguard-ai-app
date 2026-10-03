import {
  DemoTag,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  Stars,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GROWER_CATEGORIES,
  GROWER_COMMUNITIES,
  GROWER_FEED,
  GROWER_SHOP,
  GROWER_TIPS,
} from "@/lib/role-data";
import { ArrowRight, Search, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const TRENDING = [
  { name: "Monstera", note: "1.2k scans this week", image: GROWER_SHOP[0].image },
  { name: "Snake Plant", note: "Low-light favourite", image: GROWER_SHOP[11].image },
  { name: "Basil", note: "Kitchen garden staple", image: GROWER_SHOP[6].image },
  { name: "Echeveria", note: "Easy-care succulent", image: GROWER_SHOP[8].image },
];

export function GrowerDiscover() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return GROWER_CATEGORIES;
    return GROWER_CATEGORIES.filter((item) =>
      item.label.toLowerCase().includes(term),
    );
  }, [query]);

  const recommended = useMemo(() => {
    const term = query.trim().toLowerCase();
    const pool = GROWER_SHOP.filter((product) =>
      category ? product.category === category : true,
    );
    if (!term) return pool.slice(0, 4);
    return pool
      .filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term),
      )
      .slice(0, 4);
  }, [query, category]);

  return (
    <RolePage
      role="home_grower"
      active="discover"
      title="Discover"
      subtitle="Plants, tips and ideas from the PlantGuard AI community."
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search plants, tips and ideas"
          className="h-13 rounded-xl pl-11 text-[15px]"
          aria-label="Search plants, tips and ideas"
        />
      </div>

      <section>
        <SectionHead
          title="Browse by category"
          subtitle="Ten starting points for small-space growing."
        />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filteredCategories.map((item) => {
            const active = category === item.label;
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(active ? null : item.label)}
                className={`group overflow-hidden rounded-2xl border bg-card text-left shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors ${
                  active ? "border-primary" : "border-[#EAF0EA] hover:border-primary/40"
                }`}
              >
                <Photo src={item.image} alt={item.label} ratio="aspect-[5/3]" />
                <span className="flex items-center gap-2 px-3.5 py-3">
                  <span aria-hidden className="text-base">
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-semibold text-foreground">
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {filteredCategories.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No categories match “{query}”. Try a different term.
          </p>
        ) : null}
      </section>

      <section>
        <SectionHead
          title="Trending plants"
          subtitle="What growers are scanning and sharing this week."
          action={<DemoTag />}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING.map((plant) => (
            <Panel key={plant.name} className="overflow-hidden p-0">
              <Photo src={plant.image} alt={plant.name} ratio="aspect-[5/3]" />
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
                  <TrendingUp className="size-4 text-primary" />
                  {plant.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{plant.note}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <SectionHead
          title="Popular plant tips"
          subtitle="Short reads written for home growing."
        />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {GROWER_TIPS.slice(0, 3).map((tip) => (
            <Panel key={tip.id} className="overflow-hidden p-0">
              <Photo src={tip.image} alt={tip.title} ratio="aspect-[16/9]" />
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
                  {tip.category}
                </p>
                <p className="mt-1.5 text-[15px] font-semibold leading-6 text-foreground">
                  {tip.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{tip.readTime}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <SectionHead
          title="Community favourites"
          subtitle="Posts growers saved the most this month."
          action={
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-xl px-3 text-[13px] font-semibold text-primary"
            >
              <Link to="/grower">
                Open feed
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {GROWER_FEED.slice(0, 3).map((post) => (
            <Panel key={post.id} className="overflow-hidden p-0">
              <Photo src={post.image} alt={post.caption} ratio="aspect-[4/3]" />
              <div className="p-4">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <img src={post.avatar} alt="" className="size-6 rounded-full object-cover" />
                  {post.author} · {post.location}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground">
                  {post.caption}
                </p>
                <p className="mt-2 text-xs font-semibold text-primary">
                  {post.saves + 12} saves
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <SectionHead
          title="Recommended for you"
          subtitle="Matched to your interests and recent searches."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((product) => (
            <Panel key={product.id} className="overflow-hidden p-0">
              <Photo src={product.image} alt={product.name} ratio="aspect-square" />
              <div className="flex flex-col gap-1.5 p-4">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <p className="text-[15px] font-semibold leading-6 text-foreground">
                  {product.name}
                </p>
                <Stars rating={product.rating} reviews={product.reviews} />
                <p className="text-sm font-bold text-foreground">
                  ₹{product.price}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    {product.unit}
                  </span>
                </p>
              </div>
            </Panel>
          ))}
        </div>
        {recommended.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nothing matches that search yet. Try another plant or category.
          </p>
        ) : null}
      </section>

      <section>
        <SectionHead
          title="Nearby plant communities"
          subtitle="Local groups that share cuttings, seeds and advice."
          action={<DemoTag />}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {GROWER_COMMUNITIES.map((community) => (
            <Panel key={community.id} className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF6EA] text-primary">
                <Users className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {community.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {community.members} members · {community.distance} away
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9 shrink-0 rounded-xl px-3 text-xs font-semibold"
              >
                Join
              </Button>
            </Panel>
          ))}
        </div>
      </section>
    </RolePage>
  );
}

export default GrowerDiscover;
