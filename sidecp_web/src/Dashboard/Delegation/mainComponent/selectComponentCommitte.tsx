import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCommitties } from '../../../API/userAPI';

type EditableTypographyProps = {
   variant?: string;
   handleChange?: (event: { target: { value: React.SetStateAction<string> } }) => void;
   selected?: string;
};

export default function SimpleSelect({selected, handleChange} : EditableTypographyProps) {

    const [commities, setCommities] = useState()

    useEffect(()=>{
        const data = async ()=>{
           const response = await getCommitties()
           setCommities(response.data)
        }
        data()
    },[])
    console.log(commities)

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">País</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selected}
        label="Comisión"
        onChange={handleChange}
      >
        <MenuItem value="us">Estados Unidos</MenuItem>
        <MenuItem value="mx">México</MenuItem>
        <MenuItem value="do">República Dominicana</MenuItem>
      </Select>
    </FormControl>
  );
}