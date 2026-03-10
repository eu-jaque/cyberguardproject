import { useState } from "react";

export type Profile = {
  name?: string,
  cpf?: string,
  phone?: string,
  birth?: string
};

export default function Profile(){


    /*uma variavel que recebeu um tipo propio é um objeto*/
    const [prof, setProf] = useState<Profile>({});

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

        </>
    )
}