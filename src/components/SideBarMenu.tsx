import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Globe, Menu, X, FileText, BookOpen, Award, MessageSquare, Gamepad2, Shield, Edit, LogOut, LayoutDashboard, Sun, Moon, Accessibility, Plus, Minus, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import logo from "@/assets/logooriginal.png";
import EditProfileModal from "./EditProfileModal";
import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

interface SidebarMenuProps {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

const SidebarMenu = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }: SidebarMenuProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propSetIsOpen || setInternalIsOpen;

  const [langOpen, setLangOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Profile and Auth
  const { user, signOutUser } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");

  const langRef = useRef<HTMLDivElement>(null);
  const a11yRef = useRef<HTMLDivElement>(null);

  // Theme
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Accessibility
  const [a11yOpen, setA11yOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("grayscale-mode", grayscale);
    root.classList.toggle("highlight-links", highlightLinks);
    root.style.fontSize = `${fontSize}%`;
  }, [highContrast, grayscale, fontSize, highlightLinks]);

  const handleMouseUp = useCallback(() => {
    if (!screenReader) return;
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText && selectedText.length > 0) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  }, [screenReader]);

  useEffect(() => {
    if (screenReader) document.addEventListener("mouseup", handleMouseUp);
    else { document.removeEventListener("mouseup", handleMouseUp); window.speechSynthesis.cancel(); }
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [screenReader, handleMouseUp]);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
        if (profile) {
          setProfileName(profile.full_name || user.email?.split("@")[0] || "Usuário");
          setProfileAvatar(profile.avatar_url || "");
        } else {
          setProfileName(user.email?.split("@")[0] || "Usuário");
        }
      }
    }
    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOutUser();
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (a11yRef.current && !a11yRef.current.contains(e.target as Node)) setA11yOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const langLabels: Record<string, string> = { pt: "PT", en: "EN", es: "ES" };

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", key: "overview" },
    { icon: FileText, label: "Blog", key: "blog" },
    { icon: BookOpen, label: "Cursos", key: "courses" },
    { icon: Award, label: "Certificados", key: "certificates" },
    { icon: MessageSquare, label: "Comunidade", key: "community" },
    { icon: Gamepad2, label: "Quiz & Jogos", key: "quiz" },
    { icon: Shield, label: "Verificadores", key: "verifiers" },
    { icon: Bot, label: "Chatbot IA", key: "chatbot", path: "/chatBot" },
  ];

  const activeSection = searchParams.get("tab") || "overview";

  const handleNavigation = (item: any) => {
    if (item.path) {
      navigate(item.path);
      return;
    }
    if (location.pathname !== "/dash") {
      navigate(`/dash?tab=${item.key}`);
    } else {
      setSearchParams({ tab: item.key });
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
        className={`fixed top-0 left-0 z-[55] h-screen transition-all duration-300 flex flex-col py-4 px-2 ${isOpen ? "w-64" : "w-16"}`}
        style={{ background: "rgba(10,14,23,0.92)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Toggle Button no Topo da Sidebar */}
        <div className={`flex items-center ${isOpen ? 'justify-between px-2' : 'justify-center'} mb-8 h-8`}>
          <div
            className={`flex items-center gap-2 cursor-pointer overflow-hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
          // onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
            <span className="font-display text-lg font-bold text-foreground whitespace-nowrap">
              Cyber<span className="text-gradient-gold">Guard</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 hover:bg-secondary/30 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.path ? location.pathname === item.path : (activeSection === item.key && location.pathname === "/dash");

            return (
              <button
                key={idx}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-3 rounded-xl text-sm transition-all group ${isActive
                    ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/20 border-l-[3px] border-transparent"
                  }`}
                title={!isOpen ? item.label : ""}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`} />
                <span className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Profile / Actions */}
        <div className="p-2 space-y-1 border-t border-border/20 pt-4 mb-2">
          {/* Theme Toggle */}
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-secondary/20 transition-all border-l-[3px] border-transparent`}
              title={!isOpen ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : ""}
            >
              {theme === "dark" ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              <span className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          )}

          {/* Accessibility Dropdown */}
          <div className="relative" ref={a11yRef}>
            <button onClick={() => {
              if (!isOpen) { setIsOpen(true); setA11yOpen(true); }
              else { setA11yOpen(!a11yOpen); }
            }}
              className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-secondary/20 transition-all border-l-[3px] border-transparent`}
              title={!isOpen ? t("a11y.title") : ""}
            >
              <Accessibility className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden flex-1 text-left ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>{t("a11y.title")}</span>
              {isOpen && <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${a11yOpen ? 'rotate-180' : ''}`} />}
            </button>

            {a11yOpen && isOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border/30 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 p-2 space-y-1">
                <button onClick={() => setScreenReader(!screenReader)} className={`block w-full text-left px-3 py-2 text-xs rounded transition-colors ${screenReader ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-secondary/30"}`}>Leitor de Tela</button>
                <button onClick={() => setHighContrast(!highContrast)} className={`block w-full text-left px-3 py-2 text-xs rounded transition-colors ${highContrast ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-secondary/30"}`}>Alto Contraste</button>
                <button onClick={() => setGrayscale(!grayscale)} className={`block w-full text-left px-3 py-2 text-xs rounded transition-colors ${grayscale ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-secondary/30"}`}>Escala de Cinza</button>
                <button onClick={() => setHighlightLinks(!highlightLinks)} className={`block w-full text-left px-3 py-2 text-xs rounded transition-colors ${highlightLinks ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-secondary/30"}`}>Destacar Links</button>
                <div className="px-3 py-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Tamanho da Fonte</span>
                  <div className="flex items-center gap-2 mt-1 bg-secondary/20 p-1 rounded">
                    <button onClick={() => setFontSize((s) => Math.max(80, s - 10))} className="p-1 hover:text-primary"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs text-primary font-bold flex-1 text-center">{fontSize}%</span>
                    <button onClick={() => setFontSize((s) => Math.min(150, s + 10))} className="p-1 hover:text-primary"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
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
              className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/20 transition-all border-l-[3px] border-transparent text-sm font-medium`}
              title={!isOpen ? langLabels[lang] : ""}
            >
              <Globe className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-opacity duration-200 flex-1 text-left whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                {langLabels[lang]}
              </span>
              {isOpen && <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${langOpen ? 'rotate-180' : ''}`} />}
            </button>

            {langOpen && isOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border/30 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                {(["pt", "en", "es"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${lang === l ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-secondary/30"
                      }`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user && (
            <>
              <button onClick={() => setShowEditProfile(true)}
                className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-secondary/20 transition-all border-l-[3px] border-transparent`}
                title={!isOpen ? "Editar Perfil" : ""}
              >
                <Edit className="w-5 h-5 flex-shrink-0" />
                <span className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>Editar Perfil</span>
              </button>
            </>
          )}
        </div>

        {/* Footer: Botão de Sair */}
        <div className="mt-auto pt-2 border-t border-border/20">

          {/* Sair (último botão) */}
          {user && (
            <button onClick={() => setShowLogoutModal(true)}
              className={`mt-1 w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-sm text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-all border-l-[3px] border-transparent`}
              title={!isOpen ? "Sair" : ""}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-opacity duration-200 whitespace-nowrap flex-1 text-left overflow-hidden ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>Sair</span>
            </button>
          )}
        </div>
      </aside>

      {/* Edit Profile Modal (agora isolado aqui) */}
      <EditProfileModal
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentName={profileName}
        currentAvatar={profileAvatar}
        onSaved={(name, avatar) => { setProfileName(name); setProfileAvatar(avatar); }}
      />

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-4">
              <LogOut className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Deseja sair?</h3>
              <p className="text-sm text-muted-foreground">Seu progresso está salvo.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary/30 transition-colors">Cancelar</button>
                <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Sair</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMenu;