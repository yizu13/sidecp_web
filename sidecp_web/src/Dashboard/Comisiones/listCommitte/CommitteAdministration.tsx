import { useRef, useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { motion, useScroll, useMotionValue, animate } from 'framer-motion';
import { getCommitties, openCommitte, closeCommitte } from '../../../API/userAPI';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSettingContext } from '../../../settingsComponent/contextSettings';


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
const leftInset = `20%`;
const rightInset = `80%`;
const transparent = `#0000`;
const opaque = `#000`;

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
            setCommitties(response.data.committies);
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
        console.log("value", value);
        setScrollValue(value)
        if(!firstState){
            setScrollValue(0)
        }
        
        if (value < 0.2 || !firstState) {
            setFirst(true)
            animate(
                maskImage,
                `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
            );
        } else if (value >= 0.95 && firstState) {
            setFirst(true)
            animate(
                maskImage,
                `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            );
        } else {
            const prev = scrollXProgress.getPrevious();
            if ((prev !== undefined && (prev <= 0.2 || prev >= 0.95))) {
                animate(
                    maskImage,
                    `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
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
                console.log(response.data.committies);
                setCommitties(response.data.committies);
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
        setCommitties(response.data.committies)
    }


    const scrollByAmount = (amount: number) => {
        if (ref.current) {
            ref.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    }
   
    return (
        <>
        <Box id="example" sx={{ position: "relative" }}>

          
                {scroll > 0.2 && <IconButton
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        zIndex: 2,
                        minWidth: 0,
                        width: 36,
                        height: 36,
                        p: 0,
                        borderRadius: 6,
                        background: "transparent",
                        transform: "translate(-80%,-50%)",
                        "&:hover": { background: "#c0c0c0" }
                    }}
                    onClick={() => scrollByAmount(-200)}
                >
                 <Icon icon="material-symbols:arrow-left-rounded"/>
                </IconButton>}
            
             
               {scroll < 0.95 && committies.length > 3 && <IconButton
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        zIndex: 2,
                        minWidth: 0,
                        width: 36,
                        height: 36,
                        p: 0,
                        borderRadius: 6,
                        background: "transparent",
                        transform: "translate(80%,-50%)",
                        "&:hover": { background: "#c0c0c0" }
                    }}
                    onClick={() => scrollByAmount(200)}
                >
                    <Icon icon="material-symbols:arrow-right-rounded"/>
                </IconButton>}
            
            <motion.ul
                ref={ref}
                style={committies.length > 3 ? { maskImage } : {}}
            >
                {committies.map((item: Committe) => (
                    <li key={item.id} style={{ color: theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f", background: theme.palette.mode === "dark"? "#141a21" :"#f1f1f1", rowGap: 4 }}>
                        <Typography typography="caption">{item.committename}</Typography>
                        <Button
                                variant='contained'
                                color={item.committeopen ? "success" : 'inherit'}
                                onClick={() => {
                                    if (item.committeopen) {
                                        handleCloseRequest(item);
                                    } else {
                                        openCloseFunction(item.committeid, item.committeopen);
                                    }
                                }}
                                sx={{ width: 5 }}
                            >
                            </Button>
                        <Typography typography="caption">{item.committeopen
                                ? <>Activo: <ElapsedTime openedtime={item.openedtime} /></>
                                : "Cerrado"}</Typography>
                    </li>
                ))}
            </motion.ul>
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
              width: 100vw;
              max-width: 50vw;
              position: relative;
            }

            #example #progress {
                position: absolute;
                top: -65px;
                left: -15px;
                transform: rotate(-90deg);
            }

            #example .bg {
                stroke: #0b1011;
            }

            #example #progress circle {
                stroke-dashoffset: 0;
                stroke-width: 10%;
                fill: none;
            }

            #progress .indicator {
                stroke: var(--accent);
            }

            #example ul {
                display: flex;
                list-style: none;
                height: 8rem;
                overflow-x: hidden;
                overflow-y: hidden;
                padding: 20px 0;
                flex: 0 0 600px;
                margin: 0 auto;
                gap: 20px;
            }

            #example ::-webkit-scrollbar {
                height: 5px;
                width: 5px;
                background: #fff3;
                -webkit-border-radius: 1ex;
            }

            #example ::-webkit-scrollbar-thumb {
                background: gray;
                -webkit-border-radius: 1ex;
            }

            #example ::-webkit-scrollbar-corner {
                background: #fff3;
            }

            #example li {
                flex: 0 0 200px;
                background: var(--accent);
                padding: 15px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
            }
        `}</style>
    );
}