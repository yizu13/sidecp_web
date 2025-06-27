import * as yup from 'yup'
import { Stack, Box, Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from "@mui/material";
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

    useEffect(()=>{
        console.log(committeForEdit)
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
        <FormManaged onSubmit={onSubmit} methods={methods}>
       <Stack spacing={4} sx={{
                width: '60vw', 
                height: '30vh', 
                backgroundColor: theme.palette.mode === 'dark'? 'gray':'#f5f5f5',
                ml: '8vw', 
                mb: '8vh',
                borderRadius: 10,
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                position: 'inherit',
                 justifyContent: "center",
                 overflow: "hidden",
                flexShrink: 0
                }}>
                    <Box display="flex" flexDirection="row" columnGap={6} paddingRight={5} paddingLeft={5}>
                    <FieldTForm name="committeName" label="Nombre del comité" variant='outlined'/>
                    <FieldTForm name="institutionRepresentated" label="Institución" variant='outlined'/>
                    </Box>
                     <Box display="flex" flexDirection="row" columnGap={6} paddingRight={5} paddingLeft={5}>
                    <FieldTForm name="topic" label="Tópico" variant='outlined'/>
                    <FieldTForm name="location" label="Localización" variant='outlined'/>
                    </Box>
                </Stack>
            <Stack sx={{
                width: '60vw', 
                height: '50vh', 
                backgroundColor: theme.palette.mode === 'dark'? 'gray':'#f5f5f5',
                ml: '8vw', 
                mb: '8vh',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                borderRadius: 10,
                 display: "flex",
                 justifyContent: "center",
                 overflow: 'hidden',
                flexDirection: 'column',
                flexShrink: 0
                }}>
                    <Box display="flex" flexDirection="row" columnGap={6} paddingLeft={6} paddingRight={6} paddingBottom={0}>
                        <Box display="flex" flexDirection="column" rowGap={2} sx={{mb: 6}}>
                                <Box
                                    sx={{
                                    height: 200,
                                    width: "100%",
                                    overflowY: "auto",
                                    overflowX: "auto",
                                    '&::-webkit-scrollbar-button': {
                                    display: 'none',
                                    height: 0,
                                    width: 0,
                                    },
                                    '&::-webkit-scrollbar': {
                                    width: 8,
                                    backgroundColor: 'transparent',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#888' : '#ccc',
                                    borderRadius: 4,
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#666' : '#aaa',
                                    },
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: `${theme.palette.mode === 'dark' ? '#888' : '#ccc'} transparent`,
                                }}
                                   
                                >
                        <Typography typography="h6" color="textPrimary" display="flex">
                            Eventos
                        </Typography>
                        <List sx={{ width: '150%', minWidth: 450, maxWidth: 450, bgcolor: 'transparent' }} >
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
                        </List>
                        </Box>
                        <Button variant="contained" color="success" onClick={()=>{setOpenCreate(true)}} sx={{borderRadius: 3, width: 200, alignSelf: "flex-end"}}>
                            Agregar evento
                        </Button>
                        </Box>
                    <FieldTForm name="description" label="Descripción" variant='outlined' multiline minRows={8} maxRows={8} sx={{mb: 0}}/>
                    </Box>
                   <Box sx={{ px: 5, display: "flex" }}>
                        <Button variant="contained" type="submit" fullWidth sx={{borderRadius: 3}}>
                            Guardar comisión
                        </Button>
                        </Box>
                    </Stack>
             </FormManaged>
             <DialogCreate boolOpenCreate={boolOpenCreate} setOpenCreate={setOpenCreate} setList={setList}/>
             </>
    )
}