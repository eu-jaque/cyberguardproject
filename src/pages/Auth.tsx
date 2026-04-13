import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Toast, useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxAuth from "@/components/ParallaxAuth";
import supabase from "../../utils/supabase";
import { Mail, Lock, User as UserIcon, ShieldCheck } from "lucide-react";
// import HCaptcha from "@hcaptcha/react-hcaptcha";
import { motion, AnimatePresence } from "framer-motion";
import authImg from "@/assets/hacker-parallax.jpg";

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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

    if (!captchaToken) {
      showToast("Complete o captcha.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            password: user.pass,
            captchaToken,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Erro no login");
        return;
      }

      // 🔥 Persistir sessão manualmente
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      showToast("Login realizado com sucesso");

      nav("/dash", { replace: true });

    } catch (err) {
      showToast("Erro de conexão");
    } finally {
      setLoading(false);
      setCaptchaToken(null);
    }
  }

  async function handleRegister() {
    if (!user.email || !user.pass) {
      showToast("E-mail e senha obrigatórios");
      return;
    }

    if (!captchaToken) {
      showToast("Complete o captcha.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            password: user.pass,
            name: user.name,
            captchaToken,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Erro ao registrar");
        return;
      }

      showToast("Conta criada com sucesso");
      setIsLogin(true);

    } catch {
      showToast("Erro de conexão");
    } finally {
      setLoading(false);
      setCaptchaToken(null);
    }
  }

  return (
    <div>
      <Toast message={message} />
      <Header />

      <main className="min-h-[calc(100vh-80px)] pt-[80px] flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
        {/* QUADRADINHOS BACKGROUND (GRID) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />

        {/* BACKGROUND DECORATION */}
        <div className="absolute top-[-100px] left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-[1000px] min-h-[600px] mx-4 my-8 z-10 flex flex-col md:flex-row rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-white/5 bg-card/30 backdrop-blur-sm"
        >
          {/* LEFT PANEL (INFO) */}
          <div
            className="w-full md:w-5/12 relative hidden md:block overflow-hidden bg-primary/5 backdrop-blur-2xl border-r border-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center p-12 text-center">
              <ShieldCheck className="w-16 h-16 text-primary mb-6 drop-shadow-glow" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login-msg" : "reg-msg"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase italic underline decoration-primary decoration-2 underline-offset-4">
                    {isLogin ? "Cyber Guard" : "Junte-se"}
                  </h2>
                  <p className="text-white/80 text-xs font-medium max-w-[200px] mx-auto">
                    {isLogin ? "Continue seus estudos." : "Aprenda com os melhores."}
                  </p>
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="btn-gold-3d mt-6 px-8 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"
                  >
                    {isLogin ? "Criar Conta" : "Fazer Login"}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT PANEL (FORM) */}
          <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-card/80 backdrop-blur-md">
            <div className="mb-10 block md:hidden text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold italic uppercase">{isLogin ? "Login" : "Cadastro"}</h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-side" : "reg-side"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gradient-gold">
                    {isLogin ? "Bem-vindo" : "Novo Cadastro"}
                  </h3>
                  <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Insira suas credenciais</p>
                </div>

                <div className="space-y-5">
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
                          className="w-full pl-12 pr-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-white"
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
                        className="w-full pl-12 pr-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-white"
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
                        className="w-full pl-12 pr-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* <HCaptcha
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                  theme="dark"
                /> */}

                <div className="pt-2">
                  <button
                    onClick={isLogin ? checkedLogin : handleRegister}
                    disabled={loading}
                    className="w-full btn-gold-3d text-primary-foreground font-black py-4 rounded-xl shadow-xl shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 text-sm italic uppercase tracking-widest"
                  >
                    {loading ? "Processando..." : isLogin ? "Autenticar Conta" : "Finalizar Cadastro"}
                  </button>

                  <div className="mt-6 text-center md:hidden">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isLogin ? "Não tem conta? Cadastrar" : "Já tem conta? Entrar"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <AccessibilityWidget />
    </div>
  );
}