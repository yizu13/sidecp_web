import { createContext, useContext } from "react";

type data ={
    committeId: number 
    committeName: string 
    creationDate: string 
    description: string 
    id: string 
    topic: string 
    events: string | undefined
    location: string | undefined
    institutionRepresentated: string | undefined
}

type context = {
    committeForEdit: data | null 
    setCommitteForEdit: (info: data | null)=> void
}

export const committeEditContext = createContext<context  | undefined>(undefined)

export function useEditCommitte(){
    const committe = useContext(committeEditContext);

    if(committe === undefined){
        throw new Error("Check setting Context");
    }
    return committe
}