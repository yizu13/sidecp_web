import * as yup from "yup";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import FieldTForm from "../../../manageForm/FieldTxtForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormManaged from "../../../manageForm/FormProvider";
import { useEffect, useState, type SetStateAction } from "react";
import { red, yellow, grey, green } from "@mui/material/colors";
import { alpha } from '@mui/material';
import { scoresUpdate, getStudents } from "../../../API/userAPI";
import { Icon } from '@iconify/react';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import React from 'react';

type student = {
  committeid: string
  studentid: string
  name: string
  lastname: string
  delegation: string
  scoreid: string
}

type scoresCalifications = {
    scoreid: string
    knowledgeskills: string
    negotiationskills : string
    communicationskills: string
    interpersonalskills: string
    analyticalskills: string
    modified: boolean
}

type props = {
    open: boolean,
    student: student | undefined | null,    
    setOpen: (data: boolean)=>void,
    setStudent_: React.Dispatch<SetStateAction<student | null | undefined>>
    setStudents: React.Dispatch<SetStateAction<student[]>>
    scores: scoresCalifications[] 
}

type generalCal = {
    knowledge: boolean
    negotiation : boolean
    communication: boolean
    interpersonal: boolean
    analytical: boolean
}

export default function ModalCalification({open, setOpen, student, setStudent_, scores, setStudents}: props){
    const { theme } = useSettingContext();
    const [ bad, setBad ] = useState<generalCal>({knowledge: false, negotiation: false, communication: false, interpersonal: false, analytical: false});
    const [ regular, setRegular ] = useState<generalCal>({knowledge: false, negotiation: false, communication: false, interpersonal: false, analytical: false});
    const [ good, setGood ] = useState<generalCal>({knowledge: false, negotiation: false, communication: false, interpersonal: false, analytical: false})
    const [ defaultCal, setDefaultCal ] = useState<generalCal>({knowledge: true, negotiation: true, communication: true, interpersonal: true, analytical: true})
    const currentScore = scores?.find((ite: scoresCalifications)=> ite.scoreid === student?.scoreid)

    const yupSchema = yup.object().shape({
        knowledgeSkills: yup.number().required().max(100, "Máximo 100"),
        negotiationSkills: yup.number().required().max(100, "Máximo 100"),
        communicationSkills: yup.number().required().max(100, "Máximo 100"),
        interpersonalSkills: yup.number().required().max(100, "Máximo 100"),
        analyticalSkills: yup.number().required().max(100, "Máximo 100")
    });
    const defaultValues = {
        knowledgeSkills: Number(currentScore?.knowledgeskills) || 0,
        negotiationSkills: Number(currentScore?.negotiationskills) || 0,
        communicationSkills: Number(currentScore?.communicationskills) || 0,
        interpersonalSkills: Number(currentScore?.interpersonalskills) || 0,
        analyticalSkills: Number(currentScore?.analyticalskills) || 0
    }

    const methods = useForm<{
        knowledgeSkills: number;
        negotiationSkills: number;
        communicationSkills: number;
        interpersonalSkills: number;
        analyticalSkills: number;
    }>({
        defaultValues,
        resolver: yupResolver(yupSchema)
    })

    const {handleSubmit, reset, getValues, watch, setValue} = methods

    useEffect(()=>{
        setValue("knowledgeSkills", Number(currentScore?.knowledgeskills))
        setValue("negotiationSkills", Number(currentScore?.negotiationskills))
        setValue("communicationSkills", Number(currentScore?.communicationskills))
        setValue("interpersonalSkills", Number(currentScore?.interpersonalskills))
        setValue("analyticalSkills", Number(currentScore?.analyticalskills))
    },[currentScore, setValue])

    const knowledgeSkills = watch("knowledgeSkills");
    const negotiationSkills = watch("negotiationSkills");
    const communicationSkills = watch("communicationSkills");
    const interpersonalSkills = watch("interpersonalSkills");
    const analyticalSkills = watch("analyticalSkills");

    useEffect(()=>{
        const valueKnowledge = Number(getValues("knowledgeSkills"));
        const valueNegotiation = Number(getValues("negotiationSkills"));
        const valueCommunication = Number(getValues("communicationSkills"));
        const valueInterpersonal = Number(getValues("interpersonalSkills"));
        const valueAnalytical = Number(getValues("analyticalSkills"));
        if(valueKnowledge === 0){
            setDefaultCal(prev=> ({...prev, knowledge: true}));
            setRegular(prev=> ({...prev, knowledge: false}));
            setGood(prev=> ({...prev, knowledge: false}));
            setBad(prev=> ({...prev, knowledge: false}));
        } else if (valueKnowledge > 0 && valueKnowledge < 70){
            setDefaultCal(prev=> ({...prev, knowledge: false}));
            setGood(prev=> ({...prev, knowledge: false}));
            setRegular(prev=> ({...prev, knowledge: false}));
            setBad(prev=> ({...prev, knowledge: true}));
        }else if (valueKnowledge >= 70 && valueKnowledge <= 85){
            setDefaultCal(prev=> ({...prev, knowledge: false}));
            setRegular(prev=> ({...prev, knowledge: true}));
            setGood(prev=> ({...prev, knowledge: false}));
            setBad(prev=> ({...prev, knowledge: false}));
        }else if (valueKnowledge > 85){
            setDefaultCal(prev=> ({...prev, knowledge: false}));
            setRegular(prev=> ({...prev, knowledge: false}));
            setGood(prev=> ({...prev, knowledge: true}));
            setBad(prev=> ({...prev, knowledge: false}));
        }

        // Para negotiationSkills
        if (valueNegotiation === 0) {
            setDefaultCal(prev => ({ ...prev, negotiation: true }));
            setRegular(prev => ({ ...prev, negotiation: false }));
            setGood(prev => ({ ...prev, negotiation: false }));
            setBad(prev => ({ ...prev, negotiation: false }));
        } else if (valueNegotiation > 0 && valueNegotiation < 70) {
            setDefaultCal(prev => ({ ...prev, negotiation: false }));
            setGood(prev => ({ ...prev, negotiation: false }));
            setRegular(prev => ({ ...prev, negotiation: false }));
            setBad(prev => ({ ...prev, negotiation: true }));
        } else if (valueNegotiation >= 70 && valueNegotiation <= 85) {
            setDefaultCal(prev => ({ ...prev, negotiation: false }));
            setRegular(prev => ({ ...prev, negotiation: true }));
            setGood(prev => ({ ...prev, negotiation: false }));
            setBad(prev => ({ ...prev, negotiation: false }));
        } else if (valueNegotiation > 85) {
            setDefaultCal(prev => ({ ...prev, negotiation: false }));
            setRegular(prev => ({ ...prev, negotiation: false }));
            setGood(prev => ({ ...prev, negotiation: true }));
            setBad(prev => ({ ...prev, negotiation: false }));
        }

        // Para communicationSkills
        if (valueCommunication === 0) {
            setDefaultCal(prev => ({ ...prev, communication: true }));
            setRegular(prev => ({ ...prev, communication: false }));
            setGood(prev => ({ ...prev, communication: false }));
            setBad(prev => ({ ...prev, communication: false }));
        } else if (valueCommunication > 0 && valueCommunication < 70) {
            setDefaultCal(prev => ({ ...prev, communication: false }));
            setGood(prev => ({ ...prev, communication: false }));
            setRegular(prev => ({ ...prev, communication: false }));
            setBad(prev => ({ ...prev, communication: true }));
        } else if (valueCommunication >= 70 && valueCommunication <= 85) {
            setDefaultCal(prev => ({ ...prev, communication: false }));
            setRegular(prev => ({ ...prev, communication: true }));
            setGood(prev => ({ ...prev, communication: false }));
            setBad(prev => ({ ...prev, communication: false }));
        } else if (valueCommunication > 85) {
            setDefaultCal(prev => ({ ...prev, communication: false }));
            setRegular(prev => ({ ...prev, communication: false }));
            setGood(prev => ({ ...prev, communication: true }));
            setBad(prev => ({ ...prev, communication: false }));
        }

        // Para interpersonalSkills
        if (valueInterpersonal === 0) {
            setDefaultCal(prev => ({ ...prev, interpersonal: true }));
            setRegular(prev => ({ ...prev, interpersonal: false }));
            setGood(prev => ({ ...prev, interpersonal: false }));
            setBad(prev => ({ ...prev, interpersonal: false }));
        } else if (valueInterpersonal > 0 && valueInterpersonal < 70) {
            setDefaultCal(prev => ({ ...prev, interpersonal: false }));
            setGood(prev => ({ ...prev, interpersonal: false }));
            setRegular(prev => ({ ...prev, interpersonal: false }));
            setBad(prev => ({ ...prev, interpersonal: true }));
        } else if (valueInterpersonal >= 70 && valueInterpersonal <= 85) {
            setDefaultCal(prev => ({ ...prev, interpersonal: false }));
            setRegular(prev => ({ ...prev, interpersonal: true }));
            setGood(prev => ({ ...prev, interpersonal: false }));
            setBad(prev => ({ ...prev, interpersonal: false }));
        } else if (valueInterpersonal > 85) {
            setDefaultCal(prev => ({ ...prev, interpersonal: false }));
            setRegular(prev => ({ ...prev, interpersonal: false }));
            setGood(prev => ({ ...prev, interpersonal: true }));
            setBad(prev => ({ ...prev, interpersonal: false }));
        }

        // Para analyticalSkills
        if (valueAnalytical === 0) {
            setDefaultCal(prev => ({ ...prev, analytical: true }));
            setRegular(prev => ({ ...prev, analytical: false }));
            setGood(prev => ({ ...prev, analytical: false }));
            setBad(prev => ({ ...prev, analytical: false }));
        } else if (valueAnalytical > 0 && valueAnalytical < 70) {
            setDefaultCal(prev => ({ ...prev, analytical: false }));
            setGood(prev => ({ ...prev, analytical: false }));
            setRegular(prev => ({ ...prev, analytical: false }));
            setBad(prev => ({ ...prev, analytical: true }));
        } else if (valueAnalytical >= 70 && valueAnalytical <= 85) {
            setDefaultCal(prev => ({ ...prev, analytical: false }));
            setRegular(prev => ({ ...prev, analytical: true }));
            setGood(prev => ({ ...prev, analytical: false }));
            setBad(prev => ({ ...prev, analytical: false }));
        } else if (valueAnalytical > 85) {
            setDefaultCal(prev => ({ ...prev, analytical: false }));
            setRegular(prev => ({ ...prev, analytical: false }));
            setGood(prev => ({ ...prev, analytical: true }));
            setBad(prev => ({ ...prev, analytical: false }));
        }
    },[knowledgeSkills, negotiationSkills, communicationSkills, interpersonalSkills, analyticalSkills, getValues])

    const onSubmit = handleSubmit(async (data)=>{
            try{
                await scoresUpdate({scoreId: student?.scoreid , ...data})
                const response = await getStudents()
                setStudents(response.data.students)
                setOpen(false);
                reset();
                setStudent_(null);
                    
            }catch(err){
                console.log("error: ", err)
            } 
        })


    return (
        <Dialog open={open} maxWidth="md" slotProps={{paper: {sx: {borderRadius: 4}}}}>
            <FormManaged methods={methods} onSubmit={onSubmit}>
            <DialogTitle sx={{ p: 3, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Icon icon="solar:clipboard-check-bold" style={{ fontSize: 24, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
                  Calificaciones del Delegado
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
                  fontSize: '0.875rem'
                }}
              >
                Si cierra la pestaña sin confirmar no se guardarán los cambios.
              </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack sx={{p: 2}} display="flex" flexDirection="row" columnGap={2}>
                    <Stack display="flex" flexDirection="column" rowGap={2}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center">
                <Chip
                label="Habilidades del conocimiento"
                sx={{ typography: "caption", color: defaultCal.knowledge? grey[50]: bad.knowledge? red[50]: regular.knowledge? yellow[50]: good.knowledge? green[50]: grey[50], backgroundColor: alpha(defaultCal.knowledge? grey[900]: bad.knowledge? red[900]: regular.knowledge? yellow[900]: good.knowledge? green[900]: grey[900], 0.9), fontWeight: "bold", borderRadius: 4, padding: "0 8px", height: 40, mb: 1 }}
          />
                <FieldTForm name="knowledgeSkills" label="" variant='outlined' type="number" 
                inputProps={{ max: 100 }}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    },
                    '& input::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input[type=number]': {
                    MozAppearance: 'textfield', 
                    },
                }}/>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center">
                <Chip
                label="Habilidades del negociación"
                sx={{ typography: "caption", color: defaultCal.negotiation? grey[50]: bad.negotiation? red[50]: regular.negotiation? yellow[50]: good.negotiation? green[50]: grey[50], backgroundColor: alpha(defaultCal.negotiation? grey[900]: bad.negotiation? red[900]: regular.negotiation? yellow[900]: good.negotiation? green[900]: grey[900], 0.9), fontWeight: "bold", borderRadius: 4, padding: "0 8px", height: 40, mb: 1 }}
          />
                <FieldTForm name="negotiationSkills" label="" variant='outlined' type="number" 
                sx={{
                    '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    },
                    '& input::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input[type=number]': {
                    MozAppearance: 'textfield', 
                    },
                }}/>
                </Box>
                </Stack>
                <Stack display="flex" flexDirection="column" rowGap={2}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center">
                <Chip
                label="Habilidades de comunicación"
                sx={{ typography: "caption", color: defaultCal.communication? grey[50]: bad.communication? red[50]: regular.communication? yellow[50]: good.communication? green[50]: grey[50], backgroundColor: alpha(defaultCal.communication? grey[900]: bad.communication? red[900]: regular.communication? yellow[900]: good.communication? green[900]: grey[900], 0.9), fontWeight: "bold", borderRadius: 4, padding: "0 8px", height: 40, mb: 1 }}
          />
                <FieldTForm name="communicationSkills" label="" variant='outlined' type="number" sx={{
                    '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    },
                    '& input::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input[type=number]': {
                    MozAppearance: 'textfield',
                    },
                }}/>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center">
                <Chip
                label="Habilidades interpersonales"
                sx={{ typography: "caption", color: defaultCal.interpersonal? grey[50]: bad.interpersonal? red[50]: regular.interpersonal? yellow[50]: good.interpersonal? green[50]: grey[50], backgroundColor: alpha(defaultCal.interpersonal? grey[900]: bad.interpersonal? red[900]: regular.interpersonal? yellow[900]: good.interpersonal? green[900]: grey[900], 0.9), fontWeight: "bold", borderRadius: 4, padding: "0 8px", height: 40, mb: 1 }}
          />
                <FieldTForm name="interpersonalSkills" label="" variant='outlined' type="number" 
                sx={{
                    '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    },
                    '& input::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
                    '& input[type=number]': {
                    MozAppearance: 'textfield', 
                    },
                }}/>
                </Box>
                </Stack>
                <Stack display="flex" justifyContent="center" alignContent="center">
                    <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center">
                <Chip
                label="Habilidades analíticas"
                sx={{ typography: "caption", color: defaultCal.analytical? grey[50]: bad.analytical? red[50]: regular.analytical? yellow[50]: good.analytical? green[50]: grey[50], backgroundColor: alpha(defaultCal.analytical? grey[900]: bad.analytical? red[900]: regular.analytical? yellow[900]: good.analytical? green[900]: grey[900], 0.9), fontWeight: "bold", borderRadius: 4, padding: "0 8px", height: 40, mb: 1 }}
          />
                    <FieldTForm name="analyticalSkills" label="" variant='outlined' type="number" 
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        borderRadius: 6,
                        },
                        '& input::-webkit-outer-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                        },
                        '& input::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                        },
                        '& input[type=number]': {
                        MozAppearance: 'textfield',
                        },
                    }} />
                    </Box>
                </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                <Button 
                  variant='outlined' 
                  startIcon={<Icon icon="solar:close-circle-bold" />}
                  onClick={()=> {setOpen(false); reset()}}  
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                  color="error"
                >
                  Cerrar
                </Button>
                <Button 
                  variant='contained' 
                  startIcon={<Icon icon="solar:check-circle-bold" />}
                  type="submit" 
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }} 
                  fullWidth
                >
                  Confirmar Calificaciones
                </Button>
            </DialogActions>
            </FormManaged>
        </Dialog>
    );
}