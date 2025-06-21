import * as yup from "yup"
import { useEffect } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import AutocompleteForm from "../../../manageForm/AutocompleteForm"
import { createEvaluator } from '../../../API/userAPI';

type currentdata ={
    userId: string | null,
    committe: string | null
    evaluatorId: string | null
}

type User = {
        name: string;
        lastname: string;
        userid: string;
    };

type props ={
    currentData: currentdata,
    setOpen: (data: boolean)=>void
    open: boolean
    usersData: Array<User>
    commities: Array<any>
    setRow: (data: Array<any>)=>void
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

    useEffect(() => {
  if (currentData) {
    reset({
      userId: currentData.userId || "",
      committeId: currentData.committe || ""
    });
  }
}, [currentData]);

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    })

    const { handleSubmit, reset } = methods

    const onSubmit = handleSubmit(async (data)=>{
        try{
            await createEvaluator({evaluatorId: currentData.evaluatorId , ...data});
            reset();
            setOpen(false)
            setRow([])
        }catch(err){
            console.log("error: ", err)
        }
    })
    
    const convertUsersToAutocomplete = (userArray: Array<User>)=>{
        try{
            const newObjectArray = userArray.map((user: User)=> ({label: `${user.name} ${user.lastname}`, id: user.userid}))
        return newObjectArray;
        }catch(err){
            console.log('err')
        }
        
    }

     const convertCommitiesToAutocomplete = (committiesArray: Array<any>)=>{
        try{
            const newObjectArray = committiesArray.map((committie: any)=> ({label: committie.committename, id: committie.committeid}))
        return newObjectArray;
        }catch(err){
            console.log('err')
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
                    <Button variant="outlined" color="error" onClick={()=>{setOpen(false); setRow([])}} sx={{borderRadius: 3, width: "40%"}} >Cerrar</Button>
                    <Button variant="contained" type='submit' onClick={()=>{}} sx={{borderRadius: 3}} fullWidth>Agregar</Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}