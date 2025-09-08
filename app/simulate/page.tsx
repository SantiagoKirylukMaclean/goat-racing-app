import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SimulationControls } from "@/components/simulate/simulation-controls"
import { RaceResults } from "@/components/simulate/race-results"
import { AddRaceDialog } from "@/components/simulate/add-race-dialog"

export default async function SimulatePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: races } = await supabase
    .from("races")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const { data: drivers } = await supabase.from("drivers").select("*").eq("user_id", user.id)

  const upcomingRaces = races?.filter((race) => race.status === "upcoming") || []
  const currentRace = upcomingRaces[0]

  return (
    <DashboardLayout title="Simulate Weekend">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Card className="flex-1 mr-4">
            <CardHeader>
              <CardTitle>Weekend Simulation</CardTitle>
              <CardDescription>
                Run complete race weekend simulations with practice, qualifying, and race sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <AddRaceDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Race
            </Button>
          </AddRaceDialog>
        </div>

        {currentRace && drivers && drivers.length > 0 ? (
          <>
            <SimulationControls race={currentRace} drivers={drivers} />
            <RaceResults raceId={currentRace.id} />
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {!drivers || drivers.length === 0
                  ? "Add drivers first to start simulating races"
                  : "No upcoming races scheduled"}
              </p>
              {!drivers || drivers.length === 0 ? (
                <Button asChild>
                  <a href="/standings">Add Drivers</a>
                </Button>
              ) : (
                <AddRaceDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule First Race
                  </Button>
                </AddRaceDialog>
              )}
            </CardContent>
          </Card>
        )}

        {races && races.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Race Calendar</CardTitle>
              <CardDescription>All scheduled and completed races</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {races.map((race) => (
                  <div
                    key={race.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{race.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {race.circuit} • {new Date(race.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          race.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : race.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {race.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
