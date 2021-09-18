import { Autocomplete } from '@/Components'
import { nearbySearch } from '@/Services/GooglePlaces/googlePlacesApi'
import { Point } from '@/Services/GooglePlaces/googlePlacesTypings'
import { useTheme } from '@/Theme'
import { Box } from 'native-base'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import uuid from 'react-native-uuid'

const initialRegion = {
  latitude: 45.7314,
  longitude: 9.63715,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

const Map = () => {
  const { Layout } = useTheme()
  const mapRef = useRef<MapView>(null)

  const [location, setLocation] = useState<Point>()
  const sessionToken = uuid.v4() as string

  const nearbySearchAsync = useCallback(async () => {
    if (location) {
      const results = await nearbySearch(location, sessionToken)
      const resultPlaceId =
        results?.length && results.length > 0 && results[0].place_id
      // richiesta a backend con placeId ed eventuale apertura bottom sheet
    }
  }, [location, sessionToken])

  useEffect(() => {
    if (location) {
      nearbySearchAsync()
      mapRef.current?.animateToRegion({
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
        latitude: location?.lat as number,
        longitude: location?.lng as number,
      })
    }
  }, [location, nearbySearchAsync, mapRef])

  const onMapPress = useCallback(
    event => {
      setLocation({
        lat: event.nativeEvent.coordinate.latitude,
        lng: event.nativeEvent.coordinate.longitude,
      })
    },
    [setLocation],
  )

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        style={{ flex: 1, width: '100%' }}
        provider="google"
        onPress={onMapPress}
        onPoiClick={onMapPress}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location?.lat as number,
              longitude: location?.lng as number,
            }}
          />
        )}
      </MapView>
      <Box w="100%" position="absolute" top="8">
        <Autocomplete sessionToken={sessionToken} setLocation={setLocation} />
      </Box>
    </View>
  )
}

export default Map
