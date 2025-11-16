"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/language-context";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/providers/toast-provider";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
    <ToastProvider />
    {children}
  </SessionProvider>
  );
}
