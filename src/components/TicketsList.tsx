import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import { Loader2, AlertCircle } from "lucide-react";

// 1. Defina uma interface clara para o Ticket
interface Ticket {
    id: string;
    nome: string;
    assunto: string;
    mensagem: string;
    status: string;
    created_at: string;
}

interface TicketListProps {
    searchTerm?: string;
}

export function TicketDataGrid({ searchTerm = "" }: TicketListProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    async function fetchTickets() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("tickets")
                .select("*")
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setTickets(data);
        } catch (err: any) {
            setError(err.message);
            console.error("Erro ao carregar tickets:", err);
        } finally {
            setLoading(false);
        }
    }

    // Lógica de filtragem local baseada no termo de busca
    const filteredTickets = tickets.filter(ticket =>
        ticket.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Estado de Carregamento
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="text-primary animate-spin" size={32} />
            </div>
        );
    }

    // Estado de Erro
    if (error) {
        return (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 m-6">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">Erro ao conectar com a base de dados.</span>
            </div>
        );
    }

    // Estado Vazio (Aquele componente estilizado que criamos antes)
    if (filteredTickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                {/* ... (Aquele código do Empty State que te mandei antes) ... */}
                <p className="text-foreground/50">Nenhum registro encontrado.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border">
            {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-secondary/20 transition-colors flex justify-between items-center group">
                    <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {ticket.assunto}
                        </h4>
                        <p className="text-xs text-foreground/60">{ticket.nome} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {ticket.status || 'Pendente'}
                    </span>
                </div>
            ))}
        </div>
    );
}