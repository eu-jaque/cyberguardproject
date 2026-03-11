import { useState } from "react";
import supabase from "../../utils/supabase";
import { useAuth } from "../contexts/AuthContext";

export type Profile = {
  name?: string,
  cpf?: string,
  phone?: string,
  birth?: string
};

export default function Profile(){
    const {user, signOutUser} =  useAuth();

    /*uma variavel que recebeu um tipo propio é um objeto*/
    const [prof, setProf] = useState<Profile>({});

    async function handleProfile(){
        const data = {...prof, user_id: user?.id};

        const { error} = await supabase.from('profiles')
            .insert(data);
            if(error){
                alert(error.message);
                return
            }

            alert("Cadastrado com sucesso")
    }

    return (
        <>
            <input 
                type="text"
                placeholder="Qual é o seu nome?"
                value={prof.name}
                onChange={
                    (e) => setProf({...prof, name: e.target.value})
                }
            />

            <input 
                type="text"
                placeholder="Qual é o seu CPF?"
                value={prof.cpf}
                onChange={
                    (e) => setProf({...prof, cpf: e.target.value})
                }
            />

            <input 
                type="text"
                placeholder="Qual é o seu número celular?"
                value={prof.phone}
                onChange={
                    (e) => setProf({...prof, phone: e.target.value})
                }
            />

            <input 
                type="text"
                placeholder="Qual é a sua data de nascimento?"
                value={prof.birth}
                onChange={
                    (e) => setProf({...prof, name: e.target.value}) //credits: Number(e.target.value)
                }
            />

            <button onClick={handleProfile}>Cadastrar</button>

        </>
    )
}