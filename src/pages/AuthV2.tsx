import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, LogIn, UserPlus } from "lucide-react"; // Importando ícones para combinar com seu padrão
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";
import ParallaxAuth from "@/components/ParallaxAuth";
import supabase from "../../utils/supabase";

export default function Auth() {
  const navigate = useNavigate();

  // Estados de controle
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pToast, setPToast] = useState("");
  const [tentativas, setTentativas] = useState(0);

  // Estados dos inputs
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const showToast = (msg: string) => {
    setPToast(msg);
    setTimeout(() => setPToast(""), 5000);
  };

  // 🚪 Lógica de Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tentativas >= 3) return showToast("Muitas tentativas. Volte mais tarde.");
    if (!email || !pass) return showToast("E-mail e senha são obrigatórios.");

    setLoading(true);
    setTentativas((prev) => prev + 1);

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

    setLoading(false);
    if (error) {
      showToast("Erro ao fazer login. Verifique suas credenciais.");
    } else {
      showToast("Bem-vindo de volta!");
      navigate("/dashboard");
    }
  };

  // 📝 Lógica de Cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) return showToast("E-mail e senha são obrigatórios.");

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { display_name: nome } },
    });

    setLoading(false);
    if (error) {
      showToast(error.message);
    } else {
      showToast("Cadastrado com sucesso! Verifique seu e-mail.");
      setIsLogin(true); // Redireciona para o login
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 flex items-center justify-center">
        <ParallaxAuth>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LADO 1: O Formulário Dinâmico (Toma 7 colunas no desktop) */}
            <div className="lg:col-span-7 bg-card p-8 rounded-2xl border border-border shadow-xl min-h-[500px] flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isLogin ? "Entre na sua " : "Crie sua "}
                <span className="text-gradient-gold">Conta</span>
              </h2>

              <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* Campo Nome (Apenas no Cadastro) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                        <User size={16} /> Nome Completo
                      </label>
                      <input
                        type="text"
                        placeholder="Como prefere ser chamado?"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                      <Lock size={16} /> Senha
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold-3d w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-primary-foreground transition-all hover:scale-[1.02]"
                  >
                    {loading ? (
                      "Processando..."
                    ) : isLogin ? (
                      <>
                        <LogIn size={18} /> Entrar {tentativas > 0 && `(${tentativas})`}
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} /> Criar Conta
                      </>
                    )}
                  </button>

                  <p className="text-sm text-center text-foreground/60">
                    {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-primary hover:underline font-semibold"
                    >
                      {isLogin ? "Cadastre-se" : "Faça Login"}
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* LADO 2: Texto Explicativo Estático (Toma 5 colunas no desktop) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center h-full min-h-[400px]">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Sua segurança <br />
                  <span className="text-gradient-gold">é nossa prioridade.</span>
                </h1>
                <p className="text-foreground/70 leading-relaxed text-lg">
                  Acesse o portal da <strong>CyberGuard</strong> para gerenciar seus dados, rastrear custos e proteger seu patrimônio digital.
                </p>
              </div>

              <div className="p-6 bg-secondary/30 rounded-xl border border-border/50">
                <p className="text-sm italic text-foreground/60">
                  "O elo mais forte da segurança digital começa com o controle de acesso inteligente."
                </p>
              </div>
            </div>

          </div>
        </ParallaxAuth>
      </main>

      <Footer />
      <AccessibilityWidget />

      {/* Toasts */}
      {pToast && (
        <div className="fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-primary text-primary-foreground">
          <p>{pToast}</p>
        </div>
      )}
    </div>
  );
}