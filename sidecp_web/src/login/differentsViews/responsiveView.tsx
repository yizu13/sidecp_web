import { Box, Stack, Typography, Link, Chip, Fade } from '@mui/material';
import Button from '@mui/material/Button';
import FieldTForm from '../../manageForm/FieldTxtForm';
import { Icon } from '@iconify/react';
import { red } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import React from 'react';

type props = {
    serverError: boolean,
    userNotFound: boolean
}

export default function ResponsiveView({serverError, userNotFound} : props){
    return(
        <>
        <Box
            component="img"
            src="/Cedil_logo_white.png"
            alt="Logo SIDECP"
            sx={{
                width: { xs: '100px', sm: '120px', md: '140px' },
                height: 'auto',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))',
            }}
            position="absolute"
            top={10}
            left={10}
        />
        <Box 
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { xs: 2, sm: 3 },
                position: 'relative',
            }}
        >
            

            <Typography 
                variant='h5' 
                sx={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: { 
                        xs: '1.4rem', 
                        sm: '1.6rem', 
                        md: '1.8rem' 
                    },
                    marginBottom: { xs: 2, sm: 3 },
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
            >
                Bienvenido de nuevo
            </Typography>

            <Stack 
                sx={{
                    backgroundColor: "#ffffff",
                    width: { 
                        xs: 'calc(100% - 32px)', 
                        sm: '85%', 
                        md: '450px',
                        lg: '500px'
                    },
                    maxWidth: '500px',
                    minWidth: { xs: '280px', sm: '350px' },
                    height: 'auto',
                    borderRadius: { xs: 4, sm: 5 },
                    padding: { 
                        xs: '24px 20px', 
                        sm: '32px 28px', 
                        md: '40px 36px' 
                    },
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                    gap: { xs: 2.5, sm: 3, md: 3.5 },
                    margin: { xs: '0 16px', sm: '0 auto' }
                }}
            >
                {(userNotFound || serverError) && (
                    <Box sx={{ width: '100%' }}>
                        {userNotFound && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="Correo o contraseña son incorrectos"
                                    sx={{ 
                                        width: '100%',
                                        height: 'auto',
                                        minHeight: { xs: 36, sm: 40 },
                                        padding: '8px 12px',
                                        typography: "body2", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        '& .MuiChip-label': {
                                            whiteSpace: 'normal',
                                            textAlign: 'center'
                                        }
                                    }}
                                />
                            </Fade>
                        )}

                        {serverError && (
                            <Fade in timeout={500}>
                                <Chip
                                    label="Error inesperado"
                                    sx={{ 
                                        width: '100%',
                                        height: { xs: 36, sm: 40 },
                                        typography: "body2", 
                                        color: red[50], 
                                        backgroundColor: alpha(red[900], 0.9), 
                                        fontWeight: "bold", 
                                        borderRadius: 2,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                    }}
                                />
                            </Fade>
                        )}
                    </Box>
                )}

                <Box sx={{ width: '100%' }}>
                    <FieldTForm 
                        name="Email" 
                        label="Correo" 
                        variant="outlined"
                    />
                </Box>

                <Box sx={{ width: '100%' }}>
                    <FieldTForm 
                        name="Password" 
                        label="Contraseña" 
                        variant="outlined"
                    />
                </Box>

                <Stack 
                    spacing={{ xs: 1.5, sm: 2 }}
                    sx={{ width: '100%' }}
                >
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
                        startIcon={<Icon icon='line-md:log-in' width={20}/>}
                    >
                        Entrar
                    </Button>
                    <Link 
                        variant='body2' 
                        underline="hover" 
                        href="#" 
                        color='inherit' 
                        sx={{
                            display: "flex", 
                            justifyContent: "center",
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            fontWeight: 500,
                            color: '#1E3A8A',
                            '&:hover': {
                                color: '#416dc4'
                            }
                        }}
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </Stack>
            </Stack>
        </Box>
        </>
    )
}
