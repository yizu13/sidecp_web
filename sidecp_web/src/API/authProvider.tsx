import { type ReactNode, useState, useMemo, useEffect } from "react"
import { Auth } from "./Contextauth"
import axiosInstance from './axiosServer'
import axiosLog from './AxiosLogServer'
import { useNavigate } from "react-router-dom"

type props = {
    children : ReactNode
}

export interface userProps {
    login: (data: any) => Promise<void>,
    role: string,
}

export const axiosIntercep = axiosInstance.create()

export default function Authsystem({ children }: props){
    const [accessToken, setAccesToken] = useState('token');
    const [refreshToken, setrefreshToken] = useState('refresh');
    const [role, setRole] = useState('role')
    const navigation = useNavigate()

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
                const newAccess = await axiosLog.post('/token', { token: refreshToken });
                const newAccessToken = newAccess.data.accessToken;
                setAccesToken(newAccessToken);

                originRequest.headers['authorization'] = `Bearer ${newAccessToken}`

                return axiosLog(originRequest);
            }catch(errorRefresh){
                originRequest.headers['authorization'] = `Bearer`
                // send to login
                await axiosLog.delete('/logout', { data: { token: refreshToken } });
                navigation('/login')
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
    }, [accessToken, refreshToken])

       const login = async (credentials: any) => {
            const response = await axiosLog.post("/login", credentials);
            setAccesToken(response.data.accessToken);
            setrefreshToken(response.data.refreshToken);
            setRole(response.data.role)
        }

        const memo = useMemo(() => ({
            login: login,
            role: role
        }),[login])


    return (
        <Auth.Provider value={memo}>{children}</Auth.Provider>
    )
}