"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Copy, Eye, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { TestConfiguration } from "@/lib/types"

interface ConfigurationListProps {
  configurations: TestConfiguration[]
}

export function ConfigurationList({ configurations }: ConfigurationListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async (configId: string) => {
    try {
      const { error } = await supabase.from("test_configurations").delete().eq("id", configId)

      if (error) throw error

      toast({
        title: "Configuration deleted",
        description: "The configuration has been removed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete configuration",
        variant: "destructive",
      })
    }
  }

  const handleDuplicate = async (config: TestConfiguration) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("test_configurations").insert({
        user_id: user.id,
        name: `${config.name} (Copy)`,
        circuit: config.circuit,
        weather_conditions: config.weather_conditions,
        temperature: config.temperature,
        setup_data: config.setup_data,
        notes: config.notes,
      })

      if (error) throw error

      toast({
        title: "Configuration duplicated",
        description: "A copy of the configuration has been created.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to duplicate configuration",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {configurations.map((config) => (
        <div
          key={config.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{config.name}</div>
              <div className="text-sm text-muted-foreground">
                {config.circuit} • {new Date(config.created_at).toLocaleDateString()}
              </div>
              {config.notes && (
                <div className="text-xs text-muted-foreground mt-1 max-w-md truncate">{config.notes}</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {config.weather_conditions && (
                <Badge variant="outline" className="text-xs">
                  {config.weather_conditions}
                </Badge>
              )}
              {config.temperature && (
                <Badge variant="outline" className="text-xs">
                  {config.temperature}°C
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Configuration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicate(config)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(config.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
