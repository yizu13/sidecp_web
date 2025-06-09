import { type ReactNode, useMemo, useState } from "react"
import { SettingsContext } from './contextSettings'
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
  },
});


type props = {
    children: ReactNode
}

export interface ThemeProps {
    theme: any;
    themefunc:  (data: any) => void;
}

export default function SettingsComponent({ children }: props){
    const [isDark, setDark] = useState(false);


    const themeProps = useMemo(()=> ({
        theme: isDark ? darkTheme : lightTheme,
        themefunc: (value: boolean) => {setDark(value)}
    }),[isDark])

    return(
    <SettingsContext.Provider value={themeProps}>{children}</SettingsContext.Provider>
)}