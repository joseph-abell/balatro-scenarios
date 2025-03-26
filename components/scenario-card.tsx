"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Joker, Scenario } from "@/types"

interface ScenarioCardProps {
  scenario: Scenario
  jokers: Joker[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ScenarioCard({ scenario, jokers, onEdit, onDelete }: ScenarioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get jokers assigned to this scenario
  const assignedJokers = jokers.filter((joker) => scenario.jokerIds.includes(joker.id))

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{scenario.name}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(scenario.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{scenario.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(scenario.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {scenario.description && <CardDescription>{scenario.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Assigned Jokers ({assignedJokers.length})</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {assignedJokers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jokers assigned yet</p>
        ) : isExpanded ? (
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {assignedJokers.map((joker) => (
                <div key={joker.id} className="p-2 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{joker.name}</p>
                      <p className="text-xs text-muted-foreground">{joker.description}</p>
                    </div>
                    <Badge className="ml-2">{joker.rarity}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-wrap gap-1">
            {assignedJokers.slice(0, 5).map((joker) => (
              <Badge key={joker.id} variant="outline">
                {joker.name}
              </Badge>
            ))}
            {assignedJokers.length > 5 && <Badge variant="outline">+{assignedJokers.length - 5} more</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

