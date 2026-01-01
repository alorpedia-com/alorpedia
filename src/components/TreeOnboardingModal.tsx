"use client";

import { useState, useEffect } from "react";
import { X, Heart, UserPlus, GitBranch, Eye } from "lucide-react";

interface TreeOnboardingModalProps {
  onClose: () => void;
}

export default function TreeOnboardingModal({
  onClose,
}: TreeOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Osisi Ndụ",
      subtitle: "The Tree of Life",
      icon: Heart,
      content: (
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-foreground/80 font-serif italic">
            <span className="font-black not-italic text-primary">
              "Osisi Ndụ"
            </span>{" "}
            means{" "}
            <span className="font-black not-italic text-primary">
              "Tree of Life"
            </span>{" "}
            in Igbo.
          </p>
          <p className="text-base leading-relaxed text-foreground/70">
            It represents the living connection between past, present, and
            future generations. By mapping your lineage, you preserve your
            heritage and strengthen the bonds that unite our community across
            time and distance.
          </p>
          <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6">
            <p className="text-sm font-black uppercase tracking-widest text-accent mb-2">
              Igbo Wisdom
            </p>
            <p className="text-base italic text-foreground/70 font-serif">
              "Onye aghana nna ya" — One who forgets their father forgets
              themselves.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Add Family Members",
      subtitle: "Step 1: Plant Your Roots",
      icon: UserPlus,
      content: (
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-foreground/70">
            Start by adding family members to your tree. Each person becomes a
            "node" in your family's living history.
          </p>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-background rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                1
              </div>
              <div>
                <p className="font-black text-primary mb-1">
                  Click "Add Member"
                </p>
                <p className="text-sm text-foreground/60">
                  Enter their name, gender, and birth year
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-background rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                2
              </div>
              <div>
                <p className="font-black text-primary mb-1">
                  Start with elders
                </p>
                <p className="text-sm text-foreground/60">
                  Begin with your parents or grandparents to establish the
                  foundation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-background rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                3
              </div>
              <div>
                <p className="font-black text-primary mb-1">
                  Linked vs Unlinked
                </p>
                <p className="text-sm text-foreground/60">
                  Members with Alorpedia accounts will show a "Linked" badge
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Link Roots",
      subtitle: "Step 2: Define Relationships",
      icon: GitBranch,
      content: (
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-foreground/70">
            After adding members, connect them by defining their relationships.
            This creates the branches of your family tree.
          </p>
          <div className="space-y-3">
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <p className="font-black text-primary text-sm mb-1">
                Parent-Child
              </p>
              <p className="text-xs text-foreground/60">
                Direct parent to child relationship
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <p className="font-black text-primary text-sm mb-1">Spouse</p>
              <p className="text-xs text-foreground/60">
                Marriage or partnership
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <p className="font-black text-primary text-sm mb-1">Sibling</p>
              <p className="text-xs text-foreground/60">Brothers and sisters</p>
            </div>
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
              <p className="font-black text-secondary text-sm mb-2">
                Extended Family (New!)
              </p>
              <p className="text-xs text-foreground/60 mb-2">
                Grandparent, Aunt/Uncle, and Cousin relationships
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Explore & Verify",
      subtitle: "Step 3: Navigate Your Heritage",
      icon: Eye,
      content: (
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-foreground/70">
            Once your tree is built, explore connections and ensure accuracy
            through community verification.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <span className="text-xs font-black text-primary">✓</span>
              </div>
              <div>
                <p className="font-black text-primary text-sm mb-1">
                  Click Linked Nodes
                </p>
                <p className="text-xs text-foreground/60">
                  Navigate to family members' profiles to see their
                  contributions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <span className="text-xs font-black text-accent">!</span>
              </div>
              <div>
                <p className="font-black text-accent text-sm mb-1">
                  Flag Disputes
                </p>
                <p className="text-xs text-foreground/60">
                  Report incorrect relationships for Council of Elders review
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <span className="text-xs font-black text-secondary">🔒</span>
              </div>
              <div>
                <p className="font-black text-secondary text-sm mb-1">
                  Privacy Matters
                </p>
                <p className="text-xs text-foreground/60">
                  Only add information with consent, especially for living
                  relatives
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-background/95 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-4 sm:my-8 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-primary text-background p-4 sm:p-8 lg:p-12 shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-all active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="relative z-10 flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-background/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-xl border border-background/10 shrink-0">
              <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight truncate">
                {currentStepData.title}
              </h2>
              <p className="text-background/70 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1 truncate">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="relative z-10 flex items-center space-x-1.5 sm:space-x-2 mt-4 sm:mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentStep
                    ? "bg-accent shadow-lg shadow-accent/50"
                    : "bg-background/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-8 lg:p-12 overflow-y-auto flex-1">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 sm:p-8 lg:p-12 pt-0 shrink-0">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs text-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <div className="order-1 sm:order-2 flex items-center space-x-2">
            <span className="text-xs sm:text-sm font-black text-foreground/40">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="order-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-background rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-primary/90 transition-all shadow-xl active:scale-95"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="order-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-accent text-primary rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-accent/90 transition-all shadow-xl active:scale-95"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
