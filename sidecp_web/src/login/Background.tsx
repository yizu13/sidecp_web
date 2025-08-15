import { Box, Stack } from '@mui/material';
import { type ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react';

type componentsReact = {
    children: ReactNode
}

export default function BackgroundLogin({ children } : componentsReact){
    const route_ = '/photos_changes/'
    const imageList = [`${route_}victor_background.png`, `${route_}prof_ariela.png`, 
        `${route_}another_img.png`];
    const [change, setchange] = useState(imageList[0])

    useEffect(()=>{
        const timer = setTimeout(()=>{
        const currentImage = imageList.findIndex(element => element === change);
        let nextImage = currentImage + 1;
        if(imageList.length - 1 < nextImage){
            nextImage = 0
        }
        setchange(imageList[nextImage])
        }, 12000)

        return () => clearTimeout(timer);
    },[change])
    
    return (
    <Stack display="flex" justifyContent="end" alignItems="end" >
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
    </Stack>
  );
}