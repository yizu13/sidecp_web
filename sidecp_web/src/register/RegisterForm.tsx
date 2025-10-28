import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormManaged from '../manageForm/FormProvider';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import MainView from './differentsViews/mainView';
import ResponsiveView from './differentsViews/responsiveView';
import { createRegistrationRequest, RegistrationRequestData, validateRegistrationToken, getRegistrationToken } from '../API/registrationRequestsAPI';

type Inputs = {
    registrationToken: string;
    firstName: string;
    email: string;
    email: string;
    password: string;
    confirmPassword: string;
    description: string;
}

type props = {
    size: string;
}

export default function RegisterForm({ size }: props) {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [tokenError, setTokenError] = useState<string>('');
    const [isValidatingToken, setIsValidatingToken] = useState(false);
    const [currentToken, setCurrentToken] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const yupSchema = yup.object().shape({
        registrationToken: yup.string()
            .required("El código de registro es requerido")
            .length(8, "El código debe tener 8 caracteres"),
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
        description: yup.string()
            .max(500, "La descripción no puede exceder 500 caracteres")
            .optional(),
    });

    const defaultValues = {
        registrationToken: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        description: '',
    };

    const methods = useForm<Inputs>({
        defaultValues,
        resolver: yupResolver(yupSchema)
    });

    const { handleSubmit, watch } = methods;
    const tokenValue = watch('registrationToken');

    // Función para verificar el token actual del servidor
    useEffect(() => {
        const fetchCurrentToken = async () => {
            try {
                const tokenData = await getRegistrationToken();
                setCurrentToken(tokenData.token);
                setTimeRemaining(tokenData.timeRemaining);
            } catch (err) {
                console.error('Error al obtener el token actual:', err);
            }
        };

        fetchCurrentToken();
        
        // Verificar cada 5 minutos si el token sigue siendo válido
        const interval = setInterval(fetchCurrentToken, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Validar el token cuando el usuario lo ingrese
    useEffect(() => {
        const validateToken = async () => {
            if (tokenValue && tokenValue.length === 8) {
                setIsValidatingToken(true);
                try {
                    const result = await validateRegistrationToken(tokenValue);
                    setTokenValid(result.valid);
                    if (result.valid) {
                        setTokenError('');
                    } else {
                        setTokenError(result.message);
                    }
                } catch (err) {
                    const error = err as AxiosError<{ message?: string }>;
                    setTokenValid(false);
                    setTokenError(error.response?.data?.message || 'Token inválido');
                } finally {
                    setIsValidatingToken(false);
                }
            } else {
                setTokenValid(false);
                setTokenError('');
            }
        };

        const timeoutId = setTimeout(validateToken, 500);
        return () => clearTimeout(timeoutId);
    }, [tokenValue]);

    const handleRegister = async (data: Inputs) => {
        try {
            // Validar el token nuevamente antes de enviar
            const tokenValidation = await validateRegistrationToken(data.registrationToken);
            
            if (!tokenValidation.valid) {
                setTokenError(tokenValidation.message);
                return;
            }

            const registrationData: RegistrationRequestData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                description: data.description,
                registrationToken: data.registrationToken,
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
            } else if (error.response?.status === 401) {
                setTokenError(error.response.data?.message || 'Token inválido o expirado');
                setTokenValid(false);
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
                        tokenValid={tokenValid}
                        tokenError={tokenError}
                        isValidatingToken={isValidatingToken}
                    />
                )}
                {size === "small" && (
                    <ResponsiveView 
                        serverError={serverError} 
                        emailExists={emailExists}
                        registrationSuccess={registrationSuccess}
                        tokenValid={tokenValid}
                        tokenError={tokenError}
                        isValidatingToken={isValidatingToken}
                    />
                )}
            </FormManaged>
        </>
    );
}
