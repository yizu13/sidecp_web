import { Box } from '@mui/material';
import { type ReactNode, useEffect, useState } from 'react';
import React from 'react';
import MainBackground from './differentsBackgrounds/mainBackground';
import ResponsiveBackground from './differentsBackgrounds/responsiveBackground';

type componentsReact = {
    children: ReactNode
    size: string
}

export default function BackgroundLogin({ children, size } : componentsReact){
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[change])
    
    return (
    <Box sx={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {size === "large" && <MainBackground children={children} change={change}/>}
      {size === "small" && <ResponsiveBackground children={children}/>}
    </Box>
  );
}
