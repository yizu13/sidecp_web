import { FormProvider } from 'react-hook-form'
import { ReactNode } from 'react'

type params ={
    onSubmit: (data: any) => void;
    children: ReactNode;
    methods: any;

}

export default function FormManaged({onSubmit, children, methods}: params){

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
                {children}
            </form>
        </FormProvider>
    )
}