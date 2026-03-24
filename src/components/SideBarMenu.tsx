import { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe, Menu, X, Home, BookOpen, GraduationCap, Briefcase, Info, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logooriginal.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const servicesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const langLabels: Record<string, string> = { pt: "PT", en: "EN", es: "ES" };

  // 1. Array de itens do menu principal
  const menuItems = [
    { label: t("nav.inicio"), path: "/", icon: Home, type: "scroll" },
    { label: t("nav.blog"), path: "/blog", icon: BookOpen, type: "link" },
    { label: t("nav.cursos"), path: "/cursos", icon: GraduationCap, type: "button" },
    { label: t("nav.sobre"), path: "/sobre", icon: Info, type: "link" },
    { label: t("nav.contato"), path: "contato", icon: Mail, type: "scroll" },
  ];

  // 2. Itens do dropdown de serviços
  const serviceItems = [
    // { key: "srv.verificador_seguranca", to: "/verificador" },
    { key: "srv.conversa_especialistas", to: "/especialistas" },
    // { key: "srv.servicos_page", to: "/servicos" },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.type === "scroll") {
      if (location.pathname === "/") {
        const element = document.getElementById(item.path === "/" ? "hero" : item.path);
        element ? element.scrollIntoView({ behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else if (item.type === "link") {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-4 left-4 z-[60] p-2 transition-all duration-500 rounded-full shadow-lg ${isOpen
            ? "rotate-180 text-primary bg-secondary/80 backdrop-blur-sm"
            : "text-white bg-primary"
          }`}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[54] lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`
        fixed top-0 left-0 z-[55] h-screen bg-card border-r border-border transition-transform duration-300 w-64 flex flex-col p-6
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-display text-lg font-bold text-foreground">
            Cyber<span className="text-gradient-gold">Guard</span>
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            // Inserindo o dropdown de serviços após o item "Cursos" (ou em qualquer posição desejada)
            const isAfterCursos = item.label === t("nav.cursos");

            return (
              <div key={idx} className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation(item)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-all text-sm font-medium"
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </button>

                {/* Dropdown de Serviços integrado no fluxo do Map */}
                {isAfterCursos && (
                  <div className="relative my-1" ref={servicesRef}>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-all text-sm font-medium"
                    >
                      <span className="flex items-center gap-3"><Briefcase className="w-4 h-4" /> {t("nav.servicos")}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {servicesOpen && (
                      <div className="mt-1 ml-7 flex flex-col gap-1 border-l-2 border-border pl-4 transition-all">
                        {serviceItems.map((srv) => (
                          <Link
                            key={srv.key}
                            to={srv.to}
                            className="text-xs text-foreground/60 hover:text-primary py-1.5 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {t(srv.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer: Language Selector */}
        <div className="mt-auto pt-6 border-t border-border">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" /> {langLabels[lang]}
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                {(["pt", "en", "es"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${lang === l ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-secondary"
                      }`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;