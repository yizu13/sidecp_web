import { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function EditableTypography({ variant = 'body2' }) {
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(false);

  const handleBlur = () => setEditing(false);
  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter') setEditing(false);
  };

  return (<>
    {editing ? (
    <TextField
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      variant="standard"
      fullWidth
      autoFocus
      multiline
      sx={{pt: 2}}
    />
  ) : (
    <Typography
      typography={variant}
      onClick={() => setEditing(true)}
      sx={{ cursor: 'text', pt: 2, textWrap: "wrap" }}>
      {value}
    </Typography>)}
    {(!value && !editing) && <Typography sx={{cursor: 'text'}} onClick={() => setEditing(true)}>
        Coloque una nota temporal
        </Typography>}
    </>
 );
}