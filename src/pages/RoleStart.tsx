import { PlantGuardLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { NEW_ROLES, ROLE_META, roleHomePath } from "@/lib/roles";
import { ArrowRight, Check, Sprout } from "lucide-react";
import { Link, useNavigate } from "react-router";

/**
 * Role picker for the five new PlantGuard experiences. Each card explains what
 * the role can do, and setup continues in the shared role wizard.
 */
export function RoleStart() {
  const navigate = useNavigate();
  const { profile } = useFarmerProfile();
  const current = profile?.role;
  const isNew = NEW_ROLES.includes(current as (typeof NEW_ROLES)[number]);

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
            PlantGuard AI works differently for everyone
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            Pick the role closest to what you do. You can change it later, and each
            workspace keeps its own navigation, tools and language.
          </p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {NEW_ROLES.map((id) => {
            const meta = ROLE_META[id];
            const Icon = meta.icon;
            const selected = current === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => navigate(`/setup/${id}`)}
                  className="group flex h-full w-full flex-col gap-3 rounded-2xl border border-[#E6EFE6] bg-white p-5 text-left shadow-[0_1px_3px_rgba(20,40,20,0.06)] transition-colors hover:border-[#2E7D32]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="flex size-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: meta.accentSoft, color: meta.accentDark }}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="text-2xl" aria-hidden>
                      {meta.emoji}
                    </span>
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground">
                      {meta.label}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-muted-foreground">
                      {meta.tagline}
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                  <span
                    className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold"
                    style={{ color: meta.accentDark }}
                  >
                    {selected ? (
                      <>
                        <Check className="size-3.5" />
                        Continue setup
                      </>
                    ) : (
                      <>
                        Set up {meta.short}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#E6EFE6] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Are you a farmer or nursery owner?
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {isNew
                ? `You're currently set up as ${ROLE_META[current as "home_grower"].label}. Re-run the farmer or nursery setup to switch workspaces.`
                : "Use the original setup flow for farm and nursery fields, crops and stock."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="h-11 gap-2 rounded-xl">
              <Link to="/onboarding">Farmer / nursery setup</Link>
            </Button>
            {isNew ? (
              <Button asChild className="h-11 gap-2 rounded-xl">
                <Link to={roleHomePath(current)}>Go to my workspace</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoleStart;
