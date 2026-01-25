import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import MainContent from "@/components/MainContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Alorpedia",
  description: "Preserving Alor heritage and culture",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Alorpedia",
    description: "A compendium collection of works from great Alor indigenes",
    images: ["/logo.jpg"],
  },
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <MainContent>{children}</MainContent>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
