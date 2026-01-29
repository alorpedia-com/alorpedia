import { useSupabaseSession } from "@/components/SupabaseSessionProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useSupabaseUser() {
  const { user, loading: sessionLoading } = useSupabaseSession();
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    try {
      // Clear data first for immediate UI feedback
      await supabase.auth.signOut();

      // Force a full refresh and redirect to ensure all state is purged
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback
      router.push("/");
    }
  };

  return { user, loading: sessionLoading, signOut };
}
