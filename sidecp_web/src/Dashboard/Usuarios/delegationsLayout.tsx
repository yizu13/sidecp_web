import MainLayout from "../layout/Layout"
import DelegationsComp_ from "./delegations/delegationsComponent"



export default function DelegationsComp(){
    return(
        <MainLayout setPage={{page: 2, subPage: 0}}>
            <DelegationsComp_/>
        </MainLayout>
    )
}