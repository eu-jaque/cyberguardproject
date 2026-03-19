import { Filter } from "lucide-react";
import { toast } from "sonner";
import supabase from "../../utils/supabase";
import { useState } from "react";

export default function TicketModal({ ticket, onClose }) {
    const [StatusAtual, setStatusAtual] = useState(ticket.status || "")

    const statusMap: Record<string, string> = {
        "open": "Em Aberto",
        "in_progress": "Em Análise",
        "closed": "Concluído",
        "urgent": "Urgente"
    };
    async function handleAttStatus(newStatus) {
        try {
            setStatusAtual(newStatus);
            const { error } = await supabase
                .from("tickets")
                .update({ status: newStatus })
                .eq("id", ticket.id);

            if (error) {
                setStatusAtual(ticket.status)
                throw error
            };

            // Feedback de sucesso
            toast.success("Status atualizado!");

            // Opcional: Recarregar a lista no componente pai ou atualizar o objeto localmente
            // Se o seu componente pai tiver uma função fetchTickets, chame-a aqui via props
            // Ex: onUpdate(); 

        } catch (err) {
            toast.error("Erro ao atualizar status");
            console.error(err);
        }
    }
    const handleResponder = () => {
        const subject = encodeURIComponent(`Re: ${ticket.subject} (Chamado #${ticket.id})`);
        const body = encodeURIComponent(`Olá ${ticket.name},\n\nSobre o seu chamado: "${ticket.subject}"...\n\n---\nResposta do Suporte:`);

        // Substitua 'suporte@suaempresa.com' pelo e-mail real se tiver, 
        // ou use o e-mail do próprio ticket se ele existir (ticket.email)
        window.location.href = `mailto:${ticket.email || 'contato@cyberguard.com.br'}?subject=${subject}&body=${body}`;
    };
    if (!ticket) {
        toast.error("Atenção!", {
            description: "Não foi possivel abrir o ticket.",
            duration: 5000, // 5 segundos de exibição
        });
        return;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background border border-border w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold">{ticket.subject}</h2>
                        <button onClick={onClose} className="text-foreground/60 hover:text-foreground">✕</button>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-foreground/40 font-medium uppercase text-[10px]">Cliente</p>
                                <p>{ticket.name}</p>
                            </div>
                            <div>
                                <p className="text-foreground/40 font-medium uppercase text-[10px]">Status</p>
                                <select
                                    value={StatusAtual}
                                    onChange={(e) => handleAttStatus(e.target.value)}
                                    className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                                >
                                    <option value="open">Em Aberto</option>
                                    <option value="in_progress">Em Análise</option>
                                    <option value="closed">Concluídos</option>
                                    <option value="urgent">Urgentes</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <p className="text-foreground/40 font-medium uppercase text-[10px]">Descrição do Chamado</p>
                            <div className="mt-1 p-3 bg-secondary/20 rounded-md border border-border italic">
                                {ticket.message || "Nenhuma descrição fornecida."}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleResponder}
                            className="px-4 py-2 bg-primary rounded-md hover:opacity-90 transition-opacity font-weight: 700;"
                        >
                            Responder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};