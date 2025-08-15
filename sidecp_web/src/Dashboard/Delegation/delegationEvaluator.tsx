import MainLayout from "../layout/Layout";
import DelegationEval from "./mainComponent/mainComp"
import React from "react"

export default function InicioDash(){
    document.title = 'Evaluación de delegaciones';

    return(
        <>
            <MainLayout setPage={{page: 3, subPage: null}}>
                <DelegationEval/>
            </MainLayout>
        </>
    )
}