import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { motion } from "framer-motion";
import {
  Star, Clock, Search, ShieldCheck,
  BookOpen, ArrowRight, Loader2, ChevronDown, GraduationCap, Users, Award
} from "lucide-react";

export type Module = {
  id: string;
  title: string;
  description: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  status: string;
  rating: number;
  url: string;
  modules: Module[];
};

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [view, setView] = useState<"explorer" | "details">("explorer");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("courses").select("*");
    if (!error && data) setCourses(data as Course[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleOpenDetails = (course: Course) => {
    setSelectedCourse(course);
    setView("details");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <AccessibilityWidget />
      <main className="flex-1">
        {view === "explorer" && <ExplorerView courses={courses} onSelectCourse={handleOpenDetails} />}
        {view === "details" && selectedCourse && (
          <DetailsView course={selectedCourse} onBack={() => setView("explorer")} user={user} />
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function ExplorerView({ courses, onSelectCourse }: { courses: Course[]; onSelectCourse: (c: Course) => void }) {
  const [termoBusca, setTermoBusca] = useState("");
  const cursosFiltrados = courses.filter(c =>
    c.title?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    c.category?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(216,71%,8%)] via-[hsl(216,71%,12%)] to-[hsl(216,50%,15%)]" />
        <div className="absolute top-[-100px] right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Academia CyberGuard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Proteja o <span className="text-gradient-gold">Futuro Digital</span>
            </h1>
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto mb-8">
              Cursos de cibersegurança ministrados por especialistas. Do básico ao avançado, com certificado.
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar por hacking, redes, cloud..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-12 py-7 rounded-2xl border-border/30 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40 text-lg focus:border-primary/50"
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { icon: BookOpen, label: "Cursos", value: courses.length },
              { icon: Users, label: "Alunos", value: "2.5K+" },
              { icon: Award, label: "Certificados", value: "1.2K+" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-blue-200/50 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {cursosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursosFiltrados.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border/50 rounded-2xl overflow-hidden group hover:border-primary/40 hover:shadow-[0_10px_40px_rgba(212,165,53,0.1)] transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={course.url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold border-none px-3 py-1 text-xs">
                    {course.level}
                  </Badge>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-primary" /> {course.rating}</span>
                    <span className="flex items-center gap-1"><BookOpen size={14} /> {course.modules?.length || 0} módulos</span>
                  </div>
                  <Button
                    onClick={() => onSelectCourse(course)}
                    className="w-full btn-gold-3d text-primary-foreground font-bold py-6 rounded-xl mt-2"
                  >
                    DETALHES <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">Nenhum curso encontrado para "{termoBusca}"</div>
        )}
      </section>
    </div>
  );
}

function DetailsView({ course, onBack, user }: { course: Course; onBack: () => void; user: any }) {
  const navigate = useNavigate();
  const [activeMod, setActiveMod] = useState<string | null>(null);

  const handleEnroll = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/student-dashboard", { state: { courseId: course.id } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(216,71%,8%)] via-[hsl(216,71%,12%)] to-[hsl(216,50%,15%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <img src={course.url} className="w-full h-72 object-cover rounded-2xl border-2 border-primary/30 shadow-2xl" alt={course.title} />
          </div>
          <div className="flex-1 space-y-4">
            <Button onClick={onBack} variant="ghost" className="text-white/70 hover:bg-white/10 mb-2 pl-0">
              <ArrowRight className="rotate-180 mr-2" size={16} /> Voltar
            </Button>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{course.title}</h1>
            <p className="text-lg text-blue-200/70 max-w-2xl">{course.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3 space-y-10 order-2 lg:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, label: "NÍVEL", value: course.level },
              { icon: Clock, label: "CARGA HORÁRIA", value: course.duration },
              { icon: BookOpen, label: "CONTEÚDO", value: `${course.modules?.length || 0} módulos` },
            ].map(d => (
              <div key={d.label} className="flex flex-col items-center bg-card p-5 rounded-2xl border border-border/50">
                <div className="text-primary mb-2 p-3 bg-secondary/30 rounded-xl"><d.icon className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{d.label}</span>
                <span className="font-bold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground mb-4">Conteúdo Programático</h2>
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((m, index) => (
                <div key={m.id || index} className="border border-border/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveMod(activeMod === (m.id || index.toString()) ? null : (m.id || index.toString()))}
                    className="w-full p-5 flex justify-between items-center font-bold bg-card hover:bg-secondary/30 text-foreground transition-all"
                  >
                    <span>Módulo {index + 1}: {m.title}</span>
                    <ChevronDown className={`transition-transform duration-300 text-primary ${activeMod === (m.id || index.toString()) ? "rotate-180" : ""}`} />
                  </button>
                  {activeMod === (m.id || index.toString()) && (
                    <div className="p-5 bg-secondary/10 text-muted-foreground border-t border-border/30 animate-fade-in">
                      <p>{m.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-border/30 rounded-2xl text-center text-muted-foreground">
                Os módulos deste curso serão liberados em breve.
              </div>
            )}
          </section>
        </main>

        <aside className="lg:col-span-1 order-1 lg:order-2">
          <div className="sticky top-8 p-6 bg-card rounded-2xl border border-border/50 shadow-xl text-center space-y-4">
            <Button
              onClick={handleEnroll}
              className="w-full py-8 text-lg font-bold btn-gold-3d text-primary-foreground rounded-xl"
            >
              {user ? "ACESSAR CURSO" : "MATRICULE-SE JÁ"}
            </Button>
            <p className="text-[11px] text-muted-foreground uppercase font-bold leading-tight">
              Início imediato • Certificado incluso • Acesso vitalício
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}