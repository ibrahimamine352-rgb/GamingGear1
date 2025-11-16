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
  title: "Gaming Gear TN",
  description: "Your exclusive destination for high-end PCs and gaming peripherals",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
