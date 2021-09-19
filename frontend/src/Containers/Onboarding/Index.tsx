import React, { useCallback, useMemo } from 'react'
import { Box, Button, HStack, Text } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PlacePicker from '@/Components/PlacePicker'
import uuid from 'react-native-uuid'
import { LocationPickerItem } from '@/Services/GooglePlaces/googlePlacesTypings'
import { filter, map } from 'lodash'
import { useDispatch } from 'react-redux'
import SetUser from '@/Store/User/SetUser'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { TouchableOpacity } from 'react-native'

const Onboarding = () => {
  const dispatch = useDispatch()

  const [interestPoints, setInterestPoints] = React.useState<
    LocationPickerItem[]
  >([])

  const sessionToken = useMemo(() => uuid.v4() as string, [])

  const onPlacePicked = useCallback((place: LocationPickerItem) => {
    setInterestPoints(prev => [...prev, place])
  }, [])

  const removeItem = useCallback(
    (item: LocationPickerItem) => {
      setInterestPoints(prev =>
        filter(prev, (i: LocationPickerItem) => i.place_id !== item.place_id),
      )
    },
    [setInterestPoints],
  )

  const renderItem = useCallback(
    (item: LocationPickerItem, index: number) => (
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
            {item.description}
          </Text>
          <TouchableOpacity onPress={() => removeItem(item)}>
            <Icon name="close-circle" size={22} color="#ef4444" />
          </TouchableOpacity>
        </HStack>
      </Box>
    ),
    [removeItem],
  )

  const save = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        dispatch(SetUser.action({ shouldShowOnboarding: false }))
        return
      }

      const idToken = await currentUser.getIdToken()

      await fetch(Config.API_URL + '/users/favourite_places', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place_ids: map(interestPoints, 'place_id'),
        }),
      })
    } catch (signInError) {}

    dispatch(SetUser.action({ shouldShowOnboarding: false }))
  }, [dispatch, interestPoints])

  const continueWithoutPOIs = useCallback(() => {
    dispatch(SetUser.action({ shouldShowOnboarding: false }))
  }, [dispatch])

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <Box height="100%" width="100%" bg="white" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Imposta i tuoi\nluoghi di interesse!'}
        </Text>
        <PlacePicker
          sessionToken={sessionToken}
          onPlacePicked={onPlacePicked}
        />
        {map(interestPoints, (interestPoint, index) =>
          renderItem(interestPoint, index),
        )}
        <Button
          marginTop={8}
          onPress={save}
          disabled={interestPoints.length === 0}
        >
          Salva
        </Button>
        <Button variant="link" marginTop={4} onPress={continueWithoutPOIs}>
          Continua senza punti di interesse
        </Button>
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default Onboarding
