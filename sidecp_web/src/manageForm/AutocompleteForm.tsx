import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  variant: 'outlined' | 'filled' | 'standard';
  sx?: object;
  options: any[]; 
  getOptionLabel?: (option: any) => string; 

};

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
          value={field.value || null}
          onChange={(_, data) => field.onChange(data)}
          onBlur={field.onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant={variant}
              error={!!error}
              helperText={error?.message}
              sx={{width: "15vw"}}
            />
          )}
        />
      )}
    />
  );
}