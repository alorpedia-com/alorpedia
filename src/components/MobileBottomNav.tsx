"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  MessageSquare,
  Users,
  MessageCircle,
  GitBranch,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide on auth pages and landing page only if not logged in
  const authPages = ["/login", "/register", "/onboarding"];
  const shouldHide =
    authPages.some((page) => pathname === page) ||
    (pathname === "/" && !session);

  if (shouldHide || !session) {
    return null;
  }

  const navItems = [
    {
      href: "/archive",
      label: "Archive",
      icon: BookOpen,
    },
    {
      href: "/dialogue",
      label: "Dialogue",
      icon: MessageSquare,
    },
    {
      href: "/directory",
      label: "Directory",
      icon: Users,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
    },
    {
      href: "/tree",
      label: "Tree",
      icon: GitBranch,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 ${
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-foreground/40 hover:text-foreground/60"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
              />
              <span
                className={`text-[9px] font-black uppercase tracking-wider ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
