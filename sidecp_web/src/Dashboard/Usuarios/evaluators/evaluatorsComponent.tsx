import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useState } from 'react';
import ModalEvaluator from './modalAddEvaluator';
import { getUsers } from '../../../API/userAPI';
import { getCommitties } from '../../../API/userAPI';
import { getEvaluators } from '../../../API/userAPI';
import { deleteEvaluator } from "../../../API/userAPI"
import { Icon } from '@iconify/react';

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
      <Button onClick={()=>{setOpen(true)}}sx={{m: 2, alignSelf: "end", borderRadius: 2}} color="primary" variant='contained' >Agregar evaluador</Button>
        <Box sx={{
            maxWidth: "65vw",
            borderRadius: 4,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', 
            backgroundColor: theme.palette.mode === 'dark'? 'gray':'#f5f5f5'}}>
        <DataGrid
        sx={{borderRadius: 4, p: 2}}  
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } }}}

        />
        </Box>
        </Stack>
        </Stack>
                <ModalEvaluator currentData={selectRow} setOpen={setOpen} open={open} usersData={users} commities={commities} setRow={setRow}/>
        </>
    )
}