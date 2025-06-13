import { Typography } from "@mui/material"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import OptionsNavigation from "./someOptions"

type PageObject = {
    page: number,
    subPage : number | null
}

type Props = {
    pageObject: PageObject
}

export function TextPage({ pageObject }: Props){
    const navigation = useNavigate()
    const committePage = [{label: "Crear", navigation: "/dashboard/inicio"}, {label: "Cerrar", navigation: "/dashboard/inicio"}];

    return(
        <>
        <Typography color='white' typography='h5' sx={{
            position: 'sticky', 
            pl: 8,
            pr: 8,
            pt: 0.5,
            pb: 0.5,
            userSelect: "none",
            borderRadius: 10,
            transition: 'all 0.3s ease',
            backgroundColor: pageObject.page === 0 ? 'rgb(45, 119, 255)' : '',
            '&:hover':{
                backgroundColor: 'rgb(45, 119, 255)',

            },
            typography: {
                xs: 'subtitle2', 
                sm: 'subtitle1', 
                md: 'h6', 
              }
            
        }}
        onClick={()=>{navigation('/dashboard/inicio')}}
        >Inicio</Typography>

        
        <OptionsNavigation title="Comisiones" subPages={committePage} pageObject={pageObject}/>
        
        </>
    )
}


export function IconPage({ pageObject }: Props){
    const navigation = useNavigate()
    
    return(
        <Icon icon="line-md:home-simple-twotone" color='white' style={{
            position: 'sticky',
            width: 35,
            height: 'auto',
            marginTop: '15vh',
            cursor: pageObject.page === 0 ? 'default' : 'pointer',
            padding: 5,
            transition: 'all 0.3s ease',
            backgroundColor: pageObject.page === 0 ? 'rgb(45, 119, 255)' : '',
        }}
        onClick={()=>{navigation('/dashboard/inicio')}}
        />
    )
}