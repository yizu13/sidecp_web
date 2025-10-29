import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Breadcrumbs, Button, createTheme, IconButton, Stack, ThemeProvider, Typography, Link, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { useEffect, useMemo, useState, useCallback } from 'react';
import ModalDelegation from './modalAddDelegation';
import { getCommitties } from '../../../API/userAPI';
import { getStudents, deleteStudent, getScores } from '../../../API/userAPI';
import { Icon } from '@iconify/react';
import ConfirmDialog from '../../layout/ConfirmDialog';
import { esES } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';
import { createStudent } from "../../../API/userAPI";
import { countriesWithLabelId } from "../../../../public/flags"
import * as XLSX from 'xlsx-js-style';
import React from 'react';

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
  investigacion_analisis: number,
  pensamiento_critico: number,
  oratoria: number,
  argumentacion: number,
  redaccion: number,
  negociacion: number,
  resolucion_conflictos: number,
  liderazgo: number,
  colaboracion: number,
  total: number
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

  const [loading, setLoading] = useState(false);

  // Refetch centralizado
  const refetchAll = useCallback(async () => {
    try {
      const [committeRes, studentsRes, scoresRes] = await Promise.all([
        getCommitties(),
        getStudents(),
        getScores()
      ]);
      setCommities(committeRes.data.committes || []);
      setStudents(studentsRes.data.students_ || []);
      setScores(scoresRes.data.scores_ || []);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  // Handler para eliminar todos los estudiantes de una comisión
  const handleDeleteByCommission = async () => {
    setLoading(true);
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
    setLoading(false);
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
      const dbStudents = response.data.students_ || [];

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
      refetchAll();

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
    const total = score?.total || 0;
    return { ...student, score, total };
  });

  const sorted = [...studentsWithTotal].sort((a, b) => b.total - a.total);
  const top10Map = new Map<string, number>();
  sorted.slice(0, 10).forEach((s, idx) => {
    top10Map.set(s.studentid, idx + 1);
  });

  // Crear workbook y worksheet vacío
  const workbook = XLSX.utils.book_new();
  const worksheet: any = {};

  // Configurar rangos de merge para el encabezado
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }, // Título principal
    { s: { r: 1, c: 0 }, e: { r: 1, c: 14 } }, // Subtítulo
    { s: { r: 2, c: 0 }, e: { r: 2, c: 14 } }, // Centro Educativo
    { s: { r: 3, c: 0 }, e: { r: 3, c: 14 } }, // Distrito Educativo
    { s: { r: 4, c: 0 }, e: { r: 4, c: 14 } }, // Comisión simulada
    // Headers de categorías
    { s: { r: 6, c: 3 }, e: { r: 6, c: 4 } }, // Investigación y análisis crítico (30%)
    { s: { r: 6, c: 5 }, e: { r: 6, c: 7 } }, // Comunicación y lenguaje (30%)
    { s: { r: 6, c: 8 }, e: { r: 6, c: 9 } }, // Negociación y resolución de conflictos (20%)
    { s: { r: 6, c: 10 }, e: { r: 6, c: 11 } }, // Liderazgo y colaboración (20%)
    // Headers adicionales
    { s: { r: 6, c: 14 }, e: { r: 7, c: 14 } }, // Ganadores
    { s: { r: 6, c: 15 }, e: { r: 7, c: 15 } }, // Menciones Honoríficas
    { s: { r: 6, c: 16 }, e: { r: 7, c: 16 } }, // Comentarios
    { s: { r: 6, c: 0 }, e: { r: 7, c: 0 } },   // No.
    { s: { r: 6, c: 1 }, e: { r: 7, c: 1 } },   // Delegado
    { s: { r: 6, c: 2 }, e: { r: 7, c: 2 } },   // Delegación
    { s: { r: 6, c: 12 }, e: { r: 7, c: 12 } }, // Total General
    { s: { r: 6, c: 13 }, e: { r: 7, c: 13 } }  // 100%
  ];

  worksheet['!merges'] = merges;

  // Estilo para encabezado principal (verde)
  const headerMainStyle = {
    fill: { fgColor: { rgb: "92D050" } },
    font: { bold: true, sz: 11, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Estilo para encabezados de datos (amarillo claro)
  const headerDataStyle = {
    fill: { fgColor: { rgb: "FFFF99" } },
    font: { bold: true, sz: 9, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Estilo para celdas de datos
  const dataCellStyle = {
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Agregar encabezado principal
  worksheet['A1'] = { t: 's', v: 'PROGRAMA DE LIDERAZGO EDUCATIVO- PLERD - CLUB DE LIDERAZGO EDUCATIVO REGIONAL 04', s: headerMainStyle };
  worksheet['A2'] = { t: 's', v: 'Sistema Simplificado de Evaluación de Modelos de Naciones Unidas 2025 - 2026', s: headerMainStyle };
  worksheet['A3'] = { t: 's', v: 'Centro Educativo:', s: headerMainStyle };
  worksheet['A4'] = { t: 's', v: 'Distrito Educativo:', s: headerMainStyle };
  worksheet['A5'] = { t: 's', v: 'Comisión simulada: ' + (selectedExportCommitte !== 'all' ? commities.find(c => c.committeid === selectedExportCommitte)?.committename : 'Todas'), s: headerMainStyle };

  // Fila 6 vacía
  worksheet['A6'] = { t: 's', v: '', s: { fill: { fgColor: { rgb: "FFFFFF" } } } };

  // Encabezados principales (fila 7)
  worksheet['A7'] = { t: 's', v: 'No.', s: headerDataStyle };
  worksheet['B7'] = { t: 's', v: 'Delegado', s: headerDataStyle };
  worksheet['C7'] = { t: 's', v: 'Delegación', s: headerDataStyle };
  worksheet['D7'] = { t: 's', v: 'Investigación y análisis crítico (30%)', s: headerDataStyle };
  worksheet['F7'] = { t: 's', v: 'Comunicación y lenguaje (30%)', s: headerDataStyle };
  worksheet['I7'] = { t: 's', v: 'Negociación y resolución de conflictos (20%)', s: headerDataStyle };
  worksheet['K7'] = { t: 's', v: 'Liderazgo y colaboración (20%)', s: headerDataStyle };
  worksheet['M7'] = { t: 's', v: 'Total Gral. (100%)', s: headerDataStyle };
  worksheet['O7'] = { t: 's', v: 'Ganadores', s: headerDataStyle };
  worksheet['P7'] = { t: 's', v: 'Menciones Honoríficas', s: headerDataStyle };
  worksheet['Q7'] = { t: 's', v: 'Comentarios Constructivos', s: headerDataStyle };

  // Sub-encabezados (fila 8)
  worksheet['D8'] = { t: 's', v: 'Investigación y análisis (15%)', s: headerDataStyle };
  worksheet['E8'] = { t: 's', v: 'Pensamiento crítico (15%)', s: headerDataStyle };
  worksheet['F8'] = { t: 's', v: 'Oratoria (10%)', s: headerDataStyle };
  worksheet['G8'] = { t: 's', v: 'Argumentación (10%)', s: headerDataStyle };
  worksheet['H8'] = { t: 's', v: 'Redacción (10%)', s: headerDataStyle };
  worksheet['I8'] = { t: 's', v: 'Negociación (10%)', s: headerDataStyle };
  worksheet['J8'] = { t: 's', v: 'Resolución de conflictos (10%)', s: headerDataStyle };
  worksheet['K8'] = { t: 's', v: 'Liderazgo (10%)', s: headerDataStyle };
  worksheet['L8'] = { t: 's', v: 'Colaboración (10%)', s: headerDataStyle };
  worksheet['N8'] = { t: 's', v: '100%', s: headerDataStyle };

  // Agregar datos de estudiantes
  studentsWithTotal.forEach((student, index) => {
    const rowNum = index + 9; // Comienza en fila 9
    const topPosition = top10Map.get(student.studentid);
    
    const cellData = [
      { col: 'A', val: index + 1 },
      { col: 'B', val: `${student.name} ${student.lastname}` },
      { col: 'C', val: `${student.delegation} - ${commities.find(c => c.committeid === student.committeid)?.committename || ''}` },
      { col: 'D', val: student.score?.investigacion_analisis ?? 0 },
      { col: 'E', val: student.score?.pensamiento_critico ?? 0 },
      { col: 'F', val: student.score?.oratoria ?? 0 },
      { col: 'G', val: student.score?.argumentacion ?? 0 },
      { col: 'H', val: student.score?.redaccion ?? 0 },
      { col: 'I', val: student.score?.negociacion ?? 0 },
      { col: 'J', val: student.score?.resolucion_conflictos ?? 0 },
      { col: 'K', val: student.score?.liderazgo ?? 0 },
      { col: 'L', val: student.score?.colaboracion ?? 0 },
      { col: 'M', val: student.total },
      { col: 'N', val: student.total },
      { col: 'O', val: topPosition ? `#${topPosition}` : '' },
      { col: 'P', val: '' },
      { col: 'Q', val: '' }
    ];

    cellData.forEach(({ col, val }) => {
      const cellRef = `${col}${rowNum}`;
      worksheet[cellRef] = {
        t: typeof val === 'number' ? 'n' : 's',
        v: val,
        s: dataCellStyle
      };
    });
  });

  // Establecer ancho de columnas
  worksheet['!cols'] = [
    { wch: 5 },   // A - No.
    { wch: 30 },  // B - Delegado (nombre completo)
    { wch: 35 },  // C - Delegación (país - comisión)
    { wch: 12 },  // D - Investigación
    { wch: 12 },  // E - Pensamiento
    { wch: 10 },  // F - Oratoria
    { wch: 12 },  // G - Argumentación
    { wch: 10 },  // H - Redacción
    { wch: 11 },  // I - Negociación
    { wch: 12 },  // J - Resolución
    { wch: 10 },  // K - Liderazgo
    { wch: 12 },  // L - Colaboración
    { wch: 8 },   // M - Total Gral
    { wch: 8 },   // N - 100%
    { wch: 12 },  // O - Ganadores
    { wch: 15 },  // P - Menciones
    { wch: 30 }   // Q - Comentarios
  ];

  // Establecer altura de filas
  worksheet['!rows'] = [
    { hpt: 30 },  // Fila 1
    { hpt: 20 },  // Fila 2
    { hpt: 20 },  // Fila 3
    { hpt: 20 },  // Fila 4
    { hpt: 20 },  // Fila 5
    { hpt: 5 },   // Fila 6 (vacía)
    { hpt: 35 },  // Fila 7 (headers principales)
    { hpt: 35 }   // Fila 8 (sub-headers)
  ];

  // Configurar el rango de la hoja
  const range = {
    s: { r: 0, c: 0 },
    e: { r: studentsWithTotal.length + 8, c: 16 }
  };
  worksheet['!ref'] = XLSX.utils.encode_range(range);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluación Delegados');
  XLSX.writeFile(workbook, 'evaluacion_delegados_plerd.xlsx');
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
      refetchAll();
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
  { 
    field: 'evaluatorId', 
    headerName: 'ID', 
    width: 100,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'committeName',
    headerName: 'Comisión',
    width: 250,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:clipboard-text-bold" style={{ fontSize: 18 }} />
        <span>Comisión</span>
      </Box>
    )
  },
  {
    field: 'fullName',
    headerName: 'Nombre completo',
    sortable: false,
    width: 250,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:user-bold" style={{ fontSize: 18 }} />
        <span>Nombre completo</span>
      </Box>
    )
  },{
    field: 'delegation',
    headerName: 'Delegación',
    sortable: false,
    width: 200,
    headerAlign: 'left',
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="solar:flag-bold" style={{ fontSize: 18 }} />
        <span>Delegación</span>
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
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 0.5, justifyContent: "center" }}>
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

useEffect(()=>{
      const callCommities = async ()=>{
        try{
          const response = await getCommitties();
          setCommities(response.data.committes);
        }catch(err){
          console.log(err)
        }
        
      }
      const callStudents = async ()=>{
        try{
         const response = await getStudents();
          setStudents(response.data.students_); 
        }catch(err){
          console.log(err);
        }
        
      }
      const callScores = async () => {
    try {
      const response = await getScores();
      setScores(response.data.scores_);
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
          Delegaciones
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
            <Icon icon="solar:user-speak-bold" />
            Delegaciones
          </Typography>
        </Breadcrumbs>
      </Box>
        <Stack display="flex" flexDirection="row" alignSelf="end"  sx={{ mb: 3, gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Icon icon="solar:trash-bin-minimalistic-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3,
              py: 1,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              boxShadow: '0px 4px 12px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                boxShadow: '0px 6px 16px rgba(244, 67, 54, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
            onClick={() => setDeleteByCommDialog(true)}
          >
            Eliminar por comisión
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Icon icon="solar:export-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3,
              py: 1,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                boxShadow: '0px 6px 16px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
            
            onClick={handleExportExcel}
          >
            Exportar a Excel
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Icon icon="solar:import-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3,
              py: 1,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              boxShadow: '0px 4px 12px rgba(255, 152, 0, 0.3)',
              '&:hover': {
                boxShadow: '0px 6px 16px rgba(255, 152, 0, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
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
          <Button 
            onClick={() => { setOpen(true) }} 
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
            Agregar delegado
          </Button>
        </Stack>

      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} slotProps={{ paper: { sx: { borderRadius: 4, maxWidth: 500 } } }}>
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon="solar:import-bold" style={{ fontSize: 24, color: theme.palette.warning.main }} />
            <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
              Seleccionar Comisión
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif', color: theme.palette.mode === 'dark' ? '#cccccc' : '#666', mb: 3 }}>
            Selecciona la comisión para los estudiantes que vas a importar.
          </Typography>
          <FormControl fullWidth>
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
        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={() => setImportDialogOpen(false)} 
            variant='outlined' 
            startIcon={<Icon icon="solar:close-circle-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3, 
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
            color="error"
          >
            Cerrar
          </Button>
          <Button
            onClick={handleImportExcel}
            color="warning"
            variant="contained"
            startIcon={<Icon icon="solar:check-circle-bold" />}
            disabled={!selectedCommitte || importing}
            sx={{ 
              borderRadius: 3, 
              px: 4, 
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
            fullWidth
          >
            {importing ? 'Importando...' : 'Importar'}
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
        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar delegado"
          description="¿Estás seguro que deseas eliminar este delegado? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="error"
          icon="solar:trash-bin-minimalistic-bold"
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />


      <Dialog open={openExplanationDialog} slotProps={{paper: {sx: {borderRadius: 4, maxWidth: 600}}}}>
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon="solar:document-add-bold" style={{ fontSize: 24, color: theme.palette.warning.main }} />
            <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
              Importar Delegados desde Excel
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Typography sx={{ 
            fontFamily: '"Inter", "Roboto", sans-serif',
            color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
            mb: 3,
            lineHeight: 1.6
          }}>
            Selecciona un archivo Excel con los datos de los delegados siguiendo estas instrucciones:
          </Typography>
          
          <Box sx={{ 
            mb: 3,
            p: 2, 
            borderRadius: 2, 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
            border: `1px solid ${theme.palette.primary.main}`
          }}>
            <Typography sx={{ 
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 600,
              mb: 2,
              color: theme.palette.primary.main
            }}>
              <Icon icon="solar:document-text-bold"/> Formato requerido de columnas:
            </Typography>
            <Box component="ol" sx={{ 
              fontFamily: '"Inter", "Roboto", sans-serif',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#333',
              pl: 2,
              m: 0
            }}>
              <li><strong>Nombre del estudiante</strong></li>
              <li><strong>Apellidos</strong></li>
              <li><strong>Delegación (país)</strong></li>
            </Box>
          </Box>

          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
            border: `1px solid ${theme.palette.warning.main}`
          }}>
            <Typography sx={{ 
              color: theme.palette.warning.main,
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              <Icon icon="solar:danger-bold"/> <strong>Importante:</strong> Los nombres de los países deben estar escritos correctamente para evitar conflictos.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={() => setExplanation(false)} 
            variant='outlined' 
            startIcon={<Icon icon="solar:close-circle-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
            color="error"
          >
            Cerrar
          </Button>
          <Button
            color="warning"
            variant="contained"
            startIcon={<Icon icon="solar:file-smile-bold" />}
            onClick={() => {
              setExplanation(false);
              document.getElementById('excel-file-input')?.click();
            }}
            sx={{ 
              borderRadius: 3, 
              px: 4,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
            fullWidth
          >
            Seleccionar Archivo
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} slotProps={{ paper: { sx: { borderRadius: 4, maxWidth: 500 } } }}>
  <DialogTitle sx={{ p: 3, pb: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Icon icon="solar:export-bold" style={{ fontSize: 24, color: theme.palette.success.main }} />
      <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
        Exportar a Excel
      </Typography>
    </Box>
  </DialogTitle>
  <DialogContent sx={{ p: 3, pt: 1 }}>
    <Typography sx={{ 
      fontFamily: '"Inter", "Roboto", sans-serif',
      color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
      mb: 3,
      lineHeight: 1.5
    }}>
      Selecciona qué delegados deseas exportar a un archivo Excel.
    </Typography>
    <FormControl fullWidth>
      <InputLabel id="select-export-committe-label">Comisión</InputLabel>
      <Select
        labelId="select-export-committe-label"
        value={selectedExportCommitte}
        label="Comisión"
        onChange={e => setSelectedExportCommitte(e.target.value)}
      >
        <MenuItem value="all">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="solar:users-group-two-rounded-bold" style={{ fontSize: 18 }} />
            Todas las comisiones
          </Box>
        </MenuItem>
        {commities.map((committe) => (
          <MenuItem key={committe.committeid} value={committe.committeid}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="solar:clipboard-text-bold" style={{ fontSize: 18 }} />
              {committe.committename}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
    <Button 
      onClick={() => setExportDialogOpen(false)} 
      variant='outlined' 
      startIcon={<Icon icon="solar:close-circle-bold" />}
      sx={{ 
        borderRadius: 3, 
        px: 3,
        textTransform: 'none',
        fontFamily: '"Inter", "Roboto", sans-serif',
        fontWeight: 500
      }}
      color="error"
    >
      Cerrar
    </Button>
    <Button
      onClick={handleConfirmExport}
      color="success"
      variant="contained"
      startIcon={<Icon icon="solar:check-circle-bold" />}
      sx={{ 
        borderRadius: 3, 
        px: 4,
        textTransform: 'none',
        fontFamily: '"Inter", "Roboto", sans-serif',
        fontWeight: 500
      }}
      fullWidth
    >
      Exportar
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={deleteByCommDialog} onClose={() => setDeleteByCommDialog(false)} slotProps={{ paper: { sx: { borderRadius: 4, maxWidth: 550 } } }}>
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon="solar:danger-bold" style={{ fontSize: 24, color: theme.palette.error.main }} />
            <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
              Eliminar Delegados por Comisión
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Typography sx={{ 
            fontFamily: '"Inter", "Roboto", sans-serif',
            color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
            mb: 3,
            lineHeight: 1.5
          }}>
            Selecciona la comisión de la cual deseas eliminar todos los delegados.
          </Typography>
          <FormControl fullWidth>
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
          <Box sx={{ 
            mt: 3,
            p: 2, 
            borderRadius: 2, 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
            border: `1px solid ${theme.palette.error.main}`
          }}>
            <Typography sx={{ 
              color: theme.palette.error.main,
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
               Esta acción eliminará <strong>todos</strong> los estudiantes de la comisión seleccionada. No se puede deshacer.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={() => setDeleteByCommDialog(false)} 
            variant='outlined' 
            startIcon={<Icon icon="solar:close-circle-bold" />}
            sx={{ 
              borderRadius: 3, 
              px: 3,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Cerrar
          </Button>
          <Button
            onClick={handleDeleteByCommission}
            color="error"
            variant="contained"

            startIcon={<Icon icon="solar:trash-bin-minimalistic-bold" />}
            disabled={!selectedDeleteComm || loading}
            sx={{ 
              borderRadius: 3, 
              px: 4,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
            fullWidth
          >
            Eliminar Todos
          </Button>
        </DialogActions>
      </Dialog>

        </>
    );
}