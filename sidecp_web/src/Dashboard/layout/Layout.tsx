import { type ReactNode, useRef, useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useSettingContext } from '../../settingsComponent/contextSettings';
import { Icon } from '@iconify/react'
import {TextPage} from './pages_layout'
import {IconPage} from './pages_layout'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';

type props = {
    setPage: any
    children: ReactNode
}

export default function MainLayout({ setPage, children }: props){
    const pageSelected = useRef(setPage) 
    const [changeSoft, setSoft] = useState(false)
    const navigation = useNavigate()
    
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
                
                {!changeSoft && <Stack
                    display="flex"
                    sx={{
                        backgroundColor: 'rgb(65, 131, 255, 0.8)',
                        width: 'auto', 
                        height: '100%',
                        justifyContent: 'start',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                    }}
                    spacing={4}
                >
                    <Box
                    component="img"
                    src="/Cedil_logo.png"
                    sx={{
                    position: 'relative',
                    width: '12vw',
                    height: 'auto',
                    top: 0,
                    left: 0,
                    p: 3,
                    pt: 6,
                    pb: 10,
                    }}
                />

                <TextPage pageObject={pageSelected.current}/>

                <Icon icon='line-md:chevron-small-left' color="white" onClick={()=>{setSoft(true)}} style={{
                    width: '4vw',
                    height: '4vh',
                    alignSelf: 'flex-end',
                    justifySelf: 'flex-end',
                    position:'fixed',
                    bottom: 100,
                    cursor: 'pointer'
                }}/>

                <Typography color='white' typography='h5' sx={{
                            position: 'fixed',
                            m: 3, 
                            mt: 5,
                            cursor:'pointer',
                            pl: 8,
                            pr: 8,
                            pt: 0.5,
                            pb: 0.5,
                            borderRadius: 10,
                            transition: 'all 0.3s ease',
                            '&:hover':{
                                backgroundColor: 'rgb(45, 119, 255)',
                            },
                             bottom: 30,
                            typography: {
                                xs: 'subtitle1', // Small screens (mobile)
                                sm: 'h6', // Medium screens (tablet)
                                md: 'h5', // Large screens (desktop)
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
                        backgroundColor: 'rgb(65, 131, 255, 0.8)',
                        width: 'auto', 
                        height: '100%',
                        justifyContent: 'start',
                        alignItems: 'center',
                        mr: '5vw',
                        transition: 'all 0.3s ease'
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
                }} whileHover={{marginLeft: 5, transition: { duration: 0.2 }}} >
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
                       // backgroundColor: 'black',
                        width: 'auto', // Half of the parent width
                        height: '100%', // Full height of the parent
                        opacity: 0.5,
                        justifyContent: 'start',
                        alignItems: 'center',
                        p: '3%'
                    }}
                >{children}
                </Stack>
            </Stack>
        );
    }