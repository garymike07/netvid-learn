import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useSignIn, useSignUp, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

export type AppUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string | null;
};

type AuthContextValue = {
  session: { id: string } | null;
  user: AppUser | null;
  loading: boolean;
  signIn: (params: { email: string; password: string }) => Promise<{ error: string | null }>;
  signUp: (params: { email: string; password: string; fullName: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SOCIAL_PROVIDER_PRIORITY = ["oauth_google", "oauth_linkedin", "oauth_linkedin_oidc"] as const;

type ExternalAccount = {
  provider: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  emailAddress?: string | null;
};

const selectPreferredExternalAccount = (accounts: Array<ExternalAccount> | undefined) => {
  if (!accounts || accounts.length === 0) {
    return undefined;
  }

  for (const provider of SOCIAL_PROVIDER_PRIORITY) {
    const match = accounts.find((account) => account.provider === provider);
    if (match) {
      return match;
    }
  }

  return accounts[0];
};

const extractExternalName = (account: ExternalAccount | undefined) => {
  if (!account) {
    return { firstName: null, lastName: null, fullName: null };
  }

  const firstName = account.firstName ?? account.username ?? account.emailAddress?.split?.("@")[0] ?? null;
  const lastName = account.lastName ?? null;

  let fullName: string | null = null;
  const combined = [account.firstName, account.lastName].filter(Boolean).join(" ").trim();
  if (combined.length > 0) {
    fullName = combined;
  } else if (typeof account.username === "string" && account.username.trim().length > 0) {
    fullName = account.username.trim();
  } else if (typeof account.emailAddress === "string") {
    const emailAlias = account.emailAddress.split("@")[0];
    fullName = emailAlias.length > 0 ? emailAlias : null;
  }

  return { firstName: firstName ?? null, lastName, fullName };
};

const mapClerkUser = (user: ReturnType<typeof useUser>["user"]): AppUser | null => {
  if (!user) return null;

  const preferredExternalAccount = selectPreferredExternalAccount(user.externalAccounts as Array<ExternalAccount> | undefined);
  const externalName = extractExternalName(preferredExternalAccount);

  const derivedFirstName = user.firstName ?? externalName.firstName;
  const derivedLastName = user.lastName ?? externalName.lastName;

  let derivedFullName = user.fullName ?? null;
  if (!derivedFullName || derivedFullName.trim().length === 0) {
    const combined = [derivedFirstName, derivedLastName].filter(Boolean).join(" ").trim();
    if (combined.length > 0) {
      derivedFullName = combined;
    } else if (externalName.fullName && externalName.fullName.trim().length > 0) {
      derivedFullName = externalName.fullName.trim();
    }
  }

  if (!derivedFullName && preferredExternalAccount?.emailAddress) {
    const alias = preferredExternalAccount.emailAddress.split("@")[0];
    if (alias.length > 0) {
      derivedFullName = alias;
    }
  }

  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? preferredExternalAccount?.emailAddress ?? null,
    fullName: derivedFullName ?? null,
    firstName: derivedFirstName ?? null,
    lastName: derivedLastName ?? null,
    createdAt: user.createdAt?.toISOString?.() ?? null,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded: authLoaded, isSignedIn, signOut, setActive, getToken } = useClerkAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);
  const [hasSyncedSupabase, setHasSyncedSupabase] = useState(false);
  const baseLoading = !authLoaded || !userLoaded || !signInLoaded || !signUpLoaded;
  const loading = baseLoading || (!hasSyncedSupabase && supabaseSyncing);

  useEffect(() => {
    if (!isSignedIn) {
      setHasSyncedSupabase(true);
      setSupabaseSyncing(false);
    } else {
      setHasSyncedSupabase(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    let cancelled = false;

    const syncSupabaseSession = async () => {
      if (!authLoaded) return;

      if (!isSignedIn) {
        setSupabaseSyncing(false);
        await supabase.auth.signOut();
        return;
      }

      try {
        setSupabaseSyncing(true);
        const token = await getToken({ template: "supabase" });
        if (!token || cancelled) {
          if (!cancelled) {
            setSupabaseSyncing(false);
          }
          return;
        }
        const { error } = await supabase.auth.setSession({ access_token: token, refresh_token: token });
        if (error && !cancelled) {
          console.error("Supabase session sync failed", error.message);
        }
      } catch (error) {
        console.error("Failed to sync Supabase session", error);
      } finally {
        if (!cancelled) {
          setSupabaseSyncing(false);
          setHasSyncedSupabase(true);
        }
      }
    };

    syncSupabaseSession();

    const interval = setInterval(syncSupabaseSession, 1000 * 60 * 10);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [authLoaded, getToken, isSignedIn]);

  const value = useMemo<AuthContextValue>(() => {
    const appUser = mapClerkUser(user);

    return {
      session: isSignedIn && appUser ? { id: appUser.id } : null,
      user: appUser,
      loading,
      signIn: async ({ email, password }) => {
        if (!signInLoaded || !signIn) {
          return { error: "Sign-in is not ready yet. Please try again." };
        }

        try {
          const result = await signIn.create({ identifier: email, password });
          if (result.status === "complete") {
            if (result.createdSessionId) {
              await setActive({ session: result.createdSessionId });
            }
            return { error: null };
          }
          if (result.status === "needs_first_factor") {
            return { error: "Additional verification required. Check your email for the code." };
          }
          return { error: "Unable to sign in. Please continue in the Clerk modal." };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to sign in.";
          return { error: message };
        }
      },
      signUp: async ({ email, password, fullName }) => {
        if (!signUpLoaded || !signUp) {
          return { error: "Sign-up is not ready yet. Please try again." };
        }

        try {
          const result = await signUp.create({ emailAddress: email, password });
          const [firstName, ...rest] = fullName.trim().split(" ");
          if (firstName) {
            await signUp.update({ firstName, lastName: rest.join(" ") || undefined });
          }

          if (result.status === "complete" && result.createdSessionId) {
            await setActive({ session: result.createdSessionId });
            return { error: null };
          }

          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          return { error: "We sent a verification code to your email to finish signing up." };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to create account.";
          return { error: message };
        }
      },
      signOut: async () => {
        await signOut();
        await supabase.auth.signOut();
      },
    };
  }, [isSignedIn, loading, setActive, signIn, signInLoaded, signUp, signUpLoaded, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
