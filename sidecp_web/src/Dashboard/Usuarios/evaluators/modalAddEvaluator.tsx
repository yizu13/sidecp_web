import * as yup from "yup"
import { useEffect, useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import AutocompleteForm from "../../../manageForm/AutocompleteForm"
import { createEvaluator, getEvaluators } from '../../../API/userAPI'
import { Icon } from '@iconify/react'
import { useSettingContext } from '../../../settingsComponent/contextSettings'
import React from 'react';

type row = { 
  userId: string | undefined
  committe: string | undefined
  evaluatorId: string | undefined
}

type User = {
        name: string;
        lastname: string;
        userid: string;
    };

type committe = {
  committeid: string
  committename: string
  creationdate: string
  description: string
  events: string
  location: string
  relatedinstitution: string
  topic: string
}

type props ={
    currentData: row | undefined,
    setOpen: (data: boolean)=>void
    open: boolean
    usersData: Array<User>
    commities: Array<committe>
    setRow: (data: row |undefined)=>void
}

type evaluator = {
  committeid: string
  evaluatorid: string
  userid: string
}

export default function ModalEvaluator({currentData, setOpen, open, usersData, commities, setRow}: props){

    const [evaluators, setEvaluators] = useState<evaluator[]>([]);
    const [dataFiltered, setDataFiltered] = useState<{ label: string; id: string }[] | undefined>()
    const { theme } = useSettingContext()
    const schema = yup.object().shape({
        userId: yup.string().required("Se requiere usuario"),
        committeId: yup.string().required("Se requiere comité")
    })

    const defaultValues = {
        userId: currentData?.userId || "",
        committeId: currentData?.committe || ""
    }

      const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    })

    const { handleSubmit, reset } = methods

    useEffect(()=>{
        const fetchEvaluators = async()=>{
            const response = await getEvaluators();
            setEvaluators(response.data.evaluators);
        }
        fetchEvaluators();
    },[])

    useEffect(() => {
    if (open && currentData) {
        reset({
            userId: currentData.userId || "",
            committeId: currentData.committe || ""
        });
    } else if (open && !currentData) {
        reset({
            userId: "",
            committeId: ""
        });
    }
}, [currentData, reset, open]);

    const onSubmit = handleSubmit(async (data)=>{
    
        try{
            await createEvaluator({evaluatorId: currentData?.evaluatorId , ...data});
            const response = await getEvaluators();
            setEvaluators(response.data.evaluators);
            reset();
            setOpen(false)
            setRow(undefined)
        }catch(err){
            console.log("error: ", err)
        } 
    })
    

    useEffect(()=>{
        const filter = ()=>{
            try{
            const newObjectArray = usersData.map((user: User)=> ({label: `${user.name} ${user.lastname}`, id: user.userid}))
            const newEvaluators = evaluators.map(i=> i.userid)
            const resultado = newObjectArray.filter(item => !newEvaluators.includes(item.id));
         
        setDataFiltered(resultado);
        }catch(err){
            console.log('err', err)
        }
        }
        filter()
    },[currentData, evaluators, usersData]);

     const convertCommitiesToAutocomplete = (committiesArray: Array<committe>)=>{
        try{
            const newObjectArray = committiesArray.map((committie: committe)=> ({label: committie.committename, id: committie.committeid}))
        return newObjectArray;
        }catch(err){
            console.log('err', err)
        }
        
    }

     return(
    <>
    <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 500}}}}>
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{ p: 3, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Icon 
                      icon={Object.keys(currentData || {}).length > 0 ? "solar:pen-bold" : "solar:user-plus-bold"} 
                      style={{ fontSize: 24, color: theme.palette.primary.main }} 
                    />
                    <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
                      {Object.keys(currentData || {}).length > 0 ? "Editar evaluador" : "Crear evaluador"}
                    </Typography>
                  </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 1 }}>
                    <Box display="flex" flexDirection="column" rowGap={3} mt={2}>
                    {!currentData && <AutocompleteForm
                        name="userId"
                        label="Usuario"
                        variant="outlined"
                        options={dataFiltered}
                        getOptionLabel={(option) => option.label}
                        />}
                    <AutocompleteForm
                        name="committeId"
                        label="Comité"
                        variant="outlined"
                        options={convertCommitiesToAutocomplete(commities)}
                        getOptionLabel={(option) => option.label}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Icon icon="solar:close-circle-bold" />}
                      onClick={()=>{setOpen(false); setRow(undefined)}} 
                      color="error"
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
                    <Button 
                      variant="contained" 
                      type='submit' 
                      startIcon={<Icon icon="solar:check-circle-bold" />}
                      color="success"
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        textTransform: 'none',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500
                      }} 
                      fullWidth
                    >
                      {Object.keys(currentData || {}).length > 0 ? "Actualizar" : "Agregar"}
                    </Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}