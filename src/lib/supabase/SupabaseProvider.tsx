"use client";

import { useSession } from "@clerk/nextjs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useMemo } from "react";

type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const SupabaseCtx = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoaded: clerkLoaded } = useSession();

  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!session) return null;

    const getToken = () => session.getToken();

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        accessToken: async () => (await getToken()) ?? null,
      }
    );
  }, [session]);
  const isLoaded = clerkLoaded && (session ? !!supabase : true);

  const value = useMemo(() => ({ supabase, isLoaded }), [supabase, isLoaded]);

  return <SupabaseCtx.Provider value={value}>{children}</SupabaseCtx.Provider>;
}

export function useSupabase() {
  const ctx = useContext(SupabaseCtx);
  if (!ctx) {
    throw new Error("useSupabase deve ser usado dentro de <SupabaseProvider>");
  }
  return ctx;
}
