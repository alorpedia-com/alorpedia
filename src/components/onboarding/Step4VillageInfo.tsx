"use client";

import { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { VILLAGES, calculateAgeGrade } from "@/lib/utils";

interface Step4VillageInfoProps {
  initialVillage?: string;
  initialBirthDate?: string;
  onNext: (data: { village: string; birthDate: string }) => void;
  onBack: () => void;
}

export default function Step4VillageInfo({
  initialVillage = VILLAGES[0],
  initialBirthDate = "",
  onNext,
  onBack,
}: Step4VillageInfoProps) {
  const [village, setVillage] = useState(initialVillage);
  const [birthDate, setBirthDate] = useState(initialBirthDate);

  const ageGrade = birthDate
    ? calculateAgeGrade(new Date(birthDate))
    : "Select your birth date";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (village && birthDate) {
      onNext({ village, birthDate });
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] px-5 py-8">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Your Village & Age-Grade
          </h2>
          <p className="text-sm text-foreground/60">
            Connect with your community and age-grade
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Village Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground/80">
              Village
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none bg-background"
                required
              >
                {VILLAGES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground/80">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Age Grade Display */}
          <div className="bg-accent/10 border-2 border-accent/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground/70">
                Your Age-Grade:
              </span>
              <span className="text-base font-bold text-accent">
                {ageGrade}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={!village || !birthDate}
              className="flex-1 px-6 py-4 bg-primary text-background rounded-2xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
