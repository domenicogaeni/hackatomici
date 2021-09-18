export type GooglePlaceDetail = {
  place_id: string
  reference: string
  formatted_address: string
  name?: string
  types?: string[]
  vicinity?: string
  geometry?: Geometry
  photos?: GooglePlacePhoto[]
  icon?: string
}

export type Geometry = {
  location: Point
  viewport: {
    northeast: Point
    southwest: Point
  }
}

export type Point = {
  lat: number
  lng: number
}

export type GooglePlacePhoto = {
  height: number
  width: number
  photo_reference: string
  html_attributions: string[]
}

export type Prediction = {
  place_id: string
  reference: string
  description: string
  matched_substring?: {
    length: number
    offset: number
  }[]
  terms?: {
    offset: number
    value: string
  }[]
  types?: string[]
}

export type NearbySearch = {
  place_id: string
  reference: string
  name: string
  geometry?: Geometry
  photos?: GooglePlacePhoto[]
  icon?: string
  scope?: string
  vicinity?: string
  types?: string[]
}

export type AutoCompleteResult = {
  predictions: Prediction[]
  status: string
}

export type NearbySearchResult = {
  results: NearbySearch[]
  html_attributions: string[]
  next_page_token: string
  status: string
}

export type PlaceDetailResult = {
  result: GooglePlaceDetail
  html_attributions: string[]
  status: string
}

export type PlaceType = 'geocode' | 'address' | 'establishment'

export class LocationPickerItem {
  public place_id: string
  public reference: string
  public description: string

  constructor(place_id: string, reference: string, description: string) {
    this.place_id = place_id
    this.reference = reference
    this.description = description
  }

  static fromPrediction(prediction: Prediction): LocationPickerItem {
    return new this(
      prediction.place_id,
      prediction.reference,
      prediction.description,
    )
  }

  static fromNearbySearch(nearbySearch: NearbySearch): LocationPickerItem {
    return new this(
      nearbySearch.place_id,
      nearbySearch.reference,
      nearbySearch.name,
    )
  }

  static fromGooglePlaceDetail(
    placeDetail: GooglePlaceDetail,
  ): LocationPickerItem {
    return new this(
      placeDetail.place_id,
      placeDetail.reference,
      placeDetail.formatted_address,
    )
  }
}
