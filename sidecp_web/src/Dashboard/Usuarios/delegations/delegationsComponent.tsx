import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Breadcrumbs, Button, createTheme, IconButton, Stack, ThemeProvider, Typography, Link } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useMemo, useState } from 'react';
import ModalDelegation from './modalAddDelegation';
import { getCommitties } from '../../../API/userAPI';
import { getStudents, deleteStudent } from '../../../API/userAPI';
import { Icon } from '@iconify/react';
import { esES } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';

type data = {
  committeName: string
  evaluatorId: number
  fullName: string
  id: string
  delegation: string
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
  name: string | undefined
  lastName: string | undefined
  committe: string | undefined
  studentId: string | undefined
  delegation : string | undefined
  scoreId: string | undefined
}

type student = {
  committeid: string
  studentid: string
  name: string
  lastname: string
  delegation: string
  scoreid: string
}


export default function DelegationsComp_(){
    
    // three columns evaluatorId, fullName(name, fullName)(get this from users table), committeName(get this from committe table)
const [open, setOpen] = useState(false);
const [selectRow, setRow] = useState<row | null>();
const [commities, setCommities] = useState<committe[]>([])
const [ students, setStudents ] = useState<student[]>([])

console.log(selectRow)

 const handleEdit = (data: data)=>{
    const names = data.fullName.split(" ")
    setRow({ name: names[0], lastName: names[1], committe: commities.find((i: committe)=> i.committename === data.committeName)?.committeid, studentId: data.id, delegation: data.delegation, scoreId: students.find((i: student)=>i.studentid === data.id)?.scoreid})
    setOpen(true)
  }
  const handleDelete = async (data: data) =>{
   await deleteStudent(data.id)
    setStudents(prev=> prev.filter((item: student)=> item.studentid !== data.id))
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
    field: 'delegation',
    headerName: 'Delegación',
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
      const callCommities = async ()=>{
        try{
          const response = await getCommitties();
          setCommities(response.data.committies);
        }catch(err){
          console.log(err)
        }
        
      }
      const callStudents = async ()=>{
        try{
         const response = await getStudents();
          setStudents(response.data.students); 
        }catch(err){
          console.log(err);
        }
        
      }
      callCommities();
      callStudents();
},[open])

const transformDataRow = ()=>{
  return students.map((student: student, i: number)=> {
    const foundCommitte = commities.find((i: committe)=> i.committeid === student.committeid);
    return {
      id: student.studentid,
      evaluatorId: i,
      fullName: `${student.name} ${student.lastname}`,
      delegation: student.delegation,
      committeName: commities.map((i: committe)=> i.committeid).includes(student.committeid)? 
        (foundCommitte?.committename ?? "no existe") : 
        "no existe",
      scoreId: student.scoreid
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
      <Stack sx={{ width: "100%", alignItems: "flex-start", pt: 5, pl: "15vw", }}>
          <Typography typography="h4" sx={{color: theme.palette.mode === "dark"?'white':'black', mb: 2}}>Delegaciones</Typography>
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
          <Icon icon="fontisto:persons" />
          Delegaciones
        </Typography>
      </Breadcrumbs>
      </Stack>
        <Stack sx={{ 
                width: "80vw",
                height: "auto",
                p: 4,
                pt: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "auto",
                }}>
                <Stack>
      <Button onClick={()=>{setOpen(true)}}sx={{m: 2, alignSelf: "end", borderRadius: 2}} color="primary" variant='contained' >Agregar delegado</Button>
        <Box sx={{
            maxWidth: "70vw",
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
                <ModalDelegation currentData={selectRow} setOpen={setOpen} open={open} commities={commities} setRow={setRow}/>
        </>
    )
}