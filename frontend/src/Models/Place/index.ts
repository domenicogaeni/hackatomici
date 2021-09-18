export type Place = {
  name: string
  place_id: string
  type:
    | 'point_of_interest'
    | 'locality'
    | 'administrative_area_level_2'
    | 'administrative_area_level_1'
    | 'country'
  administrative_area_level_1: string | null
  administrative_area_level_2: string | null
  country: string
  latitude: number
  longitude: number
  locality: string | null
}
