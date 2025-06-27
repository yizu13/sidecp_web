import * as yup from 'yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FieldTForm from '../../../manageForm/FieldTxtForm';

type EventItem = {
    title: string 
    eventDescription: string | undefined
}

type props ={
    setOpenCreate: (data: boolean)=>void,
    setList: (data: (prev: EventItem[]) => EventItem[])=>void,
    boolOpenCreate: boolean
}

export default function DialogCreate({setOpenCreate, boolOpenCreate, setList}: props){

    const schema = yup.object().shape({
        title: yup.string().required("Se requiere un título para el evento"),
        eventDescription: yup.string()
    })

    const defaultValues = {
        title: '',
        eventDescription: ''
    }

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    })

    const { handleSubmit, reset } = methods;

    const onSubmit = handleSubmit((data)=>{
        try{
            setList((prev: EventItem[]) => [...prev, { title: data.title, eventDescription: data.eventDescription }] );
            reset()
            setOpenCreate(false)
        }catch(err){
            console.log("error: ", err)
        }
    })
    return(
    <>
    <Dialog open={boolOpenCreate} slotProps={{paper: {sx: {borderRadius: 6}}}}>
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{p: 2, ml: 1, mt: 1}}>Crear evento</DialogTitle>
                <DialogContent >
                    <Box display="flex" flexDirection="row" columnGap={2} sx={{p: 2}}>
                    <FieldTForm name='title' label='Nombre del evento' variant='outlined'/>
                    <FieldTForm name='eventDescription' label='Description' variant='outlined'/>
                    </Box>
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button variant="outlined" color="error" onClick={()=>{setOpenCreate(false)}} sx={{borderRadius: 3, width: "40%"}} >Cerrar</Button>
                    <Button variant="contained" type='submit' sx={{borderRadius: 3}} fullWidth>Agregar</Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}