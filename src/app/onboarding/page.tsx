"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/onboarding/StepIndicator";
import Step2BasicInfo from "@/components/onboarding/Step2BasicInfo";
import Step3ProfileImage from "@/components/onboarding/Step3ProfileImage";
import Step4VillageInfo from "@/components/onboarding/Step4VillageInfo";
import Step5Complete from "@/components/onboarding/Step5Complete";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

interface OnboardingData {
  name?: string;
  profileImage?: string;
  userType?: "INDIGENE" | "NDI_OGO";
  village?: string;
  kindred?: string;
  hostVillage?: string;
  birthDate?: string;
  birthYear?: number;
  ageGrade?: string;
  generationalRole?: string;
}

export default function OnboardingPage() {
  const { user, loading: authLoading } = useSupabaseUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2); // Start at Step 2 (Basic Info) since user is already authenticated
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/register");
      return;
    }

    // Fetch user from database to check onboarding status
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Onboarding: Fetching user profile...");
        const response = await fetch("/api/user/profile");

        if (response.ok) {
          const userData = await response.json();
          setDbUser(userData);

          // Check if onboarding is already completed
          if (userData.onboardingCompleted) {
            router.push("/profile");
            return;
          }

          // Set current step based on onboardingStep
          if (userData.onboardingStep) {
            setCurrentStep(userData.onboardingStep);
          }

          // Pre-fill data if available
          setData({
            name: userData.name || user.user_metadata?.name || "",
            profileImage:
              userData.profileImage || user.user_metadata?.avatar_url || "",
            userType: userData.userType,
            village: userData.village,
            kindred: userData.kindred,
            hostVillage: userData.hostVillage,
            birthDate: userData.birthDate,
            birthYear: userData.birthYear,
            ageGrade: userData.ageGrade,
            generationalRole: userData.generationalRole,
          });
        } else {
          const errorText = await response.text();
          console.error(
            "Onboarding: Profile API returned error",
            response.status,
            errorText,
          );
          setError(
            "Could not load your profile. Please check your connection and try again.",
          );
        }
      } catch (error) {
        console.error("Onboarding: Failed to fetch user data:", error);
        setError(
          "An unexpected error occurred. Please refresh the page or try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authLoading, user, router]);

  const updateOnboarding = async (
    step: number,
    stepData: Partial<OnboardingData>,
  ) => {
    try {
      console.log(
        `Sending onboarding update for User ${user?.id} (Step ${step}):`,
        stepData,
      );
      const response = await fetch("/api/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, data: stepData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Onboarding API error response:", errorData);
        throw new Error(errorData.error || "Failed to update onboarding");
      }

      const result = await response.json();
      console.log("Onboarding API success response:", result);

      // Don't update session here - it causes page refresh
      // Session will be updated when onboarding is complete

      return result;
    } catch (error) {
      console.error("Onboarding update error:", error);
      throw error;
    }
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = async (stepData: { name: string }) => {
    try {
      setData((prev) => ({ ...prev, ...stepData }));
      await updateOnboarding(2, stepData);
      setCurrentStep(3);
    } catch (error) {
      console.error("Failed to proceed to next step:", error);
      // Don't change step if there's an error
      alert("Failed to save your information. Please try again.");
    }
  };

  const handleStep3Next = async (stepData: { profileImage?: string }) => {
    setData((prev) => ({ ...prev, ...stepData }));
    await updateOnboarding(3, stepData);
    setCurrentStep(4);
  };

  const handleStep4Next = async (stepData: {
    userType: "INDIGENE" | "NDI_OGO";
    village?: string;
    kindred?: string;
    hostVillage?: string;
    birthYear: number;
    ageGrade?: string;
    generationalRole?: string;
  }) => {
    try {
      setData((prev) => ({ ...prev, ...stepData }));
      await updateOnboarding(4, stepData);

      // Don't update session here - it will be updated in Step5Complete
      setCurrentStep(5);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      alert("Failed to complete onboarding. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalSteps = 4; // Excluding welcome screen

  // Show loading while checking session
  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator - Hide on complete screen */}
      {currentStep < 5 && (
        <StepIndicator currentStep={currentStep - 1} totalSteps={totalSteps} />
      )}

      {/* Step Content */}
      <div className="container mx-auto">
        {currentStep === 2 && (
          <Step2BasicInfo
            initialName={data.name}
            onNext={handleStep2Next}
            onBack={() => router.push("/profile")} // Go back to profile instead of step 1
          />
        )}

        {currentStep === 3 && (
          <Step3ProfileImage
            initialImage={data.profileImage}
            onNext={handleStep3Next}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <Step4VillageInfo
            initialVillage={data.village}
            initialBirthDate={data.birthDate}
            onNext={handleStep4Next}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <Step5Complete userName={data.name} userType={data.userType} />
        )}
      </div>
    </div>
  );
}
