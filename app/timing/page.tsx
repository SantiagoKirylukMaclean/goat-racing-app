import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer } from "lucide-react"
import { TimingAnalysis } from "@/components/timing/timing-analysis"
import { MicrosectorData } from "@/components/timing/microsector-data"

export default async function TimingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: timingData } = await supabase
    .from("timing_data")
    .select(
      `
      *,
      drivers (
        name,
        number
      ),
      races (
        name,
        circuit
      )
    `,
    )
    .eq("user_id", user.id)
    .order("time_ms", { ascending: true })
    .limit(20)

  // Calculate fastest times by sector
  const sectorTimes = {
    sector1: timingData?.filter((t) => t.sector === 1).sort((a, b) => a.time_ms - b.time_ms)[0],
    sector2: timingData?.filter((t) => t.sector === 2).sort((a, b) => a.time_ms - b.time_ms)[0],
    sector3: timingData?.filter((t) => t.sector === 3).sort((a, b) => a.time_ms - b.time_ms)[0],
  }

  const fastestOverall = timingData?.[0]

  return (
    <DashboardLayout title="Timing Analysis">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fastest Lap</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fastestOverall ? `${(fastestOverall.time_ms / 1000).toFixed(3)}s` : "No data"}
              </div>
              <p className="text-xs text-muted-foreground">
                {fastestOverall ? (fastestOverall as any).drivers?.name : "No driver"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sector 1</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sectorTimes.sector1 ? `${(sectorTimes.sector1.time_ms / 1000).toFixed(3)}s` : "No data"}
              </div>
              <p className="text-xs text-muted-foreground">
                {sectorTimes.sector1 ? (sectorTimes.sector1 as any).drivers?.name : "No driver"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sector 2</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sectorTimes.sector2 ? `${(sectorTimes.sector2.time_ms / 1000).toFixed(3)}s` : "No data"}
              </div>
              <p className="text-xs text-muted-foreground">
                {sectorTimes.sector2 ? (sectorTimes.sector2 as any).drivers?.name : "No driver"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sector 3</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sectorTimes.sector3 ? `${(sectorTimes.sector3.time_ms / 1000).toFixed(3)}s` : "No data"}
              </div>
              <p className="text-xs text-muted-foreground">
                {sectorTimes.sector3 ? (sectorTimes.sector3 as any).drivers?.name : "No driver"}
              </p>
            </CardContent>
          </Card>
        </div>

        <TimingAnalysis timingData={timingData || []} />
        <MicrosectorData timingData={timingData || []} />
      </div>
    </DashboardLayout>
  )
}
