"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface Step2BasicInfoProps {
  initialName?: string;
  onNext: (data: { name: string }) => void;
  onBack: () => void;
}

export default function Step2BasicInfo({
  initialName = "",
  onNext,
  onBack,
}: Step2BasicInfoProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext({ name: name.trim() });
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] px-5 py-8">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            What's your name?
          </h2>
          <p className="text-sm text-foreground/60">
            This is how you'll appear to other members
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-4 text-base border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-4 border-2 border-border text-foreground rounded-2xl font-semibold hover:bg-background/50 transition-all active:scale-[0.98]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-6 py-4 bg-primary text-background rounded-2xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
