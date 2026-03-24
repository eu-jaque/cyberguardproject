import { useState } from "react";
import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type ExpertFormType = {
  name: string;
  area: string;
  rating: number;
  available: boolean;
  bio: string;
  formation: string;
  convenios: string;
  avatar: string;
};

export default function CreateExpertForm() {
  const { user } = useAuth();
  
  const [expert, setExpert] = useState<ExpertFormType>({
    name: "",
    area: "",
    rating: 5,
    available: true,
    bio: "",
    formation: "",
    convenios: "",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" // fallback avatar
  });

  const handleCreate = async () => {
    if (!user) {
      alert("Você precisa estar logado para cadastrar!");
      return;
    }

    const payload = { ...expert, user_id: user.id };
    const { error } = await supabase.from("experts").insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    alert("SUCESSO AO CADASTRAR ESPECIALISTA!");
    setExpert({ name: "", area: "", rating: 5, available: true, bio: "", formation: "", convenios: "", avatar: expert.avatar });
  };

  return (
    <div className="bg-card p-8 rounded-xl border border-border max-w-2xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Cadastrar Especialista</h2>
      
      <div className="flex flex-col gap-4">
        <input type="text" placeholder="Nome" value={expert.name} className="p-2 border rounded bg-background text-foreground" onChange={(e) => setExpert({ ...expert, name: e.target.value })} />
        <input type="text" placeholder="Área de Especialização" value={expert.area} className="p-2 border rounded bg-background text-foreground" onChange={(e) => setExpert({ ...expert, area: e.target.value })} />
        <input type="number" placeholder="Avaliação (0 a 5)" value={expert.rating} className="p-2 border rounded bg-background text-foreground" onChange={(e) => setExpert({ ...expert, rating: Number(e.target.value) })} />
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="available" checked={expert.available} onChange={(e) => setExpert({ ...expert, available: e.target.checked })} />
          <label htmlFor="available" className="text-foreground text-sm">Disponível para atendimento</label>
        </div>

        <textarea placeholder="Biografia" value={expert.bio} className="p-2 border rounded h-24 bg-background text-foreground" onChange={(e) => setExpert({ ...expert, bio: e.target.value })} />
        <input type="text" placeholder="Formação Acadêmica" value={expert.formation} className="p-2 border rounded bg-background text-foreground" onChange={(e) => setExpert({ ...expert, formation: e.target.value })} />
        <input type="text" placeholder="Convênios (separados por vírgula)" value={expert.convenios} className="p-2 border rounded bg-background text-foreground" onChange={(e) => setExpert({ ...expert, convenios: e.target.value })} />

        <button onClick={handleCreate} className="btn-gold-3d text-primary-foreground py-3 rounded-lg font-bold mt-4">
          Cadastrar Especialista
        </button>
      </div>
    </div>
  );
}