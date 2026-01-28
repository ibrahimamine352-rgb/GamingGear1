// src/app/layout.tsx
import React from "react";
import "./globals.css";
import "@/components/front/main.css"; // gradient/glass helpers (tokenized)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/components/custom/Provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientProviders from "./ClientProviders";

import { LanguageProvider } from "@/context/language-context";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "PC Gamer & PC Portable Tunisie | Gaming Gear TN",
  description:
    "Boutique spécialisée en PC Gamer, PC portables, composants et périphériques en Tunisie. Configurations sur-mesure, livraison rapide et garantie 1 an.",

  verification: {
    google: "WN6mHKSUzEyafoGqd8VqSidxCAnomSUBXp_8mUguVh4",
  },

  icons: {
    // 🔴 PRIORITÉ GOOGLE & DESKTOP
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",

    // 🍎 iOS
    apple: "/apple-touch-icon.png",
  },

  // 🤖 Android / PWA
  manifest: "/site.webmanifest",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session is available if you need it later
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      {/* data-auth just prevents "unused variable" errors; harmless to keep */}
      <body className={`${inter.className} bg-background text-foreground`}>
      <ClientProviders>
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </ThemeProvider>
  </ClientProviders>
      </body>
    </html>
    
  );
  
}
