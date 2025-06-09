import { axiosIntercep } from './authProvider'

export const userData = async () =>{
    const response = await axiosIntercep.get("/userInfo")
    return response.data
}