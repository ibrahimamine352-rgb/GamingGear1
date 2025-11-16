import * as React from "react";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";
export function InlineDetails({ text }: { text?: string }) {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full rounded-md border px-3 py-1.5 text-sm text-white transition-colors focus:outline-none"
        // keep the label white; lock ONLY the border to your orange
        style={{ borderColor: "var(--brand-orange, #FF7A1A)" }}
      >
       {ui.builderBtndetails}
      </button>

      {open && (
        <div
          className="
            mt-2 rounded-md border border-border bg-card/90 p-3 text-sm
            whitespace-pre-wrap break-words max-h-40 overflow-auto
          "
        >
          <div className="font-semibold mb-1">Description :</div>
          <p className="text-foreground/80">{text || "—"}</p>
        </div>
      )}
    </div>
  );
}
