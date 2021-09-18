export type WarningLevel = 'red' | 'orange' | 'yellow' | 'white'

export type ShortTrip = {
  id: number
  name: string
  description: string | null
  // Format: YYYY-MM-DD
  from: string
  // Format: YYYY-MM-DD
  to: string
}

export type Point = {
  id: number
  name: string
  place_id: string
  level: WarningLevel
}

export type Stop = {
  id: number
  name: string
  place_id: string
  from: string
  to: string
  level: WarningLevel
  points: Point[] | null
}

export type Trip = ShortTrip & {
  stops: Stop[]
}
