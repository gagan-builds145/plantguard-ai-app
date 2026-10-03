import { PlantGuardLogo } from "@/components/brand";
import { RoleChooser, getChooserRole } from "@/components/role-chooser";
import { Button } from "@/components/ui/button";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { roleHomePath } from "@/lib/roles";
import { Sprout } from "lucide-react";
import { Link, useNavigate } from "react-router";

/**
 * One role block for every role — Farmer and Nursery sit in the same list as
 * Home Grower, Seller, Vehicle Owner, Labour and Scientist. Each card routes to
 * that role's own setup flow.
 */
export function RoleStart() {
  const navigate = useNavigate();
  const { profile } = useFarmerProfile();
  const current = getChooserRole(profile?.role);

  return (
    <div className="min-h-screen bg-[#F6FAF6]">
      <header className="border-b border-[#E6EFE6] bg-white">
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 py-4">
          <Link to="/">
            <PlantGuardLogo />
          </Link>
          <Link to="/">
            <Button variant="ghost" className="h-10 rounded-xl text-[13px]">
              Back to home
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:py-14">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-[11px] font-semibold text-[#1B5E20]">
            <Sprout className="size-3" />
            Choose your workspace
          </span>
          <h1 className="mt-4 text-[30px] font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-[40px]">
            Every PlantGuard role, in one place
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            All seven roles live in this single list. Pick the one closest to what you
            do — you can switch later and your saved work stays with your account.
          </p>
        </div>

        <div className="mt-8">
          <RoleChooser
            value={current?.id}
            columns="sm:grid-cols-2 xl:grid-cols-3"
            onSelect={(role) => navigate(role.setupTo)}
          />
        </div>

        {current ? (
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#E6EFE6] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                You&apos;re currently set up as {current.label}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Switch roles any time — your profile, scans and saved items stay put.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild className="h-11 gap-2 rounded-xl">
                <Link to={roleHomePath(profile?.role)}>Go to my workspace</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 gap-2 rounded-xl"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default RoleStart;
