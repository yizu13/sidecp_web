import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Box, Tooltip, Breadcrumbs, Typography, createTheme, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useState, useMemo } from 'react';
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
        const students = response.data.students || [];
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

  const handleSee = async(data: data) =>{
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
    headerName: 'Id', 
    width: 90, 
    maxWidth: 120 
  },
  {
    field: 'committeName',
    headerName: 'Nombre del comité',
    width: 200,
    maxWidth: 220
  },
  {
    field: 'topic',
    headerName: 'Tópico',
    width: 200,
    maxWidth: 220
  },{
    field: 'description',
    headerName: 'Descripción',
    width: 200,
    maxWidth: 220
  },{
    field: 'creationDate',
    headerName: 'Fecha de creación',
    width: 200,
    maxWidth: 220
  },{
    field: 'actions',
    headerName: 'Acciones',
    width: 200,
    maxWidth: 220,
    sortable: false,
    filterable: false,
    disableExport: true,
    renderCell: (params) => (
      <>
      <Tooltip title="Ver descripción" placement="top">
      <IconButton
          onClick={() => {handleDescription(params.row)}}
          color="info"
        >
          <Icon icon="basil:document-solid"/>
        </IconButton>
        </Tooltip>
      <Tooltip title="Ver eventos" placement="top">
      <IconButton
          onClick={() => {handleSee(params.row)}}
          color="info"
        >
          <Icon icon="tabler:eye-filled"/>
        </IconButton>
        </Tooltip>
        <IconButton
          onClick={() => {handleEdit(params.row)}}
          color="warning"
        >
          <Icon icon="ic:baseline-edit"/>
        </IconButton>
        <IconButton
          onClick={() => {handleDelete(params.row)}}
          color="error"
        >
          <Icon icon="weui:delete-filled"/>
        </IconButton>
      </>
    ),
  },
];

useEffect(()=>{
 
      const callCommities = async ()=>{
        try{
          const response = await getCommitties();
          setCommities(response.data.committies);
        }catch(err){
          console.log(err)
        }
      }
      callCommities();
},[])

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
                width: "80vw",
                height: "auto",
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "auto",
                }}>
        <Stack>
      <Box sx={{ display: "flex", width: "100%", alignItems: "flex-start" , p: 5, pl: 0, pb: 10, flexDirection: "column" }}>
          <Typography typography="h4" sx={{color: theme.palette.mode === "dark"?'white':'black', mb: 2}}>Comisiones</Typography>
      <Breadcrumbs aria-label="breadcrumb" >
         <Link
          component={RouterLink}
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}
          color="inherit"
          to="/dashboard/inicio"
        >
          <Icon icon="tabler:home-filled"/>
          Inicio
        </Link>
        <Typography
          sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', cursor: "default", columnGap: 1 }}
        >
          <Icon icon="dashicons:admin-site-alt" />
          Comisiones
        </Typography>
      </Breadcrumbs>
      </Box>
                  
        <Box sx={{
            maxWidth: "65vw",
            borderRadius: 4,
            mb: 2,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', 
            backgroundColor: theme.palette.mode === 'dark'? 'gray':'#f5f5f5'}}>
              <ThemeProvider theme={dataGridTheme}>
        <DataGrid
        sx={{borderRadius: 4,p: 2,
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


       <Dialog open={confirmOpen} onClose={cancelDelete} slotProps={{paper: {sx: {borderRadius: 6}}}}>
        <DialogTitle>Eliminar comisión</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar esta comisión? Esta acción no se puede deshacer.
          {deleteError && (
            <Typography sx={{ color: "red", mt: 2 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary" variant='outlined' sx={{borderRadius: 4}}>
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{borderRadius:4}}
            disabled={!!deleteError}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      
        </>
        
    )

}