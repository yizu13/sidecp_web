import { type ReactNode, useRef, useState } from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react'
import {TextPage} from './pages_layout'
import {IconPage} from './pages_layout'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { useSettingContext } from '../../settingsComponent/contextSettings';

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
    const [changeSoft, setSoft] = useState(false)
    const navigation = useNavigate()
    const { theme, themefunc } = useSettingContext()

    const handleChangeTheme = ()=>{
        if(theme.palette.mode === "dark"){
            themefunc("light")
        } else{
            themefunc("dark")
        }
    }

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
                <IconButton
                onClick={handleChangeTheme}
                sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    zIndex: 2000,
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
                
                {!changeSoft && <Stack
                    display="flex"
                    sx={{
                        backgroundColor: theme.palette.mode === "dark" ?'#141a21':"#f1f1f1",
                        width: 'auto', 
                        height: '100%',
                        justifyContent: 'start',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        paddingRight: 2,
                        paddingLeft: 2,
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)'
                    }}
                    spacing={4}
                >
                    <Box>
                    <Box
                    component="img"
                    src= {theme.palette.mode === "dark" ? "/Cedil_logo_white.png" :"/Cedil_logo.png"}
                    sx={{
                    position: 'relative',
                    width: '8vw',
                    height: 'auto',
                    top: 0,
                    left: 0,
                    p: 3,
                    pt: 6,
                    pb: 3,
                    }}
                />
                </Box>

                <TextPage pageObject={pageSelected.current}/>

                <Icon icon='iconamoon:arrow-left-2-light' color={theme.palette.mode === "dark" ?"#ffffff" : "#141a21"} onClick={()=>{setSoft(true)}} style={{
                    width: '2vw',
                    height: '4vh',
                    alignSelf: 'flex-end',
                    justifySelf: 'flex-end',
                    position:'fixed',
                    bottom: 100,
                    cursor: 'pointer'
                }}/>

                <Typography color='white' typography='h5' sx={{
                            position: 'fixed',
                            cursor:'pointer',
                            pl: 8,
                            pr: 8,
                            pt: 0.5,
                            pb: 0.5,
                            borderRadius: 10,
                            transition: 'all 0.3s ease',
                            color: theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f",
                            '&:hover':{
                             backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                             boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
                            },
                             bottom: 30,
                            typography: {
                               xs: 'subtitle2', 
                                sm: 'subtitle1', 
                                md: 'h6', 
                              }
                            
                        }}
                        onClick={()=>{
                            navigation('/logout')}}
                        >Salir</Typography>

                </Stack>}

                {changeSoft && 
                <Stack
                    display="flex"
                    sx={{
                        backgroundColor: '#3b70d3',
                        width: 'auto', 
                        height: '100%',
                        justifyContent: 'start',
                        alignItems: 'center',
                        mr: '5vw',
                        transition: 'all 0.3s ease',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)'
                    }}
                    spacing={4}
                >

                <IconPage pageObject={pageSelected.current}/>

                    <Box sx={{display: 'flex', alignItems: 'end'}}>
                        <motion.div style={{
                    width: '5vw',
                    height: '4vh',
                    position:'fixed',
                    bottom: 100,
                    marginLeft: -30,
                    borderRadius: 30,
                    cursor: 'pointer',
                    backgroundColor: "#679cff",
                    zIndex: -1
                }} whileHover={{marginLeft: 5, transition: { duration: 0.2 }}} onClick={()=>{setSoft(false)}}>
                <Icon icon='line-md:chevron-small-right' color="white" onClick={()=>{setSoft(false)}} style={{
                    width: '4vw',
                    height: '4vh',
                    marginLeft: 35,
                }}/>
                </motion.div>
                </Box>
                </Stack>}

                <Stack
                    display="flex"
                    sx={{
                       backgroundColor: theme.palette.mode === "dark"? '#0e1217': 'white',
                        width: 'auto', 
                        height: '100%', 
                        opacity: 1,
                        justifyContent: 'start',
                        alignItems: 'center',
                        p: '3%'
                    }}
                >{children}
                </Stack>
            </Stack>
        );
    }