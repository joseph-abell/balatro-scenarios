"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import JokerCard from "@/components/joker-card"
import ScenarioForm from "@/components/scenario-form"
import ScenarioCard from "@/components/scenario-card"
import { jokersData } from "@/data/jokers"
import type { Joker, Scenario } from "@/types"

export default function Home() {
  const [jokers, setJokers] = useState<Joker[]>([])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null)
  const [showScenarioForm, setShowScenarioForm] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  // Load data from local storage on initial render
  useEffect(() => {
    // Load jokers from local storage or use default data
    const savedJokers = localStorage.getItem("balatroJokers")
    if (savedJokers) {
      setJokers(JSON.parse(savedJokers))
    } else {
      setJokers(jokersData)
    }

    // Load scenarios from local storage
    const savedScenarios = localStorage.getItem("balatroScenarios")
    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios))
    }
  }, [])

  // Save jokers to local storage whenever they change
  useEffect(() => {
    if (jokers.length > 0) {
      localStorage.setItem("balatroJokers", JSON.stringify(jokers))
    }
  }, [jokers])

  // Save scenarios to local storage whenever they change
  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem("balatroScenarios", JSON.stringify(scenarios))
    }
  }, [scenarios])

  const handleCreateScenario = (newScenario: Scenario) => {
    setScenarios([...scenarios, newScenario])
    setShowScenarioForm(false)
  }

  const handleUpdateScenario = (updatedScenario: Scenario) => {
    setScenarios(scenarios.map((scenario) => (scenario.id === updatedScenario.id ? updatedScenario : scenario)))
    setSelectedScenario(null)
    setShowScenarioForm(false)
  }

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((scenario) => scenario.id !== id))
  }

  const handleAddJokerToScenario = (jokerId: number, scenarioId: string) => {
    setScenarios(
      scenarios.map((scenario) => {
        if (scenario.id === scenarioId) {
          // Check if joker is already in the scenario
          if (!scenario.jokerIds.includes(jokerId)) {
            return {
              ...scenario,
              jokerIds: [...scenario.jokerIds, jokerId],
            }
          }
        }
        return scenario
      }),
    )
  }

  const handleRemoveJokerFromScenario = (jokerId: number, scenarioId: string) => {
    setScenarios(
      scenarios.map((scenario) => {
        if (scenario.id === scenarioId) {
          return {
            ...scenario,
            jokerIds: scenario.jokerIds.filter((id) => id !== jokerId),
          }
        }
        return scenario
      }),
    )
  }

  // Add a function to update joker notes and complements
  const handleUpdateJoker = (updatedJoker: Joker) => {
    setJokers(jokers.map((joker) => (joker.id === updatedJoker.id ? updatedJoker : joker)))
  }

  // Get unique types and rarities for filters
  const types = Array.from(new Set(jokers.flatMap((joker) => joker.type).filter(Boolean)))
  const rarities = Array.from(new Set(jokers.map((joker) => joker.rarity)))

  // Filter jokers based on search term and filters
  const filteredJokers = jokers.filter((joker) => {
    const matchesSearch =
      joker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      joker.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType ? joker.type.includes(selectedType) : true
    const matchesRarity = selectedRarity ? joker.rarity === selectedRarity : true

    return matchesSearch && matchesType && matchesRarity
  })

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Balatro Scenario Manager</h1>

      <Tabs defaultValue="jokers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="jokers">Joker Cards</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="jokers" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jokers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-40">
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-40">
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedRarity || ""}
                  onChange={(e) => setSelectedRarity(e.target.value || null)}
                >
                  <option value="">All Rarities</option>
                  {rarities.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {rarity}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedType(null)
                  setSelectedRarity(null)
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredJokers.map((joker) => (
              <JokerCard
                key={joker.id}
                joker={joker}
                scenarios={scenarios}
                onAddToScenario={handleAddJokerToScenario}
                onRemoveFromScenario={handleRemoveJokerFromScenario}
                onUpdateJoker={handleUpdateJoker}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Scenarios</h2>
            <Button onClick={() => setShowScenarioForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Scenario
            </Button>
          </div>

          {showScenarioForm && (
            <ScenarioForm
              onSubmit={selectedScenario ? handleUpdateScenario : handleCreateScenario}
              onCancel={() => {
                setShowScenarioForm(false)
                setSelectedScenario(null)
              }}
              initialData={selectedScenario}
            />
          )}

          {scenarios.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No scenarios created yet. Create your first scenario to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  jokers={jokers}
                  onEdit={() => {
                    setSelectedScenario(scenario)
                    setShowScenarioForm(true)
                  }}
                  onDelete={handleDeleteScenario}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}

