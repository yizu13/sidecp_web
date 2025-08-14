import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Breadcrumbs, Button, createTheme, IconButton, Stack, ThemeProvider, Typography, Tooltip } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useMemo, useState, useCallback } from 'react';
import ModalEvaluator from './modalAddEvaluator';
import { getUsers } from '../../../API/userAPI';
import { getCommitties } from '../../../API/userAPI';
import { getEvaluators } from '../../../API/userAPI';
import { deleteEvaluator } from "../../../API/userAPI"
import { Icon } from '@iconify/react';
import ConfirmDialog from '../../layout/ConfirmDialog';
import { esES } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import React from 'react';

type data = {
  committeName: string
  evaluatorId: number
  fullName: string
  id: string
}

type users = {
  lastname: string
  name: string
  userid: string
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

type row = { 
  userId: string | undefined
  committe: string | undefined
  evaluatorId: string | undefined
}

type evaluator = {
  committeid: string
  evaluatorid: string
  userid: string
}


export default function EvaluatorsComp(){
    
    // three columns evaluatorId, fullName(name, fullName)(get this from users table), committeName(get this from committe table)

const [open, setOpen] = useState(false);
const [selectRow, setRow] = useState<row>();
const [users, setUsers] = useState<users[]>([])
const [commities, setCommities] = useState<committe[]>([])
const [evaluators, setEvaluators] = useState([])

 const handleEdit = (data: data)=>{
    setRow({ userId: users.find((i: users)=> `${i.name} ${i.lastname}` === data.fullName)?.userid, committe: commities.find((i: committe)=> i.committename === data.committeName)?.committeid, evaluatorId: data.id})
    setOpen(true)
  }
 const [confirmOpen, setConfirmOpen] = useState(false);
 const [rowToDelete, setRowToDelete] = useState<data | null>(null);

 const handleDelete = (data: data) =>{
    setRowToDelete(data)
    setConfirmOpen(true)
 }

 const confirmDelete = async () =>{
   if(rowToDelete){
     await deleteEvaluator(rowToDelete.id)
     await refetchAll()
     setRowToDelete(null)
     setConfirmOpen(false)
   }
 }

 const cancelDelete = () =>{
   setRowToDelete(null)
   setConfirmOpen(false)
 }

const columns: GridColDef<(typeof rows)[number]>[] = [
  { 
    field: 'evaluatorId', 
    headerName: 'ID', 
    width: 100,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'committeName',
    headerName: 'Comité',
    width: 300,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:clipboard-text-bold" style={{ fontSize: 18 }} />
        <span>Comité</span>
      </Box>
    )
  },
  {
    field: 'fullName',
    headerName: 'Nombre completo',
    sortable: false,
    width: 300,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:user-bold" style={{ fontSize: 18 }} />
        <span>Nombre completo</span>
      </Box>
    )
  },{
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
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
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, justifyContent: "center" }}>
        <Tooltip title="Editar" placement="top">
          <IconButton onClick={() => handleEdit(params.row)} color="warning" size="medium" sx={{ borderRadius: 2 }}>
            <Icon icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar" placement="top">
          <IconButton onClick={() => handleDelete(params.row)} color="error" size="medium" sx={{ borderRadius: 2 }}>
            <Icon icon="solar:trash-bin-minimalistic-bold" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

 const refetchAll = useCallback(async () => {
   try {
     const [usersRes, commRes, evalRes] = await Promise.all([
       getUsers(),
       getCommitties(),
       getEvaluators()
     ]);
     setUsers(usersRes.data?.users || []);
     setCommities(commRes.data?.committies || []);
     setEvaluators(evalRes.data?.evaluators || []);
   } catch (err) {
     console.log(err);
   }
 }, []);

 useEffect(() => {
   refetchAll();
 }, [refetchAll]);

const transformDataRow = ()=>{
  return evaluators.map((evaluator: evaluator, i: number)=> {
    const foundCommitte = commities.find((i: committe)=> i.committeid === evaluator.committeid);
    return {
      id: evaluator.evaluatorid,
      evaluatorId: i,
      fullName: users.map((i: users)=> i.userid).includes(evaluator.userid)? 
        `${users.find((i: users)=> i.userid === evaluator.userid)?.name} ${users.find((i: users)=> i.userid === evaluator.userid)?.lastname}`: 
        "no existe",
      committeName: commities.map((i: committe)=> i.committeid).includes(evaluator.committeid)? 
        (foundCommitte?.committename ?? "no existe") : 
        "no existe"
    }
  })
}

const rows = transformDataRow();

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

    return (
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
                 <Box sx={{ 
                   display: "flex", 
                   width: "100%", 
                   alignItems: "flex-start", 
                   p: 5, 
                   pl: 0, 
                   pb: 4, 
                   flexDirection: "column" 
                 }}>
          <Typography 
            variant="h4" 
            sx={{
              color: theme.palette.mode === "dark"?'white':'black', 
              mb: 3,
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}
          >
            Evaluadores
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              component={RouterLink}
              underline="hover"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                columnGap: 1,
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
                columnGap: 1,
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 500
              }}
            >
              <Icon icon="solar:users-group-two-rounded-bold" />
              Usuarios
            </Typography>
            <Typography
              sx={{ 
                color: 'text.primary', 
                display: 'flex', 
                alignItems: 'center', 
                cursor: "default", 
                columnGap: 1,
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 500
              }}
            >
              <Icon icon="solar:user-check-bold" />
              Evaluadores
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ alignSelf: "end", mb: 3 }}>
          <Button 
            onClick={()=>{setOpen(true)}}
            variant='contained' 
            color="primary"
            startIcon={<Icon icon="solar:user-plus-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3,
              py: 1,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Agregar evaluador
          </Button>
        </Box>
        <Box sx={{
            maxWidth: "65vw",
            borderRadius: 4,
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
        </Stack>
        </Stack>
                <ModalEvaluator currentData={selectRow} setOpen={setOpen} open={open} usersData={users} commities={commities} setRow={setRow}/>
        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar evaluador"
          description="¿Estás seguro que deseas eliminar este evaluador? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="error"
          icon="solar:trash-bin-minimalistic-bold"
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
        </>
    )
}