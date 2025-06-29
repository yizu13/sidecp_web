import { useState } from 'react';
import { AxiosError } from 'axios';
import { Box, Stack, Typography, Link, Chip, Fade } from '@mui/material';
import Button from '@mui/material/Button';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import FieldTForm from '../manageForm/FieldTxtForm'
import FormManaged from '../manageForm/FormProvider'
import { Icon } from '@iconify/react';
import  useAuthContext  from '../API/Contextauth'
import { useNavigate } from 'react-router-dom';
import { red } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";



type Inputs ={
    Email: string;
    Password: string;
}

export default function Loginform(){
    const { login } = useAuthContext()
    const navigate = useNavigate()
    const [userNotFound, setNotFound] = useState(false);
    const [serverError, setError] = useState(false);

    const yupSchema= yup.object().shape({
        Email: yup.string().email("Debe ser un email válido").required("Se requiere correo"),
        Password: yup.string().required("Se requiere contraseña"),
    })

    const defaultValues = {
        Email: '',
        Password: '',
    }

    const methods = useForm<Inputs>({
        defaultValues,
        resolver: yupResolver(yupSchema)
    })

    const handleLogin = async (Email: string, Password: string) => {
        try{
            await login({
                Email: Email,
                Password: Password,
            },
        );

        navigate("/dashboard/inicio")
        }catch(err){
            const error = err as AxiosError
            console.error('An error occur', err);
            if(error.message.includes("500")){
                setError(true);
                setNotFound(false)
            }else{
                 setNotFound(!!err);
                 setError(false)
            }
        }
    }
    

    const { handleSubmit } = methods; 
    

    const onSubmit = handleSubmit(async (data)=>{
       await handleLogin(data.Email, data.Password);
    })


    return(
        <>
        <FormManaged onSubmit={onSubmit} methods={methods}>
        <Typography variant='h4' sx={{ml: 8, mb: -3, color: '#ffffff'}}>Bienvenido de nuevo</Typography>
            <Stack rowGap={6} sx={{backgroundColor: "#ffffff", width: "30vw", 
                height: 'auto', borderRadius: 5, ml: 15, mt: 5,  p: 7, boxShadow: '7px 10px 15px rgba(0, 0, 0, 0.5)'}}>
                    <Stack m={-2} display="flex" justifyContent="center" alignContent="center">
                        <Box >
             
                    {userNotFound && (
                    <Fade in timeout={500}>
                    <Chip
                    label="Correo o contraseña son incorrectos"
                    sx={{ typography: "body1", color: red[50], backgroundColor: alpha(red[900], 0.9), fontWeight: "bold", borderRadius: 2, padding: "0 8px", height: 40, ".MuiChip-icon": { marginLeft: 4, marginRight: 0, } }}
                    />
                    </Fade>)}

                    {serverError && (
                    <Fade in timeout={500}>
                    <Chip
                    label="Error inesperado"
                    sx={{ typography: "body1", color: red[50], backgroundColor: alpha(red[900], 0.9), fontWeight: "bold", borderRadius: 2, padding: "0 8px", height: 40, ".MuiChip-icon": { marginLeft: 4, marginRight: 0, } }}
                    />
                    </Fade>)}
                    </Box>
                    </Stack>
                    <Box>
                <FieldTForm name="Email" label="Correo" variant="outlined" />
                    </Box>
                <FieldTForm name="Password" label="Contraseña" variant="outlined" />
                <Box flexDirection="column">
                    <Button 
                    variant='contained' 
                    fullWidth 
                    sx={{borderRadius: 20, backgroundColor: "#2c2c2c"}} 
                    type='submit'
                    startIcon={<Icon icon='line-md:log-in'/>}
                    >
                        Entrar
                    </Button>
                    <Link variant='body2' underline="hover" href="#" color='inherit' sx={{mt: 1, ml: 2, mb: -2,
                        display: "flex", justifySelf: "start", alignSelf: "start"}} >¿Olvidaste tu contraseña?</Link>
                </Box>
            </Stack>
            </FormManaged>
        </>
    )
}