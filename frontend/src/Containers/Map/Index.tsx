import { Autocomplete } from '@/Components'
import { nearbySearch } from '@/Services/GooglePlaces/googlePlacesApi'
import { Point } from '@/Services/GooglePlaces/googlePlacesTypings'
import { useTheme } from '@/Theme'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { Box, HStack, Text, VStack } from 'native-base'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import uuid from 'react-native-uuid'

const initialRegion = {
  latitude: 45.7314,
  longitude: 9.63715,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

const test = {
  data: [
    {
      id: 1,
      user_id: 1,
      place_id: 'ChIJFdPdCFtUgUcR-aSIb382exY',
      title: 'Obbligo della mascherina',
      description: 'Metti sta cazzo di mascherina',
      level: 'yellow',
      type: 'community',
      from: '2021-09-18',
      to: null,
      created_at: '2021-09-18 15:31:45',
      updated_at: '2021-09-18 15:31:45',
    },
    {
      id: 2,
      user_id: 1,
      place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
      title: 'Obbligo delle mutande',
      description: 'Tenerlo dentro',
      level: 'white',
      type: 'community',
      from: '2021-09-18',
      to: null,
      created_at: '2021-09-18 16:13:28',
      updated_at: '2021-09-18 16:13:28',
    },
    {
      id: 3,
      user_id: 1,
      place_id: 'ChIJFdPdCFtUgUcR-aSIb382exY',
      title: 'Obbligo della mascherina',
      description: 'Metti sta cazzo di mascherina',
      level: 'orange',
      type: 'community',
      from: '2021-09-18',
      to: null,
      created_at: '2021-09-18 15:31:45',
      updated_at: '2021-09-18 15:31:45',
    },
    {
      id: 4,
      user_id: 1,
      place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
      title: 'Obbligo delle mutande',
      description: 'Tenerlo dentro',
      level: 'red',
      type: 'community',
      from: '2021-09-18',
      to: null,
      created_at: '2021-09-18 16:13:28',
      updated_at: '2021-09-18 16:13:28',
    },
  ],
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

  const nearbySearchAsync = useCallback(async () => {
    if (location) {
      const results = await nearbySearch(location, sessionToken)
      const resultPlaceId =
        results?.length && results.length > 0 && results[0].place_id
      // richiesta a backend con placeId ed eventuale apertura bottom sheet
      handlePresentModalPress()
    }
  }, [location, sessionToken, handlePresentModalPress])

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
              Nome posto
            </Text>
            <Text color="gray.600">Descrizione</Text>
          </View>
          <BottomSheetScrollView>
            <View style={{ padding: 16 }}>
              {test.data?.map((content, index) => (
                <Report
                  key={index}
                  title={content.title}
                  description={content.description}
                  color={content.level}
                  dateFrom={content.from}
                  dateTo={content.to}
                />
              ))}
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

interface ReportProps {
  title: string
  description: string
  color: string
  dateFrom: string
  dateTo: string
}

const Report = ({
  title,
  description,
  color,
  dateFrom,
  dateTo,
}: ReportProps) => {
  return (
    <Box
      bg={color !== 'white' ? `${color}.400` : 'white'}
      py={4}
      px={3}
      mb={4}
      rounded="md"
      alignSelf="center"
      width={375}
      maxWidth="100%"
      borderColor="gray.100"
      borderWidth={color === 'white' ? 1 : 0}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space={2}>
            <Text
              fontSize="xxs"
              color={
                color !== 'white' && color !== 'yellow' ? 'white' : 'gray.600'
              }
            >
              {dateFrom || ''} {'->'} {dateTo || 'now'}
            </Text>
            <Text
              color={
                color !== 'white' && color !== 'yellow' ? 'white' : 'black'
              }
              fontSize="xl"
            >
              {title}
            </Text>
            <Text
              color={
                color !== 'white' && color !== 'yellow' ? 'white' : 'black'
              }
              fontSize="sm"
            >
              {description}
            </Text>
          </VStack>
        </Box>
      </HStack>
    </Box>
  )
}

export default Map
