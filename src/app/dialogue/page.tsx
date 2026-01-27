"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSupabaseSession } from "@/components/SupabaseSessionProvider";
import {
  MessageSquare,
  Plus,
  Filter,
  User as UserIcon,
  Clock,
} from "lucide-react";
import { VILLAGES, formatAgeGrade } from "@/lib/utils";
import StyledDropdown from "@/components/StyledDropdown";

export default function DialoguePage() {
  const { user } = useSupabaseSession();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState<string>("All");

  useEffect(() => {
    fetchDiscussions();
  }, [selectedVillage]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const url =
        selectedVillage === "All"
          ? "/api/discussions"
          : `/api/discussions?village=${selectedVillage}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      }
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-native py-native bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold md:font-bold font-serif text-primary tracking-tight">
            Village Dialogue
          </h1>
          <p className="text-xs md:text-lg text-foreground/70 max-w-2xl leading-relaxed font-normal md:font-medium">
            A sacred space for consultation and community dialogue. Connect with
            kin, share wisdom, and shape our collective future.
          </p>
        </div>
        {user && (
          <Link
            href="/dialogue/create"
            className="flex items-center justify-center space-x-2 bg-primary text-background px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Start a Dialogue</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 space-y-10 lg:sticky lg:top-32 h-fit">
          <div className="sticky top-20 bg-background/90 backdrop-blur-xl pt-2 pb-6 -mx-4 px-4 lg:relative lg:top-0 lg:p-0 lg:bg-transparent z-20 border-b border-border/10 lg:border-none">
            <h4 className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wide mb-3 opacity-60">
              <Filter className="w-4 h-4" />
              <span>By Village</span>
            </h4>
            <StyledDropdown
              label="Filter by village"
              value={selectedVillage}
              onChange={setSelectedVillage}
              options={[
                { value: "All", label: "All Alor" },
                ...VILLAGES.map((v) => ({ value: v, label: v })),
              ]}
            />
          </div>
        </aside>

        {/* Discussions List */}
        <div className="flex-grow space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : discussions.length > 0 ? (
            discussions.map((discussion) => (
              <Link
                key={discussion.id}
                href={`/dialogue/${discussion.id}`}
                className="block card-premium p-6 sm:p-10 group"
              >
                <div className="flex items-start justify-between mb-6 gap-6">
                  <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary text-background rounded-2xl flex-shrink-0 flex items-center justify-center font-serif font-bold text-xl sm:text-2xl border border-primary/10 shadow-lg group-hover:scale-110 transition-transform">
                      {discussion.author.name[0]}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base md:text-lg lg:text-xl font-semibold md:font-bold text-primary group-hover:text-secondary transition-colors leading-tight line-clamp-2">
                        {discussion.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase font-black tracking-[0.15em]">
                        <span className="text-secondary">
                          {discussion.author.name}
                        </span>
                        <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 font-bold">
                          {discussion.author.village}
                        </span>
                        <div className="flex items-center space-x-2 text-accent bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/10">
                          <span className="font-bold tracking-widest">
                            {formatAgeGrade(discussion.author.ageGrade).name}
                          </span>
                          <span className="opacity-60 font-medium lowercase tracking-normal italic">
                            {formatAgeGrade(discussion.author.ageGrade).years}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center bg-background/50 px-3 py-2 rounded-2xl border border-border/50 shadow-sm group-hover:border-secondary transition-colors">
                      <MessageSquare className="w-5 h-5 text-foreground/20 group-hover:text-secondary transition-colors" />
                      <span className="text-xs font-black text-foreground/40 mt-1">
                        {discussion._count?.replies || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground/60 text-base mb-8 line-clamp-2 leading-relaxed font-medium italic border-l-4 border-primary/5 pl-6">
                  {discussion.content}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-border/30 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 opacity-50" />
                    <span className="opacity-60">
                      LATEST ACTIVITY:{" "}
                      <span className="text-foreground/50 tracking-normal">
                        {new Date(discussion.updatedAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-3 text-primary group-hover:text-secondary transition-all bg-primary/5 sm:bg-transparent px-5 py-3 sm:p-0 rounded-2xl">
                    <span className="font-black tracking-[0.2em]">
                      JOIN DIALOGUE
                    </span>
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-24 sm:py-32 text-center border-4 border-dashed border-border/30 rounded-[3rem] bg-card/20 backdrop-blur-sm">
              <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse text-primary/20">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold md:font-bold text-primary mb-4">
                Silence is not dialogue
              </h2>
              <p className="text-xs md:text-base text-foreground/60 mb-12 max-w-sm mx-auto leading-relaxed px-6 font-normal md:font-medium">
                No discussions found for{" "}
                {selectedVillage === "All" ? "Alor" : selectedVillage}. Be the
                one to start the conversation.
              </p>
              {user ? (
                <Link
                  href="/dialogue/create"
                  className="inline-block bg-primary text-background px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  Start a Dialogue
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-primary font-black uppercase tracking-widest hover:text-secondary transition-colors text-sm"
                >
                  Log in to participate
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
