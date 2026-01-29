"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface SupabaseSessionContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const SupabaseSessionContext = createContext<SupabaseSessionContextType>({
  session: null,
  user: null,
  loading: true,
});

export function SupabaseSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        // If there's an auth error, only sign out if it's not a missing session
        if (error && error.name !== "AuthSessionMissingError") {
          console.error("Auth session error:", error);
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error("Session initialization error:", err);
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <SupabaseSessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SupabaseSessionContext.Provider>
  );
}

export function useSupabaseSession() {
  const context = useContext(SupabaseSessionContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseSession must be used within a SupabaseSessionProvider",
    );
  }
  return context;
}
