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
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full pl-10 p-2 rounded border"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 rounded border"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5" />
                    <input
                      type="password"
                      name="pass"
                      placeholder="Senha"
                      value={user.pass}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 rounded border"
                    />
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