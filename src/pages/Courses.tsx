import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";

import {
  Star, Clock, Search, ShieldCheck, 
  BookOpen, ArrowRight, Loader2, ChevronDown
} from "lucide-react";

// --- TIPOS ---
type Module = {
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
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: string;
  rating: number;
  url: string;
  modules: Module[]; 
};

export default function Courses() {
  const { user } = useAuth();
  const [view, setView] = useState<'explorer' | 'dashboard' | 'details'>('explorer');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select("*");
    if (!error && data) {
      setCourses(data as Course[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenDetails = (course: Course) => {
    setSelectedCourse(course);
    setView('details');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#001f3f]">
      <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      <AccessibilityWidget />
      
      <main className="flex-1">
        {view === 'explorer' && (
          <ExplorerView courses={courses} onSelectCourse={handleOpenDetails} />
        )}
        
        {view === 'details' && selectedCourse && (
          <DetailsView 
            course={selectedCourse} 
            onBack={() => setView('explorer')} 
          />
        )}

        {view === 'dashboard' && <DashboardView user={user} />}
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}

// --- EXPLORER VIEW ---
type ExplorerProps = { 
  courses: Course[]; 
  onSelectCourse: (c: Course) => void 
};

function ExplorerView({ courses, onSelectCourse }: ExplorerProps) {
  const [termoBusca, setTermoBusca] = useState("");

  const cursosFiltrados = courses.filter((course) => {
    const termo = termoBusca.toLowerCase();
    return (
      course.title?.toLowerCase().includes(termo) || 
      course.category?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="animate-in fade-in duration-500">
      <header className="bg-[#001f3f] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Proteja o <span className="text-[#D4AF37]">Futuro Digital</span>
        </h1>
        <div className="max-w-xl mx-auto relative group mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]" />
          <Input 
            placeholder="Buscar por hacking, redes, cloud..." 
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-12 py-7 rounded-2xl border-none shadow-2xl text-[#001f3f] text-lg bg-white w-full" 
          />
        </div>
      </header>

      <section className="max-w-7xl mx-auto p-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {cursosFiltrados.length > 0 ? (
          cursosFiltrados.map((course) => (
            <div key={course.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="relative h-52 overflow-hidden">
                <img src={course.url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#001f3f] font-black border-none px-4 py-1">
                  {course.level}
                </Badge>
              </div>
              <div className="p-8 space-y-4 text-left flex-1 flex flex-col">
                <h3 className="text-xl font-black text-[#001f3f] leading-tight">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="text-[#D4AF37] fill-[#D4AF37]"/> {course.rating}</span>
                </div>
                <div className="pt-4 mt-auto">
                  <Button onClick={() => onSelectCourse(course)} className="w-full bg-[#001f3f] hover:bg-[#D4AF37] hover:text-[#001f3f] text-white font-black py-7 rounded-2xl transition-all">
                    DETALHES DO CURSO <ArrowRight className="ml-2" size={18}/>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold">
            Nenhum curso encontrado para "{termoBusca}"
          </div>
        )}
      </section>
    </div>
  );
}

// --- DETAILS VIEW ---
type DetailsProps = { 
  course: Course; 
  onBack: () => void 
};

function DetailsView({ course, onBack }: DetailsProps) {
  const [activeMod, setActiveMod] = useState<string | null>(null);

  // Função para redirecionar ao login
  const handleEnrollClick = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#001f3f] text-white py-16 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center text-left">
          <div className="w-full md:w-1/3">
             <img src={course.url} className="w-full h-72 object-cover rounded-3xl border-4 border-[#D4AF37] shadow-2xl" alt={course.title} />
          </div>
          <div className="flex-1 space-y-6">
            <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10 mb-2 pl-0">
               <ArrowRight className="rotate-180 mr-2" size={16}/> Voltar para a lista de cursos
            </Button>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">{course.title}</h1>
            <p className="text-xl text-blue-200 max-w-2xl">{course.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3 space-y-12 text-left order-2 lg:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <DetailIcon icon={<ShieldCheck/>} label="NÍVEL" value={course.level}/>
             <DetailIcon icon={<Clock/>} label="CARGA HORÁRIA" value={course.duration}/>
             <DetailIcon icon={<BookOpen/>} label="CONTEÚDO" value={`${course.modules?.length || 0} módulos`}/>
          </div>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-[#001f3f] mb-6">Conteúdo Programático</h2>
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((m, index) => (
                <div key={m.id || index} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setActiveMod(activeMod === (m.id || index.toString()) ? null : (m.id || index.toString()))} 
                    className="w-full p-6 flex justify-between items-center font-bold bg-white hover:bg-gray-50 text-[#001f3f] transition-all"
                  >
                    <span className="text-lg">Módulo {index + 1}: {m.title}</span>
                    <ChevronDown className={`transition-transform duration-300 text-[#D4AF37] ${activeMod === (m.id || index.toString()) ? 'rotate-180' : ''}`} />
                  </button>
                  {activeMod === (m.id || index.toString()) && (
                    <div className="p-6 bg-gray-50 text-gray-600 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                      <p className="leading-relaxed">{m.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                <p className="text-gray-400 font-medium">Os módulos deste curso serão liberados em breve.</p>
              </div>
            )}
          </section>
        </main>
        
        <aside className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-8 p-8 bg-white rounded-[32px] border border-gray-200 shadow-xl text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest"></p>
                  <p className="text-4xl font-black text-[#001f3f]"></p>
                </div>
                <Button 
                  onClick={handleEnrollClick}
                  className="w-full py-8 text-xl font-black bg-[#D4AF37] text-[#001f3f] hover:bg-[#001f3f] hover:text-white rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20"
                >
                    MATRICULE-SE JÁ
                </Button>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 uppercase font-bold leading-tight">
                    Início imediato • Certificado incluso • Acesso vitalício
                  </p>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}

function DashboardView({ user }: { user: any }) {
  return <div className="p-20 text-center font-bold text-[#001f3f]">Bem-vindo, {user?.email}. Seus cursos aparecerão aqui.</div>;
}

const DetailIcon = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="text-[#D4AF37] mb-3 p-3 bg-gray-50 rounded-2xl">{icon}</div>
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <span className="font-bold text-[#001f3f] text-lg">{value}</span>
  </div>
);