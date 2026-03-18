import { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/cyberguard-logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const servicesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const langLabels: Record<string, string> = { pt: "PT", en: "EN", es: "ES" };

  const serviceItems = [
    { key: "srv.verificador_seguranca", to: "" },
    { key: "srv.conversa_especialistas", to: "/especialistas" },
    { key: "srv.assinaturas", to: "/assinaturas" },
    { key: "srv.servicos_page", to: "/servicos" },
  ];

  return (
    <>
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
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => {
            if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            else navigate("/");
          }}>
            <img src={logo} alt="CyberGuard Logo" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl font-bold text-foreground">
              Cyber<span className="text-gradient-gold">Guard</span>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => {
              if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
              else navigate("/");
            }} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.inicio")}
            </button>

            <Link to="/blog" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.blog")}
            </Link>

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
                  {serviceItems.map((item) => (
                    item.to ? (
                      <Link
                        key={item.key}
                        to={item.to}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                        onClick={() => setServicesOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    ) : (
                      <button
                        key={item.key}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                      >
                        {t(item.key)}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            <Link to="/sobre" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t("nav.sobre")}
            </Link>

            <button onClick={() => {
              if (location.pathname === "/") {
                document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
              } else navigate("/");
            }} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
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

            <Link to="/auth" className="btn-gold-3d text-primary-foreground px-5 py-1.5 rounded-[5px] text-sm font-semibold cursor-pointer">
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
