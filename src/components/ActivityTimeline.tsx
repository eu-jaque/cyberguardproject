import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';
import { Star, CheckCircle2, UserCheck, MessageSquare, Zap, Trophy, Medal, Crown } from 'lucide-react';

const ProgressBar = ({ label, value, icon: Icon, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-[9px] text-blue-200/50 mb-1 uppercase font-bold tracking-tighter">
      <span className="flex items-center gap-1"><Icon size={10} /> {label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden border border-white/5">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${value || 0}%` }}
      />
    </div>
  </div>
);

const ExpertCard = ({ expert, position }) => {
  const isTop1 = position === 0;

  const getMedal = (pos) => {
    if (pos === 0) return <Trophy className="text-amber-400 animate-pulse w-6 h-6 md:w-7 md:h-7" />;
    if (pos === 1) return <Medal className="text-blue-300/70 w-5 h-5 md:w-6 md:h-6" />;
    if (pos === 2) return <Medal className="text-amber-600/70 w-5 h-5 md:w-6 md:h-6" />;
    return <span className="text-blue-900/40 font-bold text-lg">#{pos + 1}</span>;
  };

  return (
    <div className={`
      relative p-5 md:p-6 flex flex-col rounded-[2rem] transition-all duration-500 group
      ${isTop1 
        ? 'bg-gradient-to-br from-[#1a1c2c] to-[#0f101a] border-2 border-amber-500/40 shadow-[0_0_40px_-12px_rgba(245,158,11,0.2)] md:scale-105 z-10' 
        : 'bg-[#0a0c14] border border-blue-900/30 hover:border-amber-500/30 shadow-2xl'}
    `}>
      {isTop1 && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
      )}

      <div className="absolute top-5 right-6">{getMedal(position)}</div>

      {isTop1 && (
        <div className="flex items-center gap-1 text-[9px] font-black text-amber-500 mb-2 uppercase tracking-[0.2em]">
          <Crown size={10} /> Expert de Elite
        </div>
      )}

      <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
        <div className="relative shrink-0">
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl p-0.5 ${isTop1 ? 'bg-amber-500' : 'bg-blue-800'}`}>
            <img 
              src={expert.image || `https://dicebear.com{expert.name}`} 
              className="w-full h-full bg-[#0a0c14] rounded-[14px] object-cover"
              alt="Avatar"
            />
          </div>
          {/* Mostra check azul se 'available' for true no Supabase */}
          <div className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-[#0a0c14] ${expert.available ? 'bg-blue-500' : 'bg-gray-600'}`}>
            <CheckCircle2 size={10} className="text-[#0a0c14]" />
          </div>
        </div>
        <div className="overflow-hidden">
          <h3 className="text-blue-50 font-bold text-base md:text-lg leading-tight truncate group-hover:text-amber-400 transition-colors">
            {expert.name}
          </h3>
          <p className="text-amber-500/80 text-[9px] font-black tracking-widest uppercase mt-1 truncate">
            {expert.area}
          </p>
        </div>
      </div>

      {/* Como sua tabela não tem as porcentagens, usei valores fixos ou você pode adicionar as colunas depois */}
      <div className={`p-4 rounded-2xl border mb-5 ${isTop1 ? 'bg-black/40 border-amber-500/20' : 'bg-black/20 border-blue-900/20'}`}>
        <ProgressBar label="Avaliação" value={expert.rating * 20} icon={Star} color="bg-amber-500" />
        <ProgressBar label="Disponibilidade" value={expert.available ? 100 : 0} icon={Zap} color="bg-blue-600" />
        <p className="text-[10px] text-blue-100/60 mt-2 line-clamp-2 italic">"{expert.bio}"</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-amber-500" fill="currentColor" />
          <span className="text-blue-100 font-bold text-xs md:text-sm">{expert.rating}</span>
        </div>
        <button className={`
          text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg transition-all
          ${isTop1 ? 'bg-amber-500 text-black hover:bg-amber-400' : 'text-amber-500 border border-amber-500/20 hover:bg-amber-500/10'}
        `}>
          Ver Perfil
        </button>
      </div>
    </div>
  );
};

export default function RankingElite() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperts() {
      const { data, error } = await supabase
        .from('experts') // Nome da sua tabela
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Erro:', error);
      } else {
        setExperts(data);
      }
      setLoading(false);
    }
    fetchExperts();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#020408] flex items-center justify-center text-amber-500 animate-pulse uppercase tracking-widest">Carregando especialistas...</div>;

  return (
    <div className="min-h-screen bg-[#020408] p-6 md:p-12 lg:p-20 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[150%] h-[40%] bg-blue-900/20 -rotate-12 transform" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[150%] h-[50%] bg-blue-900/10 -rotate-12 transform" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl text-white font-black italic tracking-tighter mb-3 uppercase">
            Ranking dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600 bg-[length:200%_auto] animate-pulse">Especialistas</span>
          </h1>
          <p className="text-blue-300/40 text-[9px] md:text-xs max-w-[280px] md:max-w-lg mx-auto uppercase tracking-[0.3em] font-bold">
            Performance e Qualificações Verificadas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 items-stretch">
          {experts.map((e, index) => (
            <ExpertCard key={e.id} expert={e} position={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
