import {
  Chip,
  DemoTag,
  MetaRow,
  Panel,
  RolePage,
  SectionHead,
  StatusPill,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { SELLER_CATEGORIES, SELLER_STATS } from "@/lib/role-data";
import { useMutation } from "convex/react";
import {
  BarChart3,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  IndianRupee,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Warehouse,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function SellerProfile() {
  const { profile } = useFarmerProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(profile?.sellerBrandName ?? "");
  const [categories, setCategories] = useState<string[]>(
    profile?.sellerCategories ?? ["Plants", "Seeds"],
  );

  const displayName = profile?.displayName ?? user?.name ?? "Seller";
  const brand = profile?.sellerBrandName || "Your store name";
  const location = profile?.location
    ? `${profile.location.city}, ${profile.location.state}`
    : "Location not set";

  const tiles = [
    { key: "orders", label: "Orders", value: "124", to: "/seller/orders", icon: ShoppingBag },
    { key: "products", label: "Products", value: "48", to: "/seller/products", icon: Package },
    { key: "inventory", label: "Inventory", value: "Good", to: "/seller/inventory", icon: Warehouse },
    { key: "customers", label: "Customers", value: "1,284", to: "/seller/customers", icon: Store },
    { key: "finance", label: "Finance", value: "₹1.86L", to: "/seller/finance", icon: IndianRupee },
  ];

  const settings = [
    { key: "notifications", label: "Notifications", to: "/notifications", icon: Bell },
    { key: "privacy", label: "Privacy & data", to: "/help", icon: ShieldCheck },
    { key: "security", label: "Security", to: "/settings", icon: Settings },
    { key: "language", label: "Language", to: "/settings", icon: Globe },
    { key: "help", label: "Help & support", to: "/help", icon: HelpCircle },
  ];

  const toggleCategory = (category: string) =>
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );

  const openEditor = () => {
    setName(profile?.sellerBrandName ?? "");
    setCategories(profile?.sellerCategories ?? ["Plants", "Seeds"]);
    setEditOpen(true);
  };

  return (
    <RolePage
      role="seller"
      active="profile"
      title="Business Profile"
      subtitle="Your store identity, categories and account settings."
    >
      <Panel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-[#E0F2F1] text-[32px] font-bold text-[#00695C]">
            {brand.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
                {brand}
              </p>
              <StatusPill label="Seller" tone="blue" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {(profile?.sellerCategories ?? categories).slice(0, 4).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-surface-3 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {category}
                </span>
              ))}
              <DemoTag />
            </div>
          </div>
          <Button
            variant="outline"
            className="h-12 shrink-0 rounded-xl px-5 text-[15px] font-semibold"
            onClick={openEditor}
          >
            <Pencil className="size-4" />
            Edit Business
          </Button>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section>
          <SectionHead
            title="Your store"
            subtitle="Jump straight into the parts of your business you manage most."
          />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tiles.map((tile) => (
              <Link
                key={tile.key}
                to={tile.to}
                className="rounded-2xl border border-[#EAF0EA] bg-card p-4 shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors hover:border-primary/40"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF6EA] text-primary">
                  <tile.icon className="size-5" />
                </span>
                <p className="mt-3 text-lg font-bold text-foreground">{tile.value}</p>
                <p className="text-xs font-medium text-muted-foreground">{tile.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/seller/analytics"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-4 text-[13px] font-semibold text-foreground"
            >
              <BarChart3 className="size-4 text-[#00897B]" />
              Sales analytics
            </Link>
            <Link
              to="/seller/marketplace"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-4 text-[13px] font-semibold text-foreground"
            >
              <Truck className="size-4 text-[#00897B]" />
              Marketplace listings
            </Link>
          </div>
        </section>

        <Panel className="h-fit">
          <SectionHead title="Store snapshot" subtitle="Sample performance summary" />
          <div className="mt-3">
            {SELLER_STATS.map((stat) => (
              <MetaRow key={stat.key} label={stat.label} value={`${stat.value}`} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Business verified · GST details on file
          </div>
        </Panel>
      </div>

      <Panel className="p-2">
        <ul>
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-bg text-danger">
                <LogOut className="size-5" />
              </span>
              <span className="flex-1 text-sm font-semibold text-danger">Log out</span>
            </button>
          </li>
        </ul>
      </Panel>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit business</DialogTitle>
            <DialogDescription>
              This name and the categories you sell appear on your storefront and
              marketplace listings.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Store / brand name</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="GreenNest Store"
                className="h-12 rounded-xl text-[15px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">What do you sell?</Label>
              <div className="flex flex-wrap gap-2">
                {SELLER_CATEGORIES.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    selected={categories.includes(category)}
                    onClick={() => toggleCategory(category)}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {categories.length} categor{categories.length === 1 ? "y" : "ies"} selected
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await saveProfile({
                    sellerBrandName: name.trim(),
                    sellerCategories: categories,
                  });
                  toast.success("Business profile updated");
                  setEditOpen(false);
                } catch {
                  toast.error("We couldn't save that. Please try again.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound className="size-3.5" />
        Signed in as {user?.email ?? "your PlantGuard AI account"}
      </p>
    </RolePage>
  );
}

export default SellerProfile;
