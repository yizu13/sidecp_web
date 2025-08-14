import { Stack } from "@mui/material";
import {
    animate,
    motion,
    MotionValue,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
} from "framer-motion"
import {useEffect, useRef } from "react"
import { useSettingContext } from "../../settingsComponent/contextSettings";

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { getStudents, getCommitties, getScores } from "../../API/userAPI";
import React from "react";

const getDateIntervalSpanish = (format = 'long') => {
  const today = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  
  const months = {
    long: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    short: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]
  };
  
  const monthNames = months[format] || months.long;
  
  const startMonth = monthNames[twoMonthsAgo.getMonth()];
  const endMonth = monthNames[today.getMonth()];
  const startYear = twoMonthsAgo.getFullYear();
  const endYear = today.getFullYear();
  
  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${endYear}`;
  } else {
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  }
};

type DataItem = { name: string; value: number; color: string;  committeid: string};
type Committe = {
    committeid: string
    committename: string
    creationdate: string
    description: string
    events: string
    location: string
    relatedinstitution: string
    topic: string
}

type student = {
  committeid: string
  studentid: string
  name: string
  lastname: string
  delegation: string
  scoreid: string
}

type scores = {
    scoreid: string | undefined,
    knowledgeskills: number,
    negotiationskills: number,
    communicationskills: number,
    interpersonalskills: number,
    analyticalskills: number
}

function DonutChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredData, setHoveredData] = useState<DataItem | null>(null);
  const [totalStudents, setStudents] = useState([]);
  const [data, setData] = useState<DataItem[]>([]); 
  const [loading, setLoading] = useState(true);
  const { theme } = useSettingContext();

  const generateBlueColorPalette = (committees: Committe[]) => {
    return committees.map((_, index) => {
      const baseHue = 220; 
      const hueVariation = 40; 
      const hue = baseHue + ((index * hueVariation) / committees.length) - (hueVariation / 2);
      
      const saturation = 65 + (index * 15) % 25; 
      const lightness = 45 + (index * 10) % 25; 
      
      return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [studentsResponse, committeesResponse] = await Promise.all([
          getStudents(),
          getCommitties()
        ]);

        const students = studentsResponse.data.students;
        const committees = committeesResponse.data.committies;

        setStudents(students);

        const colors = generateBlueColorPalette(committees);

        const chartData = committees.map((committee: Committe, index: number) => ({
          name: committee.committename,
          value: students.filter((student: student) => student.committeid === committee.committeid).length,
          color: colors[index],
          committeid: committee.committeid 
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    setHoveredData(data[index]);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
    setHoveredData(null);
  };

  if (loading) {
    return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, bottom: 0,
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
        zIndex: 1300,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              animation: 'bounce 0.6s infinite',
              animationDelay: `${i * 0.2}s`,
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-12px)' },
              },
            }}
          />
        ))}
      </Box>
    </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Card sx={{ 
        width: '100%',
        maxWidth: 1100,
        height: 700,
        background: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        backgroundColor: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        boxShadow: "none",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography>No hay datos disponibles</Typography>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: 900,
        height: 600,
        background: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        backgroundColor: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        color: theme.palette.mode === "dark" ? "#f1f1f1" : "#141a21",
        boxShadow: "none"
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box mb={2}>
          <Typography variant="h5" fontWeight="semibold" mb={0.5}>
            Cantidad de estudiantes en el sistema
          </Typography>
          <Typography variant="body2" color="grey.400">
            {getDateIntervalSpanish()}
          </Typography>
        </Box>

        <Box display="flex" flex={1} alignItems="center" gap={3}>
          {/* Contenedor del gráfico con más espacio */}
          <Box 
            position="relative" 
            flex={1} 
            height="100%" 
            minHeight="500px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ 
              minWidth: '500px', // Ancho mínimo para evitar cortes
              overflow: 'visible' // Permite que el gráfico se muestre completamente
            }}
          >
            <ResponsiveContainer width="100%" height="100%" minHeight={500}>
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%" // Radio interno más grande para menor grosor
                  outerRadius="80%" // Radio externo mucho más grande
                  paddingAngle={1} // Pequeño espacio entre segmentos
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${entry.committeid || index}`}
                      fill={entry.color}
                      stroke={index === activeIndex ? '#ffffff' : 'transparent'}
                      strokeWidth={index === activeIndex ? 3 : 0}
                      style={{
                        filter: index === activeIndex ? 'brightness(1.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Texto central del donut */}
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
                  fontSize: hoveredData ? '3rem' : '3.5rem',
                  transition: 'font-size 0.2s ease-in-out'
                }}
              >
                {hoveredData ? hoveredData.value.toLocaleString() : totalStudents.length.toLocaleString()}
              </Typography>
              <Typography 
                variant="body2" 
                color={theme.palette.mode === "dark" ? "#f1f1f1" : "#141a21"} 
                sx={{ mt: 0.5 }}
              >
                {hoveredData ? hoveredData.name : 'Total de estudiantes'}
              </Typography>
            </Box>
          </Box>

          {/* Panel de información lateral */}
          <Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center"
            sx={{ 
              width: { xs: '100%', md: '300px' }, // Responsive width
              minWidth: '280px',
              textAlign: 'center' 
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
              <Typography variant="body1" fontWeight="medium">
                Esta estadística muestra el total de estudiantes que se encuentran registrados
                con el objetivo de ver el flujo de trabajo.
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400">
              Cada comisión contiene una cantidad de estudiantes determinados.
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

interface RadarDataItem {
  skill: string;
  value: number;
  fullMark: 100;
}

function RadarScoresChart() {
  const [data, setData] = useState<RadarDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalScores, setTotalScores] = useState<scores[]>([]);
  const [popularScore, setPopularScore] = useState(0);
  const { theme } = useSettingContext();

  // Función para determinar el rango de una puntuación
  const getScoreRange = (score: number): string => {
    if (score >= 0 && score < 50) return '0-50';
    if (score >= 50 && score < 70) return '50-70';
    if (score >= 70 && score < 90) return '70-90';
    if (score >= 90 && score <= 100) return '90-100';
    return '0-50'; // default
  };

  const calculateModeByRange = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    
    
    const rangeGroups: { [key: string]: number[] } = {
      '0-50': [],
      '50-70': [],
      '70-90': [],
      '90-100': []
    };
    

    numbers.forEach(num => {
      const range = getScoreRange(num);
      rangeGroups[range].push(num);
    });
    
    console.log('Range groups:', rangeGroups);
    
    // Encontrar el rango con más elementos (moda)
    let maxCount = 0;
    let modeRange = '0-50';
    
    Object.keys(rangeGroups).forEach(range => {
      if (rangeGroups[range].length > maxCount) {
        maxCount = rangeGroups[range].length;
        modeRange = range;
      }
    });
    
    console.log('Mode range:', modeRange, 'with count:', maxCount);
    
    // Calcular el promedio del rango más popular
    const modeRangeNumbers = rangeGroups[modeRange];
    if (modeRangeNumbers.length === 0) return 0;
    
    const sum = modeRangeNumbers.reduce((acc, num) => acc + num, 0);
    const average = Math.round(sum / modeRangeNumbers.length);
    
    console.log('Average of mode range:', average);
    
    return average;
  };

  // Función para obtener la moda general por rangos de todas las habilidades
  const calculateOverallModeByRange = (scores: scores[]): number => {
    if (scores.length === 0) return 0;
    
    const allValues: number[] = [];
    scores.forEach(score => {
      allValues.push(
        score.knowledgeskills,
        score.negotiationskills,
        score.communicationskills,
        score.interpersonalskills,
        score.analyticalskills
      );
    });
    
    return calculateModeByRange(allValues);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Reemplaza con tu función para obtener las puntuaciones
        const scoresResponse = await getScores(); // Asume que tienes esta función
        const scores: scores[] = scoresResponse.data.scores.map((item: scores)=>({
          scoresid: item.scoreid,
          knowledgeskills: Number(item.knowledgeskills),
          negotiationskills: Number(item.negotiationskills),
          communicationskills: Number(item.communicationskills),
          interpersonalskills: Number(item.interpersonalskills),
          analyticalskills: Number(item.analyticalskills)
        }));

        setTotalScores(scores);


        const knowledgeMode = calculateModeByRange(scores.map(s => s.knowledgeskills));
        const negotiationMode = calculateModeByRange(scores.map(s => s.negotiationskills));
        const communicationMode = calculateModeByRange(scores.map(s => s.communicationskills));
        const interpersonalMode = calculateModeByRange(scores.map(s => s.interpersonalskills));
        const analyticalMode = calculateModeByRange(scores.map(s => s.analyticalskills));

        const radarData: RadarDataItem[] = [
          {
            skill: 'Conocimiento',
            value: knowledgeMode,
            fullMark: 100
          },
          {
            skill: 'Negociación',
            value: negotiationMode,
            fullMark: 100
          },
          {
            skill: 'Comunicación',
            value: communicationMode,
            fullMark: 100
          },
          {
            skill: 'Interpersonal',
            value: interpersonalMode,
            fullMark: 100
          },
          {
            skill: 'Analítico',
            value: analyticalMode,
            fullMark: 100
          }
        ];

        setData(radarData);
        setPopularScore(calculateOverallModeByRange(scores));
        
      } catch (error) {
        console.error('Error fetching scores data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0, bottom: 0,
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
          zIndex: 1300,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[0, 1, 2].map(i => (
            <Box
              key={i}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                animation: 'bounce 0.6s infinite',
                animationDelay: `${i * 0.2}s`,
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-12px)' },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Card sx={{ 
        width: 788,
        height: 600,
        background: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        backgroundColor: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        boxShadow: "none",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography>No hay datos de puntuaciones disponibles</Typography>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        width: 940,
        height: 600,
        background: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        backgroundColor: theme.palette.mode === "dark" ? "transparent" : "#f1f1f1",
        color: theme.palette.mode === "dark" ? "#f1f1f1" : "#141a21",
        boxShadow: "none"
      
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box mb={2}>
          <Typography variant="h5" fontWeight="semibold" mb={0.5}>
            Puntuaciones más populares por habilidades
          </Typography>
          <Typography variant="body2" color="grey.400">
            {getDateIntervalSpanish()}
          </Typography>
        </Box>

        <Box display="flex" flex={1} alignItems="center" gap={3}>
          <Box position="relative" flex={1} height="100%" minHeight="350px">
            <ResponsiveContainer width="100%" height="100%" minHeight={350}>
              <RadarChart 
                data={data} 
                margin={{ 
                  top: 40, 
                  right: 80, 
                  bottom: 40, 
                  left: 80 
                }}
              >
                <PolarGrid 
                  stroke={theme.palette.mode === "dark" ? "#374151" : "#d1d5db"}
                />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ 
                    fill: theme.palette.mode === "dark" ? "#f1f1f1" : "#141a21",
                    fontSize: 12,
                    fontFamily: '"Inter", "Roboto", sans-serif'
                  }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ 
                    fill: theme.palette.mode === "dark" ? "#9ca3af" : "#6b7280",
                    fontSize: 10,
                    fontFamily: '"Inter", "Roboto", sans-serif'
                  }}
                />
                <Radar
                  name="Puntuación Promedio"
                  dataKey="value"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.main}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ 
                    fill: theme.palette.primary.main, 
                    strokeWidth: 2, 
                    r: 4 
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: theme.palette.mode === "dark" ? "#f1f1f1" : "#141a21",
                    fontFamily: '"Inter", "Roboto", sans-serif'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
            
            {/* Indicador central con promedio general */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                bgcolor: theme.palette.mode === "dark" ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography 
                variant="h6" 
                component="div" 
                fontWeight="bold"
                sx={{ fontSize: '1.5rem' }}
              >
                {popularScore}
              </Typography>
              <Typography 
                variant="caption" 
                color={theme.palette.mode === "dark" ? "#f1f1f1" : "#141a21"}
                sx={{ fontSize: '0.7rem' }}
              >
                Popular
              </Typography>
            </Box>
          </Box>

          <Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center"
            sx={{ width: "20vw", textAlign: 'center', mr: 0 }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
              <Typography variant="body1" fontWeight="medium">
                Esta estadística muestra el promedio de las puntuaciones del rango más popular por habilidades.
                Rangos: 0-50, 50-70, 70-90, 90-100.
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400" mb={2}>
              Total de evaluaciones: {totalScores.length}
            </Typography>
            
            <Box sx={{ mt: 2, width: '100%' }}>
              {data.map((item, index) => (
                <Box 
                  key={index}
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {item.skill}:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ fontSize: '0.8rem' }}
                  >
                    {item.value}/100
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
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
            width: '100%', 
            maxWidth: '1200px',
            height: '90vh', 
            overflowY: 'auto',
            scrollbarWidth: 'none',
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 16,
            paddingRight: 16,
            maskImage
        }}>
            <Stack sx={{
                width: '100%', 
                minHeight: { xs: '400px', sm: '500px', md: '600px' },
                height: 'auto',
                backgroundColor: theme.palette.mode === "dark"? "#141a21": "#f1f1f1",
                mb: 4,
                borderRadius: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: 'inherit',
                flexShrink: 0,
                p: { xs: 2, sm: 3, md: 4 }
                }}>
                <DonutChart/>
                    </Stack>
            <Stack sx={{
                width: '100%', 
                minHeight: { xs: '400px', sm: '500px', md: '600px' },
                height: 'auto',
                backgroundColor: theme.palette.mode === "dark"? "#141a21": "#f1f1f1",
                mb: 4,
                borderRadius: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: 'inherit',
                flexShrink: 0,
                p: { xs: 2, sm: 3, md: 4 }
                }}> 
                <RadarScoresChart/>
            </Stack>
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


