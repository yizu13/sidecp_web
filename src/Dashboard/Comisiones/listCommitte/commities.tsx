import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Box, Tooltip, Breadcrumbs, Typography, createTheme, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getCommitties } from '../../../API/userAPI';
import { deleteCommitte } from '../../../API/userAPI';
import { Icon } from '@iconify/react';
import { useEditCommitte } from '../../../router/committeEditContext/committeContextEdit';
import EventsModal from './eventsModal';
import DescriptionModal from './descriptionModal';
import { getEventsById, getStudents } from '../../../API/userAPI';
import { useNavigate } from 'react-router-dom';
import AdministrationCommitte from './CommitteAdministration';
import { esES } from '@mui/x-data-grid/locales';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

type Committe = {
    committeid: string
    committename: string
    creationdate: string
    description: string
    events: string
    location: string
    relatedinstitution: string
    topic: string
}

type data ={
    committeId: number 
committeName: string 
creationDate: string 
description: string 
id: string 
topic: string 
}

type events = {
     title: string
    eventDescription: string
}

type student = {
  committeid: string
  studentid: string
  name: string
  lastname: string
  delegation: string
  scoreid: string
}

export default function ListCommities(){

const { setCommitteForEdit } = useEditCommitte()
const navigate = useNavigate()
const [commities, setCommities] = useState<Committe[]>([]);
const [ openModal, setModal ] = useState<boolean>(false);
const [ eventList, setEvents ] = useState<events[]>([]);
const [ description, setDescription ] = useState<string>("");
const [ openModalDescription, setModalDescription ] = useState<boolean>(false);

 function formatDateTime(datetime: string){
  const date = new Date(datetime);

  const optionsDate: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }; 
  const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false }; 

  const formattedDate = date.toLocaleDateString('en-US', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate}\n${formattedTime}`;
}

 const handleEdit = (data: data)=>{
    const relatedinstitution_: string | undefined = commities.find((i: Committe)=> i.committeid === data.id)?.relatedinstitution
    const location_: string | undefined = commities.find((i: Committe)=> i.committeid === data.id)?.location
    const events_: string | undefined  =  commities.find((i: Committe)=> i.committeid === data.id)?.events
     setCommitteForEdit({events:  events_ ?? "", location: location_ ?? "", institutionRepresentated: relatedinstitution_ ?? "",...data})
        navigate('/dashboard/comisiones/crear')
  }
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<data | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");
  

  const handleDelete = async (data: data) => {
    setDeleteError(""); // Limpiar error previo
    setRowToDelete(data);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete) {
      // Validar si hay estudiantes en la comisión antes de borrar
      try {
        const response = await getStudents();
        const students = response.data.students_ || [];
        const hasStudents = students.some((s: student) => s.committeid === rowToDelete.id);
        if (hasStudents) {
          setDeleteError("No se puede eliminar la comisión porque tiene estudiantes asignados.");
          return;
        }

        await deleteCommitte(rowToDelete.id);
        setCommities(prev => prev.filter((item: Committe) => item.committeid !== rowToDelete.id));
        setRowToDelete(null);
        setConfirmOpen(false);
      } catch (err) {
        setDeleteError("Ocurrió un error al validar los estudiantes.");
        console.error(err);
      }
    }
  };

  const cancelDelete = () => {
    setRowToDelete(null);
    setDeleteError("");
    setConfirmOpen(false);
  };

  const handleSee = async(data: data) => {
    const events_: string | undefined  =  commities.find((i: Committe)=> i.committeid === data.id)?.events
    const response = await getEventsById(events_ ?? "")
    setEvents(response.data)
    setModal(true)
  }

  const handleDescription = async (data: data)=>{
    setDescription(data.description);
    setModalDescription(true);
  }

const columns: GridColDef<(typeof rows)[number]>[] = [
  { 
    field: 'committeId', 
    headerName: 'ID', 
    width: 90, 
    maxWidth: 120,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'committeName',
    headerName: 'Nombre del comité',
    width: 200,
    maxWidth: 220,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:clipboard-text-bold" style={{ fontSize: 18 }} />
        <span>Nombre del comité</span>
      </Box>
    )
  },
  {
    field: 'topic',
    headerName: 'Tópico',
    width: 200,
    maxWidth: 220,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:hashtag-bold" style={{ fontSize: 18 }} />
        <span>Tópico</span>
      </Box>
    )
  },{
    field: 'description',
    headerName: 'Descripción',
    width: 200,
    maxWidth: 220,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:document-text-bold" style={{ fontSize: 18 }} />
        <span>Descripción</span>
      </Box>
    )
  },{
    field: 'creationDate',
    headerName: 'Fecha de creación',
    width: 200,
    maxWidth: 220,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:calendar-add-bold" style={{ fontSize: 18 }} />
        <span>Fecha de creación</span>
      </Box>
    )
  },{
    field: 'actions',
    headerName: 'Acciones',
    width: 200,
    maxWidth: 220,
    sortable: false,
    filterable: false,
    disableExport: true,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:settings-bold" style={{ fontSize: 18 }} />
        <span>Acciones</span>
      </Box>
    ),
    renderCell: (params) => (
      <Box sx={{ display: 'flex', p: 0.5, gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip title="Ver descripción" placement="top">
          <IconButton
            onClick={() => handleDescription(params.row)}
            color="info"
            size="medium"
            sx={{ 
              borderRadius: 2,
              transition: 'all 0.15s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Icon icon="solar:document-bold"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Ver eventos" placement="top">
          <IconButton
            onClick={() => handleSee(params.row)}
            color="info"
            size="medium"
            sx={{ 
              borderRadius: 2,
              transition: 'all 0.15s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Icon icon="solar:eye-bold"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar" placement="top">
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="warning"
            size="medium"
            sx={{ 
              borderRadius: 2,
              transition: 'all 0.15s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Icon icon="solar:pen-bold"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar" placement="top">
          <IconButton
            onClick={() => handleDelete(params.row)}
            color="error"
            size="medium"
            sx={{ 
              borderRadius: 2,
              transition: 'all 0.15s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Icon icon="solar:trash-bin-minimalistic-bold"/>
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

const refetchAll = useCallback(async () => {
  try {
    const response = await getCommitties();
    setCommities(response.data.committes || []);
  } catch (err) {
    console.log(err)
  }
}, []);

useEffect(() => {
  refetchAll();
}, [refetchAll])

const transformDataRow = ()=>{
  return commities.map((committe: Committe, i: number)=> ({id: committe.committeid, committeId: i, 
    committeName: committe.committename, topic: committe.topic, description: committe.description, 
    creationDate: formatDateTime(committe.creationdate)  }))
}

const rows = transformDataRow() 

const {theme} = useSettingContext()

const dataGridTheme = useMemo(() =>
  createTheme({
    palette: {
      mode: theme.palette.mode,
      primary: {
        main: '#1976d2',
        contrastText: '#fff'
      },
      background: {
        default: theme.palette.mode === 'dark' ? '#141a21' : '#f1f1f1',
        paper: theme.palette.mode === 'dark' ? '#222b3a' : '#f1f1f1',
      },
      text: {
        primary: theme.palette.mode === 'dark' ? '#ffffff' : '#222b3a',
      }
    },
    components: {
      MuiMenu: {
        styleOverrides: {
          paper: {
            '& .MuiFormControlLabel-label': {
              color: theme.palette.mode === 'dark' ? '#fff !important' :'#222 !important',
            },
            '& .MuiTypography-root': {
              color: theme.palette.mode === 'dark' ? '#fff !important' :'#222 !important',
            }
          }
        }
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            color: theme.palette.mode === 'dark' ? '#fff !important' :'#222 !important',
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: theme.palette.mode === 'dark' ? '#fff !important' :'#222 !important',
          }
        }
      }
    }
  })
, [theme.palette.mode]);

    return(
        <>
        <Stack sx={{ 
                width: "100%",
                maxWidth: { xs: "95vw", md: "1200px" },
                mx: "auto",
                height: "auto",
                p: { xs: 2, md: 3 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "visible",
                }}>
        <Stack sx={{overflow: "visible", width: "100%", alignItems: "center"}}>
      <Box sx={{ 
          display: "flex", 
          width: "100%", 
          alignItems: "flex-start", 
          p: { xs: 2, md: 3 }, 
          pl: { xs: 2, md: 3 }, 
          pb: { xs: 3, md: 4 }, 
          flexDirection: "column",
          maxWidth: "1200px",
          mx: { xs: 1, md: 2 }
      }}>
          <Typography 
              variant="h4" 
              sx={{
                  color: theme.palette.mode === "dark"?'white':'black', 
                  mb: 2,
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  letterSpacing: '-0.02em'
              }}
          >
              Comisiones
          </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} >
         <Link
          component={RouterLink}
          underline="hover"
          sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
          }}
          color="inherit"
          to="/dashboard/inicio"
        >
          <Icon icon="solar:home-bold"/>
          Inicio
        </Link>
        <Typography
          sx={{ 
              color: 'text.primary', 
              display: 'flex', 
              alignItems: 'center', 
              cursor: "default", 
              gap: 1,
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
          }}
        >
          <Icon icon="solar:clipboard-list-bold" />
          Comisiones
        </Typography>
      </Breadcrumbs>
      </Box>
                  
        <Box sx={{
            width: "100%",
            maxWidth: { xs: "95vw", md: "100vw" },
            mx: "auto",
            borderRadius: 4,
            mb: 4,
            boxShadow: '0px 6px 24px rgba(0,0,0,0.12)', 
            backgroundColor: theme.palette.mode === 'dark'? '#1a1a1a':'#ffffff',
            overflow: "hidden",
            border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`
            }}>
              <ThemeProvider theme={dataGridTheme}>
        <DataGrid
        sx={{borderRadius: 4, p: 2,
      '& .MuiDataGrid-scrollbar--horizontal': {
      '&::-webkit-scrollbar': {
        height: '6px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor:theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.3)',
        borderRadius: '3px',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
      },
    }, }}
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } }}}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}

        />
        </ThemeProvider>
        </Box>
        <AdministrationCommitte/>
        </Stack>
        </Stack>
        <EventsModal open={openModal} eventList={eventList} modalFunc={setModal} eventsFunc={setEvents}/>
        <DescriptionModal open={openModalDescription} description={description} modalFunc={setModalDescription} descriptionFunc={setDescription}/>


       <Dialog open={confirmOpen} onClose={cancelDelete} slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 500}}}}>
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon="solar:trash-bin-minimalistic-bold" style={{ fontSize: 24, color: theme.palette.error.main }} />
            <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
              Eliminar Comisión
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Typography sx={{ 
            fontFamily: '"Inter", "Roboto", sans-serif',
            color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
            lineHeight: 1.5,
            mb: 2
          }}>
            ¿Estás seguro que deseas eliminar esta comisión? Esta acción no se puede deshacer.
          </Typography>
          {deleteError && (
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
              border: `1px solid ${theme.palette.error.main}`,
              mt: 2
            }}>
              <Typography sx={{ 
                color: theme.palette.error.main,
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontSize: '0.875rem'
              }}>
                {deleteError}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={cancelDelete} 
            variant='outlined' 
            startIcon={<Icon icon="solar:close-circle-bold" />}
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<Icon icon="solar:check-circle-bold" />}
            disabled={!!deleteError}
            sx={{
              borderRadius: 3,
              px: 4,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      
        </>
        
    )

}