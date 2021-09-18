import { Autocomplete } from '@/Components'
import { nearbySearch } from '@/Services/GooglePlaces/googlePlacesApi'
import { Point } from '@/Services/GooglePlaces/googlePlacesTypings'
import { useTheme } from '@/Theme'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { Box, Button, Text, View as RBView } from 'native-base'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import uuid from 'react-native-uuid'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { Place } from '@/Models/Place'
import { navigate } from '@/Navigators/utils'
import Report from '@/Components/Report'
import { WarningLevel } from '@/Models/Trip'

const initialRegion = {
  latitude: 45.7314,
  longitude: 9.63715,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

interface Report {
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

const Map = () => {
  const { Layout } = useTheme()
  const mapRef = useRef<MapView>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ['25%', '80%'], [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const [location, setLocation] = useState<Point>()

  const sessionToken = useMemo(() => uuid.v4() as string, [])

  const [currentInfo, setCurrentInfo] = useState<Place>()
  const [currentReports, setCurrentReports] = useState<Report[]>()
  const [placeId, setPlaceId] = useState<string>()

  const getInfo = useCallback(
    (placeId: string) => {
      const fetchReportsAsync = async () => {
        try {
          const currentUser = await auth().currentUser
          if (!currentUser) {
            return
          }

          const idToken = await currentUser.getIdToken()

          const getReportsResponse = await fetch(
            Config.API_URL + `/places/${placeId}`,
            {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ' + idToken,
                'Content-Type': 'application/json',
              },
            },
          )

          if (getReportsResponse.status === 200) {
            setCurrentInfo((await getReportsResponse.json()).data)
            handlePresentModalPress()
          }
        } catch (signInError) {}
      }

      fetchReportsAsync()
    },
    [handlePresentModalPress],
  )

  console.log(currentInfo)

  const getReports = useCallback((placeId: string) => {
    const fetchReportsAsync = async () => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          return
        }

        const idToken = await currentUser.getIdToken()

        const getReportsResponse = await fetch(
          Config.API_URL + `/reports/places/${placeId}`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + idToken,
              'Content-Type': 'application/json',
            },
          },
        )

        if (getReportsResponse.status === 200) {
          setCurrentReports((await getReportsResponse.json()).data)
        }
      } catch (signInError) {}
    }

    fetchReportsAsync()
  }, [])

  const nearbySearchAsync = useCallback(async () => {
    if (location) {
      const results = await nearbySearch(location, sessionToken)
      const resultPlaceId =
        results?.length && results.length > 0 && results[0].place_id
      resultPlaceId && setPlaceId(resultPlaceId)
      resultPlaceId && getInfo(resultPlaceId)
      resultPlaceId && getReports(resultPlaceId)
    }
  }, [location, sessionToken, getReports, getInfo])

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

  const addReport = useCallback(() => navigate('AddReport', { placeId }), [
    placeId,
  ])

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
          <Autocomplete sessionToken={sessionToken} setLocation={setLocation} />
        </Box>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text fontSize="3xl" marginBottom={4} fontWeight={600}>
              {currentInfo?.name}
            </Text>
            <Text color="gray.600">
              {currentInfo
                ? `${
                    currentInfo.administrative_area_level_2
                      ? currentInfo.administrative_area_level_2 + ', '
                      : ''
                  }${
                    currentInfo.administrative_area_level_1
                      ? currentInfo.administrative_area_level_1 + ', '
                      : ''
                  }${currentInfo.country}`
                : ''}
            </Text>
          </View>
          <BottomSheetScrollView>
            <View style={{ padding: 16 }}>
              {currentReports?.map((content, index) => (
                <Report
                  key={index}
                  title={content.title}
                  description={content.description}
                  color={content.level}
                  dateFrom={content.from}
                  dateTo={content.to}
                  score={content.score}
                  vote={content.vote}
                  type={content.type}
                  id={content.id}
                />
              ))}
            </View>
          </BottomSheetScrollView>
          <RBView p={4} bg="primary.50">
            <Button onPress={addReport}>+ Aggiungi segnalazione</Button>
          </RBView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

export default Map
