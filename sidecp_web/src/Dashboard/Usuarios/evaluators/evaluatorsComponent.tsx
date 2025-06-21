import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Button, IconButton, Stack } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useState } from 'react';
import ModalEvaluator from './modalAddEvaluator';
import { getUsers } from '../../../API/userAPI';
import { getCommitties } from '../../../API/userAPI';
import { getEvaluators } from '../../../API/userAPI';
import { deleteEvaluator } from "../../../API/userAPI"
import { Icon } from '@iconify/react';


export default function EvaluatorsComp(){
    
    // three columns evaluatorId, fullName(name, fullName)(get this from users table), committeName(get this from committe table)

const [open, setOpen] = useState(false);
const [selectRow, setRow] = useState({ userId: null, committe: null, evaluatorId: null});
const [users, setUsers] = useState([])
const [commities, setCommities] = useState([])
const [evaluators, setEvaluators] = useState([])

 const handleEdit = (data: any)=>{
    setRow({ userId: users.find((i: any)=> `${i.name} ${i.lastname}` === data.fullName)?.userid, committe: commities.find((i: any)=> i.committename === data.committeName)?.committeid, evaluatorId: data.id})
    setOpen(true)
  }
  const handleDelete = async (data: any) =>{
    await deleteEvaluator(data.id)
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
          onClick={() => handleEdit(params.row)}
          color="primary"
        >
          <Icon icon="ic:baseline-edit"/>
        </IconButton>
        <IconButton
          onClick={() => handleDelete(params.row)}
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
          console.log(response.data.evaluators)
          setEvaluators(response.data.evaluators);
        }catch(err){
          console.log(err);
        }
        
      }
      callCommities();
      callUsers();
      callEvaluators();
},[])

const transformDataRow = ()=>{
  return evaluators.map((evaluator: any, i: number)=> ({id: evaluator.evaluatorid, evaluatorId: i, 
    fullName: `${users.find((i: any)=> i.userid === evaluator.userid)?.name} ${users.find((i: any)=> i.userid === evaluator.userid)?.lastname}`, 
    committeName: commities.find((i: any)=> i.committeid === evaluator.committeid)?.committename }))
}

const rows = transformDataRow() /* [
  { id: 1 ,evaluatorId: 1, fullName: 'Snow', committeName: 14 },
  { id: 2 ,evaluatorId: 2, fullName: 'Lannister', committeName: 31 },
  { id: 3 ,evaluatorId: 3, fullName: 'Lannister', committeName: 31 },
  { id: 4 ,evaluatorId: 4, fullName: 'Stark', committeName: 11 },
  { id: 5 ,evaluatorId: 5, fullName: 'Targaryen', committeName: null },
  { id: 6 ,evaluatorId: 6, fullName: 'Melisandre', committeName: 150 },
  { id: 7 ,evaluatorId: 7, fullName: 'Clifford', committeName: 44 },
  { id: 8 ,evaluatorId: 8, fullName: 'Frances', committeName: 36 },
  { id: 9 ,evaluatorId: 9, fullName: 'Roxie', committeName: 65 },
]; */

const {theme} = useSettingContext()

    return (
      <>
      <Button onClick={()=>{setOpen(true)}}sx={{m: 2, alignSelf: "end", borderRadius: 2}} color="primary" variant='contained' >Agregar evaluador</Button>
        <Stack sx={{ 
                backgroundColor: theme.palette.mode === 'dark'? 'gray':'#f5f5f5',
                ml: '20vw', 
                mb: '10vh',
                width: "auto",
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                position: 'inherit',
                 justifyContent: "center",
                 overflow: "hidden",
                flexShrink: 0
                }}>
        <DataGrid
        sx={{borderRadius: 4, p: 2}}  
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } }}}

        />
        </Stack>
                <ModalEvaluator currentData={selectRow} setOpen={setOpen} open={open} usersData={users} commities={commities} setRow={setRow}/>
        </>
    )
}