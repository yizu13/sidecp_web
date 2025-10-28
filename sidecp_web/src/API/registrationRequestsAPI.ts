import { axiosIntercep } from "./methods"

export interface RegistrationRequest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    description?: string;
    registrationToken?: string;
    createdAt: string;
}

export interface RegistrationRequestData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    description?: string;
    registrationToken: string;
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

/**
 * Obtener el token de registro actual
 */
export const getRegistrationToken = async () => {
    const response = await axiosIntercep.get<{
        token: string;
        expiresAt: string;
        timeRemaining: number;
        generatedAt: string;
    }>('/api/auth/registration-token');
    return response.data;
};

/**
 * Validar un token de registro
 */
export const validateRegistrationToken = async (token: string) => {
    const response = await axiosIntercep.post<{
        valid: boolean;
        message: string;
        timeRemaining?: number;
    }>('/api/auth/registration-token/validate', { token });
    return response.data;
};

/**
 * Regenerar el token de registro
 */
export const regenerateRegistrationToken = async () => {
    const response = await axiosIntercep.post('/api/auth/registration-token/regenerate');
    return response.data;
};
