import { Typography } from "@mui/material"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"

type Props = {
    pageObject: any
}

export function TextPage({ pageObject }: Props){
    const navigation = useNavigate()

    return(
        <Typography color='white' typography='h5' sx={{
            position: 'sticky',
            m: 3, 
            mt: 5,
            cursor: pageObject.page === 0 ? 'default' : 'pointer',
            pl: 8,
            pr: 8,
            pt: 0.5,
            pb: 0.5,
            borderRadius: 10,
            transition: 'all 0.3s ease',
            backgroundColor: pageObject.page === 0 ? 'rgb(45, 119, 255)' : '',
            '&:hover':{
                backgroundColor: 'rgb(45, 119, 255)',

            },
            typography: {
                xs: 'subtitle1', 
                sm: 'h6', 
                md: 'h5', 
              }
            
        }}
        onClick={()=>{navigation('/dashboard/inicio')}}
        >Inicio</Typography>
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