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
import { Place } from '@/Models/Place'
import { navigate } from '@/Navigators/utils'

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
  level: 'white' | 'yellow' | 'orange' | 'red'
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

interface ReportProps {
  title: string
  description: string
  color: string
  dateFrom: string
  dateTo: string
  score: number
  vote: 'up' | 'down' | null
  id: number
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
  reportId: number
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
