"use client";

import { useState } from "react";
import { Save, Loader2, MapPin, Users, Calendar, Shield } from "lucide-react";
import {
  VILLAGES,
  calculateAgeGrade,
  getKindredsForVillage,
} from "@/lib/utils";
import StyledDropdown from "@/components/StyledDropdown";
import { useQueryClient } from "@tanstack/react-query";

interface CulturalIdentityFormProps {
  initialData: {
    userType?: "INDIGENE" | "NDI_OGO";
    village?: string;
    kindred?: string;
    hostVillage?: string;
    birthYear?: number;
    ageGrade?: string;
    generationalRole?: string;
  };
  onUpdate: (data: any) => void;
}

export default function CulturalIdentityForm({
  initialData,
  onUpdate,
}: CulturalIdentityFormProps) {
  const queryClient = useQueryClient();
  const [userType, setUserType] = useState<"INDIGENE" | "NDI_OGO">(
    initialData.userType || "INDIGENE",
  );
  const [village, setVillage] = useState(
    initialData.village || initialData.hostVillage || VILLAGES[0],
  );
  const [kindred, setKindred] = useState(initialData.kindred || "");
  const [birthYear, setBirthYear] = useState(
    initialData.birthYear?.toString() || "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate age grade from birth year
  const ageGradeData = birthYear
    ? calculateAgeGrade(parseInt(birthYear))
    : null;

  const hasChanges =
    userType !== initialData.userType ||
    (userType === "INDIGENE"
      ? village !== initialData.village || kindred !== initialData.kindred
      : village !== initialData.hostVillage) ||
    birthYear !== initialData.birthYear?.toString();

  const handleVillageChange = (newVillage: string) => {
    setVillage(newVillage);
    if (userType === "INDIGENE") {
      setKindred(""); // Reset kindred selection
    }
  };

  const handleSave = async () => {
    if (!birthYear) {
      setError("Birth year is required");
      return;
    }

    const year = parseInt(birthYear);
    if (year < 1800 || year > 2030) {
      setError("Please enter a valid birth year");
      return;
    }

    if (userType === "INDIGENE" && (!village || !kindred)) {
      setError("Village and kindred are required for indigenes");
      return;
    }

    if (userType === "NDI_OGO" && !village) {
      setError("Host village is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const updateData: any = {
        userType,
        birthYear: year,
        ageGrade: ageGradeData?.name,
        generationalRole: ageGradeData?.role,
      };

      if (userType === "INDIGENE") {
        updateData.village = village;
        updateData.kindred = kindred;
        updateData.hostVillage = null;
      } else {
        updateData.hostVillage = village;
        updateData.village = null;
        updateData.kindred = null;
      }

      const response = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      onUpdate(updateData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Invalidate React Query cache to update navbar and profile immediately
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const availableKindreds = getKindredsForVillage(village);
  const villageOptions = VILLAGES.map((v) => ({ value: v, label: v }));
  const kindredOptions = availableKindreds.map((k) => ({ value: k, label: k }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif font-bold text-primary text-lg mb-1">
          Cultural Identity
        </h3>
        <p className="text-sm text-foreground/60">
          Update your connection to Alor community
        </p>
      </div>

      <div className="space-y-4">
        {/* User Type Switcher */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
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
          <label className="block text-sm font-semibold text-foreground">
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
            <label className="block text-sm font-semibold text-foreground">
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
          <label className="block text-sm font-semibold text-foreground">
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
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Age Grade Display */}
        {ageGradeData && (
          <div className="bg-accent/10 border-2 border-accent/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold text-foreground/70 uppercase tracking-wide">
                Your Age Grade
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-serif font-bold text-accent">
                {ageGradeData.name}
              </p>
              <p className="text-sm text-foreground/60">
                {ageGradeData.role} • {ageGradeData.start}-{ageGradeData.end}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
          Changes saved successfully!
        </div>
      )}

      {/* Save Button */}
      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-background rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      )}
    </div>
  );
}
