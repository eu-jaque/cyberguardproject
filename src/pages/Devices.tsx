import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
export type Devices = ({
    user?:string,
    devices?:string,
    lasted?:number
});



export default function Device(){
     const {user, signOutUser} = useAuth();
     const[device,setDevice] = useState <Devices> ({});
    async function handleDevice (){
     const data = {...device, user_id: user.id};

     const{error} = await supabase.from('Devices').insert(data);

       if(error){
        alert(error.message);
        return
       }     

       alert("Cadastrado com sucesso")
    }
    
    return(
        <>
        <h1>minha pagina de dispostivos</h1>
             
              <input type= "text" 
              placeholder="User? " 
              value={device.user}
              onChange={ (e) => setDevice({...device, user :(e.target.value)})}/>


              <input type= "text" 
              placeholder="Qual o seu dispostivo" 
              value={device.devices} 
              onChange={ (e) => setDevice({...device,devices:(e.target.value)})}/>

              <input type= "numeric" 
              placeholder="Ultimo login " 
              value={device.lasted}
              onChange={ (e) => setDevice({...device,lasted :Number(e.target.value)})}/>


              <button onClick = {handleDevice}>cadastrar</button>
        </>
        
    )
}