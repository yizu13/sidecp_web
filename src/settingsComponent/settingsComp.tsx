import { type ReactNode, useMemo, useState } from "react"
import { SettingsContext } from './contextSettings'
import { createTheme, type Theme, type PaletteMode } from '@mui/material/styles';


type props = {
    children: ReactNode
}

export interface ThemeProps {
    theme: Theme;
    themefunc:  (data: string) => void;
}

export default function SettingsComponent({ children }: props){
    const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

    const themeProps = useMemo(()=> ({
        theme: theme,
        themefunc: (value: string) => {
            if (value === 'light' || value === 'dark') {
                setMode(value);
            }
        }
    }),[theme])

    return(
    <SettingsContext.Provider value={themeProps}>{children}</SettingsContext.Provider>
)}