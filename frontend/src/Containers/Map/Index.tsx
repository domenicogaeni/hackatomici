import { Autocomplete } from '@/Components'
import { nearbySearch } from '@/Services/GooglePlaces/googlePlacesApi'
import { Point } from '@/Services/GooglePlaces/googlePlacesTypings'
import { useTheme } from '@/Theme'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  View as RBView,
  Pressable,
} from 'native-base'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import uuid from 'react-native-uuid'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { useDispatch } from 'react-redux'
import SetUser from '@/Store/User/SetUser'
import { Config } from '@/Config'

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
      score: 1,
      vote: null,
    },
    {
      id: 2,
      user_id: 1,
      place_id: 'ChIJf4M-GsNEgUcR1JMVKCIm8qY',
      title: 'Obbligo delle mutande',
      description: 'Tenerlo dentro',
      level: 'white',
      type: 'verified',
      from: '2021-09-18',
      to: null,
      created_at: '2021-09-18 16:13:28',
      updated_at: '2021-09-18 16:13:28',
      score: 2,
      vote: 'up',
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
      score: 4,
      vote: 'up',
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
      score: -3,
      vote: 'down',
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
                  score={content.score}
                  vote={content.vote}
                  type={content.type}
                />
              ))}
            </View>
          </BottomSheetScrollView>
          <RBView p={4} bg="primary.50">
            <Button onPress={() => {}}>+ Aggiungi segnalazione</Button>
          </RBView>
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
  score: number
  vote: 'up' | 'down' | null
  id: string
  type: 'community' | 'verified'
}

const Report = ({
  title,
  description,
  color,
  dateFrom,
  dateTo,
  score,
  vote,
  id,
  type,
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
        {type === 'community' ? (
          <Score score={score} vote={vote} reportId={id} />
        ) : (
          <Icon name="shield-checkmark" size={22} color={'black'} />
        )}
      </HStack>
    </Box>
  )
}

interface ScoreProps {
  score: number
  vote: 'up' | 'down' | null
  reportId: string
}

const Score = ({ score, vote, reportId }: ScoreProps) => {
  const dispatch = useDispatch()
  const sendVote = useCallback(
    async value => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          dispatch(SetUser.action({ shouldShowOnboarding: false }))
          return
        }

        const idToken = await currentUser.getIdToken()

        await fetch(`${Config.API_URL}/reports/${reportId}/vote`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vote: value,
          }),
        })
      } catch (signInError) {}
    },
    [dispatch, reportId],
  )

  const removeVote = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      await fetch(`${Config.API_URL}/reports/${reportId}/vote`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
      })
    } catch (signInError) {}
  }, [reportId])

  return (
    <VStack alignItems="center" paddingX="1" bg="rgba(255, 255, 255, 0.2)">
      <Pressable
        onPress={() => (vote === 'up' ? removeVote() : sendVote('up'))}
      >
        <Icon
          name="caret-up-outline"
          size={22}
          color={vote === 'up' ? 'black' : 'grey'}
        />
      </Pressable>
      <Text>{score}</Text>
      <Pressable
        onPress={() => (vote === 'down' ? removeVote() : sendVote('down'))}
      >
        <Icon
          name="caret-down-outline"
          size={22}
          color={vote === 'down' ? 'black' : 'grey'}
        />
      </Pressable>
    </VStack>
  )
}

export default Map
