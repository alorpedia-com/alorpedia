"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getUserInitials } from "@/lib/utils";
import NotificationBell from "@/components/NotificationBell";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

export default function Navbar() {
  const { user, signOut: supabaseSignOut } = useSupabaseUser();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide navbar on auth pages
  const authPages = ["/login", "/register", "/onboarding"];
  const isAuthPage = authPages.some((page) => pathname?.startsWith(page));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  if (isAuthPage) {
    return null;
  }

  const navLinks = [
    { href: "/archive", label: "Archive" },
    { href: "/dialogue", label: "Dialogue" },
    { href: "/directory", label: "Directory" },
    { href: "/messages", label: "Messages" },
    { href: "/tree", label: "Osisi Ndụ" },
  ];

  const handleSignOut = async () => {
    setShowDropdown(false);
    await supabaseSignOut();
  };

  const userInitials = getUserInitials(user?.user_metadata?.name);

  return (
    <nav className="bg-primary text-background border-b border-border/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:h-20 h-14 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 active:scale-95 transition-transform"
            >
              <div className="relative md:w-10 md:h-10 w-7 h-7 overflow-hidden rounded-full">
                <Image
                  src="/logo.jpg"
                  alt="Alorpedia Logo"
                  fill
                  sizes="(max-width: 768px) 28px, 40px"
                  className="object-cover"
                />
              </div>
              <span className="md:text-2xl text-lg font-serif font-bold tracking-tight">
                Alorpedia
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user && !isAuthPage && <NotificationBell />}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 hover:bg-background/10 px-3 py-2 rounded-xl transition-all active:scale-95"
                >
                  <div className="w-9 h-9 bg-accent text-primary rounded-full flex items-center justify-center font-bold text-sm shadow-md overflow-hidden relative">
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.name || "User"}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <span className="text-sm font-bold">
                    {user.user_metadata?.name || user.email || "Profile"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/50"
                    >
                      <UserCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        View Profile
                      </span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-semibold text-red-500">
                        Sign Out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold uppercase tracking-widest hover:text-accent"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-accent text-primary px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-accent/90 transition-all active:scale-95 shadow-md"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth/Profile Icon */}
          <div className="md:hidden">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 bg-accent text-primary rounded-full flex items-center justify-center font-bold text-sm shadow-md active:scale-90 transition-transform overflow-hidden relative"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.name || "User"}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    userInitials
                  )}
                </button>

                {/* Mobile Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/50"
                    >
                      <UserCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Profile
                      </span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold text-red-500">
                        Sign Out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/30 px-3 py-2 rounded-lg active:scale-95 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
