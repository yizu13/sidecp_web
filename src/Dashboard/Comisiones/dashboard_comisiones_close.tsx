import MainLayout from "../layout/Layout";
import ListCommities from "./listCommitte/commities";
import React from "react";

export default function CommitteDashboardClose(){
    document.title = 'Lista de comisiones';
    return(
        <>
            <MainLayout setPage={{page: 1, subPage: 1}}>
                <ListCommities/>
            </MainLayout>
        </>
    )
}