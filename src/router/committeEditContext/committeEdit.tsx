import { useState, type ReactNode } from "react";
import { committeEditContext } from "./committeContextEdit";

type props ={
    children : ReactNode
}

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

export default function CommitteEdit({children}: props){
    const [committeForEdit, setCommitteForEdit] = useState<data | null>(null); 
   
    return(
        <committeEditContext.Provider value={{ committeForEdit, setCommitteForEdit }}>{children}</committeEditContext.Provider>
    )
}