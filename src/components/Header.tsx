import { useState, useEffect, useRef } from "react";
import { Shield, ChevronDown, Globe, Accessibility, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from 'react-router-dom'

const serviceKeys = [
  "srv.testa_pix", "srv.verificador_link", "srv.verificador_email",
  "srv.verificador_seguranca", "srv.guia_informacoes", "srv.teste_vulnerabilidades",
  "srv.lgpd", "srv.vazamento_dados", "srv.dicas_protecao", "srv.conversa_especialistas",
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Accessibility state
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highlightLinks, setHighlightLinks] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const a11yRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (a11yRef.current && !a11yRef.current.contains(e.target as Node)) setA11yOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Apply accessibility classes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("grayscale-mode", grayscale);
    root.classList.toggle("highlight-links", highlightLinks);
    root.style.fontSize = `${fontSize}%`;
  }, [highContrast, grayscale, fontSize, highlightLinks]);

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setToast({ msg: t("nav.email_invalid"), type: "error" });
    } else {
      setToast({ msg: t("nav.email_success"), type: "success" });
    }
  };

  const langLabels: Record<string, string> = { pt: "PT", en: "EN", es: "ES" };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === "error"
              ? "bg-destructive text-destructive-foreground"
              : "bg-green-600 text-white"
          }`}
          style={{ minWidth: 190 }}
        >
          {toast.msg}
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 w-full z-50 h-[80px] flex items-center transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1366px] mx-auto px-[2%] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => scrollTo("inicio")}>
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Cyber<span className="text-primary">Guard</span>
            </span>
          </div>

          {/* Nav + Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Nav links */}
            <button onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.inicio")}
            </button>
            <button className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.blog")}
            </button>
            <button className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.cursos")}
            </button>

            {/* Services dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium inline-flex items-center gap-1"
              >
                {t("nav.servicos")} <ChevronDown className="w-3 h-3" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-[100] py-2">
                  {serviceKeys.map((key) => (
                    <button
                      key={key}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => scrollTo("sobre")} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.sobre")}
            </button>
            <button onClick={() => scrollTo("contato")} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.contato")}
            </button>

            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium inline-flex items-center gap-1"
              >
                <Globe className="w-4 h-4" /> {langLabels[lang]}
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-xl z-[100] py-2">
                  {(["pt", "en", "es"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        lang === l ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary hover:text-primary"
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accessibility */}
            <div className="relative" ref={a11yRef}>
              <button
                onClick={() => setA11yOpen(!a11yOpen)}
                className="text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1 text-sm font-medium"
                aria-label={t("a11y.title")}
              >
                <Accessibility className="w-5 h-5" />
                {t("a11y.title")}
              </button>
              {a11yOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-xl z-[100] py-2">
                  <button className="block w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-secondary transition-colors">
                    {t("a11y.screen_reader")}
                  </button>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${highContrast ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary"}`}
                  >
                    {t("a11y.high_contrast")}
                  </button>
                  <button
                    onClick={() => setGrayscale(!grayscale)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${grayscale ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary"}`}
                  >
                    {t("a11y.grayscale")}
                  </button>
                  <div className="px-4 py-2 text-sm text-foreground/80">
                    <span>{t("a11y.font_size")}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setFontSize((s) => Math.max(80, s - 10))} className="p-1 hover:text-primary"><Minus className="w-4 h-4" /></button>
                      <span className="text-xs text-primary font-bold">{fontSize}%</span>
                      <button onClick={() => setFontSize((s) => Math.min(150, s + 10))} className="p-1 hover:text-primary"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <button
                    onClick={() => setHighlightLinks(!highlightLinks)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${highlightLinks ? "text-primary font-bold" : "text-foreground/80 hover:bg-secondary"}`}
                  >
                    {t("a11y.highlight_links")}
                  </button>
                </div>
              )}
            </div>

            {/* Email + Login */}
            
             <Link to="/auth" className="btn-login bg-primary text-primary-foreground px-5 py-1.5 rounded-[5px] text-sm font-semibold cursor-pointer">
              {t("nav.login")}
            </Link>
           
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
