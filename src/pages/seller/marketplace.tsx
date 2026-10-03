import {
  DemoTag,
  HeroPanel,
  InfoNote,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { SELLER_MARKETPLACE_LISTINGS } from "@/lib/role-data";
import { Building2, MapPin, PackageSearch, Store, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

const STEPS = [
  {
    title: "Set your wholesale profile",
    body: "Add your business type, city and the volumes you can supply so buyers can shortlist you.",
  },
  {
    title: "List your catalogue in bulk",
    body: "Push existing products to the marketplace as bulk lots with per-unit pricing.",
  },
  {
    title: "Receive enquiries",
    body: "Respond to buyer requests for quantities and delivery windows from one inbox.",
  },
  {
    title: "Fulfil and build history",
    body: "Completed deals improve your ranking and unlock repeat-buyer messaging.",
  },
];

export function SellerMarketplace() {
  return (
    <RolePage
      role="seller"
      active="marketplace"
      title="Marketplace"
      subtitle="Reach wholesale buyers beyond your own storefront with bulk listings and repeat orders."
      action={
        <Button asChild className="h-11 gap-2 rounded-xl">
          <Link to="/seller/products">
            <PackageSearch className="size-4" />
            List a bulk product
          </Link>
        </Button>
      }
    >
      <HeroPanel role="seller">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E0F2F1] px-3 py-1 text-[11px] font-semibold text-[#00695C]">
            <Store className="size-3" />
            PlantGuard Marketplace
          </span>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-foreground sm:text-[26px]">
            Sell in bulk to shops, cafés and institutions
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            List per-unit or per-kilogram pricing, set your delivery radius, and let
            verified buyers come to you. Sample listings below show the format.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DemoTag />
            <span className="text-xs text-muted-foreground">
              Listings are illustrative sample data
            </span>
          </div>
        </div>
      </HeroPanel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active listings"
          value="9"
          note="3 updated this week"
          icon={Store}
          accent="#00897B"
        />
        <StatTile
          label="Buyer enquiries"
          value="27"
          note="Last 30 days"
          icon={Building2}
          accent="#00897B"
        />
        <StatTile
          label="Bulk enquiries"
          value="11"
          note="Pending reply"
          icon={PackageSearch}
          accent="#00897B"
        />
        <StatTile
          label="Enquiry conversion"
          value="41%"
          note="Sample figure"
          icon={TrendingUp}
          accent="#00897B"
        />
      </div>

      <Panel>
        <SectionHead
          title="Listings on the marketplace"
          subtitle="What buyers can see right now"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SELLER_MARKETPLACE_LISTINGS.map((listing) => (
            <Panel key={listing.id} className="flex flex-col gap-3 p-0">
              <Photo src={listing.image} alt={listing.title} ratio="aspect-[16/9]" />
              <div className="flex flex-col gap-2 px-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{listing.title}</p>
                  <StatusPill label="Open" tone="green" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {listing.title} · {listing.price} per listed unit
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#00695C]">{listing.price}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {listing.location}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Seller: {listing.seller}</p>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="h-10 flex-1 rounded-xl">
                    View lot
                  </Button>
                  <Button
                    size="sm"
                    className="h-10 flex-1 rounded-xl"
                    onClick={() =>
                      toast.success(`Enquiry sent to ${listing.seller}`)
                    }
                  >
                    Enquire
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHead
          title="How to get started"
          subtitle="Four steps to your first marketplace sale"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#E0F2F1] text-sm font-bold text-[#00695C]">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <InfoNote>
            Marketplace supply, prices and buyer names shown here are sample content
            written for this prototype, not live listings.
          </InfoNote>
        </div>
      </Panel>
    </RolePage>
  );
}

export default SellerMarketplace;
