import { Autocomplete } from '@/Components'
import { nearbySearch } from '@/Services/GooglePlaces/googlePlacesApi'
import { Point } from '@/Services/GooglePlaces/googlePlacesTypings'
import { useTheme } from '@/Theme'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { Box } from 'native-base'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import uuid from 'react-native-uuid'
import PlaceInfoModal from '@/Components/PlaceInfoModal'

const initialRegion = {
  latitude: 45.7314,
  longitude: 9.63715,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

const Map = () => {
  const { Layout } = useTheme()

  const mapRef = useRef<MapView>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const [location, setLocation] = useState<Point>()
  const [placeId, setPlaceId] = useState<string>()

  const snapPoints = useMemo(() => ['25%', '80%'], [])
  const sessionToken = useMemo(() => uuid.v4() as string, [])

  const nearbySearchAsync = useCallback(
    async (locationToSearch: Point) => {
      if (locationToSearch) {
        const results = await nearbySearch(locationToSearch, sessionToken)
        const resultPlaceId =
          results?.length && results.length > 0 && results[0].place_id
        resultPlaceId && setPlaceId(resultPlaceId)
      }
    },
    [sessionToken, setPlaceId],
  )

  useEffect(() => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
        latitude: location?.lat as number,
        longitude: location?.lng as number,
      })
    }
  }, [location, mapRef])

  useEffect(() => {
    if (placeId) {
      bottomSheetModalRef.current?.present()
    }
  }, [placeId, bottomSheetModalRef])

  const onMapPress = useCallback(
    event => {
      const point = {
        lat: event.nativeEvent.coordinate.latitude,
        lng: event.nativeEvent.coordinate.longitude,
      }
      nearbySearchAsync(point)
      setLocation(point)
    },
    [nearbySearchAsync, setLocation],
  )

  const onLocationPicked = useCallback(
    (id: string, latLng: Point) => {
      setPlaceId(id)
      setLocation(latLng)
    },
    [setPlaceId, setLocation],
  )

  const clearPlaceId = useCallback(() => setPlaceId(undefined), [setPlaceId])

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      shadowColor: '#000',
    }),
    [],
  )

  return (
    <BottomSheetModalProvider>
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
          <Autocomplete
            sessionToken={sessionToken}
            setLocation={onLocationPicked}
          />
        </Box>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onDismiss={clearPlaceId}
          index={1}
          snapPoints={snapPoints}
          style={sheetStyle}
        >
          <PlaceInfoModal placeId={placeId} />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    elevation: 24,
  },
})

export default Map
