"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Filter, Shield, User as UserIcon, MapPin } from "lucide-react";
import {
  VILLAGES,
  KINDREDS,
  getKindredsForVillage,
  formatAgeGrade,
} from "@/lib/utils";
import StyledDropdown from "@/components/StyledDropdown";
import Image from "next/image";
import Link from "next/link";

export default function DirectoryPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("All");
  const [ageGrade, setAgeGrade] = useState("All");
  const [userType, setUserType] = useState("All");
  const [kindred, setKindred] = useState("All");
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
    new Set(users.map((u) => u.ageGrade).filter(Boolean)),
  );

  const filteredUsers = users.filter((user) => {
    const matchesVillage =
      village === "All" ||
      user.village === village ||
      user.hostVillage === village;
    const matchesAgeGrade = ageGrade === "All" || user.ageGrade === ageGrade;
    const matchesUserType = userType === "All" || user.userType === userType;
    const matchesKindred = kindred === "All" || user.kindred === kindred;
    const matchesSearch =
      search === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.village?.toLowerCase().includes(search.toLowerCase()) ||
      user.hostVillage?.toLowerCase().includes(search.toLowerCase());
    return (
      matchesVillage &&
      matchesAgeGrade &&
      matchesUserType &&
      matchesKindred &&
      matchesSearch
    );
  });

  // Get kindreds for selected village
  const availableKindreds =
    village !== "All" ? getKindredsForVillage(village) : [];

  const toggleCard = (userId: string) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold md:font-bold font-serif text-primary mb-2">
            {" "}
            Global Brain Trust
          </h1>
          <p className="text-xs md:text-base text-foreground/60">
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
        <div className="flex flex-wrap gap-3">
          <StyledDropdown
            label="User Type"
            value={userType}
            onChange={(value) => {
              setUserType(value);
              // Reset kindred when switching user types
              if (value === "NDI_OGO") {
                setKindred("All");
              }
            }}
            options={[
              { value: "All", label: "All Types" },
              { value: "INDIGENE", label: "Indigenes" },
              { value: "NDI_OGO", label: "Ndi Ogo" },
            ]}
            icon={<UserIcon className="w-4 h-4 text-secondary" />}
          />

          <StyledDropdown
            label="Village"
            value={village}
            onChange={(value) => {
              setVillage(value);
              // Reset kindred when village changes
              setKindred("All");
            }}
            options={[
              { value: "All", label: "All Villages" },
              ...VILLAGES.map((v) => ({ value: v, label: v })),
            ]}
            icon={<MapPin className="w-4 h-4 text-primary" />}
          />

          {/* Kindred Filter - Only show for Indigenes */}
          {(userType === "All" || userType === "INDIGENE") && (
            <StyledDropdown
              label="Kindred"
              value={kindred}
              onChange={setKindred}
              options={[
                { value: "All", label: "All Kindreds" },
                ...availableKindreds.map((k) => ({ value: k, label: k })),
              ]}
              icon={<UserIcon className="w-4 h-4 text-accent" />}
              disabled={village === "All" || availableKindreds.length === 0}
              disabledMessage="Select village first"
            />
          )}

          <StyledDropdown
            label="Age Grade"
            value={ageGrade}
            onChange={setAgeGrade}
            options={[
              { value: "All", label: "All Age Grades" },
              ...availableAgeGrades.map((g) => ({ value: g, label: g })),
            ]}
            icon={<Shield className="w-4 h-4 text-accent" />}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
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
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary text-background rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden relative">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name}
                        fill
                        sizes="(max-width: 768px) 48px, 56px"
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 md:w-7 md:h-7" />
                    )}
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

                    {/* Send Message Button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const response = await fetch("/api/conversations", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ recipientId: user.id }),
                          });
                          if (response.ok) {
                            router.push("/messages");
                          }
                        } catch (error) {
                          console.error("Error creating conversation:", error);
                        }
                      }}
                      className="w-full mt-2 px-4 py-2.5 bg-secondary text-background rounded-xl text-xs font-semibold text-center hover:bg-secondary/90 transition-all active:scale-95 shadow-sm"
                    >
                      Send Message
                    </button>
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
