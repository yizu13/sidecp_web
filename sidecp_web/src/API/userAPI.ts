import { axiosIntercep } from "./methods"

export const userData = async () =>{
    const response = await axiosIntercep.get("/userInfo")
    return response.data
}

export const createCommitte = async (payload: object)=>{
    const response = await axiosIntercep.post("/committes",payload);
    return response
}

export const getEventsById = async (id: string)=>{
    const response = await axiosIntercep.get(`/committes/events/${id}`);
    return response
}

export const getUsers = async ()=>{
    const response = await axiosIntercep.get(`/users`);
    return response
}

export const getCommitties = async ()=>{
    const response = await axiosIntercep.get(`/committes`);
    return response
}

export const getEvaluators = async ()=>{
    const response = await axiosIntercep.get(`/evaluators`);
    return response
}

export const getEvaluator = async (id: string)=>{
    const response = await axiosIntercep.get(`/evaluators/${id}`);
    return response
}

type evaluatorInfo = {
    committeId: string
    userId: string
    evaluatorId: string | undefined
}

export const createEvaluator = async (payload: evaluatorInfo)=>{
    const response = await axiosIntercep.post(`/evaluators`, payload);
    return response
}

export const deleteEvaluator = async (id: string)=>{
    const response = await axiosIntercep.delete(`/evaluators/${id}`);
    return response
}

export const deleteCommitte = async (id: string)=>{
    const response = await axiosIntercep.delete(`/committes/${id}`);
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
    const response = await axiosIntercep.post(`/students`, payload)
    return response
}

export const getStudents = async () =>{
    const response = await axiosIntercep.get("/students");
    return response
}

export const deleteStudent = async (id: string)=>{
    const response = await axiosIntercep.delete(`/students/${id}`);
    return response
}

type scores = {
    scoreId: string | undefined,
    investigacionAnalisis: number,
    pensamientoCritico: number,
    oratoria: number,
    argumentacion: number,
    redaccion: number,
    negociacion: number,
    resolucionConflictos: number,
    liderazgo: number,
    colaboracion: number
}

export const scoresUpdate = async (payload: scores) => {
    // Transformar los nombres de camelCase a snake_case para el backend
    const backendPayload = {
        scoreId: payload.scoreId,
        investigacion_analisis: payload.investigacionAnalisis,
        pensamiento_critico: payload.pensamientoCritico,
        oratoria: payload.oratoria,
        argumentacion: payload.argumentacion,
        redaccion: payload.redaccion,
        negociacion: payload.negociacion,
        resolucion_conflictos: payload.resolucionConflictos,
        liderazgo: payload.liderazgo,
        colaboracion: payload.colaboracion
    };
    const response = await axiosIntercep.post(`/scores`, backendPayload);
    return response
}

export const getScores = async ()=>{
    const response = await axiosIntercep.get("/scores");
    return response;
}

export const openCommitte = async (id: string)=>{
    const response = await axiosIntercep.post(`/committes/open/${id}`)
    return response
}

export const closeCommitte = async (id: string)=>{
    const response = await axiosIntercep.post(`/committes/close/${id}`)
    return response
}
