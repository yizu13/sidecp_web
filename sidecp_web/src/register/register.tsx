import React, { useEffect } from 'react';
import { useSettingContext } from '../settingsComponent/contextSettings';
import BackgroundLogin from '../login/Background';
import RegisterForm from './RegisterForm';
import useDeviceType from '../login/customHookForResponsive';
import { Box } from '@mui/material';

export default function Register() {
  const settings = useSettingContext();
  const { themefunc } = settings;
  document.title = 'SIDECP - Registro';
  themefunc('light');

  const device = useDeviceType();

  // Remover márgenes del body
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box sx={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', height: 'auto', overflowX: 'hidden', overflowY: 'auto' }}>
      <BackgroundLogin size={device.computadora ? "large" : "small"}>
        <RegisterForm size={device.computadora ? "large" : "small"} />
      </BackgroundLogin>
    </Box>
  );
}
