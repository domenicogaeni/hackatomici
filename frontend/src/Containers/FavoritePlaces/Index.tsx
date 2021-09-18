import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, HStack, Pressable, Text } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import InterestPlacePicker from '@/Components/InterestPlacePicker'
import uuid from 'react-native-uuid'
import { LocationPickerItem } from '@/Services/GooglePlaces/googlePlacesTypings'
import { filter, map, some } from 'lodash'
import { useDispatch } from 'react-redux'
import SetUser from '@/Store/User/SetUser'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { FavoritePlace } from '@/Models/FavoritePlace'

const FavoritePlaces = () => {
  const dispatch = useDispatch()

  const [interestPoints, setInterestPoints] = useState<
    (LocationPickerItem | FavoritePlace)[]
  >([])
  const [dirty, setDirty] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const sessionToken = useMemo(() => uuid.v4() as string, [])

  useEffect(() => {
    const fetchFavoritePlacesAsync = async () => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          return
        }

        const idToken = await currentUser.getIdToken()

        const getFavoritePlacesResponse = await fetch(
          Config.API_URL + '/users/favourite_places',
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + idToken,
              'Content-Type': 'application/json',
            },
          },
        )

        if (getFavoritePlacesResponse.status === 200) {
          setInterestPoints((await getFavoritePlacesResponse.json()).data)
        }
      } catch (signInError) {}
    }

    fetchFavoritePlacesAsync()
  }, [])

  const save = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        dispatch(SetUser.action({ shouldShowOnboarding: false }))
        return
      }

      const idToken = await currentUser.getIdToken()

      const result = await fetch(Config.API_URL + '/users/favourite_places', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          places_ids: map(interestPoints, 'place_id'),
        }),
      })

      if (result.status !== 200) {
        setError('Errore durante il salvataggio dei luoghi di interesse')
      }
    } catch (signInError) {}

    dispatch(SetUser.action({ shouldShowOnboarding: false }))
    setDirty(false)
  }, [dispatch, interestPoints, setError])

  const onPlacePicked = useCallback(
    (place: LocationPickerItem | FavoritePlace) => {
      setInterestPoints(prev =>
        some(prev, p => p.place_id === place.place_id)
          ? prev
          : [...prev, place],
      )
      setDirty(true)
    },
    [setInterestPoints, setDirty],
  )

  const removeItem = useCallback(
    (item: LocationPickerItem | FavoritePlace) => {
      setInterestPoints(prev =>
        filter(
          prev,
          (i: LocationPickerItem | FavoritePlace) =>
            i.place_id !== item.place_id,
        ),
      )
      setDirty(true)
    },
    [setInterestPoints, setDirty],
  )

  const renderItem = useCallback(
    (item: LocationPickerItem | FavoritePlace, index: number) => (
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
            {(item as LocationPickerItem).description ||
              (item as FavoritePlace).name}
          </Text>
          <Pressable onPress={() => removeItem(item)}>
            <Icon name="close-circle" size={22} color="#ef4444" />
          </Pressable>
        </HStack>
      </Box>
    ),
    [removeItem],
  )

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <Box height="100%" width="100%" bg="white" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Luoghi di interesse'}
        </Text>
        <InterestPlacePicker
          sessionToken={sessionToken}
          onPlacePicked={onPlacePicked}
        />
        {map(interestPoints, (interestPoint, index) =>
          renderItem(interestPoint, index),
        )}
        <Button marginTop={8} onPress={save} disabled={!dirty}>
          Salva
        </Button>
        {error && (
          <Text color="red.500" marginBottom={4}>
            {error}
          </Text>
        )}
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default FavoritePlaces
