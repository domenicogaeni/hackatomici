import { WarningLevel } from '../Trip'

export type Report = {
  id: number
  user_id: number
  place_id: string
  title: string
  description: string
  level: WarningLevel
  type: 'community' | 'verified'
  from: string
  to: string | null
  created_at: string
  updated_at: string
  score: number
  vote: 'down' | 'up' | null
}
