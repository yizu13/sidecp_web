import React, { useState, useEffect, ReactNode } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveBackgroundProps {
  children?: ReactNode;
}

// Gradientes azules suaves y sutiles
const gradients: string[] = [
  'linear-gradient(135deg, #3860B5 0%, #2F5394 50%, #3860B5 100%)', 
'linear-gradient(135deg, #3B67BD 0%, #3256A0 50%, #3B67BD 100%)', 
'linear-gradient(135deg, #3459A8 0%, #2C4D8E 50%, #3459A8 100%)',
'linear-gradient(135deg, #3A5EB3 0%, #2F509A 50%, #3A5EB3 100%)',
];

const ResponsiveBackground: React.FC<ResponsiveBackgroundProps> = ({ children }) => {
  const [currentBg, setCurrentBg] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % gradients.length);
    }, 12000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.9 }}
          transition={{ duration: 3 }} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: gradients[currentBg],
              backgroundSize: '200% 200%',
              animation: 'gradientMove 15s ease infinite', 
            }}
          />
        </motion.div>
      </AnimatePresence>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveBackground;
