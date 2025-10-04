import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type SubscriptionRow = Tables<"subscriptions">;

type ComputedSubscription = {
  record: SubscriptionRow | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isTrialActive: boolean;
  isExpired: boolean;
  daysRemaining: number | null;
  hasActiveSubscription: boolean;
  openUpgradeDialog: () => void;
  upgradeDialogOpen: boolean;
  setUpgradeDialogOpen: (open: boolean) => void;
};

const SubscriptionContext = createContext<ComputedSubscription | undefined>(undefined);

const TRIAL_LENGTH_DAYS = 14;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const createTrialPayload = (userId: string) => {
  const now = new Date();
  const expires = addDays(now, TRIAL_LENGTH_DAYS);

  return {
    user_id: userId,
    plan: "trial",
    status: "trial_active" as const,
    trial_started_at: now.toISOString(),
    trial_expires_at: expires.toISOString(),
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  } satisfies TablesInsert<"subscriptions">;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [record, setRecord] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const ensureTrialSubscription = useCallback(async (userId: string) => {
    const payload = createTrialPayload(userId);
    const { data, error: insertError } = await supabase
      .from("subscriptions")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    setRecord(data);
    return data;
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setRecord(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      await ensureTrialSubscription(user.id);
      setLoading(false);
      return;
    }

    setRecord(data);
    setLoading(false);
  }, [ensureTrialSubscription, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("public:subscriptions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh, user]);

  const computed = useMemo<ComputedSubscription>(() => {
    const now = new Date();
    const expires = record?.trial_expires_at ? new Date(record.trial_expires_at) : null;
    const diffMs = expires ? expires.getTime() - now.getTime() : null;
    const daysRemaining = diffMs !== null ? Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) : null;

    const hasActiveSubscription = record?.status === "active";
    const isTrialActive = record?.status === "trial_active" && (expires ? expires.getTime() > now.getTime() : true);
    const isExpired = Boolean(record) && !hasActiveSubscription && !isTrialActive;

    return {
      record,
      loading,
      error,
      refresh,
      isTrialActive,
      isExpired,
      daysRemaining,
      hasActiveSubscription,
      openUpgradeDialog: () => setUpgradeDialogOpen(true),
      upgradeDialogOpen,
      setUpgradeDialogOpen,
    };
  }, [record, loading, error, refresh, upgradeDialogOpen]);

  return <SubscriptionContext.Provider value={computed}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
};
