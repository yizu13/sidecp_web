import React from "react";
import { Typography, Box } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEditCommitte } from "../../router/committeEditContext/committeContextEdit";
import { useSettingContext } from "../../settingsComponent/contextSettings";
import { useSidebar } from "../../settingsComponent/sidebarContext";

type PageObject = {
    page: number,
    subPage : number | null
}

type subPage = {
    label: string,
    navigation: string,
    icon?: string
}

type props = {
    title: string,
    subPages: Array<subPage>,
    pageObject: PageObject,
    mainReference: number
    role: string
}

export default function OptionsNavigation({subPages, pageObject, title, mainReference, role}: props){

    const { setCommitteForEdit } = useEditCommitte()
    const navigation = useNavigate();
    const inPage = pageObject.page === mainReference
    const userRole = sessionStorage.getItem("role")
    const {theme} = useSettingContext()
    const { openSubMenus, toggleSubMenu } = useSidebar()
    
    const menuKey = title.toLowerCase()
    const open = openSubMenus[menuKey] || false
    
    const getMainIcon = (title: string) => {
        switch(title) {
            case 'Comisiones': return 'solar:clipboard-list-bold';
            case 'Usuarios': return 'solar:users-group-two-rounded-bold';
            default: return 'solar:list-bold';
        }
    }
    
    const handleToggle = () => {
        toggleSubMenu(menuKey)
    }

    return(
        <>   
        {role === userRole && <>
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: inPage ? 'default' : 'pointer',
                px: 3,
                py: 1.5,
                mx: 1,
                mb: 1,
                userSelect: "none",
                borderRadius: 3,
                transition: 'all 0.3s ease',
                backgroundColor: open || (pageObject.subPage === 0 && inPage) || 
                (pageObject.subPage && inPage) ? theme.palette.mode === "dark" ?'#10151b': "#eeeeee" : '',
                boxShadow: open || (pageObject.subPage === 0 && inPage) || 
                (pageObject.subPage && inPage) ? '0px 4px 16px rgba(30, 52, 94, 0.2)': "",
                '&:hover':{
                    backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                    boxShadow: '0px 4px 16px rgba(28, 66, 136, 0.2)',
                },
            }}
            onClick={handleToggle}
        >
            <Icon 
                icon={getMainIcon(title)} 
                style={{ 
                    fontSize: '20px', 
                    color: open || (pageObject.subPage === 0 && inPage) || 
                    (pageObject.subPage && inPage) ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a"
                }} 
            />
            <Typography 
                sx={{
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    color: open || (pageObject.subPage === 0 && inPage) || 
                    (pageObject.subPage && inPage) ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    whiteSpace: 'nowrap'
                }}
            >
                {title}
            </Typography>
            <Icon 
                icon={open ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-right-bold"} 
                style={{ 
                    fontSize: '16px', 
                    color: open || (pageObject.subPage === 0 && inPage) || 
                    (pageObject.subPage && inPage) ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
                    marginLeft: 'auto'
                }} 
            />
        </Box>
                <AnimatePresence initial={false} mode="wait">
                  {open && (
                   <motion.div
                    key="content"
                        initial={{ opacity: 0, y: -5, height: 0, marginTop: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto", marginTop: 10, marginBottom: -20}}
                        exit={{ opacity: 0 , y: -5, height: 0, marginTop: 0, marginBottom: 0}}
                        transition={{ duration: 0.3 }}
                   > 
                    {subPages.map((item, i, array)=>(
                    <Box sx={{mt: i !== 0? 1: 0.5, mb: 0.5}} key={i}>
                        <Box 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: (pageObject.subPage === i && inPage) ? 'default' : 'pointer',
                                px: 3,
                                py: 1.2,
                                ml: 3,
                                mr: 2,
                                mb: array.length - 1 === i ? 2 : 0,
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                backgroundColor: (pageObject.subPage === i && inPage)  ? theme.palette.mode === "dark" ?'#10151b': "#eeeeee" : '',
                                boxShadow: (pageObject.subPage === i && inPage)  ? '0px 4px 16px rgba(30, 52, 94, 0.2)': "",
                                '&:hover':{
                                    backgroundColor: theme.palette.mode === "dark" ?'#10151b': "#eeeeee",
                                    boxShadow: '0px 4px 16px rgba(45,119,255,0.2)',
                                    transform: 'translateX(2px)'
                                },
                            }}
                            onClick={()=>{
                                navigation(item.navigation); 
                                if(item.label === "Lista"){setCommitteForEdit(null)}
                            }}
                        >
                            {item.icon && (
                                <Icon 
                                    icon={item.icon} 
                                    style={{ 
                                        fontSize: '18px', 
                                        color: (pageObject.subPage === i && inPage)  ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a"
                                    }} 
                                />
                            )}
                            <Typography 
                                sx={{
                                    fontWeight: 500,
                                    fontFamily: '"Inter", "Roboto", sans-serif',
                                    color: (pageObject.subPage === i && inPage)  ? theme.palette.mode === "dark" ?'#ffffff': "#1f1f1f": theme.palette.mode === "dark" ?'#cccccc': "#8a8a8a",
                                    fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                     </motion.div>
                     )
                   }
                   </AnimatePresence> </>}
        </>
    )
}