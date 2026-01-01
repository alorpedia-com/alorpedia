"use client";

import { useEffect, useState, use } from "react";
import { User, MapPin, Calendar, Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        router.push("/directory");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <Link
        href="/directory"
        className="inline-flex items-center space-x-2 text-primary font-bold mb-8 hover:text-primary/80 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Directory</span>
      </Link>

      <div className="bg-card shadow-lg rounded-2xl overflow-hidden border border-border">
        {/* Header/Cover Placeholder */}
        <div className="h-32 bg-primary/10 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-card rounded-2xl border-4 border-card flex items-center justify-center shadow-md">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">
                {profileData.name}
              </h1>
              <p className="text-secondary font-medium">
                alor.pedia/u/{profileData.id.substring(0, 8)}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-8">
            <div className="flex items-center space-x-3 text-foreground/80">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-foreground/50">
                  Village
                </p>
                <p className="font-serif font-bold">{profileData.village}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-foreground/80">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-foreground/50">
                  Age Grade
                </p>
                <p className="font-serif font-bold">{profileData.ageGrade}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-foreground/80">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-foreground/50">
                  Joined
                </p>
                <p className="font-medium text-sm">
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-serif font-bold text-primary mb-4">
              Biography
            </h3>
            <div className="bg-background/50 border border-border/50 rounded-xl p-6">
              <p className="text-foreground/70 leading-relaxed italic">
                {profileData.bio ||
                  "This member hasn't shared their story yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
