"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface MicrosectorDataProps {
  timingData: any[]
}

export function MicrosectorData({ timingData }: MicrosectorDataProps) {
  const [selectedSector, setSelectedSector] = useState("1")

  if (timingData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Microsector Analysis</CardTitle>
          <CardDescription>No microsector data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Run some race simulations to generate microsector timing data.</p>
        </CardContent>
      </Card>
    )
  }

  const sectorData = timingData
    .filter((timing) => timing.sector === Number.parseInt(selectedSector))
    .sort((a, b) => a.time_ms - b.time_ms)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Microsector Analysis</CardTitle>
            <CardDescription>Detailed timing breakdown by microsector</CardDescription>
          </div>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sector 1</SelectItem>
              <SelectItem value="2">Sector 2</SelectItem>
              <SelectItem value="3">Sector 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sectorData.slice(0, 10).map((timing: any, index: number) => (
            <div
              key={timing.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{timing.drivers?.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">
                    Microsector {timing.microsector} • {timing.session_type}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs font-mono">
                  {(timing.time_ms / 1000).toFixed(3)}s
                </Badge>
                <div className="text-right">
                  <div className="text-sm font-mono">#{timing.drivers?.number || 0}</div>
                  <div className="text-xs text-muted-foreground">{timing.races?.circuit || "Unknown"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
