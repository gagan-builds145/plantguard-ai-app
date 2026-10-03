import {
  DemoTag,
  FilterPills,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
  TableShell,
  Td,
  Th,
  type PillTone,
} from "@/components/role-ui";
import { SELLER_CUSTOMERS } from "@/lib/role-data";
import { Building2, MapPin, Search, ShoppingBag, Store, Users } from "lucide-react";
import { useMemo, useState } from "react";

const TABS = ["All", "Retail", "Wholesale", "Institution"] as const;

const TYPE_TONE: Record<string, PillTone> = {
  Retail: "blue",
  Wholesale: "amber",
  Institution: "green",
};

export function SellerCustomers() {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SELLER_CUSTOMERS.filter((customer) => {
      const matchesTab = tab === "All" || customer.type === tab;
      const matchesQuery =
        !needle ||
        customer.name.toLowerCase().includes(needle) ||
        customer.location.toLowerCase().includes(needle);
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const repeat = SELLER_CUSTOMERS.filter((customer) => customer.orders >= 9).length;

  return (
    <RolePage
      role="seller"
      active="customers"
      title="Customers"
      subtitle="Understand who buys from you — retail buyers, wholesale partners and institutional accounts."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total customers"
          value={String(SELLER_CUSTOMERS.length * 160)}
          note="Sample list below"
          icon={Users}
        />
        <StatTile
          label="Repeat buyers"
          value={String(repeat)}
          note="9+ orders placed"
          icon={ShoppingBag}
        />
        <StatTile
          label="Wholesale partners"
          value={String(
            SELLER_CUSTOMERS.filter((customer) => customer.type === "Wholesale").length,
          )}
          note="Bulk order accounts"
          icon={Store}
        />
        <StatTile
          label="Institutions"
          value={String(
            SELLER_CUSTOMERS.filter((customer) => customer.type === "Institution").length,
          )}
          note="Schools, cafés, trusts"
          icon={Building2}
        />
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Customer list"
            subtitle={`${visible.length} record${visible.length === 1 ? "" : "s"} shown`}
          />
          <DemoTag />
        </div>
        <FilterPills options={TABS} value={tab} onChange={setTab} />
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or location"
            aria-label="Search customers"
            className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </Panel>

      <TableShell>
        <thead>
          <tr>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Orders</Th>
            <Th>Last activity</Th>
          </tr>
        </thead>
        <tbody>
          {visible.map((customer) => (
            <tr key={customer.id} className="transition-colors hover:bg-surface-2">
              <Td className="font-semibold text-foreground">{customer.name}</Td>
              <Td className="text-muted-foreground">{customer.location}</Td>
              <Td>
                <StatusPill label={customer.type} tone={TYPE_TONE[customer.type]} />
              </Td>
              <Td>{customer.orders}</Td>
              <Td className="text-muted-foreground">{customer.lastActivity}</Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <div className="flex flex-col gap-3 md:hidden">
        {visible.map((customer) => (
          <Panel key={customer.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {customer.location}
                </p>
              </div>
              <StatusPill label={customer.type} tone={TYPE_TONE[customer.type]} />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-3 text-[13px]">
              <span className="text-muted-foreground">Orders placed</span>
              <span className="font-semibold text-foreground">{customer.orders}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Last activity {customer.lastActivity}
            </p>
          </Panel>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">No customers found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another type or clear your search.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default SellerCustomers;
