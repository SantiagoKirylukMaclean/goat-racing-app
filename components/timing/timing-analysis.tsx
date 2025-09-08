"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TimingAnalysisProps {
  timingData: any[]
}

export function TimingAnalysis({ timingData }: TimingAnalysisProps) {
  if (timingData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timing Analysis</CardTitle>
          <CardDescription>No timing data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Run some race simulations to generate timing data.</p>
        </CardContent>
      </Card>
    )
  }

  // Group by driver and calculate averages
  const driverStats = timingData.reduce((acc: any, timing: any) => {
    const driverName = timing.drivers?.name || "Unknown"
    if (!acc[driverName]) {
      acc[driverName] = {
        name: driverName,
        number: timing.drivers?.number || 0,
        times: [],
        sectors: { 1: [], 2: [], 3: [] },
      }
    }
    acc[driverName].times.push(timing.time_ms)
    acc[driverName].sectors[timing.sector].push(timing.time_ms)
    return acc
  }, {})

  const driverAnalysis = Object.values(driverStats).map((driver: any) => {
    const avgTime = driver.times.reduce((sum: number, time: number) => sum + time, 0) / driver.times.length
    const bestTime = Math.min(...driver.times)
    const trend = driver.times.length > 1 ? (driver.times[driver.times.length - 1] < avgTime ? "up" : "down") : "up"

    return {
      ...driver,
      avgTime,
      bestTime,
      trend,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Performance Analysis</CardTitle>
        <CardDescription>Detailed timing breakdown by driver</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {driverAnalysis.map((driver: any, index: number) => (
            <div
              key={driver.name}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{driver.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {driver.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    Trending {driver.trend}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    Avg: {(driver.avgTime / 1000).toFixed(3)}s
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-mono">
                    Best: {(driver.bestTime / 1000).toFixed(3)}s
                  </Badge>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold font-mono">#{driver.number}</div>
                  <div className="text-xs text-muted-foreground">{driver.times.length} laps</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
