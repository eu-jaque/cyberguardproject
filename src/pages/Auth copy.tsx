
import { useState } from "react";
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

  const [isLogin, setIsLogin] = useState(false);
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
          <button className="back-btn signup-but"
          onClick={() => setIsLogin(false)} >Cadastrar</button>
        </div>

        <div className="right">
          <h2 className="back-header">Já tem uma conta?</h2>
          <p className="back-p">Entre agora!</p>
          <button className="back-btn login-but"
          onClick={() => setIsLogin(true)}>
            Entrar
          </button>
        </div>
      </div>
  

      <div className="form-container">
        <div className={`sign-up absolute top-[-25px] w-[375px] h-[350px] bg-white text-black shadow-xl p-6 transition-all duration-300 ${
            isLogin ? "left-[400px]" : "left-[10px]"
          }`}>

          {!isLogin ? (
            <div>  
          <h2 className="form-header text-2xl text-[#FC7D5F] mb-4">
            Cadastrar
          </h2> 
          <input 
            type="text" 
            placeholder="Digite o nome completo" className="block"
            >
          </input>

          <input 
            type="email" 
            placeholder="Email"
            className="block"
            onChange={(e) => setUser({ ...user, email: e.target.value })}>
            </input>

          <input 
            type="password" 
            placeholder="Senha"
            className="block w-full border-b mb-4 outline-none"
            onChange={(e) => setUser({ ...user, pass: e.target.value })}>
            </input>


          <button onClick={handleRegister} className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block mt-4 bg-[#FC7D5F] text-white px-4 py-2 hover:bg-[#C53716]">
            Cadastrar
          </button>
        </div>
         ) : (
         
         <div>
          <h2 className="form-header text-2xl text-[#FC7D5F] mb-4">
            Entrar
          </h2>

          <input 
            type="email" 
            placeholder="Email"
            className="block w-full border-b mb-4 outline-none"
            onChange={(e) => setUser({ ...user, email: e.target.value })}>
          </input>

          <input 
            type="password"
            placeholder="Password"
            className="block w-full border-b mb-4 outline-none"
            onChange={(e) => setUser({ ...user, pass: e.target.value })}>
          </input>

          <button  onClick={checkedLogin} className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block mt-4 bg-[#FC7D5F] text-white px-4 py-2 hover:bg-[#C53716]">
            Entrar
          </button>
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




