"use client";

import { useState } from "react";
import { MapPin, Calendar, Users, Shield } from "lucide-react";
import {
  VILLAGES,
  KINDREDS,
  calculateAgeGrade,
  getKindredsForVillage,
} from "@/lib/utils";
import StyledDropdown from "@/components/StyledDropdown";

interface Step4VillageInfoProps {
  initialVillage?: string;
  initialBirthDate?: string;
  onNext: (data: {
    userType: "INDIGENE" | "NDI_OGO";
    village?: string;
    kindred?: string;
    hostVillage?: string;
    birthYear: number;
    ageGrade?: string;
    generationalRole?: string;
  }) => void;
  onBack: () => void;
}

export default function Step4VillageInfo({
  initialVillage = VILLAGES[0],
  initialBirthDate = "",
  onNext,
  onBack,
}: Step4VillageInfoProps) {
  const [userType, setUserType] = useState<"INDIGENE" | "NDI_OGO">("INDIGENE");
  const [village, setVillage] = useState(initialVillage);
  const [kindred, setKindred] = useState("");
  const [birthYear, setBirthYear] = useState(
    initialBirthDate ? new Date(initialBirthDate).getFullYear().toString() : ""
  );

  // Calculate age grade from birth year
  const ageGradeData = birthYear
    ? calculateAgeGrade(parseInt(birthYear))
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthYear) return;

    const year = parseInt(birthYear);

    if (userType === "INDIGENE") {
      // Indigenes must have village and kindred
      if (!village || !kindred) return;
      onNext({
        userType: "INDIGENE",
        village,
        kindred,
        birthYear: year,
        ageGrade: ageGradeData?.name,
        generationalRole: ageGradeData?.role,
      });
    } else {
      // Ndi Ogo only need host village
      if (!village) return;
      onNext({
        userType: "NDI_OGO",
        hostVillage: village,
        birthYear: year,
        ageGrade: ageGradeData?.name,
        generationalRole: ageGradeData?.role,
      });
    }
  };

  // Reset kindred when village changes
  const handleVillageChange = (newVillage: string) => {
    setVillage(newVillage);
    setKindred(""); // Reset kindred selection
  };

  const availableKindreds = getKindredsForVillage(village);

  // Prepare dropdown options
  const villageOptions = VILLAGES.map((v) => ({ value: v, label: v }));
  const kindredOptions = availableKindreds.map((k) => ({ value: k, label: k }));

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
            Your Identity & Roots
          </h2>
          <p className="text-sm text-foreground/60">
            Connect with your community and heritage
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Switcher */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground/80">
              I am...
            </label>
            <div className="grid grid-cols-2 gap-3 bg-background/50 p-1.5 rounded-2xl border-2 border-border">
              <button
                type="button"
                onClick={() => setUserType("INDIGENE")}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  userType === "INDIGENE"
                    ? "bg-primary text-background shadow-md"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                Alor Indigene
              </button>
              <button
                type="button"
                onClick={() => setUserType("NDI_OGO")}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  userType === "NDI_OGO"
                    ? "bg-secondary text-background shadow-md"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                Ndi Ogo & Friends
              </button>
            </div>
            <p className="text-xs text-foreground/50 italic">
              {userType === "INDIGENE"
                ? "Born into an Alor family"
                : "Inlaw, friend, or associate of Alor"}
            </p>
          </div>

          {/* Village Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground/80">
              {userType === "INDIGENE" ? "Your Village (Ebo)" : "Host Village"}
            </label>
            <StyledDropdown
              label={userType === "INDIGENE" ? "Village" : "Host Village"}
              value={village}
              onChange={handleVillageChange}
              options={villageOptions}
              icon={<MapPin className="w-5 h-5 text-primary/60" />}
            />
            {userType === "NDI_OGO" && (
              <p className="text-xs text-foreground/50 italic">
                Which village do you live in or have ties to?
              </p>
            )}
          </div>

          {/* Kindred Selection - Only for Indigenes */}
          {userType === "INDIGENE" && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground/80">
                Your Kindred (Umunna)
              </label>
              <StyledDropdown
                label="Kindred"
                value={kindred}
                onChange={setKindred}
                options={kindredOptions}
                icon={<Users className="w-5 h-5 text-primary/60" />}
                disabled={kindredOptions.length === 0}
                disabledMessage="Select village first"
              />
              <p className="text-xs text-foreground/50 italic">
                Your clan within {village}
              </p>
            </div>
          )}

          {/* Birth Year */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground/80">
              Year of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="number"
                min="1920"
                max={new Date().getFullYear()}
                placeholder="e.g., 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Age Grade Display */}
          {ageGradeData && (
            <div className="bg-accent/10 border-2 border-accent/20 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm font-bold text-foreground/70 uppercase tracking-wide">
                  Your Age Grade
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-serif font-bold text-accent">
                  {ageGradeData.name}
                </p>
                <p className="text-sm text-foreground/60">
                  {ageGradeData.role} • {ageGradeData.start}-{ageGradeData.end}
                </p>
              </div>
            </div>
          )}

          {!ageGradeData && birthYear && parseInt(birthYear) < 1800 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-600">
                Birth year {birthYear} is before 1800. Please verify your birth
                year.
              </p>
            </div>
          )}

          {!ageGradeData && birthYear && parseInt(birthYear) > 2030 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-600">
                Birth year {birthYear} is in the future. Please verify your
                birth year.
              </p>
            </div>
          )}

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
              disabled={
                !birthYear ||
                parseInt(birthYear) < 1800 ||
                parseInt(birthYear) > 2030 ||
                (userType === "INDIGENE" && (!village || !kindred)) ||
                (userType === "NDI_OGO" && !village)
              }
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
