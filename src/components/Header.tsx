import { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/cyberguard-logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const servicesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 h-[80px] flex items-center transition-all duration-300 ${
          scrolled 
            ? "bg-background/90 backdrop-blur-md shadow-md border-b border-border/40" 
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1366px] mx-auto px-[5%] flex items-center justify-between">
          
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
            <button className="nav-link-style">{t("nav.cursos")}</button>
            <Link to="/sobre" className="nav-link-style">{t("nav.sobre")}</Link>
            <button onClick={() => handleNavClick("/Contato", true)} className="nav-link-style">{t("nav.contato")}</button>
            
            <div className="h-4 w-px bg-border/60 mx-2" />

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

            <Link to="/auth" className="btn-gold-3d px-5 py-1.5 rounded-[5px] text-sm font-semibold">
              {t("nav.login")}
            </Link>
          </div>

          {/* 3. BOTÃO MOBILE (Gira e muda de cor) */}
          <button 
            className={`lg:hidden p-2 z-[60] transition-all duration-500 rounded-full bg-primary ${
              mobileMenuOpen ? "rotate-180 text-primary bg-secondary/80 backdrop-blur-sm" : "text-foreground"
            }`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* 4. SIDEBAR MOBILE (Mimetiza o fundo da página) */}
        <div className={`fixed top-0 right-0 h-screen w-[280px] bg-background border-l border-border transition-transform duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} z-50 pt-24 px-8`}>
          <div className="flex flex-col gap-8 items-start">
            <button onClick={() => handleNavClick("/")} className="mobile-link text-left w-full">{t("nav.inicio")}</button>
            <Link to="/blog" className="mobile-link w-full">{t("nav.blog")}</Link>
            <button className="mobile-link text-left w-full">{t("nav.cursos")}</button>
            <Link to="/sobre" className="mobile-link w-full">{t("nav.sobre")}</Link>
            <button onClick={() => handleNavClick("/Contato", true)} className="mobile-link text-left w-full">{t("nav.contato")}</button>
            
            <div className="w-full h-px bg-border/50 my-2" />
            
            <div className="flex flex-col gap-4">
               <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("nav.idioma")}</span>
               <div className="flex gap-4">
                {(["pt", "en", "es"] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`text-sm font-bold transition-all ${lang === l ? "text-primary scale-110" : "text-muted-foreground/50"}`}>
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            </div>

            <Link to="/auth" className="btn-gold-3d w-full text-center py-3 rounded-lg font-bold mt-4 shadow-lg">
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