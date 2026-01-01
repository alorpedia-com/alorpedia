"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, User as UserIcon, MapPin, Shield } from "lucide-react";
import { VILLAGES } from "@/lib/utils";

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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">
          Global Brain Trust
        </h1>
        <p className="text-foreground/70 max-w-2xl">
          Connect with the collective intelligence of Alor. Search for
          professionals, elders, and peers across our global community.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Search and Filters */}
        <div className="flex-grow">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-foreground/30 text-lg shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-card border border-border rounded-xl px-4 py-2">
            <Filter className="w-4 h-4 text-primary" />
            <select
              className="bg-transparent text-sm font-bold text-primary outline-none cursor-pointer"
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

          <div className="flex items-center space-x-2 bg-card border border-border rounded-xl px-4 py-2">
            <Shield className="w-4 h-4 text-accent" />
            <select
              className="bg-transparent text-sm font-bold text-primary outline-none cursor-pointer"
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-1">
                {user.name}
              </h3>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mb-4">
                Member ID: {user.id.substring(0, 8)}
              </p>

              <div className="space-y-2 w-full pt-4 border-t border-border/50">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="font-bold text-foreground/70">
                    {user.village}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="font-bold text-foreground/70">
                    {user.ageGrade}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <Link
                  href={`/profile/${user.id}`}
                  className="block w-full py-2 bg-primary/5 text-primary rounded-lg text-sm font-bold hover:bg-primary/10 transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl opacity-50">
              <UserIcon className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <p className="text-primary font-serif italic">
                No community members found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
