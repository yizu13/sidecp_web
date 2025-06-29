import { useState, type SetStateAction } from 'react';
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

type dataListMock = {
    title: string
    name: string
    lastName: string
}
type flags = {
    title: string
    cdn: string
}

export default function DelegationEval(){
    const [selected, setSelected] = useState('');

    const dataListMock = [
        {title: "Estados Unidos", name: "Jesús Alexander", lastName: "Hernández de los Santos" },
        {title: "Arabia Saudita", name: "Jesús Alexander", lastName: "Hernández de los Santos" },
        {title: "Arabia Saudita", name: "Jesús Alexander", lastName: "Hernández de los Santos" },
        {title: "Arabia Saudita", name: "Jesús Alexander", lastName: "Hernández de los Santos" }
    ]
      const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelected(event.target.value);
    console.log("Seleccionado:", event.target.value);
  };

    return (
        <>
        <Stack display="flex" flexDirection="row" justifyContent="center" alignContent="end" sx={{width: "100%"}}>
            <Box width="15vw" sx={{mb: 2}}>
            <SimpleSelect handleChange={handleChange} selected={selected}/>
            </Box>
        </Stack>
        <Stack sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            maxWidth: '80vw', 
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
    {dataListMock.map((item: dataListMock, i: number) => 
    <Stack key={i} sx={{p: 2}}>
    <Card sx={{ maxWidth: 350, height: "auto", borderRadius: 4 }}>
      <CardMedia
        component="img"
        alt={`Bandera de ${item.title}`}
        height={200}
        image={countriesWithFlags.find((i: flags)=> i.title === item.title)?.cdn}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.title}
        </Typography>
        <Typography gutterBottom variant="body1" sx={{fontWeight: "bold"}}>
          {`${item.name} ${item.lastName}`}
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