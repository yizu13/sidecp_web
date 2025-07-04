import * as yup from "yup"
import { useEffect } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import AutocompleteForm from "../../../manageForm/AutocompleteForm"
import { createEvaluator } from '../../../API/userAPI';

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


export default function ModalEvaluator({currentData, setOpen, open, usersData, commities, setRow}: props){
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
            reset();
            setOpen(false)
            setRow(undefined)
        }catch(err){
            console.log("error: ", err)
        } 
    })
    
    const convertUsersToAutocomplete = (userArray: Array<User>)=>{
        try{
            const newObjectArray = userArray.map((user: User)=> ({label: `${user.name} ${user.lastname}`, id: user.userid}))
        return newObjectArray;
        }catch(err){
            console.log('err', err)
        }
        
    }

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
    <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 6}}}}>
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{p: 2, ml: 1, mt: 1}}>{Object.keys(currentData || {}).length > 0 ? "Editar evaluador" : "Crear evaluador"}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="row" columnGap={2} sx={{p: 2}}>
                    <AutocompleteForm
                        name="userId"
                        label="Usuario"
                        variant="outlined"
                        options={convertUsersToAutocomplete(usersData)}
                        getOptionLabel={(option) => option.label}
                        />
                    <AutocompleteForm
                        name="committeId"
                        label="Comité"
                        variant="outlined"
                        options={convertCommitiesToAutocomplete(commities)}
                        getOptionLabel={(option) => option.label}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button variant="outlined" color="error" onClick={()=>{setOpen(false); setRow(undefined)}} sx={{borderRadius: 3, width: "40%"}} >Cerrar</Button>
                    <Button variant="contained" type='submit' onClick={()=>{}} sx={{borderRadius: 3}} fullWidth>Agregar</Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}