import { useState } from 'react';
import { AxiosError } from 'axios';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormManaged from '../manageForm/FormProvider';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import MainView from './differentsViews/mainView';
import ResponsiveView from './differentsViews/responsiveView';
import { createRegistrationRequest, RegistrationRequestData } from '../API/registrationRequestsAPI';

type Inputs = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type props = {
    size: string;
}

export default function RegisterForm({ size }: props) {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const yupSchema = yup.object().shape({
        firstName: yup.string()
            .required("El nombre es requerido")
            .min(2, "El nombre debe tener al menos 2 caracteres"),
        lastName: yup.string()
            .required("El apellido es requerido")
            .min(2, "El apellido debe tener al menos 2 caracteres"),
        email: yup.string()
            .email("Debe ser un email válido")
            .required("El correo es requerido"),
        password: yup.string()
            .required("La contraseña es requerida")
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
            ),
        confirmPassword: yup.string()
            .required("Debes confirmar la contraseña")
            .oneOf([yup.ref('password')], "Las contraseñas no coinciden"),
    });

    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const methods = useForm<Inputs>({
        defaultValues,
        resolver: yupResolver(yupSchema)
    });

    const handleRegister = async (data: Inputs) => {
        try {
            const registrationData: RegistrationRequestData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            };

            await createRegistrationRequest(registrationData);

            setRegistrationSuccess(true);
            setServerError(false);
            setEmailExists(false);

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.error('Error en el registro:', err);
            
            if (error.response?.status === 409) {
                setEmailExists(true);
                setServerError(false);
            } else if (error.response?.status === 500) {
                setServerError(true);
                setEmailExists(false);
            } else {
                setServerError(true);
                setEmailExists(false);
            }
            setRegistrationSuccess(false);
        }
    };

    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(async (data) => {
        await handleRegister(data);
    });

    return (
        <>
            <FormManaged onSubmit={onSubmit} methods={methods}>
                {size === "large" && (
                    <MainView 
                        serverError={serverError} 
                        emailExists={emailExists}
                        registrationSuccess={registrationSuccess}
                    />
                )}
                {size === "small" && (
                    <ResponsiveView 
                        serverError={serverError} 
                        emailExists={emailExists}
                        registrationSuccess={registrationSuccess}
                    />
                )}
            </FormManaged>
        </>
    );
}
