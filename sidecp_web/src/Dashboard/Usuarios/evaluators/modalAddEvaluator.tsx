import * as yup from "yup"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import FormManaged from "../../../manageForm/FormProvider"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import AutocompleteForm from "../../../manageForm/AutocompleteForm"

type currentdata ={
    userId: string | null,
    committe: string | null
}

type props ={
    currentData: currentdata,
    setOpen: (data: boolean)=>void
    open: boolean
}


export default function ModalEvaluator({currentData, setOpen, open}: props){
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

    const {handleSubmit} = methods

    const onSubmit = handleSubmit((data)=>{
        try{
            console.log(data)
        }catch(err){
            console.log("error: ", err)
        }
    })

     return(
    <>
    <Dialog open={open} slotProps={{paper: {sx: {borderRadius: 6}}}}>
                <FormManaged methods={methods} onSubmit={onSubmit}>
                <DialogTitle sx={{p: 2, ml: 1, mt: 1}}>Crear evaluador</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="row" columnGap={2} sx={{p: 2}}>
                    <AutocompleteForm
                        name="userId"
                        label="Usuario"
                        variant="outlined"
                        options={[
                            { label: "John Doe", id: 1 },
                            { label: "Jane Smith", id: 2 }
                        ]}
                        getOptionLabel={(option) => option.label}
                        />
                    <AutocompleteForm
                        name="committeId"
                        label="Comité"
                        variant="outlined"
                        options={[
                            { label: "John Doe", id: 1 },
                            { label: "Jane Smith", id: 2 }
                        ]}
                        getOptionLabel={(option) => option.label}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{p: 2}}>
                    <Button variant="outlined" color="error" onClick={()=>{setOpen(false)}} sx={{borderRadius: 3, width: "40%"}} >Cerrar</Button>
                    <Button variant="contained" type='submit' sx={{borderRadius: 3}} fullWidth>Agregar</Button>
                </DialogActions>
                </FormManaged>
             </Dialog>
    </>)
}