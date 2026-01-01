"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, MapPin, Calendar, Shield, Save, X } from "lucide-react";
import { formatAgeGrade } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [activeTab, setActiveTab] = useState<"stories" | "dialogues">(
    "stories"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user) {
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setNewBio(data.bio || "");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    setSavingBio(true);
    try {
      const response = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: newBio }),
      });

      if (response.ok) {
        setProfileData({ ...profileData, bio: newBio });
        setIsEditingBio(false);
      }
    } catch (error) {
      console.error("Failed to update bio:", error);
    } finally {
      setSavingBio(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="bg-card shadow-lg rounded-2xl overflow-hidden border border-border">
        {/* Header/Cover Placeholder */}
        <div className="h-24 sm:h-32 bg-primary/10 relative">
          <div className="absolute -bottom-10 sm:-bottom-12 left-6 sm:left-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-card rounded-2xl border-4 border-card flex items-center justify-center shadow-md">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
          </div>
        </div>

        <div className="pt-14 sm:pt-16 pb-6 sm:pb-8 px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                {user?.name || "Member Name"}
              </h1>
              <p className="text-secondary font-medium text-sm">
                alor.pedia/u/{user?.id?.substring(0, 8)}
              </p>
            </div>
            {!isEditingBio && (
              <button
                onClick={() => setIsEditingBio(true)}
                className="w-full sm:w-auto px-4 py-2 border border-primary text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-all active:scale-95"
              >
                Edit Bio
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-border pt-8">
            <div className="flex items-center space-x-3 text-foreground/80 bg-background/30 p-4 rounded-2xl border border-border/50">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-foreground/50">
                  Village
                </p>
                <p className="font-serif font-bold text-sm sm:text-base leading-tight">
                  {user?.village || "Not set"}
                </p>
                <p className="text-[9px] text-red-600/60 mt-0.5 italic font-medium">
                  Permanent identity
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-foreground/80 bg-background/30 p-4 rounded-2xl border border-border/50">
              <div className="p-2 bg-accent/10 rounded-lg text-accent flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-foreground/50">
                  Age Grade
                </p>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1">
                  <p className="font-serif font-bold text-sm sm:text-base leading-tight">
                    {formatAgeGrade(user?.ageGrade).name || "Calculating..."}
                  </p>
                  <p className="text-[10px] text-foreground/40 font-medium lowercase tracking-normal">
                    {formatAgeGrade(user?.ageGrade).years}
                  </p>
                </div>
                <p className="text-[9px] text-red-600/60 mt-0.5 italic font-medium">
                  By birth year
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-foreground/80 bg-background/30 p-4 rounded-2xl border border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-foreground/50">
                  Joined
                </p>
                <p className="font-medium text-xs sm:text-sm">
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString()
                    : "Member since 2024"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-serif font-bold text-primary mb-4 flex items-center justify-between">
              <span>Biography</span>
              {isEditingBio && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="p-1 px-3 border border-border text-foreground/50 rounded-lg text-xs font-bold hover:bg-foreground/5 transition-all flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpdateBio}
                    disabled={savingBio}
                    className="p-1 px-3 bg-primary text-background rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center space-x-1 shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    <span>{savingBio ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </h3>
            <div className="bg-background/50 border border-border/50 rounded-xl p-6 transition-all">
              {isEditingBio ? (
                <textarea
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[150px] resize-none leading-relaxed transition-all italic text-foreground/80"
                  placeholder="Tell the community about your journey and contributions..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                />
              ) : (
                <p className="text-foreground/70 leading-relaxed italic">
                  {profileData?.bio ||
                    "No biography provided yet. Tell the community about your journey and contributions."}
                </p>
              )}
            </div>
          </div>

          <div className="mt-12">
            <div className="border-b border-border">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === "stories"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  My Stories ({profileData?.posts?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("dialogues")}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === "dialogues"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  My Dialogues ({profileData?.discussions?.length || 0})
                </button>
              </div>
            </div>

            <div className="mt-6">
              {activeTab === "stories" ? (
                <div className="space-y-4">
                  {profileData?.posts?.length > 0 ? (
                    profileData.posts.map((post: any) => (
                      <Link
                        key={post.id}
                        href={`/archive/${post.id}`}
                        className="block p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary/30 transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded">
                              {post.type}
                            </span>
                            <h4 className="mt-1 font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                              {post.title}
                            </h4>
                          </div>
                          <span className="text-xs text-foreground/40">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center py-8 text-foreground/40 italic text-sm">
                      You haven't shared any stories yet.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData?.discussions?.length > 0 ? (
                    profileData.discussions.map((discussion: any) => (
                      <Link
                        key={discussion.id}
                        href={`/dialogue/${discussion.id}`}
                        className="block p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary/30 transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                              {discussion.title}
                            </h4>
                            <p className="text-xs text-foreground/50 mt-1">
                              {discussion.village}
                            </p>
                          </div>
                          <span className="text-xs text-foreground/40">
                            {new Date(
                              discussion.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center py-8 text-foreground/40 italic text-sm">
                      You haven't started any dialogues yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
