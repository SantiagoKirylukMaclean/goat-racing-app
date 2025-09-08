"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Edit, Trash2, Wrench } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { CarPart } from "@/lib/types"

interface PartsInventoryProps {
  parts: CarPart[]
}

export function PartsInventory({ parts }: PartsInventoryProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async (partId: string) => {
    try {
      const { error } = await supabase.from("car_parts").delete().eq("id", partId)

      if (error) throw error

      toast({
        title: "Part deleted",
        description: "The part has been removed from inventory.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete part",
        variant: "destructive",
      })
    }
  }

  const getConditionColor = (condition: number) => {
    if (condition >= 70) return "text-green-600"
    if (condition >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getConditionBadge = (condition: number) => {
    if (condition >= 70) return { variant: "default" as const, text: "Good" }
    if (condition >= 40) return { variant: "secondary" as const, text: "Fair" }
    return { variant: "destructive" as const, text: "Critical" }
  }

  const getCategoryIcon = (category: string) => {
    return <Wrench className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {parts.map((part) => {
        const conditionBadge = getConditionBadge(part.condition)
        return (
          <div
            key={part.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {getCategoryIcon(part.category)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{part.name}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {part.category} • ${part.cost.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={part.condition} className="w-24 h-2" />
                  <span className={`text-sm font-medium ${getConditionColor(part.condition)}`}>{part.condition}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Badge variant={conditionBadge.variant} className="text-xs">
                  {conditionBadge.text}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Wear: {part.wear_rate}x
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
                    Edit Part
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(part.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Part
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}
