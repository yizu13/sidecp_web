import * as yup from 'yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from "@mui/material"
import { Icon } from '@iconify/react/dist/iconify.js';
import FormManaged from "../../../manageForm/FormProvider";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FieldTForm from '../../../manageForm/FieldTxtForm';
import React from 'react';

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
    <Dialog 
        open={boolOpenCreate} 
        onClose={() => setOpenCreate(false)}
        maxWidth="md"
        fullWidth
        slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 600}}}}
    >
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{p: 3}}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Icon 
                            icon="solar:add-square-bold" 
                            style={{ fontSize: '28px', color: '#1976d2' }}
                        />
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 500, 
                                fontFamily: '"Inter", "Roboto", sans-serif',
                                letterSpacing: '-0.02em',
                                color: 'text.primary'
                            }}
                        >
                            Crear evento
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{pb: 1}}>
                    <Box 
                        display="flex" 
                        flexDirection={{ xs: 'column', sm: 'row' }} 
                        columnGap={3} 
                        rowGap={2}
                        sx={{pt: 1}}
                    >
                        <FieldTForm name='title' label='Nombre del evento' variant='outlined'/>
                        <FieldTForm 
                            name='eventDescription' 
                            label='Descripción del evento' 
                            variant='outlined'
                            multiline
                            minRows={1}
                            maxRows={4}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{p: 3, gap: 1.5}}>
                    <Button 
                        variant="outlined" 
                        onClick={()=>{setOpenCreate(false)}} 
                        startIcon={<Icon icon="solar:close-circle-bold" />}
                        color='error'
                        sx={{
                            borderRadius: 2, 
                            px: 3,
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            textTransform: 'none'
                        }} 
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        type='submit' 
                        startIcon={<Icon icon="solar:check-circle-bold" />}
                        color='success'
                        sx={{
                            borderRadius: 2, 
                            px: 4,
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
                            '&:hover': {
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.18)',
                            }
                        }}
                        fullWidth
                    >
                        Agregar evento
                    </Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}