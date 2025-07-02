import { Stack } from "@mui/material";
import {
    animate,
    motion,
    MotionValue,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
} from "framer-motion"
import { useRef } from "react"
import { useSettingContext } from "../../settingsComponent/contextSettings";
import { Icon } from "@iconify/react/dist/iconify.js";

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Chrome', value: 275, color: 'hsl(217, 89%, 61%)' },
  { name: 'Safari', value: 200, color: 'hsl(4, 82%, 57%)' },
  { name: 'Firefox', value: 187, color: 'hsl(45, 100%, 51%)' },
  { name: 'Edge', value: 173, color: 'hsl(122, 61%, 41%)' },
  { name: 'Other', value: 90, color: 'hsl(271, 48%, 53%)' }
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Paper 
        elevation={8}
        sx={{ 
          p: 1.5, 
          bgcolor: 'grey.900', 
          color: 'white',
          border: '1px solid',
          borderColor: 'grey.700'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="grey.300">
            {data.name}
          </Typography>
          <Typography 
            variant="body2" 
            fontFamily="monospace" 
            fontWeight="medium"
            sx={{ ml: 'auto' }}
          >
            {data.value.toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

type DataItem = { name: string; value: number; color: string };

function DonutChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredData, setHoveredData] = useState<DataItem | null>(null);
  const { theme } = useSettingContext()
  
  const totalVisitors = data.reduce((sum, item) => sum + item.value, 0);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    setHoveredData(data[index]);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
    setHoveredData(null);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 900, 
        background: theme.palette.mode === "dark"? "transparent": "#f1f1f1",
        backgroundColor: theme.palette.mode === "dark"? "transparent": "#f1f1f1",
        color: theme.palette.mode === "dark"? "#f1f1f1": "#141a21",
        boxShadow: "none"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box mb={3}>
          <Typography variant="h5" fontWeight="semibold" mb={0.5}>
            Pie Chart - Donut with Text
          </Typography>
          <Typography variant="body2" color="grey.400">
            January - June 2024
          </Typography>
        </Box>

        <Box position="relative" height={320} mb={3}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={index === activeIndex ? '#ffffff' : 'transparent'}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    style={{
                      filter: index === activeIndex ? 'brightness(1.1)' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            <Typography 
              variant="h3" 
              component="div" 
              fontWeight="bold"
              sx={{
                fontSize: hoveredData ? '2rem' : '2.5rem',
                transition: 'font-size 0.2s ease-in-out'
              }}
            >
              {hoveredData ? hoveredData.value.toLocaleString() : totalVisitors.toLocaleString()}
            </Typography>
            <Typography 
              variant="body2" 
              color="grey.400" 
              sx={{ mt: 0.5 }}
            >
              {hoveredData ? hoveredData.name : 'Visitors'}
            </Typography>
          </Box>
        </Box>

        <Box textAlign="center" mb={3}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
            <Typography variant="body1" fontWeight="medium">
              Trending up by 5.2% this month
            </Typography>
          </Box>
          <Typography variant="body2" color="grey.400">
            Showing total visitors for the last 6 months
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
}


export default function InicioPage(){
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ container: ref })
    const maskImage = useScrollOverflowMask(scrollYProgress)
    const { theme } = useSettingContext()

    return(

        <motion.ul className='scrollConfiguration' ref={ref} style={{
            width: '80vw', 
            height: '90vh', 
            overflowY: 'auto',
            scrollbarWidth: 'none',
           // backgroundColor: 'lightgray', 
            paddingTop: 2,
            paddingBottom: 2,
            maskImage
        }}>
            <Stack sx={{
                width: '60vw', 
                height: '600px', 
                backgroundColor:  theme.palette.mode === "dark"? "#141a21": "#f1f1f1",
                ml: '6vw', 
                mb: '8vh',
                borderRadius: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: 'inherit',
                flexShrink: 0
                }}>
                {/*<Button variant="contained" sx={{width: "20%"}} onClick={callBack}>hola</Button>*/}
                <DonutChart/>

                    
                    </Stack>
            <Stack sx={{
                width: '60vw', 
                height: '600px', 
                backgroundColor:  theme.palette.mode === "dark"? "#141a21": "#f1f1f1",
                ml: '6vw', 
                mb: '8vh',
                borderRadius: 20,
                flexShrink: 0
                }}></Stack>
            </motion.ul>
                
    )
}

const left = `0%`
const right = `80%`
const leftInset = `20%`
const rightInset = `80%`
const transparent = `#0000`
const opaque = `#000`
function useScrollOverflowMask(scrollYProgress: MotionValue<number>) {
    const maskImage = useMotionValue(
        `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
    )

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        if (value === 0) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
            )
        } else if (value >= 0.95) {
            animate(
                maskImage,
                `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            )
        } else {
            const prev = scrollYProgress.getPrevious();
            if (
                (prev !== undefined && prev === 0) ||
                (prev !== undefined && prev >= 0.95)
            ) {
                animate(
                    maskImage,
                    `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
                )
            }
        }
    })

    return maskImage
}


