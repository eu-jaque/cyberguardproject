    import { Link } from "react-router-dom"
    import { useState } from "react";


export default function Auth(){
    const [tentativa, setTentativa] = useState(0);
    const [ login, setLogin] = useState(true)
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [user, setUser] = useState({
       email:"isabela.crsilvestre@senacsp.edu.br",
       pass:"010101"     
    });

function checkedLogin(){

    if(tentativa < 3){
        setTentativa (tentativa+1)
    }
    else{
        alert('volte mais tarde')
        return;
    }
    //comparando  a variavel com o objeto.atributo
    //as duas condiçoes precisam ser verdade
    if (email == user.email && pass == user.pass){
        alert('Login realizado')

    } else{
            alert('Email e senha invalidos')
    }
}
        
    function handleRegister(){

    }
    
    return (
        <>
        <h1>Pagina de login</h1>
        <Link to='/'>Voltar</Link>
        <input type= "email" onChange= {(e) => setEmail(e.target.value)}/>
        <input type= "pass" onChange = {(e) => setPass(e.target.value)}/>

        {/*teste? <verdadeiro> :< falso>   */}
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