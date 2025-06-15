import { Outlet, useLocation, useRoutes } from "react-router"
import Login from '../login/login'
import { lazy, Suspense, useEffect } from "react"
import { useNavigate } from "react-router";
import { Typography, Stack } from "@mui/material";
import Logout from "../logout/logout";
import { useSettingContext } from "../settingsComponent/contextSettings";

const InicioDash = lazy(()=> import('../Dashboard/Inicio/dashboard_inicio'))
const CommitteDashboardCreate = lazy(()=> import('../Dashboard/Comisiones/dashboard_comisiones_create'))
const CommitteDashboardClose = lazy(()=> import('../Dashboard/Comisiones/dashboard_comisiones_close'))
const EvaluatorsLayout = lazy(()=> import("../Dashboard/Usuarios/evaluatorsLayout"))

export default function Router(){
    const navigate = useNavigate()
    const location = useLocation()
    const { theme } = useSettingContext();

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
                     <Stack sx={{
                        width: "100%", 
                        height: "100%", 
                        backgroundColor: theme.palette.mode === "dark"? "black": "white", 
                        position: "absolute",
                        top: 0,
                        left: 0,
                        }}>
                    <Outlet/>
                    </Stack>
                    </Suspense>
            ),
            children:[
                {
                    path: "inicio",
                    element: <InicioDash/>
                }, {
                    path: "comisiones",
                    children: [
                        {
                            path: "crear",
                            element: <CommitteDashboardCreate/>
                        },
                        {
                            path: "cerrar",
                            element: <CommitteDashboardClose/>
                        }
                    ]
                },
                {
                    path: "usuarios",
                    children: [
                        {
                            path: "evaluadores",
                            element: <EvaluatorsLayout/>

                        }
                    ]
                }
            ]
        }
    ]);
}

function Charging(){
    return(
        <Typography typography='h4'> Cargando... </Typography>
    )
}