"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  MessageSquare,
  Users,
  User,
  TreeDeciduous,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Archive",
    href: "/archive",
    icon: Archive,
  },
  {
    label: "Dialogue",
    href: "/dialogue",
    icon: MessageSquare,
  },
  {
    label: "Osisi Ndụ",
    href: "/tree",
    icon: TreeDeciduous,
  },
  {
    label: "Directory",
    href: "/directory",
    icon: Users,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav on auth pages
  const authPages = ["/login", "/register", "/onboarding"];
  const isAuthPage = authPages.some((page) => pathname?.startsWith(page));

  if (isAuthPage) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-all active:scale-90",
                isActive ? "text-primary" : "text-foreground/40"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-colors",
                  isActive ? "bg-primary/10" : ""
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  )}
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
