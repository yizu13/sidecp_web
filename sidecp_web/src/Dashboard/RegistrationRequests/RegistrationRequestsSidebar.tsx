import React, { useEffect, useState, useCallback } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Stack,
    Card,
    CardContent,
    Button,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Avatar,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useSettingContext } from '../../settingsComponent/contextSettings';
import {
    getPendingRegistrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
    RegistrationRequest,
    getRegistrationToken,
    regenerateRegistrationToken,
} from '../../API/registrationRequestsAPI';

interface RegistrationRequestsSidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function RegistrationRequestsSidebar({ open, onClose }: RegistrationRequestsSidebarProps) {
    const { theme } = useSettingContext();
    const [requests, setRequests] = useState<RegistrationRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [selectedRole, setSelectedRole] = useState<'admin' | 'evaluator'>('evaluator');
    const [registrationToken, setRegistrationToken] = useState<string>('');
    const [tokenTimeRemaining, setTokenTimeRemaining] = useState<number>(0);
    const [loadingToken, setLoadingToken] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const loadToken = useCallback(async () => {
        try {
            setLoadingToken(true);
            const tokenData = await getRegistrationToken();
            setRegistrationToken(tokenData.token);
            setTokenTimeRemaining(tokenData.timeRemaining);
        } catch (err: any) {
            console.error('Error loading token:', err);
            setSnackbar({
                open: true,
                message: 'Error al cargar el token',
                severity: 'error',
            });
        } finally {
            setLoadingToken(false);
        }
    }, []);

    const handleRegenerateToken = async () => {
        try {
            setLoadingToken(true);
            const newTokenData = await regenerateRegistrationToken();
            setRegistrationToken(newTokenData.token);
            // Obtener el timeRemaining real del servidor
            const tokenData = await getRegistrationToken();
            setTokenTimeRemaining(tokenData.timeRemaining);
            setSnackbar({
                open: true,
                message: 'Token regenerado exitosamente',
                severity: 'success',
            });
        } catch (err: any) {
            console.error('Error regenerating token:', err);
            setSnackbar({
                open: true,
                message: 'Error al regenerar el token',
                severity: 'error',
            });
        } finally {
            setLoadingToken(false);
        }
    };

    const loadRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPendingRegistrationRequests(1, 50);
            setRequests(response.data);
        } catch (err: any) {
            console.error('Error loading requests:', err);
            setError(err.response?.data?.message || 'Error al cargar las solicitudes');
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos iniciales cuando se abre el drawer
    useEffect(() => {
        if (open) {
            loadRequests();
            loadToken();
        }
    }, [open, loadToken]);

    // Actualizar token cada 5 minutos
    useEffect(() => {
        if (!open) return;

        const interval = setInterval(() => {
            loadToken();
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [open, loadToken]);

    // Contador regresivo - optimizado para evitar re-renders innecesarios
    useEffect(() => {
        if (!open) return;
        if (tokenTimeRemaining <= 0) {
            // Si el token expira, recargar automáticamente
            loadToken();
            return;
        }

        const interval = setInterval(() => {
            setTokenTimeRemaining((prev) => {
                const newValue = Math.max(0, prev - 1);
                // Si llega a 0, refrescar el token
                if (newValue === 0) {
                    setTimeout(() => loadToken(), 1000);
                }
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [open, tokenTimeRemaining > 0, loadToken]); // Cambiado a comparación booleana

    const formatTimeRemaining = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopyToken = () => {
        if (!registrationToken) {
            setSnackbar({
                open: true,
                message: 'No hay token disponible para copiar',
                severity: 'error',
            });
            return;
        }
        
        navigator.clipboard.writeText(registrationToken);
        setSnackbar({
            open: true,
            message: 'Token copiado al portapapeles',
            severity: 'success',
        });
    };

    const handleOpenApproveDialog = (request: RegistrationRequest) => {
        setSelectedRequest(request);
        setSelectedRole('evaluator');
        setApproveDialogOpen(true);
    };

    const handleCloseApproveDialog = () => {
        setApproveDialogOpen(false);
        setSelectedRequest(null);
        setSelectedRole('evaluator');
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;

        setProcessingId(selectedRequest.id);
        handleCloseApproveDialog();
        
        try {
            await approveRegistrationRequest(selectedRequest.id, selectedRole);
            setSnackbar({
                open: true,
                message: `Solicitud aprobada exitosamente como ${selectedRole === 'admin' ? 'Administrador' : 'Evaluador'}`,
                severity: 'success',
            });
            setRequests(requests.filter((r) => r.id !== selectedRequest.id));
        } catch (err: any) {
            console.error('Error approving request:', err);
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Error al aprobar la solicitud',
                severity: 'error',
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId: string) => {
        setProcessingId(requestId);
        try {
            await rejectRegistrationRequest(requestId);
            setSnackbar({
                open: true,
                message: 'Solicitud rechazada',
                severity: 'success',
            });
            setRequests(requests.filter((r) => r.id !== requestId));
        } catch (err: any) {
            console.error('Error rejecting request:', err);
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Error al rechazar la solicitud',
                severity: 'error',
            });
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', sm: '450px', md: '500px' },
                        backgroundColor: theme.palette.mode === 'dark' ? '#141a21' : '#f5f5f5',
                        backgroundImage: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2.5,
                            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : '#e0e0e0'}`,
                            backgroundColor: theme.palette.mode === 'dark' ? '#0e1217' : '#ffffff',
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Icon
                                    icon="mdi:account-multiple-plus"
                                    style={{
                                        fontSize: '28px',
                                        color: theme.palette.primary.main,
                                    }}
                                />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                        Solicitudes de Registro
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {requests.length} {requests.length === 1 ? 'pendiente' : 'pendientes'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <IconButton onClick={onClose} size="small">
                                <Icon icon="mdi:close" style={{ fontSize: '24px' }} />
                            </IconButton>
                        </Stack>

                        {/* Token Card */}
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#1a2027' : '#ffffff',
                                borderRadius: 2,
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Token de Registro
                                    </Typography>
                                    <Chip
                                        label={tokenTimeRemaining > 0 ? formatTimeRemaining(tokenTimeRemaining) : 'Expirado'}
                                        size="small"
                                        color={tokenTimeRemaining > 60 ? 'success' : tokenTimeRemaining > 0 ? 'warning' : 'error'}
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Stack>

                                {loadingToken ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : (
                                    <>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                backgroundColor: theme.palette.mode === 'dark' ? '#0e1217' : '#f5f5f5',
                                                borderRadius: 1,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontWeight: 700,
                                                    letterSpacing: 4,
                                                    color: theme.palette.primary.main,
                                                }}
                                            >
                                                {registrationToken || '--------'}
                                            </Typography>
                                        </Box>

                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Icon icon="mdi:content-copy" />}
                                                onClick={handleCopyToken}
                                                fullWidth
                                                disabled={!registrationToken}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Copiar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<Icon icon="mdi:refresh" />}
                                                onClick={handleRegenerateToken}
                                                fullWidth
                                                disabled={loadingToken}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Regenerar
                                            </Button>
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Content */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                                borderRadius: 4,
                            },
                        }}
                    >
                        {loading && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '200px',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {!loading && !error && requests.length === 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '300px',
                                    textAlign: 'center',
                                    px: 3,
                                }}
                            >
                                <Icon
                                    icon="mdi:clipboard-check-outline"
                                    style={{
                                        fontSize: '80px',
                                        color: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                                        marginBottom: '16px',
                                    }}
                                />
                                <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                    No hay solicitudes pendientes
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Todas las solicitudes han sido procesadas
                                </Typography>
                            </Box>
                        )}

                        {!loading && !error && requests.length > 0 && (
                            <Stack spacing={2}>
                                {requests.map((request) => (
                                    <Card
                                        key={request.id}
                                        sx={{
                                            backgroundColor:
                                                theme.palette.mode === 'dark' ? '#1a2027' : '#ffffff',
                                            boxShadow: theme.shadows[2],
                                            '&:hover': {
                                                boxShadow: theme.shadows[4],
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                            <Stack spacing={2}>
                                                {/* User Info */}
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                            backgroundColor: theme.palette.primary.main,
                                                            fontSize: '1.25rem',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {request.firstName.charAt(0)}
                                                        {request.lastName.charAt(0)}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{ fontWeight: 600, lineHeight: 1.2 }}
                                                        >
                                                            {request.firstName} {request.lastName}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: 'text.secondary', mt: 0.5 }}
                                                        >
                                                            {request.email}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                {/* Description */}
                                                {request.description && (
                                                    <>
                                                        <Divider />
                                                        <Box
                                                            sx={{
                                                                p: 1.5,
                                                                backgroundColor: theme.palette.mode === 'dark' ? '#0e1217' : '#f5f5f5',
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                                                <Icon icon="mdi:message-text" style={{ fontSize: '18px', marginTop: '2px' }} />
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                        Razón de admisión:
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                        {request.description}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                    </>
                                                )}

                                                <Divider />

                                                {/* Details */}
                                                <Box>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Icon icon="mdi:clock-outline" style={{ fontSize: '18px' }} />
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {formatDate(request.createdAt)}
                                                        </Typography>
                                                    </Stack>
                                                </Box>

                                                <Divider />

                                                {/* Actions */}
                                                <Stack direction="row" spacing={1.5}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        fullWidth
                                                        startIcon={<Icon icon="mdi:check" />}
                                                        onClick={() => handleOpenApproveDialog(request)}
                                                        disabled={processingId === request.id}
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: 3,
                                                            },
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        {processingId === request.id ? (
                                                            <CircularProgress size={20} color="inherit" />
                                                        ) : (
                                                            'Aprobar'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        fullWidth
                                                        startIcon={<Icon icon="mdi:close" />}
                                                        onClick={() => handleReject(request.id)}
                                                        disabled={processingId === request.id}
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: 3,
                                                            },
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        Rechazar
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Drawer>

            {/* Dialog for Role Selection */}
            <Dialog
    open={approveDialogOpen}
    onClose={handleCloseApproveDialog}
    maxWidth="xs"
    fullWidth
    PaperProps={{
        sx: {
            bgcolor: theme.palette.mode === 'dark' ? '#1a2027' : 'background.paper',
            borderRadius: 2,
        },
    }}
>
                <DialogTitle sx={{ pb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Icon
                            icon="mdi:shield-account"
                            style={{
                                fontSize: '28px',
                                color: theme.palette.primary.main,
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Seleccionar Rol
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Selecciona el rol que tendrá <strong>{selectedRequest?.firstName} {selectedRequest?.lastName}</strong> en el sistema:
                    </Typography>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                            Rol del usuario
                        </FormLabel>
                        <RadioGroup
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'evaluator')}
                        >
                            <FormControlLabel
                                value="evaluator"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Evaluador
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Puede evaluar estudiantes y ver comités asignados
                                        </Typography>
                                    </Box>
                                }
                                sx={{ mb: 2 }}
                            />
                            <FormControlLabel
                                value="admin"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Administrador
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Acceso completo al sistema y gestión de usuarios
                                        </Typography>
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        onClick={handleCloseApproveDialog}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="success"
                        startIcon={<Icon icon="mdi:check" />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Aprobar como {selectedRole === 'admin' ? 'Admin' : 'Evaluador'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}