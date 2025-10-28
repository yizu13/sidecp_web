import { useState } from 'react';
import { AxiosError } from 'axios';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import FormManaged from '../manageForm/FormProvider'
import  useAuthContext  from '../API/Contextauth'
import { useNavigate } from 'react-router-dom';
import React from 'react';
import MainView from './differentsViews/mainView';
import ResponsiveView from './differentsViews/responsiveView';



type Inputs ={
    Email: string;
    Password: string;
}

type props = {
    size: string;
}

export default function Loginform({size}: props){
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
           {size === "large" && <MainView serverError={serverError} userNotFound={userNotFound}/>}
           {size === "small" && <ResponsiveView serverError={serverError} userNotFound={userNotFound}/>}
            </FormManaged>
        </>
    )
}