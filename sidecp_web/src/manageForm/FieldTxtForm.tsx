import { useCallback, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Icon } from '@iconify/react';

type props = {
    name: string;
    label: string;
    variant: 'outlined' | 'filled' | 'standard';
}

export default function FieldTForm({ name, label, variant }: props){
    const { control } = useFormContext();
    const [show, setShow] = useState(false)

    const placeHolderFunc = useCallback((param: string)=>{
        if(param == 'email'){
            return "M20-0080@ipl.edu.do"
        } else if(param == 'password'){
            return "password@123"
        }else{
            return undefined
        }
    }, [])

    return(
        <Controller 
        name={name}
        control={control}
        render={({ field, fieldState: {error} }) => (
            <TextField 
            {...field}
            id={name}
            label={label} 
            variant={variant}
            error={!!error}
            helperText={error?.message}
            type={name.toLowerCase() === 'password' && !show ? "password": undefined}
            fullWidth
            placeholder={placeHolderFunc(name.toLowerCase())}
            {...(name.toLowerCase() === 'password' && {
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon
                        icon={
                          show
                            ? 'ion:eye'
                            : 'ion:eye-off'
                        }
                        onClick={() => setShow(!show)}
                        cursor='pointer'
                      />
                    </InputAdornment>
                  ), startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        icon='ant-design:key-outlined'
                        cursor='pointer'
                      />
                    </InputAdornment>
                  )
                },
              })}
              {...(name.toLowerCase() === 'email' && {
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        icon="line-md:email-alt-twotone"
                        cursor='default'
                      />
                    </InputAdornment>
                  ),
                },
              })}
            />
          )}
        />
    )
}