import { axiosIntercep } from "./methods"

export interface RegistrationRequest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface RegistrationRequestData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

/**
 * Crear una nueva solicitud de registro
 */
export const createRegistrationRequest = async (data: RegistrationRequestData) => {
    const response = await axiosIntercep.post('/api/auth/register', data);
    return response.data;
};

/**
 * Obtener todas las solicitudes de registro pendientes
 */
export const getPendingRegistrationRequests = async (page: number = 1, limit: number = 10) => {
    const response = await axiosIntercep.get<PaginatedResponse<RegistrationRequest>>(
        '/api/auth/registration-requests', 
        {
            params: { status: 'pending', page, limit }
        }
    );
    return response.data;
};

/**
 * Aprobar una solicitud de registro
 */
export const approveRegistrationRequest = async (requestId: string, role: 'admin' | 'evaluator') => {
    const response = await axiosIntercep.post(`/api/auth/registration-requests/${requestId}/approve`, {
        role
    });
    return response.data;
};

/**
 * Rechazar una solicitud de registro
 */
export const rejectRegistrationRequest = async (requestId: string, reason?: string) => {
    const response = await axiosIntercep.post(`/api/auth/registration-requests/${requestId}/reject`, {
        reason
    });
    return response.data;
};

/**
 * Obtener el conteo de solicitudes pendientes
 */
export const getPendingRequestsCount = async () => {
    const response = await axiosIntercep.get<{ count: number }>('/api/auth/registration-requests/count');
    return response.data.count;
};
