"use client";

import { useQuery } from "@tanstack/react-query";
import { useSupabaseUser } from "./useSupabaseUser";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  profileImage: string | null;
  userType: "INDIGENE" | "NDI_OGO";
  village: string | null;
  kindred: string | null;
  hostVillage: string | null;
  birthYear: number | null;
  ageGrade: string | null;
  generationalRole: string | null;
  onboardingCompleted: boolean;
  onboardingStep: number;
}

export function useUserProfile() {
  const { user } = useSupabaseUser();

  const query = useQuery<UserProfile>({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      const response = await fetch("/api/user/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
