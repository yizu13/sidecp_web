import * as yup from "yup"
import { useEffect } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { createStudent } from "../../../API/userAPI"
import AutocompleteForm from "../../../manageForm/AutocompleteForm"
import FieldTForm from "../../../manageForm/FieldTxtForm"

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
    <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 6}}}}>
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{p: 2, ml: 1, mt: 1}}>{Object.keys(currentData || {}).length > 0 ? "Editar delegado" : "Crear delegado"}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" rowGap={2} sx={{p: 2}}>
                        <Stack display="flex" flexDirection="row" columnGap={2}>
                    <FieldTForm name="name" label="Nombre" variant="outlined"/>
                    <FieldTForm name="lastName" label="Appellido" variant="outlined"/>
                    </Stack>
                    
                    <AutocompleteForm
                        name="committeId"
                        label="Comisión"
                        variant="outlined"
                        options={convertCommitiesToAutocomplete(commities)}
                        getOptionLabel={(option) => option.label}
                        />
                        <FieldTForm name="delegation" label="Delegación" variant="outlined"/>
                    </Box>
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button variant="outlined" color="error" onClick={handleClose} sx={{borderRadius: 3, width: "40%"}} >Cerrar</Button>
                    <Button variant="contained" type='submit' onClick={()=>{}} sx={{borderRadius: 3}} fullWidth>Agregar</Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}