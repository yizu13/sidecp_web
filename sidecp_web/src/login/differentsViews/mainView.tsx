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

export default function MainView({serverError, userNotFound} : props){
    return(
        <>
        <Typography variant='h4' sx={{ml: 12, mb: -3, color: '#ffffff', fontWeight: 600,}} >Bienvenido de nuevo</Typography>
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
                    <Link variant='body2' underline="hover" href="#" color='inherit' sx={{mt: 1, ml: 2, mb: -2,
                        display: "flex", justifySelf: "start", alignSelf: "start"}} >¿Olvidaste tu contraseña?</Link>
                </Box>
            </Stack>
            </>
    )
}