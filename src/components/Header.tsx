import { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe, Menu, X, Sun, Moon } from "lucide-react"; // Importando os ícones Sun e Moon
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes"; // Importando o useTheme
import logo from "@/assets/logooriginal.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Next-Themes
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const serviceItems = [
    { key: "srv.conversa_especialistas", to: "/especialistas" },
  ];

  // Evita Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const langLabels: Record<string, string> = { pt: "PT", en: "EN", es: "ES" };

  const handleNavClick = (path: string, isAnchor?: boolean) => {
    if (location.pathname === path && isAnchor) {
      document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null; // Espera montar no cliente para renderizar e evitar o clarão no carregamento

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 h-[80px] flex items-center transition-all duration-300 ${scrolled
          ? "bg-background/90 backdrop-blur-md shadow-md border-b border-border/40"
          : "bg-transparent"
          }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">

          {/* 1. LOGO */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0 z-50" onClick={() => handleNavClick("/")}>
            <img src={logo} alt="CyberGuard Logo" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl font-bold text-foreground">
              Cyber<span className="text-gradient-gold">Guard</span>
            </span>
          </div>

          {/* 2. MENU DESKTOP */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => handleNavClick("/")} className="nav-link-style">{t("nav.inicio")}</button>
            <Link to="/blog" className="nav-link-style">{t("nav.blog")}</Link>
            <Link className="nav-link-style" to="/cursos">{t("nav.cursos")}</Link>

            {/* Dropdown de Serviços */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`nav-link-style inline-flex items-center gap-1.5 py-2 ${servicesOpen ? "text-primary" : ""}`}
              >
                {t("nav.servicos")}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute top-[calc(100%+10px)] left-0 w-64 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      {t("nav.servicos")}
                    </span>
                  </div>

                  {serviceItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to || "#"}
                      className="group flex items-center px-4 py-2.5 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all relative"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="relative z-10 font-medium">
                        {t(item.key)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/sobre" className="nav-link-style">{t("nav.sobre")}</Link>
            <Link to="/saiba-mais" className="nav-link-style">{t("nav.planos")}</Link>
            <button onClick={() => handleNavClick("/Contato", true)} className="nav-link-style">{t("nav.contato")}</button>

            <div className="h-4 w-px bg-border/60 mx-2" />

            {/* Idioma */}
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="nav-link-style flex items-center gap-1">
                <Globe className="w-4 h-4" /> {langLabels[lang]}
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-card border border-border rounded-lg shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95">
                  {(["pt", "en", "es"] as const).map((l) => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }} className={`block w-full text-left px-4 py-2 text-xs hover:bg-secondary ${lang === l ? "text-primary font-bold" : "text-foreground/70"}`}>
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 🌙 Alternar Tema Desktop */}
            <button
              onClick={toggleTheme}
              className="nav-link-style p-2 rounded-full hover:bg-secondary/60 flex items-center justify-center transition-all"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/auth" className="btn-gold-3d px-5 py-1.5 rounded-[5px] text-sm font-semibold">
              {t("nav.login")}
            </Link>
          </div>

          {/* 3. BOTÃO MOBILE (Gira e muda de cor) */}
          <button
            className={`lg:hidden p-2 z-[60] bg-primary transition-all duration-500 rounded-full ${mobileMenuOpen ? "rotate-180 text-primary bg-secondary/80 backdrop-blur-sm" : "text-foreground"
              }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* 4. SIDEBAR MOBILE (Mimetiza o fundo da página) */}
        <div className={`fixed top-0 right-0 h-[100dvh] w-[85vw] sm:w-[320px] bg-background border-l border-border transition-transform duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} z-50 flex flex-col shadow-2xl`}>
          <div className="flex flex-col gap-6 items-start flex-1 overflow-y-auto px-6 sm:px-8 pt-24 pb-8">
            <button onClick={() => handleNavClick("/")} className="mobile-link text-left w-full">{t("nav.inicio")}</button>
            <button onClick={() => handleNavClick("/blog")} className="mobile-link text-left w-full">{t("nav.blog")}</button>
            <button onClick={() => handleNavClick("/cursos")} className="mobile-link text-left w-full">{t("nav.cursos")}</button>
            <button onClick={() => handleNavClick("/sobre")} className="mobile-link text-left w-full">{t("nav.sobre")}</button>
            <button onClick={() => handleNavClick("/saiba-mais")} className="mobile-link text-left w-full">{t("nav.planos")}</button>
            <button onClick={() => handleNavClick("/Contato", true)} className="mobile-link text-left w-full">{t("nav.contato")}</button>

            <div className="w-full h-px bg-border/50 my-2 shrink-0" />

            <div className="flex flex-col gap-4 w-full shrink-0">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("nav.idioma")}</span>
              <div className="flex gap-4">
                {(["pt", "en", "es"] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`text-sm font-bold transition-all ${lang === l ? "text-primary scale-110" : "text-muted-foreground/50"}`}>
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* 🌙 Alternar Tema Mobile */}
            <div className="flex flex-col gap-4 w-full shrink-0">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Aparência</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-base font-medium text-foreground/80 hover:text-primary transition-all w-full"
              >
                {theme === "dark" ? (
                  <><Sun size={18} /> Modo Claro</>
                ) : (
                  <><Moon size={18} /> Modo Escuro</>
                )}
              </button>
            </div>

            <Link to="/auth" className="btn-gold-3d w-full text-center py-3 rounded-lg font-bold mt-auto mb-4 shadow-lg shrink-0">
              {t("nav.login")}
            </Link>
          </div>
        </div>

        {/* Overlay Simples */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-500" onClick={() => setMobileMenuOpen(false)} />
        )}
      </nav>

      <style>{`
        .nav-link-style { @apply text-foreground/70 hover:text-primary transition-all text-sm font-medium; }
        .mobile-link { @apply text-xl font-medium text-foreground/80 hover:text-primary transition-all; }
      `}</style>
    </>
  );
};

export default Header;