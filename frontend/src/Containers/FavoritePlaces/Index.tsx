import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, HStack, Text } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PlacePicker from '@/Components/PlacePicker'
import uuid from 'react-native-uuid'
import { LocationPickerItem } from '@/Services/GooglePlaces/googlePlacesTypings'
import { map } from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { Place } from '@/Models/Place'
import { HeaderBackButton } from '@react-navigation/stack'
import { goBack } from '@/Navigators/utils'
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'

const FavoritePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState<string>()
  const [shouldShowPointPicker, setShouldShowPointPicker] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isRefreshing, setRefreshing] = useState(false)

  const sessionToken = useMemo(() => uuid.v4() as string, [])

  const fetchFavoritePlaces = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const getFavoritePlacesResponse = await fetch(
        `${Config.API_URL}/users/favourite_places`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        },
      )

      if (getFavoritePlacesResponse.status === 200) {
        setPlaces((await getFavoritePlacesResponse.json()).data)
      }
    } catch (getPlacesError) {}
  }, [setPlaces])

  useEffect(() => {
    const fetchFavoritePlacesAsync = async () => {
      setLoading(true)
      await fetchFavoritePlaces()
      setLoading(false)
    }

    fetchFavoritePlacesAsync()
  }, [fetchFavoritePlaces])

  const deletePlace = useCallback(
    async (place: Place) => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          return
        }

        const idToken = await currentUser.getIdToken()

        const result = await fetch(
          `${Config.API_URL}/users/favourite_places/${place.place_id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + idToken,
              'Content-Type': 'application/json',
            },
          },
        )

        if (result.status !== 200) {
          setError("Errore durante l'eliminazione di un luogo di interesse")
        }
      } catch (deletePlaceError) {}
    },
    [setError],
  )

  const removeItem = useCallback(
    async (item: Place) => {
      setLoading(true)
      await deletePlace(item)
      await fetchFavoritePlaces()
      setLoading(false)
    },
    [deletePlace, fetchFavoritePlaces],
  )

  const addPlace = useCallback(
    async (place: LocationPickerItem) => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          return
        }

        const idToken = await currentUser.getIdToken()

        const result = await fetch(`${Config.API_URL}/users/favourite_places`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            places_ids: [place.place_id],
          }),
        })

        if (result.status !== 200) {
          setError('Errore durante il salvataggio dei luoghi di interesse')
        }
      } catch (addPlaceError) {}
    },
    [setError],
  )

  const onPlacePicked = useCallback(
    async (place: LocationPickerItem) => {
      setLoading(true)
      setShouldShowPointPicker(false)
      await addPlace(place)
      await fetchFavoritePlaces()
      setLoading(false)
    },
    [addPlace, fetchFavoritePlaces],
  )

  const showPointPicker = useCallback(() => setShouldShowPointPicker(true), [
    setShouldShowPointPicker,
  ])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchFavoritePlaces()
    setRefreshing(false)
  }, [fetchFavoritePlaces, setRefreshing])

  const renderItem = useCallback(
    (item: Place, index: number) => (
      <Box
        borderRadius={4}
        borderWidth={1}
        borderColor="primary.300"
        padding={3}
        marginTop={2}
        key={`${item.place_id}_${index}`}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text flex={1} marginRight={2}>
            {`${item.name}${
              item.administrative_area_level_2
                ? `, ${item.administrative_area_level_2}`
                : ''
            }${
              item.administrative_area_level_1
                ? `, ${item.administrative_area_level_1}`
                : ''
            }${item.country ? `, ${item.country}` : ''}`}
          </Text>
          <TouchableOpacity onPress={() => removeItem(item)}>
            <Icon name="close-circle" size={22} color="#ef4444" />
          </TouchableOpacity>
        </HStack>
      </Box>
    ),
    [removeItem],
  )

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: 'white' }}
    >
      <HeaderBackButton onPress={goBack} label="Indietro" />
      <Box height="100%" width="100%" bg="white" paddingX={8}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={8}
        >
          <Text fontSize="3xl" fontWeight={600}>
            Luoghi d'interesse
          </Text>
          <TouchableOpacity onPress={showPointPicker}>
            <Icon name="add-circle" size={32} color="#14b8a6" />
          </TouchableOpacity>
        </HStack>
        {isLoading ? (
          <ActivityIndicator size="large" color="primary.500" />
        ) : (
          <>
            {shouldShowPointPicker && (
              <Box marginBottom={4}>
                <PlacePicker
                  sessionToken={sessionToken}
                  onPlacePicked={onPlacePicked}
                />
              </Box>
            )}
            {error && (
              <Text color="red.500" marginBottom={4}>
                {error}
              </Text>
            )}
            {(places?.length || 0) > 0 && (
              <Box marginBottom={8}>
                {map(places, (place, index) => renderItem(place, index))}
              </Box>
            )}
          </>
        )}
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default FavoritePlaces
