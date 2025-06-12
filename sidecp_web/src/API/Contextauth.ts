import { createContext, useContext } from "react";
import type { userProps } from './authProvider';


export const Auth = createContext<userProps |undefined>(undefined);


export default function useAuthContext(){
    const auth = useContext(Auth)

    if(auth === undefined){
        throw new Error('Check useAuth')
    }
    
    return auth
}