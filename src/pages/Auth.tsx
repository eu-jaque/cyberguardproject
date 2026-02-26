    import { Link } from "react-router-dom"
    import { useState } from "react";
    import { useNavigate } from "react-router-dom";

    export type User = {
    email?: string; 
    pass?: string;
}



export default function Auth(){
     const navigate = useNavigate ();

    const [tentativa, setTentativa] = useState(0);
    const [ login, setLogin] = useState(true)

    const[user , setUser] = useState<User>();
    const[users, setUsers] = useState<User[]>([]);
  
function checkedLogin(){

    if(tentativa < 3){
        setTentativa (tentativa+1)
    }
    else{
        showToast('volte mais tarde')
        return;
    }
 
let loged = users.find( u => u.email == user?.email && u.pass === user?.pass)

     if(loged){
        showToast('Login realizado')
        navigate('/dash');
    }else{
        showToast('email e senha invalidos')
    }
   
}
        
    function handleRegister(){
          if(user?.email && user?.pass){

            setUsers([...users, user]);
            showToast("cadastro com sucesso");
        }else{
            showToast("Email e Senha obrigatórios");
        }
    }
    const[pToast, setPToast] = useState('');
       function showToast(msg:string)
        {setPToast(msg);

        setTimeout( () => 
            {setPToast(''); 
             } , 5000 ); 

}
  

    return (
        <>
        {pToast.length && (
            <div className="toast">
                <p id="toast"> {pToast} </p>
            </div>
    )
}
        <h1>Pagina de login</h1>
        <Link to='/'> Voltar </Link>
        <input className="preto" type="email" onChange={
            (e) => setUser({ ...user, email: e.target.value})} />

        <input className="preto" type="password" onChange={ (e) => setUser ({ ...user,pass:e.target.value})} />

        
        { login? ( <a className="button" onClick={ () => checkedLogin() }> login {tentativa} </a>

             
        ):( 
             <a className="button"onClick= { () => handleRegister() }> Cadastre-se </a>
         )}
             <a className="Link" onClick={ () => setLogin(!login)}> {login? "Clique aqui para fazer casdastro" 
             :"clique aqui para fazer login"}
             
             </a>
        </>
    )
}