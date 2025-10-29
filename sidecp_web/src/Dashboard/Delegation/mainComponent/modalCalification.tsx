import * as yup from "yup";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Divider } from "@mui/material";
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
    investigacion_analisis: number
    pensamiento_critico: number
    oratoria: number
    argumentacion: number
    redaccion: number
    negociacion: number
    resolucion_conflictos: number
    liderazgo: number
    colaboracion: number
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
    investigacion: boolean
    pensamiento: boolean
    oratoria: boolean
    argumentacion: boolean
    redaccion: boolean
    negociacion: boolean
    resolucion: boolean
    liderazgo: boolean
    colaboracion: boolean
}

export default function ModalCalification({open, setOpen, student, setStudent_, scores, setStudents}: props){
    const { theme } = useSettingContext();
    const [ bad, setBad ] = useState<generalCal>({
        investigacion: false, 
        pensamiento: false, 
        oratoria: false, 
        argumentacion: false,
        redaccion: false, 
        negociacion: false, 
        resolucion: false, 
        liderazgo: false, 
        colaboracion: false
    });
    const [ regular, setRegular ] = useState<generalCal>({
        investigacion: false, 
        pensamiento: false, 
        oratoria: false,
        argumentacion: false, 
        redaccion: false, 
        negociacion: false, 
        resolucion: false, 
        liderazgo: false, 
        colaboracion: false
    });
    const [ good, setGood ] = useState<generalCal>({
        investigacion: false, 
        pensamiento: false, 
        oratoria: false,
        argumentacion: false, 
        redaccion: false, 
        negociacion: false, 
        resolucion: false, 
        liderazgo: false, 
        colaboracion: false
    });
    const [ defaultCal, setDefaultCal ] = useState<generalCal>({
        investigacion: true, 
        pensamiento: true, 
        oratoria: true,
        argumentacion: true, 
        redaccion: true, 
        negociacion: true, 
        resolucion: true, 
        liderazgo: true, 
        colaboracion: true
    });
    
    const currentScore = scores?.find((ite: scoresCalifications)=> ite.scoreid === student?.scoreid)

    const yupSchema = yup.object().shape({
        investigacionAnalisis: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(15, "Máximo 15"),
        pensamientoCritico: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(15, "Máximo 15"),
        oratoria: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10"),
        argumentacion: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10"),
        redaccion: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10"),
        negociacion: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10"),
        resolucionConflictos: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10"),
        liderazgo: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10"),
        colaboracion: yup.number().required("Campo requerido").min(0, "Mínimo 0").max(10, "Máximo 10")
    });

    const defaultValues = {
        investigacionAnalisis: Number(currentScore?.investigacion_analisis) || 0,
        pensamientoCritico: Number(currentScore?.pensamiento_critico) || 0,
        oratoria: Number(currentScore?.oratoria) || 0,
        argumentacion: Number(currentScore?.argumentacion) || 0,
        redaccion: Number(currentScore?.redaccion) || 0,
        negociacion: Number(currentScore?.negociacion) || 0,
        resolucionConflictos: Number(currentScore?.resolucion_conflictos) || 0,
        liderazgo: Number(currentScore?.liderazgo) || 0,
        colaboracion: Number(currentScore?.colaboracion) || 0
    }

    const methods = useForm<{
        investigacionAnalisis: number;
        pensamientoCritico: number;
        oratoria: number;
        argumentacion: number;
        redaccion: number;
        negociacion: number;
        resolucionConflictos: number;
        liderazgo: number;
        colaboracion: number;
    }>({
        defaultValues,
        resolver: yupResolver(yupSchema)
    })

    const {handleSubmit, reset, getValues, watch, setValue} = methods

    useEffect(()=>{
        setValue("investigacionAnalisis", Number(currentScore?.investigacion_analisis))
        setValue("pensamientoCritico", Number(currentScore?.pensamiento_critico))
        setValue("oratoria", Number(currentScore?.oratoria))
        setValue("argumentacion", Number(currentScore?.argumentacion))
        setValue("redaccion", Number(currentScore?.redaccion))
        setValue("negociacion", Number(currentScore?.negociacion))
        setValue("resolucionConflictos", Number(currentScore?.resolucion_conflictos))
        setValue("liderazgo", Number(currentScore?.liderazgo))
        setValue("colaboracion", Number(currentScore?.colaboracion))
    },[currentScore, setValue])

    const investigacionAnalisis = watch("investigacionAnalisis");
    const pensamientoCritico = watch("pensamientoCritico");
    const oratoria = watch("oratoria");
    const argumentacion = watch("argumentacion");
    const redaccion = watch("redaccion");
    const negociacion = watch("negociacion");
    const resolucionConflictos = watch("resolucionConflictos");
    const liderazgo = watch("liderazgo");
    const colaboracion = watch("colaboracion");

    // Función para corregir valores que excedan el máximo
    const correctValue = (fieldName: string, value: number, maxValue: number) => {
        if (value > maxValue) {
            setValue(fieldName as any, maxValue);
            return maxValue;
        }
        if (value < 0) {
            setValue(fieldName as any, 0);
            return 0;
        }
        return value;
    };

    // Función helper para actualizar estados de validación
    const updateValidationState = (
        field: keyof generalCal,
        value: number,
        maxValue: number
    ) => {
        const percentage = (value / maxValue) * 100;
        
        if (value === 0) {
            setDefaultCal(prev => ({ ...prev, [field]: true }));
            setRegular(prev => ({ ...prev, [field]: false }));
            setGood(prev => ({ ...prev, [field]: false }));
            setBad(prev => ({ ...prev, [field]: false }));
        } else if (percentage < 70) {
            setDefaultCal(prev => ({ ...prev, [field]: false }));
            setGood(prev => ({ ...prev, [field]: false }));
            setRegular(prev => ({ ...prev, [field]: false }));
            setBad(prev => ({ ...prev, [field]: true }));
        } else if (percentage >= 70 && percentage <= 85) {
            setDefaultCal(prev => ({ ...prev, [field]: false }));
            setRegular(prev => ({ ...prev, [field]: true }));
            setGood(prev => ({ ...prev, [field]: false }));
            setBad(prev => ({ ...prev, [field]: false }));
        } else if (percentage > 85) {
            setDefaultCal(prev => ({ ...prev, [field]: false }));
            setRegular(prev => ({ ...prev, [field]: false }));
            setGood(prev => ({ ...prev, [field]: true }));
            setBad(prev => ({ ...prev, [field]: false }));
        }
    };

    useEffect(() => {
        const correctedInv = correctValue('investigacionAnalisis', Number(getValues("investigacionAnalisis")), 15);
        const correctedPens = correctValue('pensamientoCritico', Number(getValues("pensamientoCritico")), 15);
        const correctedOrat = correctValue('oratoria', Number(getValues("oratoria")), 10);
        const correctedArg = correctValue('argumentacion', Number(getValues("argumentacion")), 10);
        const correctedRed = correctValue('redaccion', Number(getValues("redaccion")), 10);
        const correctedNeg = correctValue('negociacion', Number(getValues("negociacion")), 10);
        const correctedRes = correctValue('resolucionConflictos', Number(getValues("resolucionConflictos")), 10);
        const correctedLid = correctValue('liderazgo', Number(getValues("liderazgo")), 10);
        const correctedCol = correctValue('colaboracion', Number(getValues("colaboracion")), 10);

        updateValidationState('investigacion', correctedInv, 15);
        updateValidationState('pensamiento', correctedPens, 15);
        updateValidationState('oratoria', correctedOrat, 10);
        updateValidationState('argumentacion', correctedArg, 10);
        updateValidationState('redaccion', correctedRed, 10);
        updateValidationState('negociacion', correctedNeg, 10);
        updateValidationState('resolucion', correctedRes, 10);
        updateValidationState('liderazgo', correctedLid, 10);
        updateValidationState('colaboracion', correctedCol, 10);
    }, [
        investigacionAnalisis, 
        pensamientoCritico, 
        oratoria, 
        argumentacion,
        redaccion, 
        negociacion, 
        resolucionConflictos, 
        liderazgo, 
        colaboracion, 
        getValues
    ])

    const onSubmit = handleSubmit(async (data)=>{
            try{
                await scoresUpdate({scoreId: student?.scoreid , ...data})
                const response = await getStudents()
                setStudents(response.data.students_)
                setOpen(false);
                reset();
                setStudent_(null);
                    
            }catch(err){
                console.log("error: ", err)
            } 
        })

    const renderFieldBox = (
        name: string,
        label: string,
        field: keyof generalCal,
        maxValue: number
    ) => (
        <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Chip
                label={`${label} (${maxValue} pts)`}
                size="small"
                sx={{ 
                    typography: "caption", 
                    color: defaultCal[field] ? grey[50] : bad[field] ? red[50] : regular[field] ? yellow[900] : good[field] ? green[50] : grey[50], 
                    backgroundColor: alpha(
                        defaultCal[field] ? grey[700] : bad[field] ? red[700] : regular[field] ? yellow[600] : good[field] ? green[700] : grey[700], 
                        0.95
                    ), 
                    fontWeight: 600, 
                    borderRadius: 2, 
                    mb: 1.5,
                    height: 28,
                    fontSize: '0.75rem'
                }}
            />
            <FieldTForm 
                name={name} 
                label="" 
                variant='outlined' 
                type="number" 
                inputProps={{ max: maxValue, min: 0, step: 0.5 }}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: 56,
                    },
                    '& .MuiOutlinedInput-input': {
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        textAlign: 'center'
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
                }}
            />
        </Box>
    );

    const totalScore = 
        (Number(investigacionAnalisis) || 0) + 
        (Number(pensamientoCritico) || 0) + 
        (Number(oratoria) || 0) + 
        (Number(argumentacion) || 0) + 
        (Number(redaccion) || 0) + 
        (Number(negociacion) || 0) + 
        (Number(resolucionConflictos) || 0) + 
        (Number(liderazgo) || 0) + 
        (Number(colaboracion) || 0);

    return (
        <Dialog open={open} maxWidth="lg" fullWidth slotProps={{paper: {sx: {borderRadius: 4, maxHeight: '90vh'}}}}>
            <FormManaged methods={methods} onSubmit={onSubmit}>
            <DialogTitle sx={{ p: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Icon icon="solar:clipboard-check-bold" style={{ fontSize: 28, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600, lineHeight: 1.2 }}>
                      Calificaciones del Delegado
                    </Typography>
                    <Typography variant="subtitle2" sx={{ 
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      color: theme.palette.text.secondary,
                      fontWeight: 500
                    }}>
                      {student?.name} {student?.lastname}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  p: 2,
                  borderRadius: 2
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    TOTAL
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {totalScore.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    / 100 pts
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {/* Investigación y análisis crítico (30%) */}
                    <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          p: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}>
                          <Icon icon="solar:document-text-bold" style={{ fontSize: 20, color: theme.palette.primary.main }} />
                          <Typography variant="subtitle1" sx={{fontWeight: 600, color: theme.palette.primary.main}}>
                            Investigación y análisis crítico (30%)
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          {renderFieldBox("investigacionAnalisis", "Investigación y análisis", "investigacion", 15)}
                          {renderFieldBox("pensamientoCritico", "Pensamiento crítico", "pensamiento", 15)}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Comunicación y lenguaje (30%) */}
                    <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          p: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}>
                          <Icon icon="solar:chat-round-bold" style={{ fontSize: 20, color: theme.palette.primary.main }} />
                          <Typography variant="subtitle1" sx={{fontWeight: 600, color: theme.palette.primary.main}}>
                            Comunicación y lenguaje (30%)
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          {renderFieldBox("oratoria", "Oratoria", "oratoria", 10)}
                          {renderFieldBox("argumentacion", "Argumentación", "argumentacion", 10)}
                          {renderFieldBox("redaccion", "Redacción", "redaccion", 10)}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Negociación y resolución de conflictos (20%) */}
                    <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          p: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}>
                          <Icon icon="solar:user-hands-bold" style={{ fontSize: 20, color: theme.palette.primary.main }} />
                          <Typography variant="subtitle1" sx={{fontWeight: 600, color: theme.palette.primary.main}}>
                            Negociación y resolución (20%)
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          {renderFieldBox("negociacion", "Negociación", "negociacion", 10)}
                          {renderFieldBox("resolucionConflictos", "Resolución de conflictos", "resolucion", 10)}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Liderazgo y colaboración (20%) */}
                    <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          p: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}>
                          <Icon icon="solar:users-group-rounded-bold" style={{ fontSize: 20, color: theme.palette.primary.main }} />
                          <Typography variant="subtitle1" sx={{fontWeight: 600, color: theme.palette.primary.main}}>
                            Liderazgo y colaboración (20%)
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          {renderFieldBox("liderazgo", "Liderazgo", "liderazgo", 10)}
                          {renderFieldBox("colaboracion", "Colaboración", "colaboracion", 10)}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2, gap: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button 
                  variant='outlined' 
                  startIcon={<Icon icon="solar:close-circle-bold" />}
                  onClick={()=> {setOpen(false); reset()}}  
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                  color="error"
                >
                  Cancelar
                </Button>
                <Button 
                  variant='contained' 
                  startIcon={<Icon icon="solar:check-circle-bold" />}
                  type="submit" 
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }} 
                >
                  Guardar Calificaciones
                </Button>
            </DialogActions>
            </FormManaged>
        </Dialog>
    );
}
