"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Hide navbar on auth pages
  const authPages = ["/login", "/register", "/onboarding"];
  const isAuthPage = authPages.some((page) => pathname?.startsWith(page));

  if (isAuthPage) {
    return null;
  }

  const navLinks = [
    { href: "/archive", label: "Archive" },
    { href: "/dialogue", label: "Dialogue" },
    { href: "/directory", label: "Directory" },
    { href: "/tree", label: "Osisi Ndụ" },
  ];

  return (
    <nav className="bg-primary text-background border-b border-border/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:h-20 h-14 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 active:scale-95 transition-transform"
            >
              <div className="relative md:w-10 md:h-10 w-7 h-7">
                <Image
                  src="/logo.jpg"
                  alt="Alorpedia Logo"
                  fill
                  className="object-contain"
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
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-bold uppercase tracking-widest hover:text-accent"
                >
                  {session.user?.name || "Profile"}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-secondary px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-secondary/90 transition-all active:scale-95 shadow-md"
                >
                  Sign Out
                </button>
              </>
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

          {/* Mobile Auth/Profile Icon - Native app header */}
          <div className="md:hidden">
            {session ? (
              <Link
                href="/profile"
                className="w-9 h-9 bg-accent text-primary rounded-full flex items-center justify-center font-bold text-sm shadow-md active:scale-90 transition-transform"
              >
                {session.user?.name?.[0] || <User className="w-4 h-4" />}
              </Link>
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
