import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBarMenu";
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import supabase from "../../utils/supabase";
import { toast } from "sonner";
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";

export default function Contact() {

    const [loading, setLoading] = useState(false);

    const containerMargin = "lg:ml-64 ml-0";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Evita envios duplicados ou com erro de validação
        if (loading || phoneError) return;

        setLoading(true);

        try {
            // 1. Reunindo as informações do formulário
            const formData = new FormData(e.target as HTMLFormElement);

            const payload = {
                name: formData.get('nome'), // Certifique-se de adicionar 'name' aos inputs no JSX
                email: formData.get('email'),
                phone: phone, // Já está no estado 'phone' 
                subject: formData.get('assunto'),
                message: formData.get('mensagem'),
                status: 'open'
            };

            const { error } = await supabase
                .from('tickets')
                .insert([payload]);

            if (error) throw error;

            // Sucesso
            (e.target as HTMLFormElement).reset();
            setPhone('');
            toast.success("Mensagem enviada!", {
                description: "Recebemos seu ticket e responderemos em breve.",
                duration: 5000, // 5 segundos de exibição
            });

        } catch (error) {
            console.error("Erro na transação:", error);
        } finally {
            setLoading(false);
        }
    };

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // 2. Função que aplica a máscara e valida repetidos
    const handlePhoneChange = (e) => {
        let v = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
        // Aplica a máscara (00) 00000-0000
        if (v.length > 0) v = '(' + v;
        if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
        if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
        if (v.length > 15) v = v.substring(0, 15);
        setPhone(v);
        // Validação de números repetidos (ex: 999999999)
        const numbersOnly = v.replace(/\D/g, '');
        const isRepeating = /^(\d)\1+$/.test(numbersOnly.slice(2)); // Checa do 3º dígito em diante
        if (isRepeating && numbersOnly.length > 5) {
            setPhoneError("Número inválido (sequência repetida)");
        } else {
            setPhoneError("");
        }
    };
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Main Content - Ajustado para dar espaço à Sidebar */}
            <main className={`flex-1 mt-20 p-6 md:p-12 transition-all duration-300 ${containerMargin}`}>
                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Esquerda: Formulário */}
                        <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
                            <h2 className="text-2xl font-bold text-foreground mb-6">
                                Envie uma <span className="text-gradient-gold">Mensagem</span>
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                        <User size={16} /> Nome Completo / Social
                                    </label>
                                    <input
                                        name="nome"
                                        type="text"
                                        placeholder="Como prefere ser chamado?"
                                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                            <Mail size={16} /> Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                            <Phone size={16} /> Telefone
                                        </label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="(00) 00000-0000"
                                            className={`w-full bg-secondary/50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 
                                                        ${phoneError ? 'border-red-500 focus:ring-red-500/50' : 'border-border focus:ring-primary/50'}`}
                                            required
                                        />
                                        {phoneError && <span className="text-[10px] text-red-500 ml-1">{phoneError}</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                        <MessageSquare size={16} /> Assunto
                                    </label>
                                    <select name="assunto"
                                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
                                        <option>Suporte Técnico</option>
                                        <option>Consultoria de Segurança</option>
                                        <option>Dúvidas sobre Cursos</option>
                                        <option>Parcerias</option>
                                        <option>Outros</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70">Sua Mensagem</label>
                                    <textarea
                                        name="mensagem"
                                        rows={4}
                                        placeholder="Descreva como podemos ajudar..."
                                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-gold-3d w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-primary-foreground transition-all hover:scale-[1.02]"
                                >
                                    {loading ? "Enviando..." : <><Send size={18} /> Enviar Mensagem</>}
                                </button>
                                <p className="text-sm italic text-foreground/60">
                                    A resposta da nossa equipe de suporte será enviada para o seu e-mail cadastrado.
                                </p>
                            </form>
                        </div>

                        {/* Direita: Texto Explicativo */}
                        <div className="lg:pt-10 space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground mb-4">
                                    Estamos prontos para <br />
                                    <span className="text-gradient-gold">proteger seu futuro.</span>
                                </h1>
                                <p className="text-foreground/70 leading-relaxed text-lg">
                                    A equipe da <strong>CyberGuard</strong> está disponível para ajudar você a mitigar riscos,
                                    treinar sua equipe ou resolver problemas técnicos críticos.
                                    Não deixe sua segurança para depois.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Email Direto</h4>
                                        <p className="text-sm text-foreground/60">contato@cyberguard.com.br</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Atendimento Rápido</h4>
                                        <p className="text-sm text-foreground/60">Segunda a Sexta, das 9h às 18h</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-secondary/30 rounded-xl border border-border/50">
                                <p className="text-sm italic text-foreground/60">
                                    "Segurança digital não é um produto, é um processo contínuo."
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}