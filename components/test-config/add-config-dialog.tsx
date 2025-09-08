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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AddConfigDialogProps {
  children: React.ReactNode
}

export function AddConfigDialog({ children }: AddConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [circuit, setCircuit] = useState("")
  const [weather, setWeather] = useState("")
  const [temperature, setTemperature] = useState("")
  const [notes, setNotes] = useState("")
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

      // Basic setup data structure
      const setupData = {
        aerodynamics: {
          frontWing: 5,
          rearWing: 5,
        },
        suspension: {
          frontSuspension: 5,
          rearSuspension: 5,
        },
        brakes: {
          brakePressure: 85,
          brakeBalance: 52,
        },
        differential: {
          onThrottle: 50,
          offThrottle: 50,
        },
      }

      const { error } = await supabase.from("test_configurations").insert({
        user_id: user.id,
        name,
        circuit,
        weather_conditions: weather || null,
        temperature: temperature ? Number.parseInt(temperature) : null,
        setup_data: setupData,
        notes: notes || null,
      })

      if (error) throw error

      toast({
        title: "Configuration saved",
        description: `${name} has been saved successfully.`,
      })

      setOpen(false)
      setName("")
      setCircuit("")
      setWeather("")
      setTemperature("")
      setNotes("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Test Configuration</DialogTitle>
          <DialogDescription>Create a new car setup configuration for testing.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Configuration Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monaco High Downforce"
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
            <Label htmlFor="weather">Weather Conditions</Label>
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
            <Label htmlFor="temperature">Temperature °C</Label>
            <Input
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="25"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Setup notes and observations..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
