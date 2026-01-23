"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

interface Step5CompleteProps {
  userName?: string;
  userType?: "INDIGENE" | "NDI_OGO";
}

export default function Step5Complete({
  userName,
  userType,
}: Step5CompleteProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleExplore = async () => {
    if (isNavigating) return; // Prevent double clicks

    setIsNavigating(true);

    try {
      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate to profile
      router.push("/profile");
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  const isNdiOgo = userType === "NDI_OGO";

  const welcomeMessage = isNdiOgo
    ? "You're now part of the Alorpedia community as Ndi Ogo. Connect with your host village, explore Alor heritage, and build meaningful relationships with the community."
    : "You're now part of the Alorpedia community. Start exploring your heritage, connect with your village, and preserve your family's legacy.";

  const features = isNdiOgo
    ? [
        "Connect with your host village",
        "Join village dialogues",
        "Explore the living archive",
        "Build relationships with the community",
      ]
    : [
        "Build your family tree (Osisi Ndụ)",
        "Join village dialogues",
        "Explore the living archive",
        "Connect with your age-grade",
      ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-5 py-8">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">
            Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-base text-foreground/70 leading-relaxed">
            {welcomeMessage}
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
          <h3 className="font-semibold text-foreground text-center mb-4">
            What you can do now:
          </h3>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleExplore}
          disabled={isNavigating}
          className="w-full px-8 py-4 bg-primary text-background rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isNavigating ? "Loading..." : "Start Exploring"}
        </button>
      </div>
    </div>
  );
}
