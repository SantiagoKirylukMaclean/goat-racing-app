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
import { Slider } from "@/components/ui/slider"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AddPartDialogProps {
  children: React.ReactNode
}

export function AddPartDialog({ children }: AddPartDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState([100])
  const [wearRate, setWearRate] = useState([1])
  const [performanceImpact, setPerformanceImpact] = useState([0])
  const [cost, setCost] = useState("")
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

      const { error } = await supabase.from("car_parts").insert({
        user_id: user.id,
        name,
        category,
        condition: condition[0],
        wear_rate: wearRate[0],
        performance_impact: performanceImpact[0],
        cost: Number.parseFloat(cost) || 0,
      })

      if (error) throw error

      toast({
        title: "Part added",
        description: `${name} has been added to inventory.`,
      })

      setOpen(false)
      setName("")
      setCategory("")
      setCondition([100])
      setWearRate([1])
      setPerformanceImpact([0])
      setCost("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add part",
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
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>Add a new part to your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Part Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Front Wing Assembly"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engine">Engine</SelectItem>
                <SelectItem value="aerodynamics">Aerodynamics</SelectItem>
                <SelectItem value="suspension">Suspension</SelectItem>
                <SelectItem value="brakes">Brakes</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="tires">Tires</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Condition: {condition[0]}%</Label>
            <Slider value={condition} onValueChange={setCondition} max={100} min={0} step={5} />
          </div>
          <div className="grid gap-2">
            <Label>Wear Rate: {wearRate[0]}x</Label>
            <Slider value={wearRate} onValueChange={setWearRate} max={3} min={0.5} step={0.1} />
          </div>
          <div className="grid gap-2">
            <Label>Performance Impact: {performanceImpact[0]}%</Label>
            <Slider value={performanceImpact} onValueChange={setPerformanceImpact} max={10} min={-10} step={0.5} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="5000"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Part"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
