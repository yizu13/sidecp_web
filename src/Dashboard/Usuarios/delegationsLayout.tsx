import MainLayout from "../layout/Layout"
import DelegationsComp_ from "./delegations/delegationsComponent"
import React from "react"



export default function DelegationsComp(){
    document.title = 'Delegaciones';
    return(
        <>
            <MainLayout setPage={{page: 2, subPage: 0}}>
                <DelegationsComp_/>
            </MainLayout>
        </>
    )
}