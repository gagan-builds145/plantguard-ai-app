// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { emailOtp } from "./auth/emailOtp";

// Email + password is the primary sign-in method. The email OTP provider is
// wired in as the password **reset** verifier only — it is not exposed as a
// standalone sign-in method.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      reset: emailOtp,
      // Keep the name supplied at sign-up on the user record so the workspace
      // can greet them and onboarding can prefill it.
      profile(params): { email: string; name?: string } {
        const email = params.email as string;
        const name = params.name;
        return typeof name === "string" ? { email, name } : { email };
      },
    }),
    Anonymous,
  ],
});
