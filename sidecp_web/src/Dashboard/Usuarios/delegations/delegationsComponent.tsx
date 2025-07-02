import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Breadcrumbs, Button, createTheme, IconButton, Stack, ThemeProvider, Typography, Link, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useMemo, useState } from 'react';
import ModalDelegation from './modalAddDelegation';
import { getCommitties } from '../../../API/userAPI';
import { getStudents, deleteStudent, getScores } from '../../../API/userAPI';
import { Icon } from '@iconify/react';
import { esES } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';
import { createStudent } from "../../../API/userAPI";
import { countriesWithLabelId } from "../../../../public/flags"
import * as XLSX from 'xlsx';

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

type scores = {
  scoreid: string | undefined,
  knowledgeskills: number,
  negotiationskills: number,
  communicationskills: number,
  interpersonalskills: number,
  analyticalskills: number
};

export default function DelegationsComp_(){
    
    // three columns evaluatorId, fullName(name, fullName)(get this from users table), committeName(get this from committe table)
const [open, setOpen] = useState(false);
const [selectRow, setRow] = useState<row | null>();
const [commities, setCommities] = useState<committe[]>([])
const [ students, setStudents ] = useState<student[]>([])

const [confirmOpen, setConfirmOpen] = useState(false);
const [rowToDelete, setRowToDelete] = useState<data | null>(null);

const [importing, setImporting] = useState(false);

const [importDialogOpen, setImportDialogOpen] = useState(false);
const [selectedCommitte, setSelectedCommitte] = useState<string>('');
const [pendingFile, setPendingFile] = useState<File | null>(null);

const [ openExplanationDialog, setExplanation ] = useState(false);
const [scores, setScores] = useState<scores[]>([]);
const [exportDialogOpen, setExportDialogOpen] = useState(false);
const [selectedExportCommitte, setSelectedExportCommitte] = useState<string>('all');

const [deleteByCommDialog, setDeleteByCommDialog] = useState(false);
const [selectedDeleteComm, setSelectedDeleteComm] = useState<string>("");

  // Handler para eliminar todos los estudiantes de una comisión
  const handleDeleteByCommission = async () => {
    if (!selectedDeleteComm) return;
    try {
      // Elimina en el backend si tienes un endpoint, si no, elimina uno por uno:
      const studentsToDelete = students.filter(s => s.committeid === selectedDeleteComm);
      for (const student of studentsToDelete) {
        await deleteStudent(student.studentid);
      }
      setStudents(prev => prev.filter(s => s.committeid !== selectedDeleteComm));
      setDeleteByCommDialog(false);
      setSelectedDeleteComm("");
    } catch (err) {
      console.error("Error eliminando estudiantes por comisión", err);
    }
  };

  // Nuevo handler para abrir el diálogo antes de importar
  const handleImportButtonClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setImportDialogOpen(true);
    // Limpiar input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };

  // Handler para importar después de seleccionar comisión
  const handleImportExcel = async () => {
  if (!pendingFile || !selectedCommitte) return;
  setImporting(true);

  const reader = new FileReader();

  reader.onload = async (evt) => {
    try {
      const bstr = evt.target?.result;
      if (!bstr) {
        setImporting(false);
        setImportDialogOpen(false);
        return;
      }

      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Filtrar filas vacías
      const filteredData = data.filter(row => row && row.length > 0 && row.some((cell: string | null | undefined) => cell !== null && cell !== undefined && cell !== ''));

      if (filteredData.length === 0) {
        console.error('El archivo está vacío o no contiene datos válidos');
        setImporting(false);
        setImportDialogOpen(false);
        return;
      }

      const [, ...rows] = filteredData;

      const response = await getStudents();
      const dbStudents = response.data.students || [];

      const existingNames = new Set(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbStudents.map((s: { name: any; lastname: any; }) =>
          `${(s.name ?? '').trim().toLowerCase()} ${(s.lastname ?? '').trim().toLowerCase()}`
        )
      );

      let importados = 0;
      let duplicados = 0;

      for (const row of rows) {
        const name = (row[0] || "").trim();
        const lastName = (row[1] || "").trim();
        const fullNameKey = `${name.toLowerCase()} ${lastName.toLowerCase()}`;

        if (existingNames.has(fullNameKey)) {
          duplicados++;
          continue; // Salta si ya existe
        }

        const rawDelegation = (row[2] || "").trim();
        const delegacionMatch = countriesWithLabelId.find(
          d => d.id.toLowerCase() === rawDelegation.toLowerCase()
        )?.label;

        const studentData = {
          name,
          lastName,
          committeId: selectedCommitte,
          delegation: delegacionMatch || rawDelegation
        };

        try {
          await createStudent({ scoreId: undefined, studentId: undefined, ...studentData });
          existingNames.add(fullNameKey);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          importados++;
        } catch (err) {
          console.error("Error creando estudiante:", err, studentData);
        }
      }

      // Refresca la lista de estudiantes después de importar
      const response2 = await getStudents();
      setStudents(response2.data.students);

      if (duplicados > 0) {
        alert(`Se omitieron ${duplicados} estudiantes porque ya existen.`);
      }

    } catch (error) {
      console.error('Error al procesar el archivo:', error);
    } finally {
      setImporting(false);
      setImportDialogOpen(false);
      setPendingFile(null);
      setSelectedCommitte('');
    }
  };

  reader.onerror = () => {
    console.error('Error al leer el archivo');
    setImporting(false);
    setImportDialogOpen(false);
    setPendingFile(null);
    setSelectedCommitte('');
  };

  reader.readAsBinaryString(pendingFile);
};

const handleExportExcel = async () => {
  setExportDialogOpen(true);
};

const handleConfirmExport = () => {
  let filteredStudents = students;
  if (selectedExportCommitte !== 'all') {
    filteredStudents = students.filter(s => s.committeid === selectedExportCommitte);
  }

  const studentsWithTotal = filteredStudents.map(student => {
    const score = scores.find(s => s.scoreid === student.scoreid);
    const total =
      ((Number(score?.knowledgeskills)) +
      (Number(score?.negotiationskills)) +
      (Number(score?.interpersonalskills)) +
      (Number(score?.analyticalskills)) +
      (Number(score?.communicationskills)))/5;
    return { ...student, total };
  });

  const sorted = [...studentsWithTotal].sort((a, b) => b.total - a.total);
  const top10Map = new Map<string, number>();
  sorted.slice(0, 10).forEach((s, idx) => {
    top10Map.set(s.studentid, idx + 1);
  });

  const exportData = studentsWithTotal.map(student => {
    const score = scores.find(s => s.scoreid === student.scoreid);
    const commite = commities.find(c => c.committeid === student.committeid);
    const topPosition = top10Map.get(student.studentid);
    return {
      "Nombre de estudiante": student.name,
      "Apellidos": student.lastname,
      "Delegación": student.delegation,
      "Comisión": commite?.committename ?? "",
      "Conocimientos": score?.knowledgeskills ?? "",
      "Negociación": score?.negotiationskills ?? "",
      "Comunicación": score?.communicationskills ?? "",
      "Interpersonales": score?.interpersonalskills ?? "",
      "Analíticos": score?.analyticalskills ?? "",
      "Nota total": student.total,
      "Top 10": topPosition ? `#${topPosition}` : ""
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Delegados");

  XLSX.writeFile(workbook, "delegados.xlsx");
  setExportDialogOpen(false);
  setSelectedExportCommitte('all');
};

  const handleDelete = (data: data) => {
    setRowToDelete(data);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete) {
      await deleteStudent(rowToDelete.id);
      setStudents(prev => prev.filter((item: student) => item.studentid !== rowToDelete.id));
      setRowToDelete(null);
      setConfirmOpen(false);
    }
  };

  const cancelDelete = () => {
    setRowToDelete(null);
    setConfirmOpen(false);
  };

 const handleEdit = (data: data)=>{
    const names = data.fullName.split(" ")
    setRow({ name: names[0], lastName: names[1], committe: commities.find((i: committe)=> i.committename === data.committeName)?.committeid, studentId: data.id, delegation: data.delegation, scoreId: students.find((i: student)=>i.studentid === data.id)?.scoreid})
    setOpen(true)
  }

const columns: GridColDef<(typeof rows)[number]>[] = [
  
  { field: 'evaluatorId', headerName: 'Id', width: 150 },
  {
    field: 'committeName',
    headerName: 'Nombre del comisión',
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
      const callScores = async () => {
    try {
      const response = await getScores();
      setScores(response.data.scores);
    } catch (err) {
      console.log(err);
    }
  }
      callCommities();
      callStudents();
      callScores();
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
      <Box sx={{ display: "flex", width: "100%", alignItems: "flex-start" , p: 5, pl: 0, pb: 4, flexDirection: "column" }}>
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
      </Box>
        <Stack display="flex" flexDirection="row" alignSelf="end">
          <Button
        variant="contained"
        color="error"
        sx={{ m: 2, alignSelf: "end", borderRadius: 2 }}
        onClick={() => setDeleteByCommDialog(true)}
      >
        Eliminar por comisión
      </Button>
          <Button
              variant="contained"
              color="success"
              sx={{ m: 2, alignSelf: "end", borderRadius: 2 }}
              onClick={handleExportExcel}
            >
              Exportar a Excel
            </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ m: 2, alignSelf: "end", borderRadius: 2 }}
          onClick={() => setExplanation(true)}
        >
          Importar de Excel
        </Button>
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx,.xls"
          hidden
          style={{ display: 'none' }}
          onChange={handleImportButtonClick}
        />
        <Button onClick={() => { setOpen(true) }} sx={{ m: 2, alignSelf: "end", borderRadius: 2 }} color="primary" variant='contained'>Agregar delegado</Button>
      </Stack>

      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} slotProps={{ paper: { sx: { borderRadius: 6 } } }}>
        <DialogTitle>Selecciona la comisión para los estudiantes</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-committe-label">Comisión</InputLabel>
            <Select
              labelId="select-committe-label"
              value={selectedCommitte}
              label="Comisión"
              onChange={e => setSelectedCommitte(e.target.value)}
            >
              {commities.map((committe) => (
                <MenuItem key={committe.committeid} value={committe.committeid}>
                  {committe.committename}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)} color="primary" variant='outlined' sx={{ borderRadius: 4 }}>
            Cerrar
          </Button>
          <Button
            onClick={handleImportExcel}
            color="warning"
            variant="contained"
            sx={{ borderRadius: 4 }}
            disabled={!selectedCommitte || importing}
          >
            Importar
          </Button>
        </DialogActions>
      </Dialog>
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
        <Dialog open={confirmOpen} onClose={cancelDelete} slotProps={{paper: {sx: {borderRadius: 6}}}}>
        <DialogTitle>Eliminar delegado</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar este delegado? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary" variant='outlined' sx={{borderRadius: 4}}>
            Cerrar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={{borderRadius: 4}}>
            Eliminar
          </Button>
        </DialogActions>
        </Dialog>


      <Dialog open={openExplanationDialog}  slotProps={{paper: {sx: {borderRadius: 6}}}}>
        <DialogTitle><Typography variant='h5' paddingTop={2}>Importar delegados desde Excel</Typography></DialogTitle>
        <DialogContent sx={{ whiteSpace: 'pre-line' }}>
    <span>
      Selecciona un archivo Excel con los datos de los delegados.
      {"\n\n"}
      Antes de continuar usted debe de tener las columnas en el siguiente orden:
      {"\n"}
      <b>1. Nombre de estudiante</b>, <b>2. Apellidos, </b> <b>3. Delegación</b>
      {"\n\n"}
      <b style={{color: theme.palette.error.main}}>Le recordamos que los países deben estar bien escritos para evitar conflictos.</b>
    </span>
  </DialogContent>
        <DialogActions>
          <Button onClick={() => setExplanation(false)} color="primary" variant='outlined' sx={{borderRadius: 4, width: "30%"}}>
            Cerrar
          </Button>
          <Button
            color="warning"
            variant="contained"
            sx={{borderRadius: 4}}
            onClick={() => {
              setExplanation(false);
              document.getElementById('excel-file-input')?.click();
            }}
            fullWidth
          >
            Seleccionar archivo
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} slotProps={{ paper: { sx: { borderRadius: 6 } } }}>
  <DialogTitle>Selecciona la comisión a exportar</DialogTitle>
  <DialogContent>
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="select-export-committe-label">Comisión</InputLabel>
      <Select
        labelId="select-export-committe-label"
        value={selectedExportCommitte}
        label="Comisión"
        onChange={e => setSelectedExportCommitte(e.target.value)}
      >
        <MenuItem value="all">Todas las comisiones</MenuItem>
        {commities.map((committe) => (
          <MenuItem key={committe.committeid} value={committe.committeid}>
            {committe.committename}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setExportDialogOpen(false)} color="error" variant='outlined' sx={{ borderRadius: 4, width: "30%" }}>
      Cerrar
    </Button>
    <Button
      onClick={handleConfirmExport}
      color="success"
      variant="contained"
      sx={{ borderRadius: 4 }}
      fullWidth
    >
      Exportar
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={deleteByCommDialog} onClose={() => setDeleteByCommDialog(false)} slotProps={{ paper: { sx: { borderRadius: 6 } } }}>
        <DialogTitle>Eliminar todos los delegados de una comisión</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-delete-committe-label">Comisión</InputLabel>
            <Select
              labelId="select-delete-committe-label"
              value={selectedDeleteComm}
              label="Comisión"
              onChange={e => setSelectedDeleteComm(e.target.value)}
            >
              {commities.map((committe) => (
                <MenuItem key={committe.committeid} value={committe.committeid}>
                  {committe.committename}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography sx={{ mt: 2, color: theme.palette.error.main }}>
            Esta acción eliminará <b>todos</b> los estudiantes de la comisión seleccionada. No se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteByCommDialog(false)} color="primary" variant='outlined' sx={{ borderRadius: 4, width: "30%" }}>
            Cerrar
          </Button>
          <Button
            onClick={handleDeleteByCommission}
            color="error"
            variant="contained"
            sx={{ borderRadius: 4 }}
            disabled={!selectedDeleteComm}
            fullWidth
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

        </>
    );
}