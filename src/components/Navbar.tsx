"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Trees, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

          <div className="flex items-center space-x-4">
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-background hover:text-accent transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-primary/95 backdrop-blur-xl z-40 animate-fadeIn overflow-y-auto">
          <div className="flex flex-col space-y-4 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className="text-2xl font-serif font-bold border-b border-border/10 pb-4 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-8 space-y-4">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={toggleMenu}
                    className="block text-xl font-bold"
                  >
                    My Profile ({session.user?.name})
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="w-full bg-secondary py-4 rounded-xl text-lg font-bold shadow-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={toggleMenu}
                    className="block text-xl font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={toggleMenu}
                    className="block w-full bg-accent text-primary text-center py-4 rounded-xl text-lg font-bold shadow-lg"
                  >
                    Join Alorpedia
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
