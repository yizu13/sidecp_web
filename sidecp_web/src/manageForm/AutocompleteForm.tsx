import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';

type Props = {
  name: string;
  label: string;
  variant: 'outlined' | 'filled' | 'standard';
  sx?: object;
  options: any[] | undefined; 
  getOptionLabel?: (option: any) => string; 

};

const StyledPopper = styled(Popper)(({ theme }) => ({
  '& .MuiAutocomplete-listbox': {
    maxHeight: 300,
    overflowY: 'auto',
    padding: 0,
    margin: 0,

    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.grey[500],
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.grey[200],
    },
  },
}));

export default function AutocompleteController({
  name,
  label,
  variant,
  ...props
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
  name={name}
  control={control}
  render={({ field, fieldState: { error } }) => (
    <Autocomplete
  {...props}
  slots={{ popper: StyledPopper }}
  options={props.options ?? []}
  value={
    props.options?.find(option => option.id === field.value) || null
  }
  onChange={(_, data) => field.onChange(data?.id ?? '')}
  onBlur={field.onBlur}
  getOptionLabel={(option) => option.label || ''} 
  renderInput={(params) => (
    <TextField
      {...params}
      label={label}
      variant={variant}
      error={!!error}
      helperText={error?.message}
    />
  )}
/>
  )}
/>
  );
}