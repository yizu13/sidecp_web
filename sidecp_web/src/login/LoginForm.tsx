import { useState } from 'react';
import { Box, Stack, Typography, Link } from '@mui/material';
import Button from '@mui/material/Button';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import FieldTForm from '../manageForm/FieldTxtForm'
import FormManaged from '../manageForm/FormProvider'
import { Icon } from '@iconify/react';
import { userData } from '../API/userAPI'
import  useAuthContext  from '../API/Contextauth'
import { NavLink, useNavigate } from 'react-router-dom';



type Inputs ={
    Email: string;
    Password: string;
}

export default function Loginform(){
    const { login } = useAuthContext()
    const navigate = useNavigate()
    const [userNotFound, setNotFound] = useState(false);

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
        }catch(err: any){
            console.error('An error occur', err.response?.data || err.message);
            setNotFound(err.response?.data.notFound)
        }
    }
    

    const { handleSubmit } = methods; 
    

    const onSubmit = handleSubmit(async (data)=>{
       await handleLogin(data.Email, data.Password);
    })

    const getUser = async() => {
        const userInfo = await userData();

        console.log('user:', userInfo);
    }


    return(
        <>
        <FormManaged onSubmit={onSubmit} methods={methods}>
        <Typography variant='h4' sx={{ml: 8, mb: -3, color: '#ffffff'}}>Bienvenido de nuevo</Typography>
            <Stack spacing={5} sx={{backgroundColor: "#ffffff", width: "30vw", 
                height: 'auto', borderRadius: 5, ml: 15, mt: 5,  p: 7, boxShadow: '7px 10px 15px rgba(0, 0, 0, 0.5)'}}>
                    <Box>
                {userNotFound && <Typography color='error' typography='subtitle2' sx={{mb: 1.5, mt: -3.5}}>Correo o contraseña son incorrectos</Typography>}
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
                    <Link variant='body2' underline="hover" href="#" color='inherit' sx={{mt: 1, ml: 2, 
                        display: "flex", justifySelf: "start", alignSelf: "start"}} >¿Olvidaste tu contraseña?</Link>
                </Box>
            </Stack>
            </FormManaged>
        </>
    )
}