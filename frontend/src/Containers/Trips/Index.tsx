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
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Trips = () => {
  const [trips, setTrips] = useState<ShortTrip[]>([])
  const [isEditMode, setEditMode] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [isRefreshing, setRefreshing] = useState(false)

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
      setLoading(true)
      await fetchTrips()
      setLoading(false)
    }

    fetchTripsAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!trips || trips.length === 0) {
      setEditMode(false)
    }
  }, [trips, setEditMode])

  const addTrip = useCallback(
    () => navigate('AddTrip', { onTripAdded: fetchTrips }),
    [fetchTrips],
  )

  const removeTrip = useCallback(async (trip: ShortTrip) => {
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
  }, [])

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
          disabled={isEditMode}
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
              {isEditMode ? (
                <TouchableOpacity
                  onPress={async () => {
                    setRefreshing(true)
                    await removeTrip(item)
                    await fetchTrips()
                    setRefreshing(false)
                  }}
                >
                  <Icon name="close-circle" size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <Icon name="chevron-forward-outline" size={20} color="white" />
              )}
            </HStack>
          </Box>
        </TouchableOpacity>
      )
    },
    [isEditMode, openTrip, removeTrip, fetchTrips],
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchTrips()
    setRefreshing(false)
  }, [fetchTrips, setRefreshing])

  const startEdit = useCallback(() => {
    setEditMode(true)
  }, [setEditMode])

  const stopEdit = useCallback(() => {
    setEditMode(false)
  }, [setEditMode])

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
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        style={{ backgroundColor: 'white' }}
      >
        <Box height="100%" flex={1} bg="white" padding={8}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom={8}
          >
            <Text flex={1} fontSize="3xl" fontWeight={600} marginRight={2}>
              Itinerari
            </Text>
            <HStack>
              {(trips?.length || 0) > 0 && (
                <>
                  {isEditMode ? (
                    <Box marginRight={2}>
                      <TouchableOpacity onPress={stopEdit}>
                        <Icon
                          name="checkmark-circle"
                          size={32}
                          color="#14b8a6"
                        />
                      </TouchableOpacity>
                    </Box>
                  ) : (
                    <Box marginRight={2}>
                      <TouchableOpacity onPress={startEdit}>
                        <Icon name="create" size={32} color="#14b8a6" />
                      </TouchableOpacity>
                    </Box>
                  )}
                </>
              )}
              <TouchableOpacity onPress={addTrip} disabled={isEditMode}>
                <Icon
                  name="add-circle"
                  size={32}
                  color={isEditMode ? '#a1a1aa' : '#14b8a6'}
                />
              </TouchableOpacity>
            </HStack>
          </HStack>
          {isLoading ? (
            <ActivityIndicator color="primary.500" size="large" />
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
    </SafeAreaView>
  )
}

export default Trips
