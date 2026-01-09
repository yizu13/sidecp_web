import { useEffect, useState, type SetStateAction, useRef } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Box, InputAdornment, TextField, Tooltip } from '@mui/material' 
import EditableTypography from './editableTypography';
import { countriesWithFlags } from "../../../../public/flags"
import SimpleSelect from './selectComponentCommitte';
import { getStudents } from '../../../API/userAPI';
import { getCommitties, getEvaluator, getScores } from '../../../API/userAPI';
import ModalCalification from './modalCalification';
import { useSettingContext } from '../../../settingsComponent/contextSettings';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
    //animate,
    motion,
    //MotionValue,
    //useMotionValue,
    //useMotionValueEvent,
    //useScroll,
} from "framer-motion"
import './scrollconfiguration.css';
import React from 'react';


type flags = {
    title: string
    cdn: string
}

type student = {
  committeid: string
  studentid: string
  name: string
  lastname: string
  delegation: string
  scoreid: string
}

type Committe = {
    committeid: string
    committename: string
    creationdate: string
    description: string
    events: string
    location: string
    relatedinstitution: string
    topic: string
    committeopen: boolean
}

type scoresCalifications = {
    scoreid: string
    knowledgeskills: string
    negotiationskills : string
    communicationskills: string
    interpersonalskills: string
    analyticalskills: string
    modified: boolean
}

export default function DelegationEval(){
    const [selected, setSelected] = useState('');
    const [students, setStudents] = useState<student[]>([]);
    const [studentsFiltered, setStudentFilter] = useState<student[]>([]);
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const [ committeDefined, setCommitteDef ] = useState<string | undefined>(undefined);
    const [ committe, setcommitte ] = useState<Committe[]>([]);
    const [ committeId, setCommitteId ] = useState('');
    const [ open, setOpen ] = useState(false);
    const [ currentStudent, setCurrent ] = useState<student | null>();
    const [ scores, setScores ] = useState<scoresCalifications[]>([])
    const { theme } = useSettingContext();
    const [ search, setSearch ] = useState('');
    const ref = useRef<HTMLUListElement>(null);
    // const { scrollYProgress } = useScroll({ container: ref })
    // const maskImage = useScrollOverflowMask(scrollYProgress)

   const filteredStudents = studentsFiltered.filter((item) => {
  const searchNormalized = search.trim().toLowerCase();
  const nameNormalized = item.name.trim().toLowerCase();
  const lastnameNormalized = item.lastname.trim().toLowerCase();
  const fullNameNormalized = (item.name + " " + item.lastname).trim().toLowerCase();
  const delegationNormalized = item.delegation.trim().toLowerCase();

  return (
    nameNormalized.includes(searchNormalized) ||
    lastnameNormalized.includes(searchNormalized) ||
    fullNameNormalized.includes(searchNormalized) ||
    delegationNormalized.includes(searchNormalized)
  );
});

      const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelected(event.target.value);
  };
  
  useEffect(()=>{
    const studentData = async ()=>{
      const response = await getStudents()
      
      setStudents(response.data.students_)
    }
    studentData()
  },[selected, open])

  useEffect(()=>{
    const filter = ()=>{
      if(user.role === "admin"){
      setStudentFilter(students.filter((i: student)=> i.committeid === selected))
    } else{
      setStudentFilter(students.filter((i: student)=> i.committeid === committeId))
    }
    }
    filter()
  },[selected, students, committeId, user.role])

   useEffect(()=>{
        const userCommitte = async()=>{
          const data = await getEvaluator(user.id)
          
          setCommitteDef(committe.find(i=> i.committeid === data.data.evaluator.committeid)?.committename)
          setCommitteId(committe.find(i=> i.committeid === data.data.evaluator.committeid)?.committeid ?? '')
        }
        userCommitte()
      },[committe, user])

     useEffect(()=>{
            const data = async ()=>{
               const response = await getCommitties()
               
               setcommitte(response.data.committes)
            }
            const scores = async ()=>{
              const response = await getScores();
              
              setScores(response.data.scores_);
            }
            scores()
            data()
        },[open])

    return (
        <>
        <Stack display="flex" flexDirection="row" justifyContent="center" alignContent="end" sx={{width: "100%"}}>
            <Box width="40vw" sx={{mb: 2}} flexDirection="row" display="flex" columnGap={6}>
            <SimpleSelect handleChange={handleChange} selected={selected} committeDefined={committeDefined} commities={committe} user={user}/>
            <TextField fullWidth placeholder='Buscar delegaciones...' 
            value={search}
            onChange={e => setSearch(e.target.value)}
            slotProps={{
                            input: {
                              startAdornment: ( 
                                <InputAdornment position='start'>
                                  <Icon icon="iconamoon:search-duotone"/>
                                </InputAdornment>
                              )
                            }}}/>
            </Box>
        </Stack>
        <motion.ul 
  className='scrollConfiguration' 
  ref={ref}
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    width: '75vw',
    height: "auto",
    overflowY: "auto",
    marginLeft: '4vw',
    padding: "16px",
    maskImage: undefined
  }}
>
    {filteredStudents.map((item: student, i: number, filteredStudents: student[]) => 
    <Box key={i} sx={{ display: 'flex', justifyContent: 'center' }}>
    <Card sx={{ 
      width: '100%', 
      maxWidth: 350,
      minWidth: 320,
      height: "auto", 
      maxHeight: filteredStudents.length <= 3 ? 470 : 'auto',
      borderRadius: 4, 
      backgroundColor: theme.palette.mode === "dark"? '#0e1217': 'white', 
      boxShadow: '0px 4px 16px rgba(22, 22, 22, 0.15)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardMedia
        component="img"
        alt={`Bandera de ${item.delegation}`}
        height={200}
        image={countriesWithFlags.find((i: flags)=> i.title === item.delegation)?.cdn}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{
          fontFamily: '"Inter", "Roboto", sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.01em'
        }}>
          {item.delegation}
        </Typography>
        <Typography gutterBottom variant="body1" sx={{
          fontWeight: 500,
          fontFamily: '"Inter", "Roboto", sans-serif'
        }}>
          {`${item.name} ${item.lastname}`}
        </Typography>
        <EditableTypography/>
      </CardContent>
      <CardActions sx={{ padding: 2, mt: 'auto' }}>
        <Tooltip title={!committe.find((i: Committe)=> i.committeid === item.committeid)?.committeopen?"La comisión está cerrada": ""} placement='top'>
          <Box width="100%">
        {scores?.find((ite: scoresCalifications)=> ite.scoreid === item.scoreid)?.modified && (
          <Button 
            disabled={!committe.find((i: Committe)=> i.committeid === item.committeid)?.committeopen} 
            variant='contained' 
            color='primary' 
            onClick={()=> {setOpen(true); setCurrent(item)}} 
            fullWidth
            startIcon={<Icon icon="solar:pen-bold" />}
            sx={{
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Modificar
          </Button>
        )}
        {!scores?.find((ite: scoresCalifications)=> ite.scoreid === item.scoreid)?.modified && (
          <Button 
            disabled={!committe.find((i: Committe)=> i.committeid === item.committeid)?.committeopen} 
            variant='contained' 
            color='primary' 
            onClick={()=> {setOpen(true); setCurrent(item)}} 
            fullWidth
            startIcon={<Icon icon="solar:clipboard-check-bold" />}
            sx={{
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Calificar
          </Button>
        )}
        </Box>
        </Tooltip>
      </CardActions>
    </Card>
    </Box>)}
    </motion.ul>
    <ModalCalification open={open} setOpen={setOpen} student={currentStudent} setStudent_={setCurrent} scores={scores} setStudents={setStudents}/>
    </>
  );
}

/* const left = `0%`
const right = `80%`
const leftInset = `20%`
const rightInset = `80%`
const transparent = `#0000`
const opaque = `#000`
function useScrollOverflowMask(scrollYProgress: MotionValue<number>) {
    const maskImage = useMotionValue(
        `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
    )

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        if (value === 0) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
            )
        } else if (value >= 0.95) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            )
        } else {
            const prev = scrollYProgress.getPrevious();
            if (
                (prev !== undefined && prev === 0) ||
                (prev !== undefined && prev >= 0.95)
            ) {
                animate(
                    maskImage,
                    `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
                )
            }
        }
    })

    return maskImage
}*/