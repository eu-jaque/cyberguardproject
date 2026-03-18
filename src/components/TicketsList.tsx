import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import { Loader2, AlertCircle, Ticket } from "lucide-react";
import TicketModal from "./TicketModal";

// 1. Defina uma interface clara para o Ticket
interface Ticket {
    id: string;
    name: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
    email: string;
}

interface TicketListProps {
    searchTerm?: string;
    statusFilterTerm?: string
}

export function TicketDataGrid({ searchTerm = "", statusFilterTerm = "all" }: TicketListProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const statusMap: Record<string, string> = {
        "open": "Em Aberto",
        "in_progress": "Em Análise",
        "closed": "Concluído",
        "urgent": "Urgente"
    };
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
            console.log(data);
        } catch (err: any) {
            setError(err.message);
            console.error("Erro ao carregar tickets:", err);
        } finally {
            setLoading(false);
        }
    }

    // Lógica de filtragem local baseada no termo de busca
    const filteredTickets = tickets.filter((ticket) => {
        // Filtro por texto (nome ou assunto)
        const matchesSearch =
            ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por status
        const matchesStatus = statusFilterTerm === "all" || ticket.status === statusFilterTerm;

        return matchesSearch && matchesStatus;
    });

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
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="relative mb-6">
                    {/* Círculo de brilho ao fundo do ícone */}
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />

                    <div className="relative p-6 bg-secondary/30 rounded-full border border-primary/20 text-primary/50">
                        <Ticket size={48} strokeWidth={1} />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                    Nenhum ticket <span className="text-gradient-gold">encontrado</span>
                </h3>

                <p className="text-foreground/60 max-w-xs mx-auto leading-relaxed">
                    No momento não foi encontrado nenhuma solicitação aberta ou que coincidam com sua busca.
                </p>
            </div>
        )
    } else {
        return (
            <div className="divide-y divide-border">
                {filteredTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        // Adicionado: cursor-pointer e onClick
                        className="p-4 hover:bg-secondary/20 transition-colors flex justify-between items-center group cursor-pointer"
                        onClick={() => setSelectedTicket(ticket)}
                    >
                        <div>
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {ticket.subject}
                            </h4>
                            <p className="text-xs text-foreground/60">
                                {ticket.name} • {new Date(ticket.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            {statusMap[ticket.status] || "Pendente"}
                        </span>
                    </div>
                ))}

                {/* 2. Renderização Condicional do Modal */}
                {selectedTicket && (
                    <TicketModal
                        ticket={selectedTicket}
                        onClose={() => setSelectedTicket(null)}
                    />
                )}
            </div>
        );
    }

}