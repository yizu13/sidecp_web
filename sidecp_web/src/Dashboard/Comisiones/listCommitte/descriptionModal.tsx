import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";


type props ={
    open: boolean
    description: string 
    modalFunc: (data: boolean)=>void
    descriptionFunc: (data: string)=>void
}



export default function DescriptionModal({open, description, modalFunc, descriptionFunc}: props){
    return(
        <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 6}}}}>
            <DialogTitle sx={{p: 2, ml: 1, mt: 1}}>Descripción</DialogTitle>
            <DialogContent>
                <Box sx={{maxHeight: "50vh", maxWidth: "50vw", overflow: "auto"}}>
                {<Typography variant="body2">{description? description: "No hay descripción para esta comisión"}</Typography>}
                        </Box>
            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button sx={{borderRadius: 3}} onClick={()=>{modalFunc(false); setTimeout(()=> {descriptionFunc("")}, 200)}} variant="outlined" color="error" fullWidth>Cerrar</Button>
            </DialogActions>
        </Dialog>
    )
}