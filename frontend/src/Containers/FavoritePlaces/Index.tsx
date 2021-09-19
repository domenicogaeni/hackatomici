import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import PlaceInfoModal from '@/Components/PlaceInfoModal'
import { SafeAreaView } from 'react-native-safe-area-context'

const FavoritePlaces = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState<string>()
  const [shouldShowPointPicker, setShouldShowPointPicker] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isRefreshing, setRefreshing] = useState(false)
  const [placeId, setPlaceId] = useState<string>()

  const sessionToken = useMemo(() => uuid.v4() as string, [])
  const snapPoints = useMemo(() => ['25%', '80%'], [])

  useEffect(() => {
    if (!places || places.length === 0) {
      setEditMode(false)
    }
  }, [places, setEditMode])

  useEffect(() => {
    if (placeId) {
      bottomSheetModalRef.current?.present()
    }
  }, [placeId, bottomSheetModalRef])

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
      setRefreshing(true)
      await deletePlace(item)
      await fetchFavoritePlaces()
      setRefreshing(false)
    },
    [setRefreshing, deletePlace, fetchFavoritePlaces],
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchFavoritePlaces()
    setRefreshing(false)
  }, [fetchFavoritePlaces, setRefreshing])

  const clearPlaceId = useCallback(() => setPlaceId(undefined), [setPlaceId])

  const renderItem = useCallback(
    (item: Place, index: number) => (
      <TouchableOpacity
        disabled={isEditMode}
        onPress={() => setPlaceId(item.place_id)}
      >
        <Box
          borderRadius={4}
          bg="primary.500"
          padding={4}
          marginBottom={4}
          key={`${item.place_id}_${index}`}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <Text flex={1} marginRight={4} color="white">
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
            {isEditMode ? (
              <TouchableOpacity onPress={() => removeItem(item)}>
                <Icon name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <Icon name="chevron-forward-outline" size={20} color="white" />
            )}
          </HStack>
        </Box>
      </TouchableOpacity>
    ),
    [isEditMode, removeItem],
  )

  const startEdit = useCallback(() => {
    setEditMode(true)
    setShouldShowPointPicker(false)
  }, [setEditMode, setShouldShowPointPicker])

  const stopEdit = useCallback(() => {
    setEditMode(false)
  }, [setEditMode])

  const showPointPicker = useCallback(() => setShouldShowPointPicker(true), [
    setShouldShowPointPicker,
  ])

  const hidePointPicker = useCallback(() => setShouldShowPointPicker(false), [
    setShouldShowPointPicker,
  ])

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
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          style={{ backgroundColor: 'white' }}
        >
          <HeaderBackButton onPress={goBack} label="Indietro" />
          <Box height="100%" width="100%" bg="white" padding={8}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom={8}
            >
              <Text flex={1} fontSize="3xl" fontWeight={600} marginRight={2}>
                {"Luoghi\nd'interesse"}
              </Text>
              <HStack>
                {(places?.length || 0) > 0 && (
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
                {shouldShowPointPicker ? (
                  <TouchableOpacity
                    onPress={hidePointPicker}
                    disabled={isEditMode}
                  >
                    <Icon
                      name="close-circle"
                      size={32}
                      color={isEditMode ? '#a1a1aa' : '#14b8a6'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={showPointPicker}
                    disabled={isEditMode}
                  >
                    <Icon
                      name="add-circle"
                      size={32}
                      color={isEditMode ? '#a1a1aa' : '#14b8a6'}
                    />
                  </TouchableOpacity>
                )}
              </HStack>
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
            <PlaceInfoModal placeId={placeId} canToggleFavourite={false} />
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

export default FavoritePlaces
