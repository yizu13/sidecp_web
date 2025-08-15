import React from "react"
import MainLayout from "../layout/Layout"
import EvaluatorsComp from "./evaluators/evaluatorsComponent"

export default function EvaluatorsPage(){
    document.title = 'Evaluadores';
    return (
        <>
            <MainLayout setPage={{page: 2, subPage: 1}}>
                <EvaluatorsComp/>
            </MainLayout>
        </>
    )
}