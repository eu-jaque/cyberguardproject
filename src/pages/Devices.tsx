
import { useState } from "react";
export type Devices = ({
    user?:string,
    devices?:string,
    lasted?:number
});



export default function Device(){
     const[device,setDevice] = useState <Devices> ({});
    
    
    return(
        <>
        <h1>minha pagina de device</h1>
             
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
        </>
        
    )
}