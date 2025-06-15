import { DataGrid, type GridColDef } from '@mui/x-data-grid';


export default function EvaluatorsComp(){
    
    // three columns evaluatorId, fullName(name, lastName)(get this from users table), committeName(get this from committe table)

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'evaluatorId', headerName: 'Id', width: 90 },
  {
    field: 'committeName',
    headerName: 'Nombre del comité',
    width: 150,
  },
  {
    field: 'fullName',
    headerName: 'Nombre completo',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

    return (
        <>
        <DataGrid  
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } }}}

        />
        </>
    )
}