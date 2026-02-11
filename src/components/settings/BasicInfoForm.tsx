"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface BasicInfoFormProps {
  initialName: string;
  email: string;
  onUpdate: (name: string) => void;
}

export default function BasicInfoForm({
  initialName,
  email,
  onUpdate,
}: BasicInfoFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasChanges = name !== initialName;

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      onUpdate(name);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Invalidate React Query cache to update navbar immediately
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif font-bold text-primary text-lg mb-1">
          Basic Information
        </h3>
        <p className="text-sm text-foreground/60">
          Update your name and view your email
        </p>
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-3 border-2 border-border rounded-xl bg-muted text-foreground/60 cursor-not-allowed"
          />
          <p className="text-xs text-foreground/40 mt-1">
            Email cannot be changed
          </p>
        </div>
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
