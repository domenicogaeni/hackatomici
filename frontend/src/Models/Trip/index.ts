export type Trip = {
  id: number
  name: string
  description: string | null
  // Format: YYYY-MM-DD
  from: string
  // Format: YYYY-MM-DD
  to: string
}
