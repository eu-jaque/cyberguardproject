import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import  supabase  from '../../utils/supabase';














const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSignUp = () => {
    console.log("clicou SIGN UP");
    setIsLogin(false);
  };

  const handleLogin = () => {
    console.log("clicou LOGIN");
    setIsLogin(true);
  };

  return (

    <div className="container">
      <div className="buttons">
        <button className="signup-but" onClick={handleSignUp}>
          Cadastre-se
        </button>

        <button className="login-but" onClick={handleLogin}>
          Login
        </button>
      </div>

      <div
        className="form-container"
        style={{
          position: "relative",
          left: isLogin ? "400px" : "10px",
          transition: "left 0.3s ease",
        }}
      >
        {/* Login */}
        <div
          className={`login ${isLogin ? "" : "hide"}`}
          style={{ display: isLogin ? "block" : "none" }}
        >
          <h2>Login</h2>
          {/* seu formulário de login aqui */}
        </div>

        {/* Sign Up */}
        <div
          className={`sign-up ${!isLogin ? "" : "hide"}`}
          style={{ display: !isLogin ? "block" : "none" }}
        >
          <h2>Sign Up</h2>
          {/* seu formulário de cadastro aqui */}
        </div>
      </div>
    </div>
  );
};







export type User = {
  email?: string;
  pass?: string;
};

export default function Auth() {
  const navigate = useNavigate();
  const [tentativa, setTentativa] = useState(0);
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [pToast, setPToast] = useState("");

  function showToast(msg: string) {
    setPToast(msg);
    setTimeout(() => setPToast(""), 5000);
  }

  async function checkedLogin() {
    if (tentativa < 3) {
      setTentativa(tentativa+1)
    }else{
      showToast('Volte mais tarde')
      return;
    }

    setTentativa(tentativa+1);

    if(!user?.email || !user?.pass) {
      showToast("Email e senha obrigatórios");
      return;
    }

    const {error} = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.pass
      });

      if (error) { 
        showToast("Erro ao cadastrar");
        return
      }
  }
    

  async function handleRegister() {
    if (user?.email && user?.pass) {
      setUsers([...users, user]);

      supabase.from('expenses').insert({})

      const {data, error} = await supabase.auth.signUp({
        email: user.email,
        password: user.pass
        
      });

      if (error) showToast("Erro ao cadastrar");
      else showToast("Cadastrado com sucesso");
    } else {
      showToast("E-mail e Senha obrigatórios");
    }
  }





//CERTO
  return (
    <div >
    <Header />
    <div className="wrapper">
      <div className="background">
        <div className="left">
          <h2 className="back-header">Não tem uma conta ainda?</h2>
          <p className="back-p">Cadastre-se agora!</p>
          <button className="back-btn signup-but">Cadastrar</button>
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
          ></input>

          <input 
            type="password" 
            placeholder="Senha"
            ></input>
          <button className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block">Cadastrar</button>
        </div>


        <div className="login hide">
          <h2 className="form-header">Entrar</h2>

          <input 
            type="text" 
            placeholder="Email"
          ></input>

          <input 
            type="password"
            placeholder="Password"
          ></input>
          <button className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block">Entrar</button>
        </div>

      </div>
    </div>
      


      <div >
        {pToast && (
          <div className="fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-primary text-primary-foreground">
            <p>{pToast}</p>
          </div>
        )}
     

        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setUser({ ...user, pass: e.target.value })}
        />

        {login ? (
          <button className="btn-login bg-primary text-primary-foreground px-5 py-2 rounded-[5px] text-sm font-semibold" onClick={checkedLogin}>
            Login {tentativa > 0 && tentativa}
          </button>
        ) : (
          <button className="btn-login bg-primary text-primary-foreground px-5 py-2 rounded-[5px] text-sm font-semibold" onClick={handleRegister}>
            Cadastre-se
          </button>
        )}

        <button className="text-primary hover:underline text-sm" onClick={() => setLogin(!login)}>
          {login ? "Clique aqui para fazer cadastro" : "Clique aqui para fazer login"}
        </button>
      </div>


    </div>

  );
}
