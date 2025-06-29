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

export const getUsers = async ()=>{
    const response = await axiosIntercep.get(`/users`);
    return response
}

export const getCommitties = async ()=>{
    const response = await axiosIntercep.get(`/committies`);
    return response
}

export const getEvaluators = async ()=>{
    const response = await axiosIntercep.get(`/evaluators`);
    return response
}

export const getEvaluator = async (id: string)=>{
    const response = await axiosIntercep.get(`/evaluator/${id}`);
    return response
}

type evaluatorInfo = {
    committeId: string
    userId: string
    evaluatorId: string | undefined
}

export const createEvaluator = async (payload: evaluatorInfo)=>{
    const response = await axiosIntercep.post(`/createEvaluators`, payload);
    return response
}

export const deleteEvaluator = async (id: string)=>{
    const response = await axiosIntercep.delete(`/evaluators/${id}`);
    return response
}

export const deleteCommitte = async (id: string)=>{
    const response = await axiosIntercep.delete(`/committies/${id}`);
    return response;
}

type row = { 
  name: string | undefined
  lastName: string | undefined
  committeId: string | undefined
  studentId: string | undefined
  delegation : string | undefined
  scoreId: string | undefined
}

export const createStudent = async(payload: row)=>{
    const response = await axiosIntercep.post(`/createStudents`, payload)
    return response
}

export const getStudents = async () =>{
    const response = await axiosIntercep.get("/students");
    return response
}

export const deleteStudent = async (id: string)=>{
    const response = await axiosIntercep.delete(`/student/${id}`);
    return response
}