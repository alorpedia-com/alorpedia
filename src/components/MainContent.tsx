"use client";

import { usePathname } from "next/navigation";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const authPages = ["/login", "/register", "/onboarding"];
  const isAuthPage = authPages.some((page) => pathname?.startsWith(page));

  return (
    <main className={isAuthPage ? "flex-grow" : "flex-grow pb-20 md:pb-0"}>
      {children}
    </main>
  );
}
