import {
  AutoCompleteResult,
  NearbySearch,
  NearbySearchResult,
  PlaceType,
  Point,
  Prediction,
} from './googlePlacesTypings'
import { GOOGLE_API_KEY } from '@env'

// Google APIs
export const autocomplete = async (
  text: string,
  sessionToken: string,
  location?: Point,
): Promise<Prediction[] | null> => {
  try {
    const { lat, lng } = location || {}

    const url = (placeType: PlaceType) =>
      'https://maps.googleapis.com/maps/api/place/autocomplete/json' +
      `?input=${text}` +
      '&language=it' +
      `&key=${GOOGLE_API_KEY}` +
      `&types=${placeType}` +
      `&sessiontoken=${sessionToken}` +
      (location ? `&location=${lat},${lng}` : '')

    const rawEstablishments = await fetch(url('establishment'))
    const responseEstablishments: AutoCompleteResult = await rawEstablishments.json()

    const rawAddresses = await fetch(url('address'))
    const responseAddresses: AutoCompleteResult = await rawAddresses.json()

    return [
      ...(responseEstablishments?.predictions || []),
      ...(responseAddresses?.predictions || []),
    ]
  } catch (error) {
    console.log(error)
  }

  return null
}

export const nearbySearch = async (
  location: Point,
  sessionToken: string,
): Promise<NearbySearch[] | null> => {
  try {
    const { lat, lng } = location || {}

    const url =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
      `?location=${lat},${lng}` +
      '&language=it' +
      '&rankby=distance' +
      '&type=locality' +
      `&key=${GOOGLE_API_KEY}` +
      `&sessiontoken=${sessionToken}`

    const raw = await fetch(url)
    const response: NearbySearchResult = await raw.json()

    if (response) {
      return response.results
    }
  } catch (error) {
    console.log(error)
  }

  return null
}
