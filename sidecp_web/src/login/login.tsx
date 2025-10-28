import React, { useEffect } from 'react';
import { useSettingContext } from '../settingsComponent/contextSettings';
import BackgroundLogin from './Background';
import Loginform from './LoginForm';
import useDeviceType from './customHookForResponsive';
import { Box } from '@mui/material';

export default function Login() {
  const settings = useSettingContext();
  const { themefunc } = settings;
  document.title = 'SIDECP';
  themefunc('light');

  const device = useDeviceType();

  // Remover márgenes del body
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  console.log(device);

  return (
    <Box sx={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <BackgroundLogin size={device.computadora? "large" : "small" }>
        <Loginform
          size={device.computadora? "large" : "small"}
        />
      </BackgroundLogin>
    </Box>
  );
}
