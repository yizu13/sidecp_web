import { Stack, Button } from "@mui/material";
import {
    animate,
    motion,
    MotionValue,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
} from "framer-motion"
import { useCallback, useRef } from "react"
import { userData } from "../../API/userAPI";
import { useSettingContext } from "../../settingsComponent/contextSettings";



export default function InicioPage(){
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ container: ref })
    const maskImage = useScrollOverflowMask(scrollYProgress)
    const { theme } = useSettingContext()

    const callBack = useCallback(async()=>{
        try{
        const response = await userData();
        console.log(response);
    }catch(err){
        console.log(err)
    }
    },[])

    return(

        <motion.ul className='scrollConfiguration' ref={ref} style={{
            width: '80vw', 
            height: '90vh', 
            overflowY: 'auto',
            scrollbarWidth: 'none',
           // backgroundColor: 'lightgray', 
            paddingTop: 2,
            paddingBottom: 2,
            maskImage
        }}>
            <Stack sx={{
                width: '60vw', 
                height: '600px', 
                backgroundColor:  theme.palette.mode === "dark"? "#141a21": "#f1f1f1",
                ml: '6vw', 
                mb: '8vh',
                borderRadius: 20,
                position: 'inherit',
                flexShrink: 0
                }}><Button variant="contained" sx={{width: "20%"}} onClick={callBack}>hola</Button></Stack>
            <Stack sx={{
                width: '60vw', 
                height: '600px', 
                backgroundColor:  theme.palette.mode === "dark"? "#141a21": "#f1f1f1",
                ml: '6vw', 
                mb: '8vh',
                borderRadius: 20,
                flexShrink: 0
                }}></Stack>
            </motion.ul>
                
    )
}

const left = `0%`
const right = `80%`
const leftInset = `20%`
const rightInset = `80%`
const transparent = `#0000`
const opaque = `#000`
function useScrollOverflowMask(scrollYProgress: MotionValue<number>) {
    const maskImage = useMotionValue(
        `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
    )

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        if (value === 0) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
            )
        } else if (value >= 0.95) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            )
        } else {
            const prev = scrollYProgress.getPrevious();
            if (
                (prev !== undefined && prev === 0) ||
                (prev !== undefined && prev >= 0.95)
            ) {
                animate(
                    maskImage,
                    `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
                )
            }
        }
    })

    return maskImage
}