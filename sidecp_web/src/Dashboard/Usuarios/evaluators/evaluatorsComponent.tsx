import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Breadcrumbs, Button, createTheme, IconButton, Stack, ThemeProvider, Typography } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useMemo, useState } from 'react';
import ModalEvaluator from './modalAddEvaluator';
import { getUsers } from '../../../API/userAPI';
import { getCommitties } from '../../../API/userAPI';
import { getEvaluators } from '../../../API/userAPI';
import { deleteEvaluator } from "../../../API/userAPI"
import { Icon } from '@iconify/react';
import { esES } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

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
  const handleDelete = async (data: data) =>{
    await deleteEvaluator(data.id)
    setEvaluators(prev=> prev.filter((item: evaluator)=> item.evaluatorid !== data.id))
  }

const columns: GridColDef<(typeof rows)[number]>[] = [
  
  { field: 'evaluatorId', headerName: 'Id', width: 150 },
  {
    field: 'committeName',
    headerName: 'Nombre del comité',
    width: 300,
  },
  {
    field: 'fullName',
    headerName: 'Nombre completo',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 300
  },{
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    sortable: false,
    filterable: false,
    disableExport: true,
    renderCell: (params) => (
      <>
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
      const callUsers = async ()=>{
        const response = await getUsers();
        setUsers(response.data?.users);
      }
      const callCommities = async ()=>{
        try{
          const response = await getCommitties();
          setCommities(response.data.committies);
        }catch(err){
          console.log(err)
        }
        
      }
      const callEvaluators = async ()=>{
        try{
          const response = await getEvaluators();
          setEvaluators(response.data.evaluators);
        }catch(err){
          console.log(err);
        }
        
      }
      callCommities();
      callUsers();
      callEvaluators();
},[open])

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
                 <Box sx={{ display: "flex", width: "100%", alignItems: "flex-start" , p: 5, pl: 0, pb: 2, flexDirection: "column" }}>
          <Typography typography="h4" sx={{color: theme.palette.mode === "dark"?'white':'black', mb: 2}}>Evaluadores</Typography>
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
          <Icon icon="ic:round-person" />
          Usuarios
        </Typography>
        <Typography
          sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', cursor: "default", columnGap: 1 }}
        >
          <Icon icon="mdi:typewriter" />
          Evaluadores
        </Typography>
      </Breadcrumbs>
      </Box>
      <Button onClick={()=>{setOpen(true)}}sx={{m: 2, alignSelf: "end", borderRadius: 2}} color="primary" variant='contained' >Agregar evaluador</Button>
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
        </>
    )
}