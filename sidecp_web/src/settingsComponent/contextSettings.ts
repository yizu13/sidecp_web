import { createContext, useContext } from "react";
import type { ThemeProps } from "./settingsComp";

export const SettingsContext = createContext<ThemeProps | undefined>(undefined);

export function useSettingContext(){
    const settings = useContext(SettingsContext);

    if(settings === undefined){
        throw new Error('Check settingsContext');
    }

    return settings;
}