import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";
import { Toast, useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxAuth from "@/components/ParallaxAuth";
import supabase from "../../utils/supabase";
import { Mail, Lock, User } from "lucide-react";

export type UserForm = {
  email: string;
  pass: string;
  name?: string;
};

export default function Auth() {
  const nav = useNavigate();
  const { message, showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserForm>({ email: "", pass: "", name: "" });
  const { t } = useLanguage();

  async function checkedLogin() {
    if (!user.email || !user.pass) {
      showToast("Informe email e senha.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.pass,
    });
    setLoading(false);
    if (error) {
      showToast(error.message);
      return;
    }
    showToast("Login realizado com sucesso.");
    nav("/dash", { replace: true });
  }

  async function handleRegister() {
    if (user?.email && user?.pass) {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: user.email,
        password: user.pass,
      });
      setLoading(false);
      if (error) {
        showToast(error.message);
        return;
      }
      showToast("Conta criada com sucesso. Faça seu login.");
      setIsLogin(true);
    } else {
      showToast("E-mail e senha obrigatórios");
    }
  }

  return (
    <div>
      <Toast message={message} />
      <Header />
      <main>
        <ParallaxAuth>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="auth-wrapper relative w-full max-w-[850px] h-[380px] mx-auto">
              {/* Background with two halves */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-background/40 backdrop-blur-md border border-border/30 shadow-2xl">
                <div className="flex h-full">
                  {/* Left side */}
                  <div className="w-1/2 flex flex-col items-center justify-center p-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Não tem uma conta?
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Cadastre-se e proteja seu mundo digital!
                    </p>
                    <button
                      onClick={() => setIsLogin(false)}
                      className="px-6 py-2.5 rounded-lg border border-primary/60 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      CADASTRAR
                    </button>
                  </div>
                  {/* Right side */}
                  <div className="w-1/2 flex flex-col items-center justify-center p-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Já tem uma conta?
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Entre e continue protegido!
                    </p>
                    <button
                      onClick={() => setIsLogin(true)}
                      className="px-6 py-2.5 rounded-lg border border-primary/60 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      ENTRAR
                    </button>
                  </div>
                </div>
              </div>

              {/* Sliding form container */}
              <div
                className="absolute top-[-20px] w-[400px] bg-card border border-border/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out z-10"
                style={{
                  left: isLogin ? "calc(100% - 420px)" : "20px",
                  height: "420px",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold rounded-t-2xl" />

                {/* Login Form */}
                {isLogin && (
                  <div className="p-10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-gradient-gold mb-8">
                      Entrar
                    </h2>

                    <div className="space-y-5">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="Senha"
                          value={user.pass}
                          onChange={(e) => setUser({ ...user, pass: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>

                      <button
                        onClick={checkedLogin}
                        disabled={loading}
                        className="btn-gold-3d text-primary-foreground w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider mt-4 disabled:opacity-50"
                      >
                        {loading ? "Entrando..." : "ENTRAR"}
                      </button>

                      <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors block text-center mt-2">
                        Esqueceu a senha?
                      </a>
                    </div>
                  </div>
                )}

                {/* Sign Up Form */}
                {!isLogin && (
                  <div className="p-10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-gradient-gold mb-6">
                      Cadastrar
                    </h2>

                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Nome completo"
                          value={user.name || ""}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="Senha"
                          value={user.pass}
                          onChange={(e) => setUser({ ...user, pass: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>

                      <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="btn-gold-3d text-primary-foreground w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider mt-2 disabled:opacity-50"
                      >
                        {loading ? "Criando conta..." : "CADASTRAR"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ParallaxAuth>
      </main>
      <Footer />
      <AccessibilityWidget />
    </div>
  );
}
