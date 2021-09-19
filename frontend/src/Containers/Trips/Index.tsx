import { ShortTrip } from '@/Models/Trip'
import { navigate } from '@/Navigators/utils'
import { Box, HStack, Text, VStack } from 'native-base'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { filter, map } from 'lodash'
import moment from 'moment'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

const Trips = () => {
  const [trips, setTrips] = useState<ShortTrip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTrips = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const getTripsResponse = await fetch(Config.API_URL + '/trips', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
      })

      if (getTripsResponse.status === 200) {
        setTrips((await getTripsResponse.json()).data)
      }
    } catch (readTripError) {}
  }, [setTrips])

  useEffect(() => {
    const fetchTripsAsync = async () => {
      setIsLoading(true)
      await fetchTrips()
      setIsLoading(false)
    }

    fetchTripsAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTrip = useCallback(
    () => navigate('AddTrip', { onTripAdded: fetchTrips }),
    [fetchTrips],
  )

  const removeTrip = useCallback(
    async (trip: ShortTrip) => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          return
        }

        const idToken = await currentUser.getIdToken()

        await fetch(`${Config.API_URL}/trips/${trip.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        })
      } catch (signInError) {}

      fetchTrips()
    },
    [fetchTrips],
  )

  const openTrip = useCallback(
    (trip: ShortTrip) => navigate('TripDetail', { tripId: trip.id }),
    [],
  )

  const renderItem = useCallback(
    (item: ShortTrip, index: number) => {
      const formattedFromDate = item.from
        ? moment(item.from, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : 'Oggi'
      const formattedToDate = item.to
        ? moment(item.to, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : 'Oggi'

      return (
        <TouchableOpacity
          key={`${item.id}_${index}`}
          onPress={() => openTrip(item)}
        >
          <Box borderRadius={8} bg="primary.500" padding={4} marginBottom={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack flex={1} marginRight={2}>
                <Text fontSize="xxs" color="primary.50">
                  {`${formattedFromDate} -> ${formattedToDate}`}
                </Text>
                <Text color="white" marginTop={1}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    fontSize="sm"
                    color="primary.100"
                    marginTop={1}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                )}
              </VStack>
              <TouchableOpacity onPress={() => removeTrip(item)}>
                <Icon name="chevron-forward-outline" size={20} color="white" />
              </TouchableOpacity>
            </HStack>
          </Box>
        </TouchableOpacity>
      )
    },
    [openTrip, removeTrip],
  )

  const ongoingTrips = useMemo(
    () =>
      filter(
        trips,
        trip =>
          moment(trip.from, 'YYYY-MM-DD').isSameOrBefore(moment(), 'date') &&
          moment(trip.to, 'YYYY-MM-DD').isSameOrAfter(moment(), 'date'),
      ),
    [trips],
  )

  const pastTrips = useMemo(
    () =>
      filter(trips, trip =>
        moment(trip.to, 'YYYY-MM-DD').isBefore(moment(), 'date'),
      ),
    [trips],
  )

  const futureTrips = useMemo(
    () =>
      filter(trips, trip =>
        moment(trip.from, 'YYYY-MM-DD').isAfter(moment(), 'date'),
      ),
    [trips],
  )

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <Box height="100%" flex={1} bg="white" padding={8}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={8}
        >
          <Text fontSize="3xl" fontWeight={600}>
            Itinerari
          </Text>
          <TouchableOpacity onPress={addTrip}>
            <Icon name="add-circle" size={32} color="#14b8a6" />
          </TouchableOpacity>
        </HStack>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            {ongoingTrips.length > 0 && (
              <>
                <Text color="gray.500" marginBottom={2}>
                  In corso
                </Text>
                {map(ongoingTrips, (trip, index) => renderItem(trip, index))}
              </>
            )}
            {futureTrips.length > 0 && (
              <>
                <Text color="gray.500" marginBottom={2}>
                  Programmati
                </Text>
                {map(futureTrips, (trip, index) => renderItem(trip, index))}
              </>
            )}
            {pastTrips.length > 0 && (
              <>
                <Text color="gray.500" marginBottom={2}>
                  Passati
                </Text>
                {map(pastTrips, (trip, index) => renderItem(trip, index))}
              </>
            )}
          </>
        )}
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default Trips
