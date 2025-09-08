import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wrench, AlertTriangle, CheckCircle } from "lucide-react"
import { PartsInventory } from "@/components/parts/parts-inventory"
import { AddPartDialog } from "@/components/parts/add-part-dialog"

export default async function PartsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: parts } = await supabase
    .from("car_parts")
    .select("*")
    .eq("user_id", user.id)
    .order("condition", { ascending: true })

  const totalParts = parts?.length || 0
  const criticalParts = parts?.filter((part) => part.condition < 30).length || 0
  const goodParts = parts?.filter((part) => part.condition >= 70).length || 0
  const totalValue = parts?.reduce((sum, part) => sum + part.cost, 0) || 0

  return (
    <DashboardLayout title="Parts List">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="grid gap-4 md:grid-cols-4 flex-1 mr-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParts}</div>
                <p className="text-xs text-muted-foreground">In inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Condition</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{criticalParts}</div>
                <p className="text-xs text-muted-foreground">Need replacement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Good Condition</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{goodParts}</div>
                <p className="text-xs text-muted-foreground">Ready to use</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Inventory value</p>
              </CardContent>
            </Card>
          </div>

          <AddPartDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Part
            </Button>
          </AddPartDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Parts Inventory</CardTitle>
            <CardDescription>Manage your car parts inventory and track condition</CardDescription>
          </CardHeader>
          <CardContent>
            {parts && parts.length > 0 ? (
              <PartsInventory parts={parts} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No parts in inventory yet</p>
                <AddPartDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Part
                  </Button>
                </AddPartDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
