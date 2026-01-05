"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
          (step, index) => (
            <div key={step} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step < currentStep
                      ? "bg-primary text-background"
                      : step === currentStep
                      ? "bg-accent text-primary border-2 border-accent"
                      : "bg-background border-2 border-border text-foreground/40"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <div
                    className={`h-full transition-all ${
                      step < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Step Label */}
      <div className="text-center mt-3">
        <p className="text-xs font-medium text-foreground/60">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
