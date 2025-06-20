import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Button, Stack } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useState } from 'react';
import ModalEvaluator from './modalAddEvaluator';


export default function EvaluatorsComp(){
    
    // three columns evaluatorId, fullName(name, fullName)(get this from users table), committeName(get this from committe table)

const [open, setOpen] = useState(false);
const [selectRow, setRow] = useState({ userId: null,
    committe: null});
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
  },
];

const rows = [
  { id: 1 ,evaluatorId: 1, fullName: 'Snow', committeName: 14 },
  { id: 2 ,evaluatorId: 2, fullName: 'Lannister', committeName: 31 },
  { id: 3 ,evaluatorId: 3, fullName: 'Lannister', committeName: 31 },
  { id: 4 ,evaluatorId: 4, fullName: 'Stark', committeName: 11 },
  { id: 5 ,evaluatorId: 5, fullName: 'Targaryen', committeName: null },
  { id: 6 ,evaluatorId: 6, fullName: 'Melisandre', committeName: 150 },
  { id: 7 ,evaluatorId: 7, fullName: 'Clifford', committeName: 44 },
  { id: 8 ,evaluatorId: 8, fullName: 'Frances', committeName: 36 },
  { id: 9 ,evaluatorId: 9, fullName: 'Roxie', committeName: 65 },
];

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
                <ModalEvaluator currentData={selectRow} setOpen={setOpen} open={open}/>
        </>
    )
}