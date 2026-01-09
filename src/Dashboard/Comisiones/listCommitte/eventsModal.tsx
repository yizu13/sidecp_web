import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Icon } from '@iconify/react';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
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
    const { theme } = useSettingContext();
    
    return(
        <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 600}}}}>
            <DialogTitle sx={{ p: 3, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon icon="solar:calendar-bold" style={{ fontSize: 24, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
                  Eventos de la Comisión
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Box sx={{maxHeight: "50vh", overflow: "auto"}}>
                {eventList.length > 0 ? (
                            eventList.map((item,i)=>(
                               <ListItem alignItems="flex-start" key={i} sx={{ px: 0, mb: 1 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                    <Icon icon="solar:calendar-date-bold" style={{ fontSize: 20, color: 'white' }} />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                primary={
                                  <Typography sx={{ 
                                    fontFamily: '"Inter", "Roboto", sans-serif', 
                                    fontWeight: 600,
                                    mb: 0.5
                                  }}>
                                    {item?.title}
                                  </Typography>
                                }
                                secondary={
                                    <Typography
                                        variant="body2"
                                        sx={{ 
                                          color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
                                          fontFamily: '"Inter", "Roboto", sans-serif',
                                          lineHeight: 1.5
                                        }}
                                    >
                                        {item?.eventDescription}
                                    </Typography>
                                }
                                />
                                {i < eventList.length - 1 && <Divider sx={{ mt: 1 }} />}
                            </ListItem>
                            ))  
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Icon icon="solar:calendar-cross-bold" style={{ fontSize: 48, color: theme.palette.mode === 'dark' ? '#666' : '#ccc', marginBottom: 16 }} />
                            <Typography sx={{ 
                              fontFamily: '"Inter", "Roboto", sans-serif',
                              color: theme.palette.mode === 'dark' ? '#666' : '#999' 
                            }}>
                              No hay eventos registrados
                            </Typography>
                          </Box>
                        )}
                        </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                  startIcon={<Icon icon="solar:close-circle-bold" />}
                  onClick={()=>{modalFunc(false); setTimeout(()=>{eventsFunc([])},200)}} 
                  variant="outlined" 
                  color="error" 
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                >
                  Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}