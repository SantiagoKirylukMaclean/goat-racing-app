import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Tag, Calendar } from "lucide-react"
import { NotesList } from "@/components/notes/notes-list"
import { AddNoteDialog } from "@/components/notes/add-note-dialog"

export default async function NotesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalNotes = notes?.length || 0
  const recentNotes =
    notes?.filter((note) => new Date(note.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0
  const categories = new Set(notes?.map((note) => note.category)).size || 0

  return (
    <DashboardLayout title="Notes">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="grid gap-4 md:grid-cols-3 flex-1 mr-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNotes}</div>
                <p className="text-xs text-muted-foreground">All notes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentNotes}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories}</div>
                <p className="text-xs text-muted-foreground">Different types</p>
              </CardContent>
            </Card>
          </div>

          <AddNoteDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </AddNoteDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Notes</CardTitle>
            <CardDescription>Keep track of important information, strategies, and observations</CardDescription>
          </CardHeader>
          <CardContent>
            {notes && notes.length > 0 ? (
              <NotesList notes={notes} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No notes created yet</p>
                <AddNoteDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Note
                  </Button>
                </AddNoteDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
