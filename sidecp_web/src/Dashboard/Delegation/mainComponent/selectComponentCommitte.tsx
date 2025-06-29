import { Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { blue } from '@mui/material/colors';
import { alpha } from '@mui/material';

type user = {
  role: string

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

type EditableTypographyProps = {
   variant?: string;
   handleChange?: (event: { target: { value: React.SetStateAction<string> } }) => void;
   selected?: string;
   commities: Committe[]
   user: user
   committeDefined: string | undefined
};


export default function SimpleSelect({selected, handleChange, commities, user, committeDefined} : EditableTypographyProps) {


  return (
    <>
    {user.role !== "admin" && 
    <Chip
    label={committeDefined}
    sx={{ typography: "body1", color: blue[50], backgroundColor: alpha(blue[900], 0.9), fontWeight: "bold", borderRadius: 2, padding: "0 8px", height: 40, ".MuiChip-icon": { marginLeft: 4, marginRight: 0, } }}
          />
    }
    {user.role === "admin" && 
      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Comisión</InputLabel>
       <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selected}
        label="Comisión"
        onChange={handleChange}
      >
        {Array.isArray(commities) && commities.map((committee: Committe) => (
          <MenuItem key={committee.committeid} value={committee.committeid}>
            {committee.committename}
          </MenuItem>
        ))}
      </Select>
    </FormControl>}
    </>
  );
}