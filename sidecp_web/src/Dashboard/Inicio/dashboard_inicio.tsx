import MainLayout from "../layout/Layout";
import InicioPage from "./InicioPage";


export default function InicioDash(){


    return(
        <MainLayout setPage={{page: 0, subPage: null}}>
            <InicioPage/>
            </MainLayout>
    )
}