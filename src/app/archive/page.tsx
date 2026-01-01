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
    <div className="max-w-7xl mx-auto px-native py-native bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 sm:mb-16 gap-8">
        <div className="flex-grow space-y-4">
          <h1 className="font-serif font-bold text-primary tracking-tight">
            Living Archive
          </h1>
          <p className="text-foreground/70 max-w-2xl text-lg leading-relaxed">
            A collective memory of Alor. Explore stories, biographies, and
            historical records preserved by our community.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow sm:w-72">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-full bg-card border border-border/50 rounded-2xl px-5 py-3 pl-12 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Filter className="w-5 h-5 text-foreground/20 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {session && (
            <Link
              href="/archive/create"
              className="flex items-center justify-center space-x-2 bg-primary text-background px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95 text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Contribute</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 space-y-10 lg:sticky lg:top-32 h-fit">
          <div className="sticky top-20 bg-background/90 backdrop-blur-xl pt-2 pb-6 -mx-4 px-4 lg:relative lg:top-0 lg:p-0 lg:bg-transparent z-20 border-b border-border/10 lg:border-none">
            {/* Village Filter */}
            <div className="mb-8 lg:mb-12">
              <h4 className="flex items-center space-x-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-5 opacity-60">
                <Filter className="w-4 h-4" />
                <span>By Village</span>
              </h4>
              <div className="flex overflow-x-auto lg:flex-col gap-3 pb-2 lg:pb-0 scrollbar-none snap-x">
                <button
                  onClick={() => setSelectedVillage("All")}
                  className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left snap-start border ${
                    selectedVillage === "All"
                      ? "bg-primary text-background shadow-xl border-primary scale-105"
                      : "bg-card border-border/50 text-foreground/40 hover:border-primary/30"
                  }`}
                >
                  All Alor
                </button>
                {VILLAGES.map((village) => (
                  <button
                    key={village}
                    onClick={() => setSelectedVillage(village)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left snap-start border ${
                      selectedVillage === village
                        ? "bg-primary text-background shadow-xl border-primary scale-105"
                        : "bg-card border-border/50 text-foreground/40 hover:border-primary/30"
                    }`}
                  >
                    {village}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Type Filter */}
            <div>
              <h4 className="flex items-center space-x-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-5 opacity-60">
                <Filter className="w-4 h-4" />
                <span>Entry Type</span>
              </h4>
              <div className="flex overflow-x-auto lg:flex-col gap-3 pb-2 lg:pb-0 scrollbar-none snap-x">
                {["All", "ARTICLE", "BIOGRAPHY"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left snap-start border ${
                      selectedType === type
                        ? "bg-accent text-primary shadow-xl border-accent scale-105"
                        : "bg-card border-border/50 text-foreground/40 hover:border-accent/30"
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
            <div className="flex justify-center items-center py-32">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/archive/${post.id}`}
                    className="group card-premium overflow-hidden flex flex-col"
                  >
                    <div className="h-56 sm:h-64 w-full relative overflow-hidden">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary/10 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                        <span className="bg-accent text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                          {post.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 flex-grow flex flex-col">
                      <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.15em] mb-4">
                        <span className="text-secondary bg-secondary/5 px-2.5 py-1 rounded-lg border border-secondary/10">
                          {post.author.village}
                        </span>
                        <span className="text-foreground/20 italic font-medium tracking-normal">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-foreground/60 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-medium italic">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-border/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary text-background rounded-xl flex items-center justify-center font-bold shadow-md border border-primary/10 group-hover:scale-110 transition-transform">
                            {post.author.name[0]}
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-foreground/80">
                            {post.author.name}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors">
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-24 sm:py-32 text-center border-4 border-dashed border-border/30 rounded-[3rem] bg-card/20 backdrop-blur-sm">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <BookOpen className="w-12 h-12 text-primary/20" />
                  </div>
                  <h2 className="text-primary mb-4">
                    The archive awaits your story
                  </h2>
                  <p className="text-foreground/60 mb-12 max-w-sm mx-auto text-lg leading-relaxed px-6">
                    No entries have been published yet{" "}
                    {selectedVillage !== "All" && `for ${selectedVillage}`}. Be
                    the first to document our heritage.
                  </p>
                  {session ? (
                    <Link
                      href="/archive/create"
                      className="inline-block bg-primary text-background px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Create first entry
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="text-primary font-black uppercase tracking-widest hover:text-secondary transition-colors"
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
