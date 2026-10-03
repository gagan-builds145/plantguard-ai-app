import { Loader2 } from "lucide-react";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { isNewRole, roleHomePath } from "@/lib/roles";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

/**
 * `/dashboard` is the single entry point after sign-in. Users on one of the
 * five new roles are sent straight into their own workspace; everyone else
 * keeps the existing Farmer / Nursery dashboard.
 */
export function RoleRouter({ children }: { children: ReactNode }) {
  const { profile, isLoading } = useFarmerProfile();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (isNewRole(profile?.role)) {
    return <Navigate to={roleHomePath(profile?.role)} replace />;
  }

  return children;
}
