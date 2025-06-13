import { axiosIntercep } from "./methods"

export const userData = async () =>{
    const response = await axiosIntercep.get("/userInfo")
    return response.data
}