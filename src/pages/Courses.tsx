
import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";




// Ícones (Incluindo os novos solicitados)
import {
  Star, Clock, Award,
  Search, ShieldCheck, BookOpen, PlayCircle,
  ArrowRight, Lock, Loader2, Globe
} from "lucide-react";

export default function CyberGuard() {

  const { user, } = useAuth();
  const [view, setView] = useState<'explorer' | 'dashboard' | 'details'>('explorer');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Busca de dados com useCallback para performance

  
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select("*");
    console.log(data)
    if (!error && data) setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#001f3f]">
      <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* 1. COMPONENTES GLOBAIS DE INTERFACE */}
      <Header />
      <AccessibilityWidget />
     
      {/* NAVEGAÇÃO ENTRE ABAS (Identidade Visual) */}
      {/* <nav className="bg-[#001f3f] py-4 flex justify-center gap-6 border-b border-white/10 shadow-lg">
        <button
          onClick={() => setView('explorer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${view === 'explorer' ? 'bg-[#D4AF37] text-[#001f3f]' : 'text-white hover:bg-white/10'}`}
        >
         
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${view === 'dashboard' ? 'bg-[#D4AF37] text-[#001f3f]' : 'text-white hover:bg-white/10'}`}
        >
          
        </button>
      </nav> */}

      {/* 2. CONTEÚDO DINÂMICO (VIEWS) */}
      <main className="flex-1">
        {view === 'explorer' && <ExplorerView courses={courses} setView={setView} />}
        {view === 'dashboard' && <DashboardView user={user} />}
        {view === 'details' && <DetailsView setView={setView} user={user} />}
      </main>

      {/* 3. RODAPÉ E AUXILIARES */}
      <Footer />
      <Chatbot />
    </div>
  );
}

// --- SUB-VIEWS (Simplificadas para integração) ---

function ExplorerView({ courses, setView }: any) {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="bg-[#001f3f] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Proteja o <span className="text-[#D4AF37]">Futuro Digital</span>
        </h1>
        <p className="text-blue-200 max-w-2xl mx-auto mb-8 font-medium">
          Torne-se um especialista em Cibersegurança com os melhores instrutores do mercado.
        </p>
        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
          <Input placeholder="Buscar por hacking, redes, cloud..." className="pl-12 py-7 rounded-2xl border-none shadow-2xl text-slate-900 text-lg" />
        </div>
      </header>

      <section className="max-w-7xl mx-auto p-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="relative h-52">
              <img src={course.url} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#001f3f] font-black border-none px-4 py-1">
                {course.level}
              </Badge>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-black text-[#001f3f] leading-tight">{course.name}</h3>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                <span className="flex items-center gap-1"><Star size={14} className="text-[#D4AF37] fill-[#D4AF37]"/> {course.rating}</span>
              </div>
              <Button onClick={() => setView('details')} className="w-full bg-[#001f3f] hover:bg-[#D4AF37] hover:text-[#001f3f] text-white font-black py-7 rounded-2xl transition-all">
                DETALHES DO CURSO <ArrowRight className="ml-2" size={18}/>
              </Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
// --- INTERFACES ---
interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: string;
  rating: number;
  students: number;

}






// --- VIEW 2: DASHBOARD DO ALUNO ---
function DashboardView({ user }: any) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="bg-[#001f3f] text-white pt-16 pb-32 px-10 text-center md:text-left">
        <h1 className="text-3xl font-black">Olá, Usuário! 👋</h1>
        <p className="opacity-70 text-blue-200">Continue de onde parou e alcance suas metas de certificação.</p>
      </div>

     

      <section className="max-w-7xl mx-auto px-10 space-y-6 pb-20">
        <h2 className="text-2xl font-bold text-[#001f3f] flex items-center gap-3"><PlayCircle className="text-[#D4AF37]"/> Meus Treinamentos</h2>
        {[1, 2].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center group">
            <div className="w-full md:w-64 h-40 bg-slate-200 rounded-xl overflow-hidden relative">
              <img src="https://images.unsplash.com" className="w-full h-full object-cover" />
              {i === 2 && <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] flex items-center justify-center"><Badge className="bg-green-600 text-white">Concluído</Badge></div>}
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <Badge variant="secondary" className="bg-gray-100 text-[#001f3f]">CIBERSEGURANÇA</Badge>
                <span className="text-[#001f3f] font-black">{i === 2 ? '100%' : '65%'}</span>
              </div>
              <h3 className="text-2xl font-black text-[#001f3f]">Cibersegurança e Crimes Digitais</h3>
              <Progress value={i === 2 ? 100 : 65} className="h-2" />
              <Button className={`font-black px-10 py-6 rounded-xl shadow-lg transition-all ${i === 2 ? 'bg-[#001f3f]' : 'bg-[#D4AF37] text-[#001f3f] hover:bg-[#b8972f]'}`}>
                {i === 2 ? 'REVER CURSO' : 'CONTINUAR'} <ArrowRight className="ml-2"/>
              </Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// --- VIEW 3: DETALHES DO CURSO ---
function DetailsView({ setView, user }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMod, setActiveMod] = useState(0);

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#001f3f] text-white py-16 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <img src="https://images.unsplash.com" className="w-full md:w-1/3 h-72 object-cover rounded-3xl border-4 border-[#D4AF37] shadow-2xl" />
          <div className="space-y-6">
            <div className="flex gap-4"><Badge className="bg-[#D4AF37] text-[#001f3f] font-bold">CURSO GRATUITO</Badge><span className="text-yellow-400 flex items-center gap-1 font-bold">⭐ 4.8</span></div>
            <h1 className="text-5xl font-black">Cibersegurança e Crimes Digitais</h1>
            <p className="text-xl text-blue-200">Carga Horária: 20 horas de conteúdo imersivo.</p>
            <div className="flex items-center gap-3 grayscale opacity-60"><Globe size={20}/> <span className="font-bold text-xs uppercase tracking-tighter">Associação Brasileira de Educação a Distância (ABED)</span></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1"><div className="sticky top-8 space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 font-bold text-gray-500">
          {["Descrição", "Detalhes", "Conteúdo", "Benefícios", "Avaliações"].map(i => <button key={i} className="w-full text-left p-3 hover:text-[#001f3f] transition-colors">{i}</button>)}
        </div></aside>

        <main className="lg:col-span-3 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
             <DetailIcon icon={<ShieldCheck/>} label="HABILIDADE" value="Básico"/>
             <DetailIcon icon={<Clock/>} label="CARGA HORÁRIA" value="20h"/>
             <DetailIcon icon={<BookOpen/>} label="CONTEÚDO" value="8 módulos"/>
             <DetailIcon icon={<Globe/>} label="MODALIDADE" value="100% Online"/>
             <DetailIcon icon={<Award/>} label="MATRÍCULA" value="Grátis"/>
        
          </div>

          <Button onClick={() => !user && setModalOpen(true)} className="w-full py-8 text-2xl font-black bg-[#D4AF37] text-[#001f3f] hover:bg-[#b8972f] rounded-3xl shadow-xl transform hover:scale-[1.01] transition-all">MATRICULE-SE GRÁTIS AGORA!</Button>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-[#001f3f] mb-6">Conteúdo Programático</h2>
            {[1,2,3,4,5,6,7,8].map(m => (
              <div key={m} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setActiveMod(m)} className="w-full p-5 flex justify-between font-bold bg-white hover:bg-gray-50 text-[#001f3f]">Módulo {m} - Tópicos da Segurança Digital </button>
                {activeMod === m && <div className="p-6 bg-gray-50 text-gray-600 border-t">Conteúdo detalhado com videoaulas, laboratórios práticos e materiais complementares em PDF.</div>}
              </div>
            ))}
          </section>
        </main>
      </div>

      {modalOpen && <div className="fixed inset-0 bg-[#001f3f]/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
        <div className="bg-white p-10 rounded-[40px] max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#001f3f]"><Lock size={40}/></div>
          <h2 className="text-3xl font-black text-[#001f3f]">Acesse sua conta para continuar</h2>
          <p className="text-gray-500">Para se matricular neste curso, você precisa estar logado na plataforma.</p>
          <div className="flex flex-col gap-4">
            <Button className="py-6 bg-[#001f3f] font-bold rounded-2xl">Fazer Login</Button>
            <Button variant="outline" className="py-6 border-2 font-bold rounded-2xl">Criar Conta</Button>
            <button onClick={() => setModalOpen(false)} className="text-gray-400 text-sm font-bold underline">Fechar</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

const DetailIcon = ({ icon, label, value }: any) => (
  <div className="flex flex-col items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
    <div className="text-[#D4AF37] mb-2">{icon}</div>
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
    <span className="font-bold text-[#001f3f]">{value}</span>
  </div>
);
