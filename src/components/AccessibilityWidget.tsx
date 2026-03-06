import { useState, useEffect, useRef } from "react";
import { Accessibility, Plus, Minus, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AccessibilityWidget = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("grayscale-mode", grayscale);
    root.classList.toggle("highlight-links", highlightLinks);
    root.style.fontSize = `${fontSize}%`;
  }, [highContrast, grayscale, fontSize, highlightLinks]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={panelRef} className="fixed right-0 top-1/2 -translate-y-1/2 z-[60]">
      {/* Toggle button - icon only */}
      <button
        onClick={() => setOpen(!open)}
        className="btn-gold-3d text-primary-foreground px-3 py-3 rounded-l-lg flex items-center justify-center shadow-lg"
        aria-label={t("a11y.title")}
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-0 translate-x-0 w-60 bg-card border border-border rounded-l-lg shadow-2xl py-3 px-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-foreground">{t("a11y.title")}</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>

          <button className="block w-full text-left px-2 py-2 text-sm text-foreground/80 hover:bg-secondary rounded transition-colors">
            {t("a11y.screen_reader")}
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`block w-full text-left px-2 py-2 text-sm rounded transition-colors ${highContrast ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary"}`}
          >
            {t("a11y.high_contrast")}
          </button>

          <button
            onClick={() => setGrayscale(!grayscale)}
            className={`block w-full text-left px-2 py-2 text-sm rounded transition-colors ${grayscale ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary"}`}
          >
            {t("a11y.grayscale")}
          </button>

          <div className="px-2 py-2 text-sm text-foreground/80">
            <span>{t("a11y.font_size")}</span>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => setFontSize((s) => Math.max(80, s - 10))} className="p-1 hover:text-primary"><Minus className="w-4 h-4" /></button>
              <span className="text-xs text-primary font-bold">{fontSize}%</span>
              <button onClick={() => setFontSize((s) => Math.min(150, s + 10))} className="p-1 hover:text-primary"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <button
            onClick={() => setHighlightLinks(!highlightLinks)}
            className={`block w-full text-left px-2 py-2 text-sm rounded transition-colors ${highlightLinks ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary"}`}
          >
            {t("a11y.highlight_links")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
