"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { compressImage, validateImageFile } from "@/lib/imageUtils";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  onImageUpdate: (url: string) => void;
  userName?: string;
}

export default function ProfileImageUpload({
  currentImage,
  onImageUpdate,
  userName,
}: ProfileImageUploadProps) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    try {
      // Compress image
      const compressedBlob = await compressImage(file, 800, 800, 0.85);

      // Create preview
      const previewUrl = URL.createObjectURL(compressedBlob);
      setPreview(previewUrl);
      setHasChanges(true);
    } catch (err) {
      setError("Failed to process image");
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!preview || !hasChanges) return;

    setUploading(true);
    setError("");

    try {
      // Convert preview to blob
      const response = await fetch(preview);
      const blob = await response.blob();

      // Upload to server
      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");

      const uploadResponse = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await uploadResponse.json();

      // Update profile with new image URL
      const updateResponse = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: url }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      onImageUpdate(url);
      setPreview(url);
      setHasChanges(false);

      // Invalidate React Query cache to update navbar immediately
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setHasChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getUserInitials = () => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Current Image Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-lg bg-primary text-background flex items-center justify-center">
            {preview ? (
              <Image
                src={preview}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl font-bold">{getUserInitials()}</span>
            )}
          </div>
          {preview && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-serif font-bold text-primary text-lg">
              Profile Picture
            </h3>
            <p className="text-sm text-foreground/60">
              Upload a photo to personalize your profile
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border-2 border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {preview ? "Change Photo" : "Upload Photo"}
            </button>

            {hasChanges && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-primary text-background rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Save Photo"
                )}
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
        <p className="text-xs text-foreground/60">
          Recommended: Square image, at least 400x400 pixels. Max file size: 5MB
        </p>
      </div>
    </div>
  );
}
