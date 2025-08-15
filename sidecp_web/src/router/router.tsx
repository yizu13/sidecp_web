import { Outlet, useLocation, useRoutes } from "react-router"
import Login from '../login/login'
import { lazy, Suspense, useEffect } from "react"
import { useNavigate } from "react-router";
import { Box, Stack } from "@mui/material";
import Logout from "../logout/logout";
import { useSettingContext } from "../settingsComponent/contextSettings";
import ProtectedRoute from "./protectedRoutes";
import { AdminRoute, EvaluatorRoute } from "./RoutesBlocked";
import React from "react";



const InicioDash = lazy(()=> import('../Dashboard/Inicio/dashboard_inicio'))
const CommitteDashboardCreate = lazy(()=> import('../Dashboard/Comisiones/dashboard_comisiones_create'))
const CommitteDashboardClose = lazy(()=> import('../Dashboard/Comisiones/dashboard_comisiones_close'))
const EvaluatorsLayout = lazy(()=> import("../Dashboard/Usuarios/evaluatorsLayout"))
const DelegationsLayout = lazy(()=> import("../Dashboard/Usuarios/delegationsLayout"))
const DelegationEvaluatorLayout = lazy(()=> import("../Dashboard/Delegation/delegationEvaluator"))

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
                    <ProtectedRoute>
                     <Stack sx={{
                        width: "100%", 
                        height: "100%", 
                        backgroundColor: theme.palette.mode === "dark"? '#0e1217': 'white', 
                        position: "absolute",
                        top: 0,
                        left: 0,
                        }}>
                    <Outlet/>
                    </Stack>
                    </ProtectedRoute>
                    </Suspense>
            ),
            children:[
                {
                    path: "inicio",
                    element: <InicioDash/>
                }, {
                    path: "comisiones",
                    element: (<AdminRoute><Outlet/></AdminRoute>),
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
                    element: (<AdminRoute><Outlet/></AdminRoute>),
                    children: [
                        {
                            path: "evaluadores",
                            element: <EvaluatorsLayout/>

                        },
                        {
                            path: "delegaciones",
                            element: <DelegationsLayout/>
                        }
                    ]
                },{
                    path: "delegados",
                    element:(<EvaluatorRoute><DelegationEvaluatorLayout/></EvaluatorRoute>),
                }
            ]
        }
    ]);
}

function Charging(){
      const { theme } = useSettingContext();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, bottom: 0,
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
        zIndex: 1300,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              animation: 'bounce 0.6s infinite',
              animationDelay: `${i * 0.2}s`,
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-12px)' },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}