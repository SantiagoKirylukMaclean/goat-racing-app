"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface RaceResult {
  id: string
  position: number
  points: number
  fastest_lap: boolean
  dnf: boolean
  dnf_reason?: string
  lap_time?: string
  driver: {
    name: string
    number: number
  }
}

interface RaceResultsProps {
  raceId: string
}

export function RaceResults({ raceId }: RaceResultsProps) {
  const [results, setResults] = useState<RaceResult[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await supabase
          .from("race_results")
          .select(
            `
            id,
            position,
            points,
            fastest_lap,
            dnf,
            dnf_reason,
            lap_time,
            drivers (
              name,
              number
            )
          `,
          )
          .eq("race_id", raceId)
          .order("position")

        if (data) {
          const formattedResults = data.map((result: any) => ({
            ...result,
            driver: result.drivers,
          }))
          setResults(formattedResults)
        }
      } catch (error) {
        console.error("Error fetching race results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [raceId, supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Race Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading results...</p>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Race Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No results yet. Run a simulation to see results.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Race Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {result.position}
                </div>
                <div>
                  <div className="font-medium">{result.driver.name}</div>
                  <div className="text-sm text-muted-foreground">#{result.driver.number}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {result.fastest_lap && (
                    <Badge variant="secondary" className="text-xs">
                      FL
                    </Badge>
                  )}
                  {result.dnf ? (
                    <Badge variant="destructive" className="text-xs">
                      DNF
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {result.points} pts
                    </Badge>
                  )}
                </div>

                {result.lap_time && (
                  <div className="text-right">
                    <div className="text-sm font-mono">{result.lap_time}</div>
                    <div className="text-xs text-muted-foreground">Best lap</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
