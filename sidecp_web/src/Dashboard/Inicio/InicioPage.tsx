import { Stack } from "@mui/material";
import {
    animate,
    motion,
    MotionValue,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
} from "framer-motion"
import { useRef } from "react"



export default function InicioPage(){
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ container: ref })
    const maskImage = useScrollOverflowMask(scrollYProgress)

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
                backgroundColor: 'gray',
                ml: '6vw', 
                mb: '8vh',
                borderRadius: 20,
                position: 'inherit',
                flexShrink: 0
                }}></Stack>
            <Stack sx={{
                width: '60vw', 
                height: '600px', 
                backgroundColor: 'gray',
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
        } else if (value === 1) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            )
        } else if (
            scrollYProgress.getPrevious() === 0 ||
            scrollYProgress.getPrevious() === 1
        ) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
            )
        }
    })

    return maskImage
}