import { type ReactNode, useRef, useState, useEffect } from 'react';
import { Stack, Box, Typography, IconButton, Tooltip, Badge } from '@mui/material';
import { Icon } from '@iconify/react'
import {TextPage} from './pages_layout'
import {IconPage} from './pages_layout'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { useSettingContext } from '../../settingsComponent/contextSettings';
import { useSidebar } from '../../settingsComponent/sidebarContext';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import RegistrationRequestsSidebar from '../RegistrationRequests/RegistrationRequestsSidebar';
import { getPendingRequestsCount } from '../../API/registrationRequestsAPI';
import React from 'react';

type PageObject ={
    page: number,
    subPage : number | null
}

type props = {
    setPage: PageObject
    children: ReactNode
}

export default function MainLayout({ setPage, children }: props){
    const pageSelected = useRef(setPage) 
    const { isCollapsed, setIsCollapsed } = useSidebar()
    const navigation = useNavigate()
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const { theme, themefunc } = useSettingContext()
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [requestsSidebarOpen, setRequestsSidebarOpen] = useState(false)
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0)

    const handleChangeTheme = ()=>{
        if(theme.palette.mode === "dark"){
            themefunc("light")
        } else{
            themefunc("dark")
        }
    }

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true)
    }

    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false)
        navigation('/logout')
    }

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false)
    }

    const loadPendingRequestsCount = async () => {
        try {
            const count = await getPendingRequestsCount();
            setPendingRequestsCount(count);
        } catch (err) {
            console.error('Error loading pending requests count:', err);
        }
    };

    useEffect(() => {
        loadPendingRequestsCount();
        // Actualizar cada 30 segundos
        const interval = setInterval(loadPendingRequestsCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRequestsSidebarClose = () => {
        setRequestsSidebarOpen(false);
        loadPendingRequestsCount(); // Recargar el contador al cerrar
    };

        return (
            <Stack
                display="flex"
                flexDirection="row"
                alignItems="start"
                justifyContent="start"
                position='inherit'
                sx={{
                    width: '100vw', 
                    height: '100vh', 
                    position: 'fixed',
                    top: 0,
                    left: 0
                }}
            >
                {/* Botones superiores derechos */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        right: 16,
                        zIndex: 2000,
                    }}
                >
                    {/* Botón de solicitudes de registro */}
                    <Tooltip title="Solicitudes de registro" placement="bottom">
                        <IconButton
                            onClick={() => setRequestsSidebarOpen(true)}
                            sx={{
                                background: theme.palette.mode === "dark" ? "#222" : "#fff",
                                color: theme.palette.mode === "dark" ? "#fff" : "#222",
                                boxShadow: 2,
                                '&:hover': {
                                    background: theme.palette.mode === "dark" ? "#333" : "#eee",
                                }
                            }}
                        >
                            <Badge 
                                badgeContent={pendingRequestsCount} 
                                color="error"
                                max={99}
                            >
                                <Icon icon="mdi:account-multiple-plus" style={{ fontSize: '22px' }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Botón de cambio de tema */}
                    <IconButton
                        onClick={handleChangeTheme}
                        sx={{
                            background: theme.palette.mode === "dark" ? "#222" : "#fff",
                            color: theme.palette.mode === "dark" ? "#fff" : "#222",
                            boxShadow: 2,
                            '&:hover': {
                                background: theme.palette.mode === "dark" ? "#333" : "#eee",
                            }
                        }}
                    >
                        {theme.palette.mode === "dark" ? <Icon icon="line-md:moon-filled-to-sunny-filled-loop-transition"/>: <Icon icon="line-md:sunny-filled-loop-to-moon-filled-loop-transition"/>}
                    </IconButton>
                </Stack>
                
                {/* Sidebar */}
                <motion.div
                    animate={{ 
                        width: isCollapsed ? '80px' : 'auto',
                        transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                    style={{
                        height: '100vh',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 1000
                    }}
                >
                    <Stack
                        display="flex"
                        sx={{
                            backgroundColor: theme.palette.mode === "dark" ?'#141a21':"#f1f1f1",
                            width: isCollapsed ? '80px' : { xs: '280px', md: '320px' },
                            height: '100vh',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingRight: isCollapsed ? 1 : 2,
                            paddingLeft: isCollapsed ? 1 : 2,
                            paddingTop: 3,
                            paddingBottom: 3,
                            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease-in-out',
                            position: 'relative'
                        }}
                    >
                        {/* Logo */}
                        <Box sx={{ 
                            cursor: 'pointer', 
                            borderRadius: 2, 
                            transition: 'all 0.2s ease', 
                            '&:hover': { transform: 'scale(1.05)' },
                            pt: isCollapsed ? 2 : 3,
                            pb: isCollapsed ? 3 : 4,
                            px: isCollapsed ? 1 : 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Box
                                component="img"
                                src= {theme.palette.mode === "dark" ? "/Cedil_logo_white.png" :"/Cedil_logo.png"}
                                onClick={() => navigation('/dashboard/inicio')}
                                sx={{
                                    width: isCollapsed ? '48px' : { xs: '120px', sm: '140px', md: '160px', lg: '180px' },
                                    height: 'auto',
                                    maxWidth: isCollapsed ? '48px' : '200px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            />
                        </Box>

                        {/* Toggle Button - Top Right */}
                        {!isCollapsed && (
                            <Tooltip title="Contraer sidebar" placement="bottom">
                                <IconButton
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 12,
                                        color: theme.palette.mode === "dark" ? "#ffffff" : "#141a21",
                                        backgroundColor: theme.palette.mode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                        width: 32,
                                        height: 32,
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === "dark" ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <Icon icon='solar:double-alt-arrow-left-bold' style={{ fontSize: '16px' }} />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Navigation Content */}
                        <Box sx={{ 
    flex: 1, 
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto', // ← permite scroll
    '&::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
        borderRadius: 6,
        border: `2px solid ${theme.palette.mode === 'dark' ? '#0e1217' : '#ffffff'}`,
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#999',
    },
    '&::-webkit-scrollbar-corner': {
        backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-button': {
        display: 'none',
    },
    scrollbarWidth: 'thin', // para Firefox
    scrollbarColor: `${theme.palette.mode === 'dark' ? '#555' : '#ccc'} transparent`,
}}>

                            {isCollapsed ? (
                                <>
                                    {/* Toggle Button - Collapsed Mode */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        mb: 3,
                                        mt: 1
                                    }}>
                                        <Tooltip title="Expandir sidebar" placement="right">
                                            <IconButton
                                                onClick={() => setIsCollapsed(!isCollapsed)}
                                                sx={{
                                                    color: theme.palette.mode === "dark" ? "#ffffff" : "#141a21",
                                                    backgroundColor: theme.palette.mode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                    width: 44,
                                                    height: 44,
                                                    border: `1px solid ${theme.palette.mode === "dark" ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === "dark" ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                                        transform: 'scale(1.05)',
                                                        borderColor: theme.palette.mode === "dark" ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                                                    }
                                                }}
                                            >
                                                <Icon icon='solar:double-alt-arrow-right-bold' style={{ fontSize: '20px' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <IconPage pageObject={pageSelected.current}/>
                                </>
                            ) : (
                                <TextPage pageObject={pageSelected.current}/>
                            )}
                        </Box>

                        {/* Bottom Logout Section */}
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            px: isCollapsed ? 1 : 2,
                            pt: 2,
                            pb: 2
                        }}>
                            {isCollapsed ? (
                                <Tooltip title="Salir" placement="right">
                                    <IconButton
                                        onClick={handleLogoutClick}
                                        sx={{
                                            color: theme.palette.mode === "dark" ? "#ffffff" : "#141a21",
                                            backgroundColor: 'transparent',
                                            border: `1px solid ${theme.palette.mode === "dark" ? '#333' : '#ddd'}`,
                                            width: 44,
                                            height: 44,
                                            '&:hover': {
                                                backgroundColor: theme.palette.mode === "dark" ? '#10151b' : "#eeeeee",
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        <Icon icon="solar:logout-bold" style={{ fontSize: '18px' }} />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Box
                                    sx={{
                                        cursor: 'pointer',
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        backgroundColor: 'transparent',
                                        border: `1px solid ${theme.palette.mode === "dark" ? '#333' : '#ddd'}`,
                                        color: theme.palette.mode === "dark" ? '#ffffff' : "#1f1f1f",
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === "dark" ? '#10151b' : "#eeeeee",
                                            boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
                                            transform: 'translateY(-1px)'
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}
                                    onClick={handleLogoutClick}
                                >
                                    <Icon icon="solar:logout-bold" style={{ fontSize: '18px' }} />
                                    <Typography 
                                        sx={{
                                            fontFamily: '"Inter", "Roboto", sans-serif',
                                            fontWeight: 500,
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}
                                    >
                                        Salir
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </motion.div>

                {/* Main Content Area */}
                <Box
                    sx={{
                        backgroundColor: theme.palette.mode === "dark"? '#0e1217': 'white',
                        width: '100%', 
                        height: '100vh',
                        marginLeft: isCollapsed ? '80px' : { xs: '280px', md: '320px' },
                        transition: 'margin-left 0.3s ease-in-out',
                        position: 'relative',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': {
                            width: 12,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                            borderRadius: 6,
                            border: `2px solid ${theme.palette.mode === 'dark' ? '#0e1217' : '#ffffff'}`,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#999',
                        },
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${theme.palette.mode === 'dark' ? '#555' : '#ccc'} transparent`,
                    }}
                >
                    <Stack
                        sx={{
                            minHeight: '100vh',
                            justifyContent: 'start',
                            alignItems: 'center',
                            p: '3%',
                        }}
                    >
                        {children}
                    </Stack>
                </Box>

                {/* Logout Confirmation Dialog */}
                <LogoutConfirmDialog
                    open={logoutDialogOpen}
                    onClose={handleLogoutCancel}
                    onConfirm={handleLogoutConfirm}
                />

             
                { user.role === "admin" && <RegistrationRequestsSidebar
                    open={requestsSidebarOpen}
                    onClose={handleRequestsSidebarClose}
                />}
            </Stack>
        );
    }