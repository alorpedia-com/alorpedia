"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, User, MapPin, Image as ImageIcon } from "lucide-react";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import ProfileImageUpload from "@/components/settings/ProfileImageUpload";
import BasicInfoForm from "@/components/settings/BasicInfoForm";
import CulturalIdentityForm from "@/components/settings/CulturalIdentityForm";

export default function SettingsPage() {
  const { user, loading: authLoading } = useSupabaseUser();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    } else if (user) {
      fetchProfile();
    }
  }, [authLoading, user, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = (url: string) => {
    setProfileData({ ...profileData, profileImage: url });
  };

  const handleNameUpdate = (name: string) => {
    setProfileData({ ...profileData, name });
  };

  const handleCulturalIdentityUpdate = (data: any) => {
    setProfileData({ ...profileData, ...data });
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-native py-native">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
            Settings
          </h1>
          <p className="text-foreground/60 mt-2">
            Manage your profile and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Profile Picture Section */}
          <div className="card-premium p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-serif font-bold text-primary">
                Profile Picture
              </h2>
            </div>
            <ProfileImageUpload
              currentImage={profileData?.profileImage}
              onImageUpdate={handleImageUpdate}
              userName={profileData?.name}
            />
          </div>

          {/* Basic Info Section */}
          <div className="card-premium p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-serif font-bold text-primary">
                Basic Information
              </h2>
            </div>
            <BasicInfoForm
              initialName={profileData?.name || ""}
              email={profileData?.email || ""}
              onUpdate={handleNameUpdate}
            />
          </div>

          {/* Cultural Identity Section */}
          <div className="card-premium p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-serif font-bold text-primary">
                Cultural Identity
              </h2>
            </div>
            <CulturalIdentityForm
              initialData={{
                userType: profileData?.userType,
                village: profileData?.village,
                kindred: profileData?.kindred,
                hostVillage: profileData?.hostVillage,
                birthYear: profileData?.birthYear,
                ageGrade: profileData?.ageGrade,
                generationalRole: profileData?.generationalRole,
              }}
              onUpdate={handleCulturalIdentityUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
