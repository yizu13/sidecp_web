import { useEffect, useState, type SetStateAction } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material' 
import EditableTypography from './editableTypography';
import { countriesWithFlags } from "../../../../public/flags"
import SimpleSelect from './selectComponentCommitte';
import { getStudents } from '../../../API/userAPI';
import { getCommitties, getEvaluator } from '../../../API/userAPI';


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
}

export default function DelegationEval(){
    const [selected, setSelected] = useState('');
    const [students, setStudents] = useState<student[]>([]);
    const [studentsFiltered, setStudentFilter] = useState<student[]>([]);
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const [ committeDefined, setCommitteDef ] = useState<string | undefined>(undefined);
    const [commities, setCommities] = useState<Committe[]>([]);
    const [committeId, setCommitteId] = useState('');

      const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelected(event.target.value);
  };
  
  useEffect(()=>{
    const studentData = async ()=>{
      const response = await getStudents()
      setStudents(response.data.students)
    }
    studentData()
  },[selected])

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
          setCommitteDef(commities.find(i=> i.committeid === data.data.evaluator.committeid)?.committename)
          setCommitteId(commities.find(i=> i.committeid === data.data.evaluator.committeid)?.committeid ?? '')
        }
        userCommitte()
      },[commities, user])

     useEffect(()=>{
            const data = async ()=>{
               const response = await getCommitties()
               setCommities(response.data.committies)
            }
            data()
        },[])

    return (
        <>
        <Stack display="flex" flexDirection="row" justifyContent="center" alignContent="end" sx={{width: "100%"}}>
            <Box width="15vw" sx={{mb: 2}}>
            <SimpleSelect handleChange={handleChange} selected={selected} committeDefined={committeDefined} commities={commities} user={user}/>
            </Box>
        </Stack>
        <Stack sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: '75vw', 
            overflowY: "auto",
            ml: '4vw', 
            mb: '8vh',
            '&::-webkit-scrollbar': {
            width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
            },
            '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            },
        }} columnGap={13}>
    {studentsFiltered.map((item: student, i: number) => 
    <Stack key={i} sx={{p: 2}}>
    <Card sx={{ maxWidth: 350, height: "auto", borderRadius: 4 }}>
      <CardMedia
        component="img"
        alt={`Bandera de ${item.delegation}`}
        height={200}
        image={countriesWithFlags.find((i: flags)=> i.title === item.delegation)?.cdn}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.delegation}
        </Typography>
        <Typography gutterBottom variant="body1" sx={{fontWeight: "bold"}}>
          {`${item.name} ${item.lastname}`}
        </Typography>
        <EditableTypography/>
      </CardContent>
      <CardActions sx={{padding: 2}}>
        <Button variant='contained' color='primary' fullWidth>Calificar</Button>
      </CardActions>
    </Card>
    </Stack>)}
    </Stack>
    </>
  );
}