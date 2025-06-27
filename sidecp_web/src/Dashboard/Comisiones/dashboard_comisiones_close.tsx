import MainLayout from "../layout/Layout";
import ListCommities from "./listCommitte/commities";


export default function CommitteDashboardClose(){

    return(
        <MainLayout setPage={{page: 1, subPage: 1}}>
            <ListCommities/>
        </MainLayout>
    )
}