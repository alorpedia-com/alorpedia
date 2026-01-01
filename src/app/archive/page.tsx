"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  User as UserIcon,
  Plus,
  ChevronRight,
  Filter,
} from "lucide-react";
import { VILLAGES } from "@/lib/utils";

export default function ArchivePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [selectedVillage, selectedType]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedVillage !== "All") params.append("village", selectedVillage);
      if (selectedType !== "All") params.append("type", selectedType);

      const response = await fetch(`/api/posts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 sm:mb-12 gap-6">
        <div className="flex-grow">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-2">
            Living Archive
          </h1>
          <p className="text-foreground/70 max-w-2xl text-sm sm:text-base">
            A collective memory of Alor. Explore the stories, biographies, and
            historical records preserved by our community.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow sm:w-64">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Filter className="w-4 h-4 text-foreground/30 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {session && (
            <Link
              href="/archive/create"
              className="flex items-center justify-center space-x-2 bg-primary text-background px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Contribute</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-6 lg:space-y-10 lg:sticky lg:top-32 h-fit">
          <div className="sticky top-20 bg-background/80 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 lg:relative lg:top-0 lg:p-0 lg:bg-transparent z-20">
            {/* Village Filter */}
            <div className="mb-4 lg:mb-8">
              <h3 className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                <Filter className="w-3.5 h-3.5" />
                <span>By Village</span>
              </h3>
              <div className="flex overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-none snap-x">
                <button
                  onClick={() => setSelectedVillage("All")}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left snap-start ${
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
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left snap-start ${
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

            {/* Entry Type Filter */}
            <div>
              <h3 className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                <Filter className="w-3.5 h-3.5" />
                <span>Entry Type</span>
              </h3>
              <div className="flex overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-none snap-x">
                {["All", "ARTICLE", "BIOGRAPHY"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left uppercase snap-start ${
                      selectedType === type
                        ? "bg-accent text-primary shadow-md border border-accent"
                        : "bg-card border border-border text-foreground/60 hover:border-accent/50"
                    }`}
                  >
                    {type === "All" ? "All Types" : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Posts List */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/archive/${post.id}`}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col active:scale-[0.98]"
                  >
                    <div className="h-40 sm:h-48 w-full relative overflow-hidden">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-primary/10" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent/90 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg backdrop-blur-sm shadow-sm">
                          {post.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 flex-grow flex flex-col">
                      <div className="flex items-center space-x-2 text-[10px] text-secondary mb-3 font-bold uppercase tracking-wider">
                        <span className="bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10">
                          {post.author.village}
                        </span>
                        <span>•</span>
                        <span className="text-foreground/40">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-serif font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-foreground/70 text-xs sm:text-sm line-clamp-3 mb-4 flex-grow italic">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[10px] font-bold border border-primary/10">
                            {post.author.name[0]}
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-bold text-foreground/80">
                            {post.author.name}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-16 sm:py-24 text-center border-2 border-dashed border-border rounded-3xl bg-card/30">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-primary mb-2 px-4">
                    The archive awaits your story
                  </h3>
                  <p className="text-foreground/60 mb-8 max-w-sm mx-auto text-sm px-6">
                    No entries have been published yet{" "}
                    {selectedVillage !== "All" && `for ${selectedVillage}`}. Be
                    the first to document our heritage.
                  </p>
                  {session ? (
                    <Link
                      href="/archive/create"
                      className="inline-block bg-primary text-background px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
                    >
                      Create the first entry
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="text-primary font-bold hover:underline"
                    >
                      Log in to contribute
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
