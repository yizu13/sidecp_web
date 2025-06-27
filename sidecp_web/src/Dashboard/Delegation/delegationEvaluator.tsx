import MainLayout from "../layout/Layout";
import DelegationEval from "./mainComponent/mainComp"

export default function InicioDash(){


    return(
        <MainLayout setPage={{page: 3, subPage: null}}>
            <DelegationEval/>
            </MainLayout>
    )
}