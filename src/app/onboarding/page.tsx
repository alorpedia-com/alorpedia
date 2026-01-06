"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/onboarding/StepIndicator";
import Step1Welcome from "@/components/onboarding/Step1Welcome";
import Step2BasicInfo from "@/components/onboarding/Step2BasicInfo";
import Step3ProfileImage from "@/components/onboarding/Step3ProfileImage";
import Step4VillageInfo from "@/components/onboarding/Step4VillageInfo";
import Step5Complete from "@/components/onboarding/Step5Complete";

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
  const { data: session, update } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/register");
      return;
    }

    const user = session.user as any;

    // Check if onboarding is already completed
    if (user.onboardingCompleted) {
      router.push("/profile");
      return;
    }

    // Set current step based on user's progress
    if (user.onboardingStep) {
      setCurrentStep(user.onboardingStep);
    }

    // Pre-fill data from session
    setData({
      name: user.name || "",
      profileImage: user.image || "",
      village: user.village || "",
      birthDate: "",
    });

    setLoading(false);
  }, [session, router]);

  const updateOnboarding = async (
    step: number,
    stepData: Partial<OnboardingData>
  ) => {
    try {
      const response = await fetch("/api/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, data: stepData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update onboarding");
      }

      const result = await response.json();

      // Update session with new data
      await update();

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
    setData((prev) => ({ ...prev, ...stepData }));
    await updateOnboarding(2, stepData);
    setCurrentStep(3);
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
    setData((prev) => ({ ...prev, ...stepData }));
    await updateOnboarding(4, stepData);

    // Force session refresh to get updated onboardingCompleted status
    // This is critical - wait for it to complete before moving to Step 5
    await update();

    // Small delay to ensure session propagates
    await new Promise((resolve) => setTimeout(resolve, 300));

    setCurrentStep(5);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator - Hide on welcome and complete screens */}
      {currentStep > 1 && currentStep < 5 && (
        <StepIndicator currentStep={currentStep - 1} totalSteps={totalSteps} />
      )}

      {/* Step Content */}
      <div className="container mx-auto">
        {currentStep === 1 && <Step1Welcome onNext={handleStep1Next} />}

        {currentStep === 2 && (
          <Step2BasicInfo
            initialName={data.name}
            onNext={handleStep2Next}
            onBack={handleBack}
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

        {currentStep === 5 && <Step5Complete userName={data.name} />}
      </div>
    </div>
  );
}
