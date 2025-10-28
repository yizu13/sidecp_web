import { type ReactNode, useState, useMemo, useEffect, useCallback, useRef } from "react"
import React from "react"
import { Auth } from "./Contextauth"
import axiosLog from './AxiosLogServer'
import { useNavigate } from "react-router-dom"
import { axiosIntercep } from "./methods"

type props = {
    children : ReactNode
}

type user ={
    email: string
    lastname: string
    name: string
    role: string
}

export interface userProps {
    login: (data: object) => Promise<void>,
    role: string | null,
    user: user | undefined | null
}


export default function Authsystem({ children }: props){
    const [accessToken, setAccesToken] = useState('token');
    const [refreshToken, setrefreshToken] = useState('refresh');
    const [ user, setUser ] = useState<user | null>();
    const [role, setRole] = useState<string | null>('role')
    const navigation = useNavigate()
    
    // Control para evitar múltiples alerts
    const sessionExpiredAlertShown = useRef(false);

    useEffect(()=>{
        if(refreshToken !== 'refresh'){
            const autoCheck = setTimeout(()=>{
                axiosIntercep.get("/userInfo");
                setrefreshToken('refresh');
            }, 605*1000)
            console.log("flow")
            return (()=>{
                clearTimeout(autoCheck);
            })
        }
    },[refreshToken])

    useEffect(()=>{
        const resRequest = axiosIntercep.interceptors.request.use(
            config => {
                const token = accessToken
                if(token){
                    config.headers['authorization'] = `Bearer ${accessToken}`;
                }
                return config
            },
            (err)=> Promise.reject(`request err: ${err}`)

        );

        const resResponse =  axiosIntercep.interceptors.response.use(
            (response)=>{
                return response
            }, 
            async (err) =>{
                const originRequest = err.config;
                if(err.response.status === 402 && !originRequest._retry){
                    originRequest._retry = true
                    try{
                        const sessionToken = sessionStorage.getItem("token") ?? 'refresh';
                        if(refreshToken === 'refresh'){
                            setrefreshToken(sessionToken);
                        }
                        const newAccess = await axiosLog.post('/auth/token', { token: refreshToken === 'refresh'? sessionToken : refreshToken });
                        const newAccessToken = newAccess.data.accessToken;
                        setAccesToken(newAccessToken);

                        originRequest.headers['authorization'] = `Bearer ${newAccessToken}`

                        return axiosLog(originRequest);
                    }catch(errorRefresh){
                        originRequest.headers['authorization'] = `Bearer`
                        
                        // Solo mostrar alert una vez
                        if (!sessionExpiredAlertShown.current) {
                            sessionExpiredAlertShown.current = true;
                            alert("session expired");
                            
                            // Resetear el flag después de un tiempo para futuras sesiones
                            setTimeout(() => {
                                sessionExpiredAlertShown.current = false;
                            }, 1000);
                        }
                        
                        // send to login
                        await axiosLog.delete('/auth/logout', { data: { token: refreshToken } });
                        navigation('/login');
                        return Promise.reject(errorRefresh);
                    }
                }
                return Promise.reject(err);
            }
        )
        return (()=>{
            axiosIntercep.interceptors.request.eject(resRequest);
            axiosIntercep.interceptors.response.eject(resResponse);
        })
    }, [accessToken, refreshToken, navigation])

    const login = useCallback(async (credentials: object) => {
        try {
            const response = await axiosLog.post("/auth/login", credentials);
            setAccesToken(response.data.accessToken);
            setrefreshToken(response.data.refreshToken);
            setRole(response.data.user.role);
            setUser(response.data.user);
            sessionStorage.setItem("role", response.data.user.role);
            sessionStorage.setItem("user", JSON.stringify(response.data.user))
            console.log(JSON.stringify(response.data.user))
            sessionStorage.setItem("token", response.data.refreshToken)
            
            // Resetear el flag al hacer login exitoso
            sessionExpiredAlertShown.current = false;
        } catch (err) {
            setRole(null);
            setUser(null);
            throw new Error(`problem when login, ${err}`)
        }
    }, [setAccesToken, setrefreshToken, setRole, setUser]);
    
    useEffect(()=>{
        if(role === undefined || user === undefined){
            setRole(sessionStorage.getItem("role"));
        }
    },[login, user, role])

    const memo = useMemo(() => ({
        login,
        role,
        user
    }), [login, user, role]);

    return (
        <Auth.Provider value={memo}>{children}</Auth.Provider>
    )
}