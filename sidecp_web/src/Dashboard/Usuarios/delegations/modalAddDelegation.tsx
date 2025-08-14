import * as yup from "yup"
import { useEffect } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { createStudent } from "../../../API/userAPI"
import AutocompleteForm from "../../../manageForm/AutocompleteForm"
import FieldTForm from "../../../manageForm/FieldTxtForm"
import { countriesWithLabelId } from "../../../../public/flags"
import { Icon } from '@iconify/react'
import { useSettingContext } from '../../../settingsComponent/contextSettings'
import React from 'react';

type row = { 
  name: string | undefined
  lastName: string | undefined
  committe: string | undefined
  studentId: string | undefined
  delegation: string | undefined
  scoreId: string | undefined
}

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
    currentData: row | null | undefined,
    setOpen: (data: boolean)=>void
    open: boolean
    commities: Array<committe>
    setRow: (data: row | null)=>void
}


export default function ModalDelegation({currentData, setOpen, open, commities, setRow}: props){
    const { theme } = useSettingContext()
    const schema = yup.object().shape({
        name: yup.string().required("Se requiere nombre del delegado"),
        lastName: yup.string().required("Se requiere apellido del delegado"),
        committeId: yup.string().required("Se requiere comité"),
        delegation: yup.string().required("Se requiere delegación")
    })

    const defaultValues = {
        name: currentData?.name || "",
        lastName: currentData?.lastName || "",
        committeId: currentData?.committe || "",
        delegation: currentData?.delegation || ""
    }

      const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    })

    const { handleSubmit, reset } = methods

    useEffect(() => {
    if (open && currentData) {
        reset({
            name: currentData.name || "",
            lastName: currentData.lastName || "",
            committeId: currentData.committe || "",
            delegation: currentData.delegation || ""
        });
    } else if (open && !currentData) {
        reset({
            name: "",
            lastName: "",
            committeId: "",
            delegation: ""
        });
    }
}, [currentData, reset, open]);

    const onSubmit = handleSubmit(async (data)=>{
    
        try{
            console.log({studentId: currentData?.studentId , scoreId: currentData?.scoreId, ...data});
            await createStudent({studentId: currentData?.studentId , scoreId: currentData?.scoreId, ...data})
            reset();
            setOpen(false);
            setRow(null);
        }catch(err){
            console.log("error: ", err)
        } 
    })
    

     const convertCommitiesToAutocomplete = (committiesArray: Array<committe>)=>{
        try{
            const newObjectArray = committiesArray.map((committie: committe)=> ({label: committie.committename, id: committie.committeid}))
        return newObjectArray;
        }catch(err){
            console.log('err', err)
        }
        
    }

    const handleClose = () => {
    reset();
    setRow(null); 
    setOpen(false);
}

     return(
    <>
    <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 550}}}}>
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{ p: 3, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Icon 
                      icon={Object.keys(currentData || {}).length > 0 ? "solar:pen-bold" : "solar:user-plus-bold"} 
                      style={{ fontSize: 24, color: theme.palette.primary.main }} 
                    />
                    <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
                      {Object.keys(currentData || {}).length > 0 ? "Editar delegado" : "Crear delegado"}
                    </Typography>
                  </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 1 }}>
                    <Box display="flex" flexDirection="column" rowGap={3} mt={2}>
                        <Stack display="flex" flexDirection="row" columnGap={2}>
                    <FieldTForm name="name" label="Nombre" variant="outlined"/>
                    <FieldTForm name="lastName" label="Apellido" variant="outlined"/>
                    </Stack>
                    
                    <AutocompleteForm
                        name="committeId"
                        label="Comisión"
                        variant="outlined"
                        options={convertCommitiesToAutocomplete(commities)}
                        getOptionLabel={(option) => option.label}
                        />
                        <AutocompleteForm
                        name="delegation"
                        label="Delegación"
                        variant="outlined"
                        options={countriesWithLabelId}
                        getOptionLabel={(option) => option.label}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Icon icon="solar:close-circle-bold" />}
                      onClick={handleClose}
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
                      color="success"
                      startIcon={<Icon icon="solar:check-circle-bold" />}
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