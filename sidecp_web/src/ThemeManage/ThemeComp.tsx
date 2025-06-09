import { ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { useSettingContext } from "../settingsComponent/contextSettings";

type props={
    children : ReactNode
}
export default function ThemeComponent({children}: props){
    const settings = useSettingContext()

    const { theme } = settings

    return(
        <ThemeProvider theme={theme}>
              {children}
        </ThemeProvider>
    )
}