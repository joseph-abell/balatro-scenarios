"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Scenario } from "@/types"

interface ScenarioFormProps {
  onSubmit: (scenario: Scenario) => void
  onCancel: () => void
  initialData?: Scenario | null
}

export default function ScenarioForm({ onSubmit, onCancel, initialData }: ScenarioFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Scenario name is required")
      return
    }

    const scenario: Scenario = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
      jokerIds: initialData?.jokerIds || [],
    }

    onSubmit(scenario)
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Scenario" : "Create New Scenario"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Scenario Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Early Game, Flush Build, etc."
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this scenario or strategy..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update" : "Create"} Scenario</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

