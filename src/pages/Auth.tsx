import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";
import { Toast, useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxAuth from "@/components/ParallaxAuth";
import supabase from "../../utils/supabase";
import { Mail, Lock, User as UserIcon } from "lucide-react";

export type User = {
  email: string;
  pass: string;
  name?: string;
};

export default function Auth() {
  const nav = useNavigate();
  const { message, showToast } = useToast();

  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("signup") !== "true");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User>({
    email: "",
    pass: "",
    name: "",
  });

  const { t } = useLanguage();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

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

    // Check if user is an expert (professional)
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (authUser) {
      const { data: expertData } = await supabase
        .from("experts")
        .select("id")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (expertData) {
        nav("/expert-profile", { replace: true });
        return;
      }
    }

    nav("/dash", { replace: true });
  }

  async function handleRegister() {
    if (!user.email || !user.pass) {
      showToast("E-mail e senha obrigatórios");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: user.email,
      password: user.pass,
      options: {
        data: {
          name: user.name,
        },
      },
    });

    setLoading(false);

    if (error) {
      showToast(error.message);
      return;
    }

    showToast("Conta criada com sucesso. Faça seu login.");
    setIsLogin(true);
  }

  return (
    <div>
      <Toast message={message} />
      <Header />

      <main>
        <ParallaxAuth>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="auth-wrapper relative w-full max-w-[850px] h-[420px] mx-auto">

              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-background/40 backdrop-blur-md border border-border/30 shadow-2xl flex">

                {/* LEFT (INFO) */}
                <div className="w-1/2 flex flex-col items-center justify-center p-8 text-center">
                  {!isLogin ? (
                    <>
                      <h2 className="text-2xl font-bold mb-3">
                        Já tem uma conta?
                      </h2>
                      <button
                        onClick={() => setIsLogin(true)}
                        className="px-6 py-2 rounded-lg border"
                      >
                        ENTRAR
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-3">
                        Não tem uma conta?
                      </h2>
                      <button
                        onClick={() => setIsLogin(false)}
                        className="px-6 py-2 rounded-lg border"
                      >
                        CADASTRAR
                      </button>
                    </>
                  )}
                </div>

                {/* RIGHT (FORM) */}
                <div className="w-1/2 flex flex-col justify-center p-8 space-y-4">

                  {!isLogin && (
                    <div className="group space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-primary/70 ml-1">Nome Completo</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                          placeholder="Ex: João Silva"
                        />
                      </div>
                    </div>
                  )}

                  <div className="group space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary/70 ml-1">E-mail corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                        placeholder="nome@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary/70 ml-1">Chave de acesso</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="password"
                        name="pass"
                        value={user.pass}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    onClick={isLogin ? checkedLogin : handleRegister}
                    disabled={loading}
                    className="bg-primary text-white py-2 rounded"
                  >
                    {loading
                      ? "Carregando..."
                      : isLogin
                        ? "Entrar"
                        : "Cadastrar"}
                  </button>

                </div>
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