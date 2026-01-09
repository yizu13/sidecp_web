import { Box, Stack, Typography, Link, Chip, Fade, CircularProgress, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import FieldTForm from '../../manageForm/FieldTxtForm';
import { Icon } from '@iconify/react';
import { red, green } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import React from 'react';

type props = {
    serverError: boolean;
    emailExists: boolean;
    registrationSuccess: boolean;
    tokenValid: boolean;
    tokenError: string;
    isValidatingToken: boolean;
}

export default function MainView({ 
    serverError, 
    emailExists, 
    registrationSuccess,
    tokenValid,
    tokenError,
    isValidatingToken 
}: props) {
    return (
        <>
            <Typography variant='h4' sx={{ ml: 12, mb: -3, color: '#ffffff', fontWeight: 600 }}>
                Crear cuenta
            </Typography>
            <Stack 
                rowGap={3} 
                sx={{
                    backgroundColor: "#ffffff", 
                    width: "32vw",
                    minWidth: "400px",
                    maxWidth: "600px",
                    height: 'auto',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: 5, 
                    ml: 15, 
                    mt: 5,
                    mb: 5,
                    p: 6, 
                    boxShadow: '7px 10px 15px rgba(0, 0, 0, 0.5)',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                        borderRadius: 5,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                }}
            >
                <Stack m={-2} display="flex" justifyContent="center" alignContent="center">
                    <Box>
                        {emailExists && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="Este correo ya está registrado"
                                    sx={{ 
                                        typography: "body1", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 40 
                                    }}
                                />
                            </Fade>
                        )}

                        {serverError && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="Error inesperado al registrar"
                                    sx={{ 
                                        typography: "body1", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 40 
                                    }}
                                />
                            </Fade>
                        )}

                        {registrationSuccess && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="¡Solicitud enviada! Espera la aprobación del administrador"
                                    sx={{ 
                                        typography: "body1", 
                                        color: green[50], 
                                        backgroundColor: alpha(green[700], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 40 
                                    }}
                                />
                            </Fade>
                        )}

                        {tokenError && !tokenValid && (
                            <Fade in timeout={500}>
                                <Chip
                                    label={tokenError}
                                    sx={{ 
                                        typography: "body1", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 40 
                                    }}
                                />
                            </Fade>
                        )}
                    </Box>
                </Stack>

                {/* Campo de token de registro */}
                <Box>
                    <FieldTForm 
                        name="registrationToken" 
                        label="Código de registro" 
                        variant="outlined"
                        placeholder="Ingrese el código de 8 caracteres"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isValidatingToken ? (
                                        <CircularProgress size={20} />
                                    ) : tokenValid ? (
                                        <Icon icon="mdi:check-circle" color={green[500]} width={24} />
                                    ) : null}
                                </InputAdornment>
                            ),
                        }}
                        helperText="Solicita el código al administrador del sistema"
                    />
                </Box>

                {/* Los demás campos solo se habilitan si el token es válido */}
                <Stack direction="row" spacing={2}>
                    <FieldTForm 
                        name="firstName" 
                        label="Nombre" 
                        variant="outlined"
                        disabled={!tokenValid}
                    />
                    <FieldTForm 
                        name="lastName" 
                        label="Apellido" 
                        variant="outlined"
                        disabled={!tokenValid}
                    />
                </Stack>

                <Box>
                    <FieldTForm 
                        name="email" 
                        label="Correo electrónico" 
                        variant="outlined"
                        disabled={!tokenValid}
                    />
                </Box>

                <Box>
                    <FieldTForm 
                        name="password" 
                        label="Contraseña" 
                        variant="outlined" 
                        type="password"
                        disabled={!tokenValid}
                    />
                </Box>

                <Box>
                    <FieldTForm 
                        name="confirmPassword" 
                        label="Confirmar contraseña" 
                        variant="outlined" 
                        type="password"
                        disabled={!tokenValid}
                    />
                </Box>

                <Box>
                    <FieldTForm 
                        name="description" 
                        label="Descripción o motivo de registro" 
                        variant="outlined"
                        multiline
                        rows={3}
                        disabled={!tokenValid}
                        placeholder="Opcional: Explica brevemente por qué solicitas acceso al sistema"
                        helperText="Máximo 500 caracteres"
                    />
                </Box>

                <Box flexDirection="column">
                    <Button 
                        variant='contained' 
                        fullWidth 
                        sx={{
                            borderRadius: 20, 
                            backgroundColor: "#2c2c2c",
                            height: { xs: 44, sm: 48, md: 52 },
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: "#1a1a1a",
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                        }} 
                        type='submit'
                        startIcon={<Icon icon='mdi:account-plus' width={20}/>}
                        disabled={registrationSuccess || !tokenValid}
                    >
                        Registrarse
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                            ¿Ya tienes cuenta?{' '}
                            <Link 
                                href="/login" 
                                underline="hover" 
                                sx={{ 
                                    color: 'inherit', 
                                    fontWeight: 600,
                                    '&:hover': {
                                        color: '#2c2c2c'
                                    }
                                }}
                            >
                                Inicia sesión
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </>
    );
}
