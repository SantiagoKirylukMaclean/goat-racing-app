import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, FileText } from "lucide-react"
import { ConfigurationList } from "@/components/test-config/configuration-list"
import { AddConfigDialog } from "@/components/test-config/add-config-dialog"

export default async function TestConfigPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: configurations } = await supabase
    .from("test_configurations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalConfigs = configurations?.length || 0
  const recentConfigs =
    configurations?.filter((config) => new Date(config.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length || 0

  return (
    <DashboardLayout title="Test Configuration">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="grid gap-4 md:grid-cols-3 flex-1 mr-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Configurations</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConfigs}</div>
                <p className="text-xs text-muted-foreground">Saved setups</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Configs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentConfigs}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Circuits</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(configurations?.map((c) => c.circuit)).size || 0}</div>
                <p className="text-xs text-muted-foreground">Unique tracks</p>
              </CardContent>
            </Card>
          </div>

          <AddConfigDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Configuration
            </Button>
          </AddConfigDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Configurations</CardTitle>
            <CardDescription>Manage your car setup configurations for different circuits</CardDescription>
          </CardHeader>
          <CardContent>
            {configurations && configurations.length > 0 ? (
              <ConfigurationList configurations={configurations} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No configurations saved yet</p>
                <AddConfigDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Configuration
                  </Button>
                </AddConfigDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
