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

export type User = {
  email: string;
  pass: string;
  name?: string;
};

export default function Auth() {
  const nav = useNavigate();
  const{message, showToast} = useToast(); 

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User>({
    email:'',
    pass:'',
    name:''
  });


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
    return;
     
  }


  async function handleRegister(){
    if(user?.email && user?.pass){

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

    <Header />
 </div>
 </div>

   
    </ParallaxAuth>
    </main>

    <Footer />
    <AccessibilityWidget />
    </div>

  );
}
