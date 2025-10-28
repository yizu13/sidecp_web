import { motion, AnimatePresence } from 'framer-motion'
import { Box, Stack } from '@mui/material';
import { ReactNode } from 'react';
import React from 'react';

type componentsReact = {
    children: ReactNode,
    change: string
}

export default function MainBackground({children, change}: componentsReact){
    return(
        <>
        <AnimatePresence>
        <motion.div
          key={change}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{opacity: 0.5 }}
          transition={{ duration: 1.8 }}
        >
          <Box
            component="img"
            src={change}
            alt="background"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: "auto",
              height: '100vh',
              zIndex: 0,
              transform: 'scale(1)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      <Box
        component="img"
        src="/logo.png"
        sx={{
          position: 'absolute',
          width: '10vw',
          height: 'auto',
          top: 10,
          left: 0
        }}
      />
      <Stack
        sx={{
            background: 'linear-gradient(135deg, #1E3A8A, #416dc4, #1E3A8A)',
            animation: 'gradientMove 10s ease infinite',
            width: '80vw',
            height: '100vh',
            zIndex: 1,
            clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
            top: 0,
            right: 0,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            '@keyframes gradientMove': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
            }
          }}
      >
        {children}
      </Stack>
      </>
    )
}