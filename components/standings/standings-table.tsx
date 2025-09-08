"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Driver } from "@/lib/types"

interface StandingsTableProps {
  drivers: Driver[]
}

export function StandingsTable({ drivers }: StandingsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async (driverId: string) => {
    try {
      const { error } = await supabase.from("drivers").delete().eq("id", driverId)

      if (error) throw error

      toast({
        title: "Driver deleted",
        description: "The driver has been removed from your team.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete driver",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {drivers.map((driver, index) => (
        <div
          key={driver.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {index + 1}
            </div>
            <div>
              <div className="font-medium">{driver.name}</div>
              <div className="text-sm text-muted-foreground">
                #{driver.number} • {driver.team || "No team"} • {driver.nationality || "Unknown"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-lg font-bold">{driver.points}</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {driver.wins}W
              </Badge>
              <Badge variant="outline" className="text-xs">
                {driver.podiums}P
              </Badge>
              <Badge variant="outline" className="text-xs">
                {driver.fastest_laps}FL
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Driver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(driver.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Driver
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
