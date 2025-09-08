"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AddDriverDialogProps {
  children: React.ReactNode
}

export function AddDriverDialog({ children }: AddDriverDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [team, setTeam] = useState("")
  const [nationality, setNationality] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("drivers").insert({
        user_id: user.id,
        name,
        number: Number.parseInt(number),
        team: team || null,
        nationality: nationality || null,
      })

      if (error) throw error

      toast({
        title: "Driver added",
        description: `${name} has been added to your team.`,
      })

      setOpen(false)
      setName("")
      setNumber("")
      setTeam("")
      setNationality("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add driver",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>Add a new driver to your racing team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Driver Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lewis Hamilton"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Car Number</Label>
            <Input
              id="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="44"
              min="1"
              max="99"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team">Team (Optional)</Label>
            <Input id="team" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Mercedes" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nationality">Nationality (Optional)</Label>
            <Input
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="British"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Driver"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
