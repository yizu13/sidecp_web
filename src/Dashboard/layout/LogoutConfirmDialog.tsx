import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { useSettingContext } from '../../settingsComponent/contextSettings';
import React from 'react';

interface LogoutConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutConfirmDialog({ open, onClose, onConfirm }: LogoutConfirmDialogProps) {
    const { theme } = useSettingContext();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 4,
                        maxWidth: 480,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                    }
                }
            }}
        >
            <DialogTitle sx={{ p: 3, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Icon 
                        icon="solar:logout-bold" 
                        style={{ 
                            fontSize: '24px', 
                            color: theme.palette.warning.main 
                        }} 
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#333'
                        }}
                    >
                        Confirmar Cierre de Sesión
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Typography
                    sx={{
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 400,
                        fontSize: '1rem',
                        color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
                        lineHeight: 1.5
                    }}
                >
                    ¿Estás seguro de que deseas cerrar sesión? Serás redirigido a la página de inicio de sesión.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    startIcon={<Icon icon="solar:close-circle-bold" />}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        color: theme.palette.mode === 'dark' ? '#cccccc' : '#666',
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ddd'}`,
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                            borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    startIcon={<Icon icon="solar:check-circle-bold" />}
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        textTransform: 'none',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        backgroundColor: theme.palette.warning.main,
                        '&:hover': {
                            backgroundColor: theme.palette.warning.dark,
                            boxShadow: '0px 4px 12px rgba(255, 152, 0, 0.3)',
                        }
                    }}
                >
                    Cerrar Sesión
                </Button>
            </DialogActions>
        </Dialog>
    );
}
