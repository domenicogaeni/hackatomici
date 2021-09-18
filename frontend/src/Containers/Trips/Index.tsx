import { Trip } from '@/Models/Trip'
import { navigate } from '@/Navigators/utils'
import { Box, HStack, Pressable, Text, VStack } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { map } from 'lodash'
import moment from 'moment'

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([])

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
    fetchTrips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTrip = useCallback(async () => {
    await navigate('AddTrip', {})
    fetchTrips()
  }, [fetchTrips])

  const removeTrip = useCallback(
    async (trip: Trip) => {
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

  const renderItem = useCallback(
    (item: Trip, index: number) => {
      const formattedFromDate = item.from_date
        ? moment(item.from_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : 'Oggi'
      const formattedToDate = item.to_date
        ? moment(item.to_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : 'Oggi'

      return (
        <Box
          key={`${item.id}_${index}`}
          borderRadius={8}
          bg="primary"
          padding={4}
          marginBottom={4}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontSize="xxs" color="white">
                {`${formattedFromDate} -> ${formattedToDate}`}
              </Text>
              <Text color="white" marginTop={2}>
                {item.name}
              </Text>
              {item.description && (
                <Text fontSize="sm" color="white" marginTop={2}>
                  {item.description}
                </Text>
              )}
            </VStack>
            <Pressable onPress={() => removeTrip(item)}>
              <Icon name="chevron-forward-outline" size={20} color="white" />
            </Pressable>
          </HStack>
        </Box>
      )
    },
    [removeTrip],
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
          <Pressable onPress={addTrip}>
            <Icon name="add-circle" size={32} color="#14b8a6" />
          </Pressable>
          {map(trips, (trip, index) => renderItem(trip, index))}
        </HStack>
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default Trips
