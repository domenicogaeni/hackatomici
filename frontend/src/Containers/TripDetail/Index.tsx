import React, { useCallback, useEffect, useState } from 'react'
import { goBack, navigate } from '@/Navigators/utils'
import { Box, HStack, Pressable, Text, VStack } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { HeaderBackButton } from '@react-navigation/stack'
import { map } from 'lodash'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { Stop, Trip } from '@/Models/Trip'
import TripStop from '../TripStop'
import moment from 'moment'
import TripStopPlaceHolder from '../TripStopPlaceHolder'
import TripStopConnector from '../TripStopConnector'
import TripCircleIcon from '../TripCircleIcon'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { ActivityIndicator } from 'react-native'

const TripDetail = ({ route }: any) => {
  const { tripId } = route.params || {}

  const [trip, setTrip] = useState<Trip>()
  const [isLoading, setIsLoading] = useState(true)

  const fetchTrip = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const getTripResponse = await fetch(`${Config.API_URL}/trips/${tripId}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
      })

      if (getTripResponse.status === 200) {
        setTrip((await getTripResponse.json()).data)
      }
    } catch (readTripError) {}
  }, [tripId, setTrip])

  useEffect(() => {
    const fetchTripAsync = async () => {
      setIsLoading(true)
      await fetchTrip()
      setIsLoading(false)
    }

    fetchTripAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTripStop = useCallback(() => {
    if (trip) {
      navigate('AddTripStop', { tripId: trip.id, onTripStopAdded: fetchTrip })
    }
  }, [fetchTrip, trip])

  const openPlaceDetail = useCallback((placeId: string) => {
    // TODO: open place detail
    console.log(placeId)
  }, [])

  const renderStop = useCallback(
    (stop: Stop, index: number) => (
      <TripStop
        key={`${stop.id}_${index}`}
        stop={stop}
        openPlaceDetail={openPlaceDetail}
      />
    ),
    [openPlaceDetail],
  )

  const formattedFromDate = trip?.from
    ? moment(trip.from, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'Oggi'
  const formattedToDate = trip?.to
    ? moment(trip.to, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'Oggi'

  return (
    <BottomSheetModalProvider>
      <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
        <HeaderBackButton onPress={goBack} label="Indietro" />
        {isLoading || !trip ? (
          <ActivityIndicator />
        ) : (
          <Box height="100%" width="100%" bg="white" marginBottom={8}>
            <Box paddingX={8}>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                marginBottom={1}
              >
                <Text fontSize="3xl" fontWeight={600}>
                  {trip.name}
                </Text>
                <Pressable onPress={addTripStop}>
                  <Icon name="add-circle" size={32} color="#14b8a6" />
                </Pressable>
              </HStack>
              {trip.description && (
                <Text marginBottom={8} color="gray.500">
                  {trip.description}
                </Text>
              )}
            </Box>
            <Box paddingX={4}>
              <HStack alignItems="center">
                <TripCircleIcon name="play" />
                <VStack flex={1}>
                  <Text fontSize="xs" color="gray.400">
                    {formattedFromDate}
                  </Text>
                  <Text>Inizio itinerario</Text>
                </VStack>
              </HStack>
              {(trip.stops?.length || 0) > 0 ? (
                map(trip.stops, (stop, index) => renderStop(stop, index))
              ) : (
                <TripStopPlaceHolder onAddStop={addTripStop} />
              )}
              <TripStopConnector />
              <HStack alignItems="center">
                <TripCircleIcon name="stop" />
                <VStack flex={1}>
                  <Text fontSize="xs" color="gray.400">
                    {formattedToDate}
                  </Text>
                  <Text>Fine itinerario</Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        )}
      </KeyboardAwareScrollView>
    </BottomSheetModalProvider>
  )
}

export default TripDetail
