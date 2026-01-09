import axiosInstance from "./axiosServer"; // ← CAMBIAR de axiosLog a axiosInstance

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
 * Crear una nueva solicitud de registro (pública, sin token)
 * ESTA sí usa axiosLog porque es pública
 */
import axiosLog from "./AxiosLogServer";
export const createRegistrationRequest = async (data: RegistrationRequestData) => {
    const response = await axiosLog.post('/api/auth/register', data);
    return response.data;
};

/**
 * Obtener todas las solicitudes de registro pendientes (requiere auth)
 */
export const getPendingRegistrationRequests = async (page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<RegistrationRequest>>(
        '/api/auth/registration-requests',
        {
            params: { status: 'pending', page, limit }
        }
    );
    return response.data;
};

/**
 * Aprobar una solicitud de registro (requiere auth)
 */
export const approveRegistrationRequest = async (requestId: string, role: 'admin' | 'evaluator') => {
    const response = await axiosInstance.post(`/api/auth/registration-requests/${requestId}/approve`, {
        role
    });
    return response.data;
};

/**
 * Rechazar una solicitud de registro (requiere auth)
 */
export const rejectRegistrationRequest = async (requestId: string, reason?: string) => {
    const response = await axiosInstance.post(`/api/auth/registration-requests/${requestId}/reject`, {
        reason
    });
    return response.data;
};

/**
 * Obtener el conteo de solicitudes pendientes (requiere auth)
 */
export const getPendingRequestsCount = async () => {
    const response = await axiosInstance.get<{ count: number }>('/api/auth/registration-requests/count');
    return response.data.count;
};

/**
 * Obtener el token de registro actual (requiere auth)
 */
export const getRegistrationToken = async () => {
    const response = await axiosInstance.get<{
        token: string;
        expiresAt: string;
        timeRemaining: number;
        generatedAt: string;
    }>('/api/auth/registration-token');
    return response.data;
};

/**
 * Validar un token de registro (pública)
 */
export const validateRegistrationToken = async (token: string) => {
    const response = await axiosLog.post<{
        valid: boolean;
        message: string;
        timeRemaining?: number;
    }>('/api/auth/registration-token/validate', { token });
    return response.data;
};

/**
 * Regenerar el token de registro (requiere auth)
 */
export const regenerateRegistrationToken = async () => {
    const response = await axiosInstance.post('/api/auth/registration-token/regenerate');
    return response.data;
};