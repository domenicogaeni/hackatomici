export type Trip = {
  id: number
  name: string
  description: string | null
  // Format: YYYY-MM-DD
  from_date: string
  // Format: YYYY-MM-DD
  to_date: string
}
