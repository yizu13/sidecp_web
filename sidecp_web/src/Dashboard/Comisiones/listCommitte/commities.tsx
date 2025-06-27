import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Box, Tooltip } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useState } from 'react';
import { getCommitties } from '../../../API/userAPI';
import { deleteCommitte } from '../../../API/userAPI';
import { Icon } from '@iconify/react';
import { useEditCommitte } from '../../../router/committeEditContext/committeContextEdit';
import EventsModal from './eventsModal';
import DescriptionModal from './descriptionModal';
import { getEventsById } from '../../../API/userAPI';
import { useNavigate } from 'react-router-dom';

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

export default function ListCommities(){

const { setCommitteForEdit } = useEditCommitte()
const navigate = useNavigate()
const [commities, setCommities] = useState<Committe[]>([])
const [ openModal, setModal ] = useState<boolean>(false)
const [ eventList, setEvents ] = useState<events[]>([])
const [ description, setDescription ] = useState<string>("");
const [ openModalDescription, setModalDescription ] = useState<boolean>(false)

 function formatDateTime(datetime: string) {
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
  const handleDelete = async (data: data) =>{
    await deleteCommitte(data.id)
    setCommities(prev=> prev.filter((item: Committe)=> item.committeid !== data.id))
  }

  const handleSee = async(data: data) =>{
    const events_: string | undefined  =  commities.find((i: Committe)=> i.committeid === data.id)?.events
    const response = await getEventsById(events_ ?? "")
    setEvents(response.data)
    setModal(true)
  }

  const handleDescription = async (data: data)=>{
    setDescription(data.description);
    setModalDescription(true)
  }

const columns: GridColDef<(typeof rows)[number]>[] = [
  
  { field: 'committeId', headerName: 'Id', width: 90, maxWidth: 120 },
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
        <EventsModal open={openModal} eventList={eventList} modalFunc={setModal} eventsFunc={setEvents}/>
        <DescriptionModal open={openModalDescription} description={description} modalFunc={setModalDescription} descriptionFunc={setDescription}/>
        </>
        
    )

}