import { axiosIntercep } from "./methods"

export const userData = async () =>{
    const response = await axiosIntercep.get("/userInfo")
    return response.data
}

export const createCommitte = async (payload: object)=>{
    const response = await axiosIntercep.post("/createCommitte",payload);
    return response
}

export const getEventsById = async (id: string)=>{
    const response = await axiosIntercep.get(`/events/${id}`);
    return response
}