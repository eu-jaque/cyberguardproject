import React, { useState } from 'react';
import Sidebar from '@/components/SideBarMenu'; // Ajuste o caminho
import { TicketDataGrid } from '@/components/TicketsList'; // Componente solicitado
import { Ticket, Filter, Search, Plus } from 'lucide-react';

export default function ViewTickets() {
    const [searchTerm, setSearchTerm] = useState('');
    const containerMargin = "lg:ml-64 ml-0";

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {/* Main Content */}
            <main className={`flex-1 p-6 md:p-12 transition-all duration-300 ${containerMargin}`}>
                <div className="max-w-6xl mx-auto">

                    {/* Header da Tela */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">
                                Seus <span className="text-gradient-gold">Tickets</span>
                            </h1>
                            <p className="text-foreground/70 mt-2">
                                Gerencie e acompanhe o status das solicitações de suporte.
                            </p>
                        </div>

                        {/* <button className="btn-gold-3d flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-primary-foreground transition-all hover:scale-[1.02]">
                            <Plus size={18} /> Novo Ticket
                        </button> */}
                    </div>

                    <div className="grid grid-cols-1 gap-8">

                        {/* Barra de Filtros e Busca */}
                        <div className="bg-card p-4 rounded-xl border border-border shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por assunto ou ID..."
                                    className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Filter size={18} className="text-primary" />
                                <select className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                                    <option>Todos os Status</option>
                                    <option>Em Aberto</option>
                                    <option>Em Análise</option>
                                    <option>Concluídos</option>
                                </select>
                            </div>
                        </div>

                        {/* Conteúdo Principal: Lista de Tickets */}
                        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-border bg-secondary/20">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Ticket size={20} className="text-primary" />
                                    Últimos Tickets
                                </h3>
                            </div>

                            <div className="p-0">
                                {/* Componente de Lista que você solicitou */}
                                <TicketDataGrid searchTerm={searchTerm} />
                            </div>
                            {/* Empty State - Exibido quando a lista está vazia */}
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

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Limpar todos os filtros
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
