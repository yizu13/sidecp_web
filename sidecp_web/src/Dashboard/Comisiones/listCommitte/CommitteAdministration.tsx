import { useRef, useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, Card, CardContent, Chip, Tooltip } from '@mui/material';
import { motion, useScroll, useMotionValue, animate } from 'framer-motion';
import { getCommitties, openCommitte, closeCommitte } from '../../../API/userAPI';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import React from 'react';


interface Committe {
    id: string | number;
    committename: string;
    openedtime: null | string
    committeopen: boolean
    committeid: string
}

function ElapsedTime({ openedtime }: { openedtime: string | null }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        if (!openedtime) return;
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, [openedtime]);
    if (!openedtime) return <>-</>;
    const start = new Date(openedtime).getTime();
    const diff = now - start;
    if (diff < 0) return <>-</>;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return (
        <>
            {days > 0 ? `${days}d ` : ""}
            {hours}h {minutes}m
        </>
    );
}

const left = `0%`;
const right = `100%`;
const leftInset = `15%`;
const rightInset = `85%`;
const transparent = `rgba(0,0,0,0)`;
const opaque = `rgba(0,0,0,1)`;

export default function AdministrationCommittee() {
    const { theme } = useSettingContext()
    const ref = useRef<HTMLUListElement>(null);
    const { scrollXProgress } = useScroll({ container: ref });
    const [ scroll, setScrollValue ] = useState(0)
    const [ firstState, setFirst] = useState(false)
    const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
);
    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [committeToClose, setCommitteToClose] = useState<Committe | null>(null);

    // ...resto del código...

    const handleCloseRequest = (committe: Committe) => {
        setCommitteToClose(committe);
        setCloseDialogOpen(true);
    };

    const confirmClose = async () => {
        if (committeToClose) {
            
            await closeCommitte(committeToClose.committeid);
            const response = await getCommitties();
            setCommitties(response.data.committes);
            setCommitteToClose(null);
            setCloseDialogOpen(false);
        }
    };

    const cancelClose = () => {
        setCommitteToClose(null);
        setCloseDialogOpen(false);
    };

useEffect(() => {
    const unsubscribe = scrollXProgress.on("change", (value) => {
        setScrollValue(value)
        if(!firstState){
            setScrollValue(0)
        }
        
        // Difuminado más suave en el lado izquierdo
        if (value <= 0.15 || !firstState) {
            setFirst(true)
            animate(
                maskImage,
                `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`,
                { duration: 0.3, ease: "easeOut" }
            );
        } 
        // Difuminado más suave en el lado derecho
        else if (value >= 0.85 && firstState) {
            setFirst(true)
            animate(
                maskImage,
                `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`,
                { duration: 0.3, ease: "easeOut" }
            );
        } 
        // Difuminado en ambos lados cuando está en el medio
        else {
            const prev = scrollXProgress.getPrevious();
            if ((prev !== undefined && (prev <= 0.15 || prev >= 0.85))) {
                animate(
                    maskImage,
                    `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`,
                    { duration: 0.3, ease: "easeOut" }
                );
            }
        }
    });
    return () => unsubscribe();
}, [scrollXProgress, maskImage, firstState]);

    const [committies, setCommitties] = useState<Committe[]>([]);

    useEffect(() => {
        const fetchCommitties = async () => {
            try {
                const response = await getCommitties();
                console.log(response.data.committes);
                
                setCommitties(response.data.committes);
            } catch (error) {
                console.error('Error fetching committies:', error);
            }
        };
        fetchCommitties();
    }, []);

    const openCloseFunction = async (id: string, state: boolean)=>{
        if(!state){
            await openCommitte(id);
        } else if (state){
            await closeCommitte(id);
        }
        const response = await getCommitties();
        setCommitties(response.data.committes)
    }


    const scrollByAmount = (amount: number) => {
        if (ref.current) {
            ref.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    }
   
    return (
        <>
        <Box id="example" sx={{ 
            position: "relative", 
            width: "100%", 
            maxWidth: { xs: "95vw", md: "1000px" },
            mx: "auto",
            overflow: "visible",
            pt: 2,
            px: { xs: 1, md: 2 }
        }}>

          
                {scroll > 0.15 && <IconButton
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: { xs: 8, md: 16 },
                        zIndex: 3,
                        minWidth: 0,
                        width: 44,
                        height: 44,
                        p: 0,
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                        transform: "translateY(-50%)",
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        "&:hover": { 
                            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
                            transform: "translateY(-50%) scale(1.05)"
                        },
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => scrollByAmount(-300)}
                >
                 <Icon icon="solar:arrow-left-bold" style={{ fontSize: '20px' }}/>
                </IconButton>}
            
             
               {scroll < 0.85 && committies.length > 3 && <IconButton
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: { xs: 8, md: 16 },
                        zIndex: 3,
                        minWidth: 0,
                        width: 44,
                        height: 44,
                        p: 0,
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                        transform: "translateY(-50%)",
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        "&:hover": { 
                            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
                            transform: "translateY(-50%) scale(1.05)"
                        },
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => scrollByAmount(300)}
                >
                    <Icon icon="solar:arrow-right-bold" style={{ fontSize: '20px' }}/>
                </IconButton>}
            
            <motion.div
                ref={ref}
                style={{
                    display: 'flex',
                    gap: '20px',
                    overflowX: 'auto',
                    overflowY: 'visible',
                    padding: '24px 40px',
                    scrollSnapType: 'x mandatory',
                    minHeight: '280px',
                    ...(committies?.length > 3 ? { maskImage } : {})
                }}
            >
                {committies?.map((item: Committe) => (
                    <Card 
                        key={item.id} 
                        sx={{
                            minWidth: { xs: 280, md: 320 },
                            maxWidth: { xs: 280, md: 320 },
                            height: 'auto',
                            borderRadius: 3,
                            boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
                            border: `2px solid ${item.committeopen ? theme.palette.success.light : theme.palette.grey[300]}`,
                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff',
                            transition: 'all 0.3s ease',
                            scrollSnapAlign: 'start',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                <Icon 
                                    icon="solar:clipboard-text-bold" 
                                    style={{ 
                                        fontSize: '24px', 
                                        color: item.committeopen ? theme.palette.success.main : theme.palette.grey[500] 
                                    }}
                                />
                                <Chip
                                    label={item.committeopen ? "Activa" : "Cerrada"}
                                    color={item.committeopen ? "success" : "default"}
                                    size="small"
                                    icon={<Icon icon={item.committeopen ? "solar:play-circle-bold" : "solar:pause-circle-bold"} />}
                                    sx={{ 
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                        fontWeight: 500
                                    }}
                                />
                            </Box>
                            
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 500,
                                    fontFamily: '"Inter", "Roboto", sans-serif',
                                    letterSpacing: '-0.01em',
                                    color: 'text.primary',
                                    mb: 2,
                                    lineHeight: 1.3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {item.committename}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={1} mb={3}>
                                <Icon 
                                    icon="solar:clock-circle-bold" 
                                    style={{ fontSize: '18px', color: theme.palette.text.secondary }}
                                />
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                        fontWeight: 400
                                    }}
                                >
                                    {item.committeopen ? (
                                        <>Activa hace: <ElapsedTime openedtime={item.openedtime} /></>
                                    ) : (
                                        "Comisión cerrada"
                                    )}
                                </Typography>
                            </Box>
                            
                            <Tooltip title={item.committeopen ? "Cerrar comisión" : "Abrir comisión"}>
                                <Button
                                    variant={item.committeopen ? "outlined" : "contained"}
                                    color={item.committeopen ? "error" : "success"}
                                    fullWidth
                                    startIcon={<Icon icon={item.committeopen ? "solar:stop-bold" : "solar:play-bold"} />}
                                    onClick={() => {
                                        
                                        if (item.committeopen) {
                                            handleCloseRequest(item);
                                        } else {
                                            openCloseFunction(item.committeid, item.committeopen);
                                        }
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1,
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        boxShadow: item.committeopen ? 'none' : '0px 2px 8px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            boxShadow: item.committeopen ? 'none' : '0px 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                >
                                    {item.committeopen ? "Cerrar" : "Abrir"}
                                </Button>
                            </Tooltip>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>
            <StyleSheet />
        </Box>
        <Dialog open={closeDialogOpen} onClose={cancelClose} slotProps={{ paper: { sx: { borderRadius: 6 } } }}>
        <DialogTitle>Cerrar comisión</DialogTitle>
        <DialogContent>
            <span>
            ¿Estás seguro que deseas cerrar esta comisión? 
            <br />
            <b style={{color: theme.palette.error.main}}>Todas las calificaciones de la comisión se borrarán y no se podrán deshacer los cambios.</b>
            </span>
        </DialogContent>
        <DialogActions>
            <Button onClick={cancelClose} color="primary" variant='outlined' sx={{ borderRadius: 4 }}>
                Cancelar
            </Button>
            <Button onClick={confirmClose} color="error" variant="contained" sx={{ borderRadius: 4 }}>
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
        </>
    );
}

function StyleSheet() {
    return (
        <style>{`
            #example {
                width: 100%;
                max-width: 100%;
                position: relative;
                margin: 0 auto;
                overflow: visible;
            }

            @media (max-width: 768px) {
                #example {
                    max-width: 100%;
                    padding: 0 10px;
                }
            }

            #example > div {
                overflow-x: auto !important;
                overflow-y: visible !important;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }

            #example ::-webkit-scrollbar {
                height: 8px;
                background: transparent;
            }

            #example ::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
                border-radius: 4px;
            }

            #example ::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            #example ::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.3);
            }

            #example ::-webkit-scrollbar-corner {
                background: transparent;
            }

            /* Asegurar que los cards no se corten */
            #example .MuiCard-root {
                flex-shrink: 0;
            }
        `}</style>
    );
}