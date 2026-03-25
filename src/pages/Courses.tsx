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



type Module = {
  id: string;
  title: string;
  content: string;
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
  students: number;
  url: string;
  modules: Module[]; 
};


export default function Courses() {
  const { user } = useAuth();
  const [view, setView] = useState<'explorer' | 'dashboard' | 'details'>('explorer');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState <Course | null>(null);

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

// --- EXPLORER VIEW (Busca Funcional) ---
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
            <div key={course.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-52">
                <img src={course.url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#001f3f] font-black border-none px-4 py-1">
                  {course.level}
                </Badge>
              </div>
              <div className="p-8 space-y-4 text-left">
                <h3 className="text-xl font-black text-[#001f3f] leading-tight">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="text-[#D4AF37] fill-[#D4AF37]"/> {course.rating}</span>
                </div>
                <Button onClick={() => onSelectCourse(course)} className="w-full bg-[#001f3f] hover:bg-[#D4AF37] hover:text-[#001f3f] text-white font-black py-7 rounded-2xl">
                  DETALHES DO CURSO <ArrowRight className="ml-2" size={18}/>
                </Button>
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

// --- DETAILS VIEW (Módulos Dinâmicos) ---
type DetailsProps = { 
  course: Course; 
  onBack: () => void 
};

function DetailsView({ course, onBack }: DetailsProps) {
  const [activeMod, setActiveMod] = useState<string | null>(null);

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#001f3f] text-white py-16 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center text-left">
          <img src={course.url} className="w-full md:w-1/3 h-72 object-cover rounded-3xl border-4 border-[#D4AF37] shadow-2xl" alt={course.title} />
          <div className="space-y-6">
            <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10 mb-2">
               <ArrowRight className="rotate-180 mr-2" size={16}/> Voltar para lista
            </Button>
            <h1 className="text-5xl font-black">{course.title}</h1>
            <p className="text-xl text-blue-200">{course.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3 space-y-12 text-left order-2 lg:order-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
             <DetailIcon icon={<ShieldCheck/>} label="HABILIDADE" value={course.level}/>
             <DetailIcon icon={<Clock/>} label="CARGA HORÁRIA" value={course.duration}/>
             <DetailIcon icon={<BookOpen/>} label="CONTEÚDO" value={`${course.modules?.length || 0} módulos`}/>
          </div>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-[#001f3f] mb-6">Conteúdo Programático</h2>
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((m, index) => (
                <div key={m.id || index} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveMod(activeMod === m.id ? null : m.id)} 
                    className="w-full p-5 flex justify-between items-center font-bold bg-white hover:bg-gray-50 text-[#001f3f] transition-colors"
                  >
                    <span>Módulo {index + 1}: {m.title}</span>
                    <ChevronDown className={`transition-transform duration-300 ${activeMod === m.id ? 'rotate-180' : ''}`} />
                  </button>
                  {activeMod === m.id && (
                    <div className="p-6 bg-gray-50 text-gray-600 border-t animate-in slide-in-from-top-2 duration-300">
                      {m.content}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">Nenhum módulo cadastrado para este curso.</p>
            )}
          </section>
        </main>
        
        <aside className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <Button className="w-full py-6 font-black bg-[#D4AF37] text-[#001f3f] hover:bg-[#b8972f] rounded-2xl mb-4">
                    MATRICULAR-SE
                </Button>
                <p className="text-[10px] text-gray-400 text-center uppercase font-bold">Acesso vitalício ao conteúdo</p>
            </div>
        </aside>
      </div>
    </div>
  );
}

// Dashboard Placeholder
function DashboardView({ user }: { user: any }) {
  return <div className="p-20 text-center">Dashboard de {user?.email} em desenvolvimento.</div>;
}

// Helper UI Component
const DetailIcon = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
    <div className="text-[#D4AF37] mb-2">{icon}</div>
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
    <span className="font-bold text-[#001f3f]">{value}</span>
  </div>
);