
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";
import { Toast, useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxAuth from "@/components/ParallaxAuth";
import  supabase  from '../../utils/supabase';

export type User = {
  email: string;
  pass: string;
};



export default function Auth() {

  const nav = useNavigate();
  const{message, showToast} = useToast(); 

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User>();

  

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

      if (error) {
        showToast(error.message);
        return;
      }

      showToast("Conta criada com sucesso. Faça seu login.");
    }else{
        showToast('E-mail e senha obrigatórios');
    }
  }   






  return (
    
    <div >
       <Toast message={message} />

    <Header />
    <main>
    <ParallaxAuth >
    <div className="wrapper">


      <div className="background">
        <div className="left">
          <h2 className="back-header">Não tem uma conta ainda?</h2>
          <p className="back-p">Cadastre-se agora!</p>
          <button className="back-btn signup-but" >Cadastrar</button>
        </div>

        <div className="right">
          <h2 className="back-header">Já tem uma conta?</h2>
          <p className="back-p">Entre agora!</p>
          <button className="back-btn login-but">Entrar</button>
        </div>
      </div>

      <div className="form-container">




        <div className="sign-up">
          <h2 className="form-header">Cadastrar</h2>
                  
          <input 
            type="text" 
            placeholder="Digite o nome completo"
          ></input>

          <input 
            type="text" 
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          ></input>

          <input 
            type="password" 
            placeholder="Senha"
            onChange={(e) => setUser({ ...user, pass: e.target.value })}
            ></input>
          <button onClick={handleRegister} className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block">
            Cadastrar
          </button>
        </div>


        <div className="login hide">
          <h2 className="form-header">Entrar</h2>

          <input 
            type="text" 
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          ></input>

          <input 
            type="password"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, pass: e.target.value })}
          ></input>
          <button  onClick={checkedLogin} className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block">
            Entrar
          </button>

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




