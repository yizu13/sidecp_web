import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'
import { Icon } from '@iconify/react'
import { useSettingContext } from '../../settingsComponent/contextSettings'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info'
  icon?: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ open, title, description, confirmText = 'Confirmar', cancelText = 'Cancelar', confirmColor = 'error', icon = 'solar:question-circle-bold', onClose, onConfirm }: ConfirmDialogProps){
  const { theme } = useSettingContext()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Icon icon={icon} style={{ fontSize: 24, color: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.error.main }} />
          <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif', color: theme.palette.mode === 'dark' ? '#cccccc' : '#666', lineHeight: 1.6 }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
        <Button onClick={onClose} startIcon={<Icon icon="solar:close-circle-bold" />} sx={{ borderRadius: 2, px: 3, textTransform: 'none' }} variant='outlined'>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" startIcon={<Icon icon="solar:check-circle-bold" />} sx={{ borderRadius: 2, px: 3, textTransform: 'none' }} fullWidth>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


