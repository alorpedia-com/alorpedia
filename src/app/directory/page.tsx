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

  const [availableAgeGrades, setAvailableAgeGrades] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [village, ageGrade]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/users?search=${search}`;
      if (village !== "All") url += `&village=${village}`;
      if (ageGrade !== "All") url += `&ageGrade=${ageGrade}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        if (data.allAgeGrades) {
          setAvailableAgeGrades(data.allAgeGrades);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto px-native py-native bg-background min-h-screen">
      <div className="mb-12 sm:mb-20">
        <h1 className="text-primary mb-4 leading-tight tracking-tight">
          Global Brain Trust
        </h1>
        <p className="text-foreground/70 max-w-2xl text-lg sm:text-xl font-medium italic border-l-4 border-primary/20 pl-6 py-2">
          Connect with the collective intelligence of Alor. Search for
          professionals, elders, and peers across our global community.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* Search and Filters */}
        <div className="flex-grow">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-foreground/20 text-lg shadow-sm font-medium italic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-3 shadow-sm hover:border-primary/30 transition-all focus-within:ring-4 focus-within:ring-primary/5">
            <Filter className="w-4 h-4 text-primary" />
            <select
              className="bg-transparent text-sm font-black text-primary outline-none cursor-pointer uppercase tracking-widest"
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

          <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-3 shadow-sm hover:border-accent/30 transition-all focus-within:ring-4 focus-within:ring-accent/5">
            <Shield className="w-4 h-4 text-accent" />
            <select
              className="bg-transparent text-sm font-black text-primary outline-none cursor-pointer uppercase tracking-widest"
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
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="card-premium p-8 flex flex-col items-center text-center group active:scale-[0.98] border-none shadow-md"
            >
              <div className="w-24 h-24 bg-primary text-background rounded-[2rem] flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out border border-primary/10">
                <UserIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-2">
                {user.name}
              </h3>
              <p className="text-[10px] text-foreground/20 font-black uppercase tracking-[0.2em] mb-6 border border-border/30 px-3 py-1 rounded-lg">
                Member ID: {user.id.substring(0, 8)}
              </p>

              <div className="space-y-4 w-full pt-6 border-t border-border/30 mb-8">
                <div className="flex items-center justify-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-black text-secondary uppercase tracking-widest text-xs">
                    {user.village}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-black text-accent uppercase tracking-widest text-[10px]">
                      {formatAgeGrade(user.ageGrade).name}
                    </span>
                    <span className="text-[9px] text-foreground/30 font-medium lowercase tracking-normal italic">
                      {formatAgeGrade(user.ageGrade).years}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto w-full">
                <Link
                  href={`/profile/${user.id}`}
                  className="block w-full py-4 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="col-span-full py-32 text-center border-4 border-dashed border-primary/10 rounded-[3rem] opacity-50">
              <UserIcon className="w-20 h-20 text-primary/10 mx-auto mb-6" />
              <p className="text-primary font-serif italic text-xl">
                No community members found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
