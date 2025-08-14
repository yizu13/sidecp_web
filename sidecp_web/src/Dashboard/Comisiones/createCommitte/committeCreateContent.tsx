import * as yup from 'yup'
import { Stack, Box, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, IconButton, Tooltip } from "@mui/material";
import { useSettingContext } from "../../../settingsComponent/contextSettings";
import FormManaged from "../../../manageForm/FormProvider";
import FieldTForm from "../../../manageForm/FieldTxtForm";
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState} from 'react';
import { createCommitte } from '../../../API/userAPI';
import { useForm, type Resolver } from 'react-hook-form';
import DialogCreate from './dialogComponent';
import { getEventsById } from '../../../API/userAPI';
import { useEditCommitte } from '../../../router/committeEditContext/committeContextEdit';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';

type currentDataObject = {
     committeName: string ,
     topic: string,
     institutionRepresentated: string,
     location: string ,
     events: { title: string; eventDescription?: string }[],
     description: string ,
}

type events = {
    title: string
    eventDescription: string | undefined
}


export default function CreateCommitte(){
    const { theme } = useSettingContext()
    const { committeForEdit, setCommitteForEdit } = useEditCommitte()
    const [ eventList, setList ] = useState<events[]>([])
    const [ boolOpenCreate, setOpenCreate ] = useState(false);
    const navigate = useNavigate()

    useEffect(()=>{
        const callEvents = async ()=>{
            if(committeForEdit?.events){
            const response = await getEventsById(committeForEdit?.events ?? "")
            setList([...(response.data || [])])
        }
    }
        callEvents()
    },[committeForEdit?.events, committeForEdit])

    const yupSchema = yup.object().shape({
        committeName: yup.string().required("Se necesita nombre del comité"),
        topic: yup.string().required("El tópico es requerido"),
        institutionRepresentated: yup.string(),
        location: yup.string().required("Se necesita lugar de comité"),
        events: yup.array().of(
            yup.object().shape({
                title: yup.string().required(),
                eventDescription: yup.string()
            })
        ),
        description: yup.string(),
    })
    
    const defaultvalue = {
        committeName: committeForEdit?.committeName || '',
        topic: committeForEdit?.topic || '',
        institutionRepresentated: committeForEdit?.institutionRepresentated || '',
        location: committeForEdit?.location || '',
        events: eventList,
        description: committeForEdit?.description || '',
    }

    const methods = useForm<currentDataObject>({
        defaultValues: defaultvalue,
        resolver: yupResolver(yupSchema) as Resolver<currentDataObject>
    })

    const {handleSubmit, setValue} = methods

    useEffect(()=>{
            setValue("events", eventList)
    },[eventList, setValue]);

    const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await createCommitte({committeId: committeForEdit?.id ,eventsId: committeForEdit?.events,...data})
      console.log(response)
      setCommitteForEdit(null)
       setList([]);
        setValue("committeName", "");
        setValue("topic", "");
        setValue("institutionRepresentated", "");
        setValue("location", "");
        setValue("description", ""); 
    } catch (err) {
        console.log("error:", err);
    }
})

    return(
        <>
        <Stack mt={-4} sx={{ minHeight: '100vh', pb: 4, ml: "-5vw" }}>
        <FormManaged onSubmit={onSubmit} methods={methods}>
            <Box
                            sx={{
                                position: "sticky", 
                                top: 16,
                                left: { xs: 16, md: 32 },
                                zIndex: 2000,
                                display: "flex",
                                justifyContent: "flex-start",
                                mb: 2,
                                width: 'fit-content'
                            }}
                            >
                                    <Tooltip title="Volver a la lista de comisiones" placement="right">
                                        <IconButton
                                                onClick={() => navigate('/dashboard/comisiones/cerrar')}
                                                sx={{
                                                    color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                                                    background: theme.palette.mode === 'dark' ? '#222' : '#fff',
                                                    boxShadow: 3,
                                                    '&:hover': {
                                                        background: theme.palette.mode === 'dark' ? '#333' : '#eee',
                                                        transform: 'scale(1.05)'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                            <Icon icon="solar:arrow-left-bold"/>
                                        </IconButton>
                                    </Tooltip>
                                    </Box>
       <Stack spacing={3} sx={{
                width: { xs: '90vw', md: '60vw' }, 
                minHeight: '280px', 
                backgroundColor: theme.palette.mode === 'dark'? '#141a21':'#f5f5f5',
                ml: { xs: '5vw', md: '8vw' }, 
                mb: '4vh',
                borderRadius: 3,
                boxShadow: '0px 6px 24px rgba(0,0,0,0.12)',
                position: 'inherit',
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
                p: 4,
                pt: 2
                }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <Icon 
                            icon="solar:info-circle-bold" 
                            style={{ fontSize: '24px', color: theme.palette.primary.main }}
                        />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 500, 
                                color: 'text.primary',
                                fontFamily: '"Inter", "Roboto", sans-serif',
                                letterSpacing: '-0.01em'
                            }}
                        >
                            Información del Comité
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} columnGap={3} rowGap={2}>
                        <FieldTForm name="committeName" label="Nombre del comité" variant='outlined'/>
                        <FieldTForm name="institutionRepresentated" label="Institución" variant='outlined'/>
                    </Box>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} columnGap={3} rowGap={2}>
                        <FieldTForm name="topic" label="Tópico" variant='outlined'/>
                        <FieldTForm name="location" label="Localización" variant='outlined'/>
                    </Box>
                </Stack>
            <Stack sx={{
                width: { xs: '90vw', md: '60vw' }, 
                minHeight: '480px', 
                backgroundColor: theme.palette.mode === 'dark'? '#141a21':'#f5f5f5',
                ml: { xs: '5vw', md: '8vw' }, 
                mb: '4vh',
                boxShadow: '0px 6px 24px rgba(0,0,0,0.12)',
                borderRadius: 3,
                display: "flex",
                justifyContent: "flex-start",
                overflow: 'hidden',
                flexDirection: 'column',
                flexShrink: 0,
                p: 4
                }}>
                    <Box display="flex" flexDirection="column" rowGap={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Icon 
                                    icon="solar:calendar-bold" 
                                    style={{ fontSize: '24px', color: theme.palette.primary.main }}
                                />
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 500, 
                                        color: 'text.primary',
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                        letterSpacing: '-0.01em'
                                    }}
                                >
                                    Eventos del Comité
                                </Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                onClick={()=>{setOpenCreate(true)}} 
                                startIcon={<Icon icon="solar:add-circle-bold" />}
                                sx={{
                                    borderRadius: 2, 
                                    px: 3,
                                    fontFamily: '"Inter", "Roboto", sans-serif',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                Agregar evento
                            </Button>
                        </Box>
                        
                        <Box
                            sx={{
                                height: 240,
                                width: "100%",
                                overflowY: "auto",
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
                                borderRadius: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fafafa',
                                '&::-webkit-scrollbar': {
                                    width: 6,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                                    borderRadius: 3,
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#999',
                                },
                            }}
                        >
                            {eventList.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Icon 
                                        icon="solar:calendar-cross-bold" 
                                        style={{ fontSize: '48px', color: theme.palette.text.disabled }}
                                    />
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            fontFamily: '"Inter", "Roboto", sans-serif',
                                            fontWeight: 400
                                        }}
                                    >
                                        No hay eventos agregados aún. Haz clic en "Agregar evento" para comenzar.
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ width: '100%', bgcolor: 'transparent', p: 1 }}>
                                    {eventList.map((item, i) => (
                                        <React.Fragment key={i}>
                                            <ListItem 
                                                alignItems="flex-start"
                                                sx={{
                                                    borderRadius: 1.5,
                                                    mb: 1,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f0f0f0'
                                                    }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        sx={{ 
                                                            bgcolor: theme.palette.primary.light,
                                                            color: theme.palette.primary.contrastText,
                                                            fontWeight: 500,
                                                            fontFamily: '"Inter", "Roboto", sans-serif'
                                                        }}
                                                    >
                                                        <Icon 
                                                            icon="solar:calendar-date-bold" 
                                                            style={{ fontSize: '20px' }}
                                                        />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            sx={{ 
                                                                fontWeight: 500, 
                                                                color: 'text.primary',
                                                                mb: 0.5,
                                                                fontFamily: '"Inter", "Roboto", sans-serif',
                                                                letterSpacing: '-0.01em'
                                                            }}
                                                        >
                                                            {item?.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ 
                                                                color: 'text.secondary',
                                                                lineHeight: 1.4,
                                                                fontFamily: '"Inter", "Roboto", sans-serif',
                                                                fontWeight: 400
                                                            }}
                                                        >
                                                            {item?.eventDescription || 'Sin descripción'}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {i < eventList.length - 1 && <Divider sx={{ mx: 2 }} />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1.5} mb={2} mt={2}>
                            <Icon 
                                icon="solar:document-text-bold" 
                                style={{ fontSize: '24px', color: theme.palette.primary.main }}
                            />
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 500, 
                                    color: 'text.primary',
                                    fontFamily: '"Inter", "Roboto", sans-serif',
                                    letterSpacing: '-0.01em'
                                }}
                            >
                                Descripción del Comité
                            </Typography>
                        </Box>
                        <FieldTForm 
                            name="description" 
                            label="Descripción general del comité" 
                            variant='outlined' 
                            multiline 
                            minRows={6} 
                            maxRows={8}
                        />
                    </Box>
                   <Box sx={{ px: 4, pb: 2, display: "flex" }}>
                        <Button 
                            variant="contained" 
                            type="submit" 
                            fullWidth 
                            startIcon={<Icon icon="solar:diskette-bold" />}
    
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                fontFamily: '"Inter", "Roboto", sans-serif',
                                textTransform: 'none',
                                boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
                                '&:hover': {
                                    boxShadow: '0px 6px 20px rgba(0,0,0,0.18)',
                                },
                                mt: 4
                            }}
                            
                        >
                            Guardar Comisión
                        </Button>
                        </Box>
                    </Stack>
             </FormManaged>
             <DialogCreate boolOpenCreate={boolOpenCreate} setOpenCreate={setOpenCreate} setList={setList}/>
             </Stack>
             </>
    )
}