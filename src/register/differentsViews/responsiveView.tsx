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

export default function ResponsiveView({ 
    serverError, 
    emailExists, 
    registrationSuccess,
    tokenValid,
    tokenError,
    isValidatingToken 
}: props) {
    return (
        <>
            <Typography 
                variant='h5' 
                sx={{ 
                    color: '#ffffff', 
                    fontWeight: 600, 
                    textAlign: 'center',
                    mb: 2,
                    px: 2
                }}
            >
                Crear cuenta
            </Typography>
            <Stack 
                rowGap={3} 
                sx={{
                    backgroundColor: "#ffffff", 
                    width: { xs: "90vw", sm: "70vw", md: "50vw" },
                    minWidth: "300px",
                    maxWidth: "600px",
                    height: 'auto',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: 5,
                    my: 3,
                    p: { xs: 4, sm: 5 }, 
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
                {/* Mensajes de estado */}
                <Stack display="flex" justifyContent="center" alignContent="center">
                    <Box>
                        {emailExists && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="Este correo ya está registrado"
                                    sx={{ 
                                        typography: "body2", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 36,
                                        width: '100%'
                                    }}
                                />
                            </Fade>
                        )}

                        {serverError && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="Error al registrar"
                                    sx={{ 
                                        typography: "body2", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 36,
                                        width: '100%'
                                    }}
                                />
                            </Fade>
                        )}

                        {registrationSuccess && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="¡Solicitud enviada! Espera aprobación"
                                    sx={{ 
                                        typography: "body2", 
                                        color: green[50], 
                                        backgroundColor: alpha(green[700], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 36,
                                        width: '100%'
                                    }}
                                />
                            </Fade>
                        )}

                        {tokenError && !tokenValid && (
                            <Fade in timeout={500}>
                                <Chip
                                    label={tokenError}
                                    sx={{ 
                                        typography: "body2", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2, 
                                        padding: "0 8px", 
                                        height: 36,
                                        width: '100%'
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
                        placeholder="Código de 8 caracteres"
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
                        helperText="Solicita el código al administrador"
                    />
                </Box>

                {/* Campos del formulario */}
                <Box>
                    <FieldTForm 
                        name="firstName" 
                        label="Nombre" 
                        variant="outlined"
                        disabled={!tokenValid}
                    />
                </Box>

                <Box>
                    <FieldTForm 
                        name="lastName" 
                        label="Apellido" 
                        variant="outlined"
                        disabled={!tokenValid}
                    />
                </Box>

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
                        label="Motivo de registro" 
                        variant="outlined"
                        multiline
                        rows={3}
                        disabled={!tokenValid}
                        placeholder="Opcional: Explica por qué solicitas acceso"
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
                            height: 48,
                            fontSize: '0.875rem',
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
                        <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
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
