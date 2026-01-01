"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Trees, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  const navLinks = [
    { href: "/archive", label: "Archive" },
    { href: "/dialogue", label: "Dialogue" },
    { href: "/directory", label: "Directory" },
    { href: "/tree", label: "Osisi Ndụ" },
  ];

  return (
    <nav className="bg-primary text-background border-b border-border/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 active:scale-95 transition-transform"
            >
              <Trees className="w-10 h-10 text-accent" />
              <span className="text-2xl font-serif font-bold tracking-tight">
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

          {/* Mobile Auth/Profile Icon - Keep it simple as a native app header */}
          <div className="md:hidden">
            {session ? (
              <Link
                href="/profile"
                className="w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center font-bold shadow-sm active:scale-90 transition-transform"
              >
                {session.user?.name?.[0] || <User className="w-5 h-5" />}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest text-accent border border-accent/30 px-3 py-1.5 rounded-lg active:scale-95"
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
