export type User = {
  firebase_uid: string
  email: string
  name: string
  surname: string
  institution_code: string | null
  institution_place_id: string | null
  device_id: string | null
  created_at?: string | null
  updated_at?: string | null
}
