import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
export type Courses = ({
    user?:string,
    description?:string,
    workload?:number,
    status: string,
    level: string
});



export default function Course(){
     const {user, signOutUser} = useAuth();
     const[device,setCourse] = useState <Courses> ({});/* apenas relacionamento muitos pra muitos*/

    useEffect(() => {
    if(user) syncCourses (user?.id);
    }, []);

   async function syncCourses(user_id: string):Promise <void>{
        const{data, error} = await supabase.from('Courses').select("*").eq('user_id', user_id).single();
    
        alert(error.message)
        return
    
    }

    async function handleDevice (){
     const data = {...device, user_id: user.id};

     const{error} = await supabase.from('Courses').insert(data);

       if(error){
        alert(error.message);
        return
       }     
       setCourse(data)

       alert("Cadastrado com sucesso")
    }
    
    return(
        <>
        <h1>cursos</h1>
             
              <input type= "text" 
              placeholder="User? " 
              value={device.user}
              onChange={ (e) => setCourse({...device, user :(e.target.value)})}/>


              <input type= "text" 
              placeholder="Qual o seu dispostivo" 
              value={device.devices} 
              onChange={ (e) => setCourse({...device,devices:(e.target.value)})}/>

              <input type= "numeric" 
              placeholder="Data de criação " 
              value={device.lasted}
              onChange={ (e) => setCourse ({...device,lasted :Number(e.target.value)})}/>


              <button onClick = {handleDevice}>cadastrar</button>
        </>
        
    )
}