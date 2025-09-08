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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AddRaceDialogProps {
  children: React.ReactNode
}

export function AddRaceDialog({ children }: AddRaceDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [circuit, setCircuit] = useState("")
  const [date, setDate] = useState("")
  const [weather, setWeather] = useState("")
  const [temperature, setTemperature] = useState("")
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

      const { error } = await supabase.from("races").insert({
        user_id: user.id,
        name,
        circuit,
        date,
        weather: weather || null,
        temperature: temperature ? Number.parseInt(temperature) : null,
        status: "upcoming",
      })

      if (error) throw error

      toast({
        title: "Race added",
        description: `${name} has been scheduled.`,
      })

      setOpen(false)
      setName("")
      setCircuit("")
      setDate("")
      setWeather("")
      setTemperature("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add race",
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
          <DialogTitle>Schedule New Race</DialogTitle>
          <DialogDescription>Add a new race to your calendar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Race Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monaco Grand Prix"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="circuit">Circuit</Label>
            <Input
              id="circuit"
              value={circuit}
              onChange={(e) => setCircuit(e.target.value)}
              placeholder="Circuit de Monaco"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weather">Weather (Optional)</Label>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger>
                <SelectValue placeholder="Select weather conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunny">Sunny</SelectItem>
                <SelectItem value="cloudy">Cloudy</SelectItem>
                <SelectItem value="rainy">Rainy</SelectItem>
                <SelectItem value="stormy">Stormy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="temperature">Temperature °C (Optional)</Label>
            <Input
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="25"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Schedule Race"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
