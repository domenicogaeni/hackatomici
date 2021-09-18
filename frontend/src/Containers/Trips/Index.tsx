import { ShortTrip } from '@/Models/Trip'
import { navigate } from '@/Navigators/utils'
import { Box, HStack, Pressable, Text, VStack } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { map } from 'lodash'
import moment from 'moment'
import { useIsFocused } from '@react-navigation/core'

const Trips = () => {
  const isFocused = useIsFocused()

  const [trips, setTrips] = useState<ShortTrip[]>([
    {
      id: 1,
      description: null,
      name: 'Test trip',
      from: moment().add(1, 'days').format('YYYY-MM-DD'),
      to: moment().add(2, 'days').format('YYYY-MM-DD'),
    },
    {
      id: 2,
      description:
        'This trip is just a test bye bye hello hello, very long description breaking everything deheheh',
      name: 'Test trip 2',
      from: moment().add(1, 'days').format('YYYY-MM-DD'),
      to: moment().add(2, 'days').format('YYYY-MM-DD'),
    },
  ])

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
    if (isFocused) {
      fetchTrips()
    }
  }, [fetchTrips, isFocused])

  const addTrip = useCallback(() => navigate('AddTrip', {}), [])

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
        <Pressable key={`${item.id}_${index}`} onPress={() => openTrip(item)}>
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
              <Pressable onPress={() => removeTrip(item)}>
                <Icon name="chevron-forward-outline" size={20} color="white" />
              </Pressable>
            </HStack>
          </Box>
        </Pressable>
      )
    },
    [openTrip, removeTrip],
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
        </HStack>
        {map(trips, (trip, index) => renderItem(trip, index))}
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default Trips
