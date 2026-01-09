import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Logout(){
    const navigation = useNavigate();
    
    useEffect(() => {
        const performLogout = async () => {
            try {
                // Limpiar sessionStorage
                sessionStorage.clear();
                
                // También puedes limpiar localStorage si lo usas
                 localStorage.clear();
                
                // Resetear el título del documento
                // document.title = 'SIDECP'; // Cambia por tu título por defecto
                
                // Pequeño delay para asegurar que el título se actualice
                setTimeout(() => {
                    navigation('/', { replace: true });
                }, 100);
                
            } catch (error) {
                console.error('Error durante el logout:', error);
                // Navegar igual en caso de error
                navigation('/', { replace: true });
            }
        };
        
        performLogout();
    }, [navigation]);
    
    return (
        <>
            <Helmet>
                <title>SIDECP</title>
            </Helmet>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Cerrando sesión...</p>
            </div>
        </>
    );
}