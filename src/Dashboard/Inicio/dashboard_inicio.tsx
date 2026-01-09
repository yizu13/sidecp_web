import React from "react";
import MainLayout from "../layout/Layout";
import InicioPage from "./InicioPage";



export default function InicioDash(){
    document.title = 'Inicio';

    return(
        <>
            <MainLayout setPage={{page: 0, subPage: null}}>
                <InicioPage/>
            </MainLayout>
        </>
    )
}