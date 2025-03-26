export interface Joker {
  id: number
  name: string
  type: string[]
  rarity: string
  description: string
  availability: string
  image: string
  comment: string
  complements?:string[]
}

export interface Scenario {
  id: string
  name: string
  description: string
  jokerIds: number[]
}

