"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, User as UserIcon, MapPin, Shield } from "lucide-react";
import { VILLAGES, formatAgeGrade } from "@/lib/utils";

export default function DirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("All");
  const [ageGrade, setAgeGrade] = useState("All");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const availableAgeGrades = Array.from(
    new Set(users.map((u) => u.ageGrade).filter(Boolean))
  );

  const filteredUsers = users.filter((user) => {
    const matchesVillage = village === "All" || user.village === village;
    const matchesAgeGrade = ageGrade === "All" || user.ageGrade === ageGrade;
    const matchesSearch =
      search === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.village?.toLowerCase().includes(search.toLowerCase());
    return matchesVillage && matchesAgeGrade && matchesSearch;
  });

  const toggleCard = (userId: string) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary mb-2">
            Global Brain Trust
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-foreground/60">
            Connect with Alor indigenes worldwide
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name or village..."
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 md:gap-4">
          <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-3 md:px-4 py-2 md:py-2.5 shadow-sm hover:border-primary/30 transition-all focus-within:ring-2 focus-within:ring-primary/10">
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
            <select
              className="bg-transparent text-xs md:text-sm font-bold text-primary outline-none cursor-pointer uppercase tracking-wide md:tracking-wider"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            >
              <option value="All">All Villages</option>
              {VILLAGES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-3 md:px-4 py-2 md:py-2.5 shadow-sm hover:border-accent/30 transition-all focus-within:ring-2 focus-within:ring-accent/10">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent shrink-0" />
            <select
              className="bg-transparent text-xs md:text-sm font-bold text-primary outline-none cursor-pointer uppercase tracking-wide md:tracking-wider"
              value={ageGrade}
              onChange={(e) => setAgeGrade(e.target.value)}
            >
              <option value="All">All Age Grades</option>
              {availableAgeGrades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 md:py-32">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredUsers.map((user) => {
            const isExpanded = expandedCard === user.id;
            return (
              <div
                key={user.id}
                onClick={() => toggleCard(user.id)}
                className={`bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${
                  isExpanded ? "ring-2 ring-primary/20" : ""
                }`}
              >
                {/* Collapsed View - Always Visible */}
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary text-background rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-primary truncate">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-secondary shrink-0" />
                      <span className="text-xs text-secondary font-medium truncate">
                        {user.village}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-foreground/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded View - Conditional */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-4 pt-2 border-t border-border/30 space-y-3">
                    {/* ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/50">ID</span>
                      <span className="text-xs font-mono text-foreground/70">
                        {user.id.substring(0, 12)}...
                      </span>
                    </div>

                    {/* Age Grade */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/50">
                        Age-Grade
                      </span>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-semibold text-accent uppercase">
                          {formatAgeGrade(user.ageGrade).name}
                        </span>
                      </div>
                    </div>

                    {/* Years */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/50">Years</span>
                      <span className="text-xs text-foreground/70">
                        {formatAgeGrade(user.ageGrade).years}
                      </span>
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href={`/profile/${user.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full mt-2 px-4 py-2.5 bg-primary text-background rounded-xl text-xs font-semibold text-center hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 md:py-32 text-center border-2 border-dashed border-primary/10 rounded-2xl md:rounded-3xl opacity-50">
              <UserIcon className="w-14 h-14 md:w-20 md:h-20 text-primary/10 mx-auto mb-4 md:mb-6" />
              <p className="text-primary font-serif text-base md:text-lg">
                No community members found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
