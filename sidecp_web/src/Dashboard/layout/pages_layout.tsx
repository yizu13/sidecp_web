import React, { useState, useRef } from "react"
import { Typography, Box, Stack, Tooltip, Popper, Paper, ClickAwayListener } from "@mui/material"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import OptionsNavigation from "./someOptions"
import { useSettingContext } from "../../settingsComponent/contextSettings"
import { useEditCommitte } from "../../router/committeEditContext/committeContextEdit"

type PageObject = {
    page: number,
    subPage : number | null
}

type Props = {
    pageObject: PageObject
}

export function TextPage({ pageObject }: Props){
    const { theme } = useSettingContext()
    const navigation = useNavigate()
    const role = sessionStorage.getItem("role")
    
    const committePage = [
        {label: "Crear", navigation: "/dashboard/comisiones/crear", icon: "solar:add-square-bold"}, 
        {label: "Lista", navigation: "/dashboard/comisiones/cerrar", icon: "solar:clipboard-list-bold"}
    ];
     const usersPage = [
        {label: "Delegaciones", navigation: "/Dashboard/usuarios/delegaciones", icon: "solar:users-group-two-rounded-bold"}, 
        {label:  "Evaluadores", navigation: "/Dashboard/usuarios/evaluadores", icon: "solar:user-check-bold"}
    ];

    return(
        <Stack 
            spacing={2}
            sx={{ 
                width: '100%', 
                flex: 1, 
                px: 2, 
                py: 1,
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: pageObject.page === 0 ? 'default' : 'pointer',
                px: 3,
                py: 1.5,
                mx: 1,
                userSelect: "none",
                borderRadius: 3,
                transition: 'all 0.3s ease',
                backgroundColor: pageObject.page === 0 ? theme.palette.mode === "dark" ?'#10151b': "#eeeeee" : '',
                boxShadow: pageObject.page === 0 ? '0px 4px 16px rgba(27, 47, 83, 0.2)': "",
                '&:hover':{
                    backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                    boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
                },
            }}
            onClick={()=>{navigation('/dashboard/inicio')}}
        >
            <Icon 
                icon="solar:home-bold" 
                style={{ 
                    fontSize: '20px', 
                    color: pageObject.page === 0 ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a"
                }} 
            />
            <Typography 
                sx={{
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    color: pageObject.page === 0 ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
                }}
            >
                Inicio
            </Typography>
        </Box>

        {("evaluator" === role || "admin" === role) && 
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: pageObject.page === 3 ? 'default' : 'pointer',
                px: 3,
                py: 1.5,
                mx: 1,
                userSelect: "none",
                borderRadius: 3,
                transition: 'all 0.3s ease',
                backgroundColor: pageObject.page === 3 ? theme.palette.mode === "dark" ?'#10151b': "#eeeeee" : '',
                boxShadow: pageObject.page === 3 ? '0px 4px 16px rgba(30, 52, 94, 0.2)': "",
                '&:hover':{
                    backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                    boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
                },
            }}
            onClick={()=>{navigation('/dashboard/delegados')}}
        >
            <Icon 
                icon="solar:user-speak-bold" 
                style={{ 
                    fontSize: '20px', 
                    color: pageObject.page === 3 ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a"
                }} 
            />
            <Typography 
                sx={{
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    color: pageObject.page === 3 ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
                }}
            >
                Delegados
            </Typography>
        </Box>}

        
        <OptionsNavigation title="Comisiones" subPages={committePage} pageObject={pageObject} mainReference={1} role="admin"/>
        <OptionsNavigation title="Usuarios" subPages={usersPage} pageObject={pageObject} mainReference={2} role="admin"/>
        
        </Stack>
    )
}


interface SubMenuIconProps {
    title: string;
    icon: string;
    isActive: boolean;
    subPages: Array<{label: string, navigation: string, icon?: string}>;
    pageObject: PageObject;
    menuKey: string;
}

function SubMenuIcon({ title, icon, isActive, subPages, pageObject }: SubMenuIconProps) {
    const { theme } = useSettingContext();
    const { setCommitteForEdit } = useEditCommitte()
    // const { openSubMenus, toggleSubMenu } = useSidebar();
    const navigation = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    
    const isOpen = Boolean(anchorEl);
    
    const handleClick = () => {
        if (anchorRef.current) {
            setAnchorEl(isOpen ? null : anchorRef.current);
        }
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleSubPageClick = (subPage: {label: string, navigation: string, icon?: string}) => {
        navigation(subPage.navigation);
        handleClose();
    };
    
    return (
        <>
            <Tooltip title={title} placement="right">
                <Box
                    ref={anchorRef}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                        position: 'relative',
                        border: `1px solid ${isActive ? 'transparent' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        '&:hover': {
                            backgroundColor: isActive ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            transform: 'scale(1.05)',
                            borderColor: isActive ? 'transparent' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                        },
                        '&::after': isOpen ? {
                            content: '""',
                            position: 'absolute',
                            right: -2,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 3,
                            height: 20,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 1
                        } : {}
                    }}
                    onClick={handleClick}
                >
                    <Icon 
                        icon={icon} 
                        style={{
                            fontSize: '24px',
                            color: isActive ? '#ffffff' : theme.palette.mode === 'dark' ? '#cccccc' : '#666'
                        }}
                    />
                </Box>
            </Tooltip>
            
            <Popper 
                open={isOpen} 
                anchorEl={anchorEl} 
                placement="right-start"
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, -8],
                        },
                    },
                ]}
                style={{ zIndex: 1300 }}
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <Paper
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                            border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                            borderRadius: 2,
                            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
                            py: 1,
                            minWidth: 180
                        }}
                    >
                        {subPages.map((subPage, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 2,
                                    py: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: (pageObject.subPage === index && isActive) ? 
                                        theme.palette.mode === 'dark' ? '#333' : '#f5f5f5' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'
                                    }
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                onClick={() => {handleSubPageClick(subPage); subPage.label === "Crear" ? setCommitteForEdit(null) : null}}
                            >
                                {subPage.icon && (
                                    <Icon 
                                        icon={subPage.icon} 
                                        style={{ 
                                            fontSize: '18px', 
                                            color: theme.palette.mode === 'dark' ? '#cccccc' : '#666' 
                                        }} 
                                    />
                                )}
                                <Typography
                                    sx={{
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        color: theme.palette.mode === 'dark' ? '#ffffff' : '#333'
                                    }}
                                >
                                    {subPage.label}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    );
}

export function IconPage({ pageObject }: Props){
    const navigation = useNavigate()
    const { theme } = useSettingContext()
    // const { openSubMenus, toggleSubMenu } = useSidebar()
    const role = sessionStorage.getItem("role")
    
    const committePage = [
        {label: "Crear", navigation: "/dashboard/comisiones/crear", icon: "solar:add-square-bold"}, 
        {label: "Lista", navigation: "/dashboard/comisiones/cerrar", icon: "solar:clipboard-list-bold"}
    ];
    const usersPage = [
        {label: "Delegaciones", navigation: "/Dashboard/usuarios/delegaciones", icon: "solar:users-group-two-rounded-bold"}, 
        {label:  "Evaluadores", navigation: "/Dashboard/usuarios/evaluadores", icon: "solar:user-check-bold"}
    ];
    
    return(
        <Stack spacing={3} sx={{ 
            mt: 2, 
            pt: 2,
            alignItems: 'center', 
            position: 'relative',
            width: '100%',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'visible',
            px: 0.5
        }}>
            {/* Inicio */}
            <Tooltip title="Inicio" placement="right">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        cursor: pageObject.page === 0 ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: pageObject.page === 0 ? theme.palette.primary.main : 'transparent',
                        border: `1px solid ${pageObject.page === 0 ? 'transparent' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        '&:hover': {
                            backgroundColor: pageObject.page === 0 ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            transform: 'scale(1.05)',
                            borderColor: pageObject.page === 0 ? 'transparent' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                        }
                    }}
                    onClick={()=>{navigation('/dashboard/inicio')}}
                >
                    <Icon 
                        icon="solar:home-bold" 
                        style={{
                            fontSize: '24px',
                            color: pageObject.page === 0 ? '#ffffff' : theme.palette.mode === 'dark' ? '#cccccc' : '#666'
                        }}
                    />
                </Box>
            </Tooltip>

            {/* Delegados */}
            {("evaluator" === role || "admin" === role) && 
            <Tooltip title="Delegados" placement="right">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        cursor: pageObject.page === 3 ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: pageObject.page === 3 ? theme.palette.primary.main : 'transparent',
                        '&:hover': {
                            backgroundColor: pageObject.page === 3 ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            transform: 'scale(1.05)'
                        }
                    }}
                    onClick={()=>{navigation('/dashboard/delegados')}}
                >
                    <Icon 
                        icon="solar:user-speak-bold" 
                        style={{
                            fontSize: '24px',
                            color: pageObject.page === 3 ? '#ffffff' : theme.palette.mode === 'dark' ? '#cccccc' : '#666'
                        }}
                    />
                </Box>
            </Tooltip>}

            {/* Comisiones */}
            <SubMenuIcon
                title="Comisiones"
                icon="solar:clipboard-list-bold"
                isActive={pageObject.page === 1}
                subPages={committePage}
                pageObject={pageObject}
                menuKey="comisiones"
            />

            {/* Usuarios */}
            <SubMenuIcon
                title="Usuarios"
                icon="solar:users-group-two-rounded-bold"
                isActive={pageObject.page === 2}
                subPages={usersPage}
                pageObject={pageObject}
                menuKey="usuarios"
            />
        </Stack>
    )
}