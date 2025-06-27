import { Typography, Box } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEditCommitte } from "../../router/committeEditContext/committeContextEdit";

type PageObject = {
    page: number,
    subPage : number | null
}

type subPage = {
    label: string,
    navigation: string
}

type props = {
    title: string,
    subPages: Array<subPage>,
    pageObject: PageObject,
    mainReference: number
    role: string
}

export default function OptionsNavigation({subPages, pageObject, title, mainReference, role}: props){

    const [open, setOpen] = useState(false);
    const { setCommitteForEdit } = useEditCommitte()
    const navigation = useNavigate();
    const inPage = pageObject.page === mainReference
    const userRole = sessionStorage.getItem("role")

    return(
        <>   
        {role === userRole && <><Typography color='white'  sx={{
                    position: 'sticky', 
                    cursor: inPage ? 'default' : 'pointer',
                    pl: 4,
                    pr: 2,
                    pt: 0.5,
                    pb: 0.5,
                    userSelect: "none",
                    borderRadius: 10,
                    textWrap: "nowrap",
                    transition: 'all 0.3s ease',
                    backgroundColor: open || (pageObject.subPage === 0 && inPage) || 
                    (pageObject.subPage && inPage) ? 'rgb(45, 119, 255)' : '',
                    '&:hover':{
                        backgroundColor: 'rgb(45, 119, 255)',
        
                    },
                    typography: {
                        xs: 'subtitle2', 
                        sm: 'subtitle1', 
                        md: 'h6', 
                      }
                }}
                onClick={()=>{setOpen(prev=> !prev)}}
        >
        <Box display="flex" alignItems="center">
        {title}
        {open
            ? <Icon icon="line-md:chevron-small-down"  style={{ marginLeft: 8 }} />
            : <Icon icon="line-md:chevron-small-right" style={{ marginLeft: 8 }} />
        }
        </Box>
    </Typography>
                <AnimatePresence initial={false} mode="wait">
                  {open && (
                   <motion.div
                    key="content"
                        initial={{ opacity: 0, y: -5, height: 0, marginTop: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto", marginTop: 10, marginBottom: -20}}
                        exit={{ opacity: 0 , y: -5, height: 0, marginTop: 0, marginBottom: 0}}
                        transition={{ duration: 0.3 }}
                   > 
                    {subPages.map((item, i)=>(
                    <Box sx={{mt: i !== 0? 0.5: 0}} key={i}>
                    <Typography color='white' typography='h5' key={i} sx={{
                    position: 'sticky', 
                    cursor: (pageObject.subPage === i && inPage) ? 'default' : 'pointer',
                    pl: 4,
                    pr: 4,
                    pt: 0.5,
                    pb: 0.5,
                    borderRadius: 10,
                    transition: 'all 0.3s ease',
                    backgroundColor: (pageObject.subPage === i && inPage) ? 'rgb(45, 119, 255)' : '',
                    '&:hover':{
                        backgroundColor: 'rgb(45, 119, 255)',
        
                    },
                    typography: {
                        xs: 'body1', 
                        sm: 'subtitle2', 
                        md: 'subtitle1', 
                      },
                    
                }}
                onClick={()=>{
                    navigation(item.navigation); 
                    if(item.label === "Lista"){setCommitteForEdit(null)}
                }}
                >{item.label}</Typography>
                    </Box>
                ))}
                     </motion.div>
                     )
                   }
                   </AnimatePresence> </>}
        </>
    )
}