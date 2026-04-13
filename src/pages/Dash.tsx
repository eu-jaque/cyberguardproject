import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Award, MessageSquare, Shield, Gamepad2,
  Loader2, Clock, LineChart, Lightbulb, FileText
} from "lucide-react";
import SidebarMenu from "@/components/SideBarMenu";
import type { Course } from "./Courses";

// Dashboard section components
import DashOverview from "@/components/dash/DashOverview";
import DashBlog from "@/components/dash/DashBlog";
import DashCourses from "@/components/dash/DashCourses";
import DashCertificates from "@/components/dash/DashCertificates";
import DashCommunity from "@/components/dash/DashCommunity";
import DashQuiz from "@/components/dash/DashQuiz";
import DashVerifiers from "@/components/dash/DashVerifiers";
import Chatbot from "@/components/Chatbot";
import ChatBotView from "./ChatBotView";
import ExpertProfileEmbed from "@/components/experts/ExpertProfileEmbed";

type SidebarItem = { icon: typeof BookOpen; label: string; key: string };

const dashTabs: SidebarItem[] = [
  { icon: FileText, label: "Blog", key: "blog" },
  { icon: BookOpen, label: "Cursos", key: "courses" },
  { icon: Award, label: "Certificados", key: "certificates" },
  { icon: MessageSquare, label: "Comunidade", key: "community" },
  { icon: Gamepad2, label: "Quiz & Jogos", key: "quiz" },
  { icon: Shield, label: "Verificadores", key: "verifiers" },
];

export default function Dash() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get("tab") || "overview";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("courses").select("*");
      if (data) setCourses(data as Course[]);

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("full_name, name, avatar_url").eq("user_id", user.id).single();
        if (profile) {
          setProfileName(profile.full_name || profile.name || user.email?.split("@")[0] || "Usuário");
          setProfileAvatar(profile.avatar_url || "");
        } else {
          const defaultName = user.email?.split("@")[0] || "Usuário";
          await supabase.from("profiles").insert({
            user_id: user.id,
            name: defaultName,
            full_name: defaultName,
            avatar_url: "",
            type: "student"
          });
          setProfileName(defaultName);
        }
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  const avatarSrc = profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileName}&backgroundColor=facc15`;

  const sectionTitles: Record<string, string> = {
    overview: "Painel Geral",
    blog: "Últimas Publicações",
    courses: "Minha Jornada de Aprendizado",
    certificates: "Minhas Conquistas",
    community: "Espaço Colaborativo",
    quiz: "Desafios & Jogos",
    verifiers: "Central de Verificação",
    chatbot: "Assistente Cyntia",
    expert: "Painel do Especialista",
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Reutilizando SideBarMenu */}
      <SidebarMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content com offset do SideBarMenu */}
      <div className={`flex-1 relative z-10 transition-all duration-300 flex flex-col h-screen overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border/10 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">{sectionTitles[activeSection] || "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-4">

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-medium text-foreground">{profileName}</span>
              <div className="w-9 h-9 rounded-full border-2 border-primary overflow-hidden shadow-[0_0_15px_rgba(212,165,53,0.3)]">
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {activeSection === "chatbot" || activeSection === "expert" ? (
          <div className="flex-1 overflow-hidden">
            {activeSection === "chatbot" && <ChatBotView />}
            {activeSection === "expert" && <ExpertProfileEmbed />}
          </div>
        ) : (
          <div className="p-6 md:p-10 flex-1 overflow-y-auto">
            {activeSection === "overview" && <DashOverview courses={courses} userName={profileName} />}
            {activeSection === "blog" && <DashBlog />}
            {activeSection === "courses" && <DashCourses courses={courses} userEmail={user?.email} />}
            {activeSection === "certificates" && <DashCertificates isComplete={false} progressPct={0} />}
            {/* {activeSection === "community" && <DashCommunity userEmail={user?.email} />} */}
            {activeSection === "quiz" && <DashQuiz />}
            {activeSection === "verifiers" && <DashVerifiers />}
          </div>
        )}
      </div>
    </div>
  );
}
