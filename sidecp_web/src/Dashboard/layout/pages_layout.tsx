import { Typography } from "@mui/material"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import OptionsNavigation from "./someOptions"
import { useSettingContext } from "../../settingsComponent/contextSettings"

type PageObject = {
    page: number,
    subPage : number | null
}

type Props = {
    pageObject: PageObject
}

export function TextPage({ pageObject }: Props){
    const { theme } = useSettingContext()
    const navigation = useNavigate()
    const role = sessionStorage.getItem("role")
    const committePage = [
        {label: "Crear", navigation: "/dashboard/comisiones/crear"}, 
        {label: "Lista", navigation: "/dashboard/comisiones/cerrar"}
    ];
     const usersPage = [
        {label: "Delegaciones", navigation: "/Dashboard/usuarios/delegaciones"}, 
        {label:  "Evaluadores", navigation: "/Dashboard/usuarios/evaluadores"}
    ];

    return(
        <>
        <Typography color='white' variant="h5" sx={{
            position: 'sticky', 
            cursor: pageObject.page === 0 ? 'default' : 'pointer',
            pl: 8,
            pr: 8,
            pt: 0.5,
            pb: 0.5,
            userSelect: "none",
            borderRadius: 10,
            transition: 'all 0.3s ease',
            backgroundColor: pageObject.page === 0 ? theme.palette.mode === "dark" ?'#10151b': "#eeeeee" : '',
            boxShadow: pageObject.page === 0 ? '0px 4px 16px rgba(27, 47, 83, 0.2)': "",
            color: pageObject.page === 0 ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
            '&:hover':{
                backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
            },
            typography: {
                xs: 'subtitle2', 
                sm: 'subtitle1', 
                md: 'h6', 
              }
            
        }}
        onClick={()=>{navigation('/dashboard/inicio')}}
        >Inicio</Typography>

        {("evaluator" === role || "admin" === role) && 
        <Typography color='white' typography='h5' sx={{
            position: 'sticky', 
            cursor: pageObject.page === 3 ? 'default' : 'pointer',
            pl: 6,
            pr: 6,
            pt: 0.5,
            pb: 0.5,
            userSelect: "none",
            borderRadius: 10,
            transition: 'all 0.3s ease',
           backgroundColor: pageObject.page === 3 ? theme.palette.mode === "dark" ?'#10151b': "#eeeeee" : '',
            boxShadow: pageObject.page === 3 ? '0px 4px 16px rgba(30, 52, 94, 0.2)': "",
            color: pageObject.page === 3 ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
            '&:hover':{
                backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                  boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
            },
            typography: {
                xs: 'subtitle2', 
                sm: 'subtitle1', 
                md: 'h6', 
              }
        }}
        onClick={()=>{navigation('/dashboard/delegados')}}
        >Delegados</Typography>}

        
        <OptionsNavigation title="Comisiones" subPages={committePage} pageObject={pageObject} mainReference={1} role="admin"/>
        <OptionsNavigation title="Usuarios" subPages={usersPage} pageObject={pageObject} mainReference={2} role="admin"/>
        
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