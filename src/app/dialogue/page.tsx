"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Plus,
  Filter,
  User as UserIcon,
  Clock,
} from "lucide-react";
import { VILLAGES } from "@/lib/utils";

export default function DialoguePage() {
  const { data: session } = useSession();
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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Village Dialogue
          </h1>
          <p className="text-foreground/70 max-w-2xl">
            A space for consultation and community dialogue. Connect with your
            neighbors and share your perspective.
          </p>
        </div>
        {session && (
          <Link
            href="/dialogue/create"
            className="flex items-center space-x-2 bg-primary text-background px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-shadow shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Start a Dialogue</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-8">
          <div>
            <h3 className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-widest mb-4">
              <Filter className="w-4 h-4" />
              <span>By Village</span>
            </h3>
            <div className="flex overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-0 scrollbar-none snap-x">
              <button
                onClick={() => setSelectedVillage("All")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-left snap-start ${
                  selectedVillage === "All"
                    ? "bg-primary text-background shadow-md border border-primary"
                    : "bg-card border border-border text-foreground/60 hover:border-primary/50"
                }`}
              >
                All Alor
              </button>
              {VILLAGES.map((village) => (
                <button
                  key={village}
                  onClick={() => setSelectedVillage(village)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-left snap-start ${
                    selectedVillage === village
                      ? "bg-primary text-background shadow-md border border-primary"
                      : "bg-card border border-border text-foreground/60 hover:border-primary/50"
                  }`}
                >
                  {village}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Discussions List */}
        <div className="flex-grow space-y-4 sm:space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : discussions.length > 0 ? (
            discussions.map((discussion) => (
              <Link
                key={discussion.id}
                href={`/dialogue/${discussion.id}`}
                className="block bg-card border border-border rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 group active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/5 rounded-xl flex-shrink-0 flex items-center justify-center text-primary font-serif font-bold text-lg sm:text-xl border border-primary/10">
                      {discussion.author.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-primary group-hover:text-secondary transition-colors leading-tight mb-2">
                        {discussion.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                        <span className="text-secondary">
                          {discussion.author.name}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                          {discussion.author.village}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-accent">
                          {discussion.author.ageGrade}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <div className="flex flex-col items-center bg-background/50 px-2 py-1 rounded-lg border border-border/50">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/20" />
                      <span className="text-[10px] sm:text-xs font-bold text-foreground/40 mt-1">
                        {discussion._count?.replies || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground/70 text-sm mb-6 line-clamp-2 leading-relaxed italic border-l-2 border-primary/10 pl-4">
                  {discussion.content}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      LATEST ACTIVITY:{" "}
                      {new Date(discussion.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-2 text-primary group-hover:text-secondary transition-colors bg-primary/5 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg">
                    <span>JOIN DIALOGUE</span>
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-16 sm:py-24 text-center border-2 border-dashed border-border rounded-3xl bg-card/30">
              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-primary/20 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-serif font-bold text-primary mb-2 px-4">
                Silence is not dialogue
              </h3>
              <p className="text-foreground/60 mb-8 max-w-sm mx-auto text-sm px-6">
                No discussions found for{" "}
                {selectedVillage === "All" ? "Alor" : selectedVillage}. Be the
                one to start the conversation.
              </p>
              {session ? (
                <Link
                  href="/dialogue/create"
                  className="inline-block bg-primary text-background px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  Start a Dialogue
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
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
