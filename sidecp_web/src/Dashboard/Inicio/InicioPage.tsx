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

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../@/components/ui/chart"
export const description = "A donut chart with text"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

function ChartPieDonutText() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          123
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
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
                position: 'inherit',
                flexShrink: 0
                }}>
                {/*<Button variant="contained" sx={{width: "20%"}} onClick={callBack}>hola</Button>*/}
                <ChartPieDonutText/>

                    
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


