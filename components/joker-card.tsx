"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Check, Plus, X, Edit, Save } from "lucide-react"
import type { Joker, Scenario } from "@/types"

interface JokerCardProps {
  joker: Joker
  scenarios: Scenario[]
  onAddToScenario: (jokerId: number, scenarioId: string) => void
  onRemoveFromScenario: (jokerId: number, scenarioId: string) => void
  onUpdateJoker: (joker: Joker) => void
}

export default function JokerCard({
  joker,
  scenarios,
  onAddToScenario,
  onRemoveFromScenario,
  onUpdateJoker,
}: JokerCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedComment, setEditedComment] = useState(joker.comment)

  // Find scenarios this joker is assigned to
  const assignedScenarios = scenarios.filter((scenario) => scenario.jokerIds.includes(joker.id))

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-slate-500"
      case "Uncommon":
        return "bg-green-500"
      case "Rare":
        return "bg-blue-500"
      case "Legendary":
        return "bg-purple-500"
      default:
        return "bg-slate-500"
    }
  }

  const handleSaveChanges = () => {
    const updatedJoker = {
      ...joker,
      comment: editedComment,
    }
    onUpdateJoker(updatedJoker)
    setIsEditing(false)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{joker.name}</CardTitle>
          <Badge className={`${getRarityColor(joker.rarity)} text-white`}>{joker.rarity}</Badge>
        </div>
        <CardDescription className="text-xs">{joker.type?.split(', ') || "No type"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-2">{joker.description}</p>

        {isExpanded && (
          <>
            <div className="mt-2 flex justify-between items-start">
              <p className="text-xs text-muted-foreground font-semibold">Notes:</p>
              <Button variant="ghost" size="sm" className="h-6 px-2 -mt-1" onClick={() => setIsEditing(true)}>
                <Edit className="h-3 w-3 mr-1" /> Edit
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{joker.comment || "No notes added yet."}</p>

            {assignedScenarios.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground font-semibold">Assigned to:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {assignedScenarios.map((scenario) => (
                    <Badge key={scenario.id} className="flex items-center gap-1 bg-primary text-xs">
                      {scenario.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveFromScenario(joker.id, scenario.id)
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show Less" : "Show More"}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add to Scenario
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            {scenarios.length === 0 ? (
              <p className="text-sm text-center py-2">No scenarios created yet</p>
            ) : (
              <div className="space-y-1">
                {scenarios.map((scenario) => {
                  const isAssigned = scenario.jokerIds.includes(joker.id)
                  return (
                    <Button
                      key={scenario.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        if (isAssigned) {
                          onRemoveFromScenario(joker.id, scenario.id)
                        } else {
                          onAddToScenario(joker.id, scenario.id)
                        }
                      }}
                    >
                      {isAssigned ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {scenario.name}
                    </Button>
                  )
                })}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </CardFooter>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {joker.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                placeholder="Add your notes about this joker..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

