import React from "react";
import MainLayout from "../layout/Layout";
import CreateCommitte from "./createCommitte/committeCreateContent";




export default function CommitteDashboardCreate(){
    document.title = 'Crear Comisión';
    return(
        <>
            <MainLayout setPage={{page: 1, subPage: 0}}>
                <CreateCommitte/>
            </MainLayout>
        </>
    )
}