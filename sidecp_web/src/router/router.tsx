import { Outlet, useLocation, useRoutes } from "react-router"
import Login from '../login/login'
import { lazy, Suspense, useEffect } from "react"
import { useNavigate } from "react-router";
import { Typography } from "@mui/material";
import Logout from "../logout/logout";

const InicioDash = lazy(()=> import('../Dashboard/Inicio/dashboard_inicio'))

export default function Router(){
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        if(location.pathname === "/"){
        navigate("/login")
    }
    },[navigate,location]);

    return useRoutes([
        {
            path: '/',
            element:( 
                <Suspense fallback={<Charging/>}>
                    <Outlet/>
                </Suspense>
                ),
            children: [
                {
                    path: "login",
                    element: <Login/>,

                },{
                    path: "logout",
                    element: (
                        <Logout/>
                    )
                }
            ]
            
        }, {
            path: "/dashboard",
            element: (
                <Suspense fallback={<Charging/>}>
                    <Outlet/>
                    </Suspense>
            ),
            children:[
                {
                    path: "inicio",
                    element: <InicioDash/>
                },
            ]
        }
    ]);
}

function Charging(){
    return(
        <Typography typography='h4'> Cargando... </Typography>
    )
}