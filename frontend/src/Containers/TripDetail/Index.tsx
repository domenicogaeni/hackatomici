import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { goBack, navigate } from '@/Navigators/utils'
import { Box, HStack, Text, VStack } from 'native-base'
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
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import PlaceInfoModal from '@/Components/PlaceInfoModal'
import { SafeAreaView } from 'react-native-safe-area-context'

const TripDetail = ({ route }: any) => {
  const { tripId } = route.params || {}

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ['25%', '80%'], [])

  const [trip, setTrip] = useState<Trip>()
  const [placeId, setPlaceId] = useState<string>()
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

  useEffect(() => {
    if (placeId) {
      bottomSheetModalRef.current?.present()
    }
  }, [placeId, bottomSheetModalRef])

  const addTripStop = useCallback(() => {
    if (trip) {
      navigate('AddTripStop', {
        tripId: trip.id,
        onTripStopAdded: fetchTrip,
        minimumDate: moment(trip?.from).toDate(),
        maximumDate: moment(trip?.to).toDate(),
      })
    }
  }, [fetchTrip, trip])

  const renderStop = useCallback(
    (stop: Stop, index: number) => (
      <TripStop
        key={`${stop.id}_${index}`}
        stop={stop}
        openPlaceDetail={setPlaceId}
      />
    ),
    [setPlaceId],
  )

  const clearPlaceId = useCallback(() => setPlaceId(undefined), [setPlaceId])

  const formattedFromDate = trip?.from
    ? moment(trip.from, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'Oggi'
  const formattedToDate = trip?.to
    ? moment(trip.to, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'Oggi'

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      shadowColor: '#000',
    }),
    [],
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BottomSheetModalProvider>
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
          <HeaderBackButton onPress={goBack} label="Indietro" />
          {isLoading || !trip ? (
            <ActivityIndicator color="primary.500" size="large" />
          ) : (
            <Box height="100%" width="100%" bg="white" marginY={8}>
              <Box paddingX={8}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="3xl" fontWeight={600}>
                    {trip.name}
                  </Text>
                  <TouchableOpacity onPress={addTripStop}>
                    <Icon name="add-circle" size={32} color="#14b8a6" />
                  </TouchableOpacity>
                </HStack>
                {trip.description && (
                  <Text marginTop={1} color="gray.500">
                    {trip.description}
                  </Text>
                )}
              </Box>
              <Box marginTop={8} paddingX={4}>
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
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onDismiss={clearPlaceId}
          index={1}
          snapPoints={snapPoints}
          style={sheetStyle}
        >
          <SafeAreaView
            edges={['bottom']}
            style={{ flex: 1, backgroundColor: 'white' }}
          >
            <PlaceInfoModal placeId={placeId} />
          </SafeAreaView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
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

export default TripDetail
