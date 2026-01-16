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
  Calendar,
} from "lucide-react";
import { VILLAGES } from "@/lib/utils";
import StyledDropdown from "@/components/StyledDropdown";
import { useDebounce } from "@/hooks/useDebounce";

export default function ArchivePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      debouncedSearch === "" ||
      post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.author.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    const postDate = new Date(post.createdAt);
    const matchesDateFrom = !dateFrom || postDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || postDate <= new Date(dateTo + "T23:59:59");

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="max-w-7xl mx-auto px-native py-native bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 sm:mb-16 gap-8">
        <div className="flex-grow space-y-4">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold md:font-bold font-serif text-primary tracking-tight">
            Living Archive
          </h1>
          <p className="text-xs md:text-lg text-foreground/70 max-w-2xl leading-relaxed font-normal md:font-medium">
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
        <aside className="lg:w-64 xl:w-72 flex-shrink-0 space-y-10 lg:sticky lg:top-32 lg:self-start">
          <div className="sticky top-20 bg-background/90 backdrop-blur-xl pt-2 pb-6 -mx-4 px-4 lg:relative lg:top-0 lg:p-0 lg:bg-transparent z-20 border-b border-border/10 lg:border-none">
            {/* Village Filter */}
            <div className="mb-6">
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

            {/* Entry Type Filter */}
            <div>
              <h4 className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wide mb-3 opacity-60">
                <Filter className="w-4 h-4" />
                <span>Entry Type</span>
              </h4>
              <StyledDropdown
                label="Filter by entry type"
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  { value: "All", label: "All Types" },
                  { value: "ARTICLE", label: "Article" },
                  { value: "BIOGRAPHY", label: "Biography" },
                ]}
              />
            </div>

            {/* Date Range Filter */}
            <div className="mt-6">
              <h4 className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wide mb-3 opacity-60">
                <Calendar className="w-4 h-4" />
                <span>Date Range</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-foreground/60 mb-1 block">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-foreground/60 mb-1 block">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="text-xs text-secondary hover:text-secondary/80 font-bold"
                  >
                    Clear dates
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Posts List */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-screen bg-background text-primary">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                      <h3 className="text-base md:text-lg lg:text-xl font-semibold md:font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                        {" "}
                        {post.title}
                      </h3>
                      <p className="text-xs md:text-sm text-foreground/60 line-clamp-3 mb-6 flex-grow leading-relaxed font-normal md:font-medium italic">
                        {" "}
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
