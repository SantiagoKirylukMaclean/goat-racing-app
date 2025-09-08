"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Settings, BarChart3 } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Race, Driver } from "@/lib/types"

interface SimulationControlsProps {
  race: Race
  drivers: Driver[]
}

export function SimulationControls({ race, drivers }: SimulationControlsProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const simulateSession = async (sessionType: "practice" | "qualifying" | "race") => {
    setIsSimulating(true)

    try {
      // Simulate random results for each driver
      const results = drivers.map((driver, index) => {
        const baseTime = 90000 + Math.random() * 5000 // Base time around 1:30
        const position = index + 1
        const points = sessionType === "race" ? Math.max(0, 25 - (position - 1) * 2) : 0

        return {
          race_id: race.id,
          driver_id: driver.id,
          position,
          points,
          fastest_lap: position === 1,
          dnf: Math.random() < 0.1, // 10% chance of DNF
          lap_time: `${Math.floor(baseTime / 60000)}:${((baseTime % 60000) / 1000).toFixed(3)}`,
        }
      })

      // Insert results
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const resultsWithUserId = results.map((result) => ({
        ...result,
        user_id: user.id,
      }))

      const { error } = await supabase.from("race_results").insert(resultsWithUserId)

      if (error) throw error

      // Update race status
      if (sessionType === "race") {
        await supabase.from("races").update({ status: "completed" }).eq("id", race.id)

        // Update driver points
        for (const result of results) {
          if (!result.dnf) {
            await supabase
              .from("drivers")
              .update({
                points: drivers.find((d) => d.id === result.driver_id)!.points + result.points,
                wins:
                  result.position === 1
                    ? drivers.find((d) => d.id === result.driver_id)!.wins + 1
                    : drivers.find((d) => d.id === result.driver_id)!.wins,
                podiums:
                  result.position <= 3
                    ? drivers.find((d) => d.id === result.driver_id)!.podiums + 1
                    : drivers.find((d) => d.id === result.driver_id)!.podiums,
                fastest_laps: result.fastest_lap
                  ? drivers.find((d) => d.id === result.driver_id)!.fastest_laps + 1
                  : drivers.find((d) => d.id === result.driver_id)!.fastest_laps,
              })
              .eq("id", result.driver_id)
          }
        }
      }

      toast({
        title: "Simulation complete",
        description: `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} session has been simulated.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to simulate session",
        variant: "destructive",
      })
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Practice Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
            onClick={() => simulateSession("practice")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            FP1 - 90 minutes
          </Button>
          <Button
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
            onClick={() => simulateSession("practice")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            FP2 - 90 minutes
          </Button>
          <Button
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
            onClick={() => simulateSession("practice")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            FP3 - 60 minutes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Qualifying</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
            onClick={() => simulateSession("qualifying")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            Q1 - 18 minutes
          </Button>
          <Button
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
            onClick={() => simulateSession("qualifying")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            Q2 - 15 minutes
          </Button>
          <Button
            className="w-full justify-start gap-2 bg-transparent"
            variant="outline"
            onClick={() => simulateSession("qualifying")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            Q3 - 12 minutes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Race</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start gap-2"
            onClick={() => simulateSession("race")}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            {isSimulating ? "Simulating..." : "Start Race"}
          </Button>
          <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
            <Settings className="h-4 w-4" />
            Race Settings
          </Button>
          <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
            <BarChart3 className="h-4 w-4" />
            View Results
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
