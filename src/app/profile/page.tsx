"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { User, MapPin, Calendar, Shield, Save, X, Check } from "lucide-react";
import { formatAgeGrade, getUserInitials } from "@/lib/utils";

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
  const [justSaved, setJustSaved] = useState(false);
  const bioRef = useRef<HTMLTextAreaElement>(null);

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
    if (newBio.length > 500) return;
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
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update bio:", error);
    } finally {
      setSavingBio(false);
    }
  };

  useEffect(() => {
    if (isEditingBio && bioRef.current) {
      bioRef.current.focus();
      // Move cursor to end
      const length = bioRef.current.value.length;
      bioRef.current.setSelectionRange(length, length);
    }
  }, [isEditingBio]);

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const user = session?.user as any;
  const userInitials = getUserInitials(user?.name);

  return (
    <div className="max-w-4xl mx-auto px-native py-native bg-background min-h-screen">
      <div className="card-premium overflow-hidden border-none shadow-2xl">
        {/* Header/Cover Placeholder */}
        <div className="h-32 sm:h-48 bg-primary/10 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-8 sm:left-12">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary text-background rounded-3xl border-8 border-card flex items-center justify-center shadow-2xl overflow-hidden relative">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-4xl font-bold">
                  {userInitials}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-8 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tight">
                {user?.name || "Member Name"}
              </h1>
              {/* User Type Badge */}
              <div className="flex items-center space-x-2">
                {user?.userType === "INDIGENE" ? (
                  <span className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border border-primary/20">
                    <Shield className="w-3 h-3 mr-1.5" />
                    Alor Indigene
                  </span>
                ) : user?.userType === "NDI_OGO" ? (
                  <span className="inline-flex items-center px-3 py-1.5 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border border-secondary/20">
                    <User className="w-3 h-3 mr-1.5" />
                    Ndi Ogo
                  </span>
                ) : null}
              </div>
              <p className="text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider opacity-80">
                alor.pedia/u/{user?.id?.substring(0, 8)}
              </p>
            </div>
            {!isEditingBio && (
              <button
                onClick={() => setIsEditingBio(true)}
                className="w-full sm:w-auto px-6 py-2.5 border-2 border-primary text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all active:scale-95"
              >
                Edit Bio
              </button>
            )}
          </div>

          {/* Cultural Identity Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 border-t border-border/30 pt-12">
            {/* Village or Host Village */}
            <div className="flex items-center space-x-4 bg-primary/5 p-5 rounded-2xl border border-primary/10 shadow-sm">
              <div className="p-3 bg-secondary text-background rounded-xl flex-shrink-0 shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                  {user?.userType === "INDIGENE" ? "Village" : "Host Village"}
                </p>
                <p className="font-serif font-bold text-base text-primary leading-none">
                  {user?.userType === "INDIGENE"
                    ? user?.village || "Not set"
                    : user?.hostVillage || "Not set"}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="w-1 h-1 rounded-full bg-secondary animate-pulse"></span>
                  <p className="text-[9px] text-secondary font-black uppercase tracking-widest">
                    {user?.userType === "INDIGENE" ? "Ebo" : "Community"}
                  </p>
                </div>
              </div>
            </div>

            {/* Kindred - Only for Indigenes */}
            {user?.userType === "INDIGENE" && (
              <div className="flex items-center space-x-4 bg-primary/5 p-5 rounded-2xl border border-primary/10 shadow-sm">
                <div className="p-3 bg-primary text-background rounded-xl flex-shrink-0 shadow-lg">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                    Kindred
                  </p>
                  <p className="font-serif font-bold text-base text-primary leading-none">
                    {user?.kindred || "Not set"}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest">
                      Umunna
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Age Grade */}
            <div className="flex items-center space-x-4 bg-primary/5 p-5 rounded-2xl border border-primary/10 shadow-sm">
              <div className="p-3 bg-accent text-primary rounded-xl flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                  Age Grade
                </p>
                <div className="flex flex-col">
                  <p className="font-serif font-bold text-base text-primary leading-none">
                    {formatAgeGrade(user?.ageGrade).name || "Not set"}
                  </p>
                  {user?.generationalRole && (
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1">
                      {user.generationalRole}
                    </p>
                  )}
                  {formatAgeGrade(user?.ageGrade).years && (
                    <p className="text-[9px] text-foreground/40 font-medium mt-0.5">
                      {formatAgeGrade(user?.ageGrade).years}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center space-x-4 bg-primary/5 p-5 rounded-2xl border border-primary/10 shadow-sm">
              <div className="p-3 bg-primary text-background rounded-xl flex-shrink-0 shadow-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                  Joined
                </p>
                <p className="font-black text-xs uppercase tracking-widest text-primary">
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString()
                    : "Member since 2024"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="font-serif font-bold text-primary mb-6 flex items-center justify-between">
              <span>Biography</span>
              {isEditingBio && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="p-2 px-4 border border-border/50 text-foreground/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 transition-all flex items-center space-x-2"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpdateBio}
                    disabled={savingBio}
                    className="p-2 px-4 bg-primary text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingBio ? "Saving..." : "Save"}</span>
                  </button>
                </div>
              )}
            </h3>
            <div
              className={`bg-primary/5 border border-primary/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 transition-all min-h-[120px] shadow-inner relative group ${
                !isEditingBio ? "cursor-pointer hover:bg-primary/10" : ""
              }`}
              onClick={() => !isEditingBio && setIsEditingBio(true)}
            >
              {justSaved && (
                <div className="absolute top-4 right-8 flex items-center space-x-2 text-green-600 animate-in fade-in slide-in-from-top-2">
                  <Check className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Saved!
                  </span>
                </div>
              )}

              {isEditingBio ? (
                <div className="space-y-4">
                  <textarea
                    ref={bioRef}
                    className="w-full bg-card border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-sm sm:text-base focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none min-h-[180px] sm:min-h-[200px] resize-none leading-relaxed transition-all italic text-foreground/80 font-medium"
                    placeholder="Tell the community about your journey and contributions..."
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center bg-background/50 p-3 rounded-xl sm:bg-transparent sm:p-0">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        newBio.length > 450
                          ? "text-red-500"
                          : "text-foreground/30"
                      }`}
                    >
                      {newBio.length} / 500
                    </p>
                    <div className="md:hidden flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditingBio(false);
                        }}
                        className="p-2 px-4 border border-border/50 text-foreground/40 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateBio();
                        }}
                        disabled={savingBio}
                        className="p-2 px-4 bg-primary text-background rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                      >
                        {savingBio ? "..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <p className="text-foreground/70 text-lg leading-relaxed italic font-medium pr-8">
                    {profileData?.bio ||
                      "No biography provided yet. Tell the community about your journey and contributions."}
                  </p>
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Save className="w-4 h-4 text-primary/30" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16">
            <div className="border-b border-border/30">
              <div className="flex space-x-12">
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${
                    activeTab === "stories"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/20 hover:text-foreground/40"
                  }`}
                >
                  My Stories ({profileData?.posts?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("dialogues")}
                  className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${
                    activeTab === "dialogues"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/20 hover:text-foreground/40"
                  }`}
                >
                  My Dialogues ({profileData?.discussions?.length || 0})
                </button>
              </div>
            </div>

            <div className="mt-10">
              {activeTab === "stories" ? (
                <div className="space-y-6">
                  {profileData?.posts?.length > 0 ? (
                    profileData.posts.map((post: any) => (
                      <Link
                        key={post.id}
                        href={`/archive/${post.id}`}
                        className="block p-6 sm:p-8 card-premium group"
                      >
                        <div className="flex justify-between items-center gap-6">
                          <div className="space-y-3">
                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
                              {post.type}
                            </span>
                            <h3 className="font-serif font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                              {post.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 bg-background/50 px-3 py-1.5 rounded-xl border border-border/30 flex-shrink-0">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-16 text-center border-4 border-dashed border-border/30 rounded-[2rem] bg-primary/5">
                      <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">
                        The archive awaits your story
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {profileData?.discussions?.length > 0 ? (
                    profileData.discussions.map((discussion: any) => (
                      <Link
                        key={discussion.id}
                        href={`/dialogue/${discussion.id}`}
                        className="block p-6 sm:p-8 card-premium group"
                      >
                        <div className="flex justify-between items-center gap-6">
                          <div className="space-y-3">
                            <h3 className="font-serif font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                              {discussion.title}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-60">
                              {discussion.village}
                            </p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 bg-background/50 px-3 py-1.5 rounded-xl border border-border/30 flex-shrink-0">
                            {new Date(
                              discussion.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-16 text-center border-4 border-dashed border-border/30 rounded-[2rem] bg-primary/5">
                      <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">
                        Silence is not dialogue
                      </p>
                    </div>
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
