import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function Logout(){
    const navigation = useNavigate()
    useEffect(
        ()=>{
            navigation('/login')
            
        }
    ,[]);
    
   return (
    <></>
   )
}