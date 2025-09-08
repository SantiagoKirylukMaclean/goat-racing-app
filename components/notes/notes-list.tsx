"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Note } from "@/lib/types"

interface NotesListProps {
  notes: Note[]
}

export function NotesList({ notes }: NotesListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async (noteId: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId)

      if (error) throw error

      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "default",
      setup: "secondary",
      strategy: "outline",
      driver: "destructive",
      technical: "default",
    } as const
    return colors[category as keyof typeof colors] || "default"
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mt-1">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{note.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {new Date(note.created_at).toLocaleDateString()} •{" "}
                {new Date(note.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              {note.content && (
                <div className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  {note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content}
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={getCategoryColor(note.category)} className="text-xs capitalize">
                  {note.category}
                </Badge>
              </div>
            </div>
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
                Edit Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(note.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
