"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { compressImage, validateImageFile } from "@/lib/imageUtils";

interface Step3ProfileImageProps {
  initialImage?: string;
  onNext: (data: { profileImage?: string }) => void;
  onBack: () => void;
}

export default function Step3ProfileImage({
  initialImage,
  onNext,
  onBack,
}: Step3ProfileImageProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
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
    } catch (err) {
      setError("Failed to process image");
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

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
      onNext({ profileImage: url });
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    onNext({});
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] px-5 py-8">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Add a profile photo
          </h2>
          <p className="text-sm text-foreground/60">
            Help others recognize you in the community
          </p>
        </div>

        {/* Image Preview/Upload Area */}
        <div className="space-y-6">
          <div className="flex justify-center">
            {preview ? (
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <Image
                    src={preview}
                    alt="Profile preview"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 rounded-full border-4 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center space-y-2 transition-all hover:bg-primary/5"
              >
                <Camera className="w-10 h-10 text-foreground/40" />
                <span className="text-xs font-medium text-foreground/60">
                  Choose Photo
                </span>
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Button (if preview exists) */}
          {preview && !initialImage && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-border rounded-xl text-sm font-medium text-foreground hover:bg-background/50 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Different Photo</span>
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
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
            {preview ? (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-6 py-4 bg-primary text-background rounded-2xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md"
              >
                {uploading ? "Uploading..." : "Continue"}
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-4 bg-primary/10 text-primary rounded-2xl font-semibold hover:bg-primary/20 transition-all active:scale-[0.98]"
              >
                Skip for Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
