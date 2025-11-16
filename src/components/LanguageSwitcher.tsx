"use client";

import { useLanguage } from "@/context/language-context";

const labels = {
  en: "EN",
  fr: "FR",
  ar: "AR",
} as const;

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm">
      {(["en", "fr", "ar"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={
            "px-2 py-1 rounded-md border transition " +
            (lang === code
              ? "border-[hsl(var(--accent))] font-semibold"
              : "border-transparent opacity-70 hover:opacity-100")
          }
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
