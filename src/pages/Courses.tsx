import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
export type Courses = ({
    name?:string,
    description?:string,
    workload?:number,
    status: string,
    level: string
});



export default function Course(){
     const {user, signOutUser} = useAuth();
     const[device,setCourse] = useState <Courses> ();/* apenas relacionamento muitos pra muitos*/

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
              placeholder="name? " 
              value={device.name}
              onChange={ (e) => setCourse({...device, name :(e.target.value)})}/>


              <input type= "text" 
              placeholder="Qual o seu dispostivo" 
              value={device.description} 
              onChange={ (e) => setCourse({...device,description:(e.target.value)})}/>

              <input type= "numeric" 
              placeholder="Data de criação " 
              value={device.workload}
              onChange={ (e) => setCourse ({...device,workload :Number(e.target.value)})}/>

              <input type= "text" 
              placeholder="status do curso" 
              value={device.status}
              onChange={ (e) => setCourse ({...device,status:(e.target.value)})}/>

               <input type= "text" 
              placeholder="Básico, Intermediário, Avançado" 
              value={device.level}
              onChange={ (e) => setCourse ({...device,level:(e.target.value)})}/>
  


              <button onClick = {handleDevice}>cadastrar</button>
        </>
        
    )
}