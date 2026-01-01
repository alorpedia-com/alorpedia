import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alorpedia",
  description:
    "A community platform for cultural identity and genealogical archives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextAuthSessionProvider>
          <Navbar />
          <main className="flex-grow pb-20 md:pb-0">{children}</main>
          <MobileNav />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
