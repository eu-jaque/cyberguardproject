import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

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

  function checkedLogin() {
    if (tentativa < 3) {
      setTentativa(tentativa + 1);
    } else {
      showToast("Volte mais tarde");
      return;
    }
    const loged = users.find((u) => u.email === user?.email && u.pass === user?.pass);
    if (loged) {
      showToast("Login realizado");
      navigate("/dash");
    } else {
      showToast("E-mail e senha inválidos");
    }
  }

  function handleRegister() {
    if (user?.email && user?.pass) {
      setUsers([...users, user]);
      showToast("Cadastro com sucesso");
    } else {
      showToast("E-mail e Senha obrigatórios");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center pt-32 gap-4">
        {pToast && (
          <div className="fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-primary text-primary-foreground">
            <p>{pToast}</p>
          </div>
        )}
        <h1 className="font-display text-2xl text-foreground">Página de Login</h1>
        <input
          className="bg-card border border-border text-foreground rounded-md px-3 py-2 text-sm w-64"
          type="email"
          placeholder="E-mail"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          className="bg-card border border-border text-foreground rounded-md px-3 py-2 text-sm w-64"
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
