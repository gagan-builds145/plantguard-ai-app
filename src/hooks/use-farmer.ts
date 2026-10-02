import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

/**
 * The signed-in user's farmer profile.
 * - `profile === undefined` → still loading
 * - `profile === null` → signed in but onboarding not completed
 */
export function useFarmerProfile() {
  const profile = useQuery(api.farmers.getProfile);
  return { profile, isLoading: profile === undefined };
}
