import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Zap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StandingsTable } from "@/components/standings/standings-table"
import { AddDriverDialog } from "@/components/standings/add-driver-dialog"

export default async function StandingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: drivers } = await supabase
    .from("drivers")
    .select("*")
    .eq("user_id", user.id)
    .order("points", { ascending: false })

  const { data: races } = await supabase.from("races").select("*").eq("user_id", user.id)

  const totalRaces = races?.length || 0
  const completedRaces = races?.filter((race) => race.status === "completed").length || 0
  const upcomingRaces = totalRaces - completedRaces

  const championshipLeader = drivers?.[0]
  const mostWins = drivers?.reduce((max, driver) => (driver.wins > max.wins ? driver : max), drivers[0])

  return (
    <DashboardLayout title="Championship Standings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="grid gap-4 md:grid-cols-3 flex-1 mr-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Races</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRaces}</div>
                <p className="text-xs text-muted-foreground">{upcomingRaces} remaining</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Championship Leader</CardTitle>
                <Medal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{championshipLeader?.name || "No drivers"}</div>
                <p className="text-xs text-muted-foreground">{championshipLeader?.points || 0} points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Wins</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mostWins?.wins || 0}</div>
                <p className="text-xs text-muted-foreground">{mostWins?.name || "No drivers"}</p>
              </CardContent>
            </Card>
          </div>

          <AddDriverDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </AddDriverDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Driver Standings</CardTitle>
            <CardDescription>Current championship standings for all drivers</CardDescription>
          </CardHeader>
          <CardContent>
            {drivers && drivers.length > 0 ? (
              <StandingsTable drivers={drivers} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No drivers added yet</p>
                <AddDriverDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Driver
                  </Button>
                </AddDriverDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
