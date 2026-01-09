import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Icon } from '@iconify/react';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import React from 'react';


type props ={
    open: boolean
    description: string 
    modalFunc: (data: boolean)=>void
    descriptionFunc: (data: string)=>void
}



export default function DescriptionModal({open, description, modalFunc, descriptionFunc}: props){
    const { theme } = useSettingContext();
    
    return(
        <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 600}}}}>
            <DialogTitle sx={{ p: 3, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon icon="solar:document-text-bold" style={{ fontSize: 24, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
                  Descripción de la Comisión
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Box sx={{maxHeight: "50vh", overflow: "auto"}}>
                  {description ? (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        color: theme.palette.mode === 'dark' ? '#ffffff' : '#333',
                        lineHeight: 1.6,
                        textAlign: 'justify'
                      }}
                    >
                      {description}
                    </Typography>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Icon icon="solar:document-cross-bold" style={{ fontSize: 48, color: theme.palette.mode === 'dark' ? '#666' : '#ccc', marginBottom: 16 }} />
                      <Typography sx={{ 
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        color: theme.palette.mode === 'dark' ? '#666' : '#999' 
                      }}>
                        No hay descripción para esta comisión
                      </Typography>
                    </Box>
                  )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                  startIcon={<Icon icon="solar:close-circle-bold" />}
                  onClick={()=>{modalFunc(false); setTimeout(()=> {descriptionFunc("")}, 200)}} 
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