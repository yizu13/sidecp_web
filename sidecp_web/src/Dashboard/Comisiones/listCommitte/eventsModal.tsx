import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";

type events = {
    title: string
    eventDescription: string
}
type props ={
    open: boolean
    eventList: events[] 
    modalFunc: (data: boolean)=>void
    eventsFunc: (data: events[])=>void
}

export default function EventsModal({open, eventList, modalFunc, eventsFunc}: props){
    return(
        <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 6}}}}>
            <DialogTitle sx={{p: 2, ml: 1, mt: 1}}>Eventos</DialogTitle>
            <DialogContent>
                <Box sx={{maxHeight: "50vh", maxWidth: "50vw", overflow: "auto"}}>
                {
                            eventList.map((item,i)=>(
                               <ListItem alignItems="flex-start" key={i}>
                                <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                primary={item?.title}
                                slotProps={{primary: {
                                    color: "textPrimary",
                                    textAlign: "justify",
                                    fontWeight: "bold",
                                    variant: "subtitle1",
                                    noWrap: true
                                }}}
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ color: 'gray', display: 'inline' }}
                                    >
                                        {item?.eventDescription}
                                    </Typography>
                                    </React.Fragment>
                                }
                                />
                                          <Divider variant="inset" /> 
                            </ListItem>
                            ))  
                        }
                        </Box>
            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button sx={{borderRadius: 3}} onClick={()=>{modalFunc(false); setTimeout(()=>{eventsFunc([])},200)}} variant="outlined" color="error" fullWidth>Cerrar</Button>
            </DialogActions>
        </Dialog>
    )
}