import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useAuth } from "../contexts/AuthContext";

export type Signature ={
    cpf?: string,
    paymethod?: string,
    address?: string,
}

export default function Signature(){
    /*  uma variavel que recebeu tipo proprio é um objeto*/
    const [sig, setSig] = useState<Signature>({});

    /* useEffect(() =>{}, []); função anonima, vetor de observados*/
   
    useEffect(() => {
      
        if(user) syncSignature(user.id);
    }, []);
    
    
    async function syncSignature(user_id: string): Promise<void>{
        const {data, error} = await supabase.from('signature').select('*').eq("user_id", user_id).single();
        // para lista ordenada -> order('created_at', {ascending: false})
        if(error){
            alert(error.message) 
            return
        }
        setSig(data)
    }
    const {user, signOutUser} = useAuth();
    
    async function handleSignature(){
        const data = {...sig, user_id: user?.id};
        const {error} = await supabase.from('signature').insert(data);
       
        if(error){
            alert(error.message);
            return
        }
        alert("Cadastrado com sucesso!")
    }

    return (
        <>
            <input 
                type= "text"
                placeholder= "Qual seu CPF?"  
                value={sig.cpf} 
                onChange={
                    (e) => setSig({...sig, cpf: e.target.value})
                } 
            />

             <input 
                type= "text"
                placeholder= "Qual vai ser o método de pagamento?"  
                value={sig.paymethod} 
                onChange={
                    (e)=> setSig({...sig, paymethod: e.target.value})
                }
            />
             <input 
                type= "text"
                placeholder= "Por favor informe seu endereço para cobrança:"  
                value={sig.address} 
                onChange={
                    (e)=> setSig({...sig, address: e.target.value})
                }
            />
            <button onClick ={handleSignature}>Cadastrar</button>

        </>
    )

}