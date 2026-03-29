import { useState, useEffect, useRef } from "react";
import { ChevronDown, Globe, Menu, X, Home, BookOpen, GraduationCap, Briefcase, Info, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logooriginal.png";

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false); // Controla a expansão da sidebar
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

  const menuItems = [
    { label: t("nav.inicio"), path: "/", icon: Home, type: "scroll" },
    { label: t("nav.blog"), path: "/blog", icon: BookOpen, type: "link" },
    { label: t("nav.cursos"), path: "/cursos", icon: GraduationCap, type: "button" },
    { label: t("nav.sobre"), path: "/sobre", icon: Info, type: "link" },
    { label: t("nav.contato"), path: "contato", icon: Mail, type: "scroll" },
  ];

  const serviceItems = [
    { key: "srv.conversa_especialistas", to: "/especialistas" },
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
  };

  return (
    <>
      {/* Overlay para cliques fora no mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[54] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-[55] h-screen bg-card border-r border-border transition-all duration-300 flex flex-col p-4
          ${isOpen ? "w-64" : "w-16"}
        `}
      >
        {/* Toggle Button no Topo da Sidebar */}
        <div className="flex items-center justify-between mb-8 h-8">
          <div
            className={`flex items-center gap-2 cursor-pointer overflow-hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
            <span className="font-display text-lg font-bold text-foreground whitespace-nowrap">
              Cyber<span className="text-gradient-gold">Guard</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${isOpen
                ? "bg-secondary/50 text-foreground/80 hover:bg-secondary hover:text-primary"
                : "bg-primary text-white hover:bg-primary/90"
              }`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isAfterCursos = item.label === t("nav.cursos");

            return (
              <div key={idx} className="flex flex-col gap-1">
                <button
                  onClick={() => handleNavigation(item)}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-all text-sm font-medium h-10"
                  title={!isOpen ? item.label : ""}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
                    {item.label}
                  </span>
                </button>

                {/* Dropdown de Serviços */}
                {isAfterCursos && (
                  <div className="relative my-1" ref={servicesRef}>
                    <button
                      onClick={() => {
                        if (!isOpen) setIsOpen(true); // Abre a sidebar se estiver fechada ao clicar em serviços
                        setServicesOpen(!servicesOpen);
                      }}
                      className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-all text-sm font-medium h-10"
                      title={!isOpen ? t("nav.servicos") : ""}
                    >
                      <span className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 flex-shrink-0" />
                        <span className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
                          {t("nav.servicos")}
                        </span>
                      </span>
                      {isOpen && <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${servicesOpen ? 'rotate-180' : ''}`} />}
                    </button>

                    {servicesOpen && isOpen && (
                      <div className="mt-1 ml-6 flex flex-col gap-1 border-l-2 border-border pl-4 animate-in fade-in slide-in-from-top-1">
                        {serviceItems.map((srv) => (
                          <Link
                            key={srv.key}
                            to={srv.to}
                            className="text-xs text-foreground/60 hover:text-primary py-1.5 transition-colors whitespace-nowrap overflow-hidden"
                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
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

        {/* Footer: Seletor de Idioma */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                  setLangOpen(true);
                } else {
                  setLangOpen(!langOpen);
                }
              }}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors text-sm font-medium h-10"
              title={!isOpen ? langLabels[lang] : ""}
            >
              <Globe className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-opacity duration-200 flex-1 text-left ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                {langLabels[lang]}
              </span>
              {isOpen && <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${langOpen ? 'rotate-180' : ''}`} />}
            </button>

            {langOpen && isOpen && (
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

export default SidebarMenu;