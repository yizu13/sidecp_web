import MainLayout from "../layout/Layout"
import EvaluatorsComp from "./evaluators/evaluatorsComponent"

export default function EvaluatorsPage(){
    
    return (
        <MainLayout setPage={{page: 2, subPage: 1}}>
        <EvaluatorsComp/>
        </MainLayout>
    )
}