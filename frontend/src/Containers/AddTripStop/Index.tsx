import React, { useCallback, useMemo, useState } from 'react'
import { goBack } from '@/Navigators/utils'
import { Box, Button, HStack, Text } from 'native-base'
import auth from '@react-native-firebase/auth'
import { Keyboard, TouchableOpacity } from 'react-native'
import uuid from 'react-native-uuid'
import Icon from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from '@react-navigation/stack'
import moment from 'moment'
import { Config } from '@/Config'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LocationPickerItem } from '@/Services/GooglePlaces/googlePlacesTypings'
import { filter, map, some } from 'lodash'
import PlacePicker from '@/Components/PlacePicker'

const AddTripStop = ({ route }: any) => {
  const { tripId, onTripStopAdded, minimumDate, maximumDate } =
    route.params || {}

  const [place, setPlace] = useState<LocationPickerItem>()
  const [dateFrom, setDateFrom] = useState<Date>(minimumDate)
  const [dateTo, setDateTo] = useState<Date>(minimumDate)
  const [points, setPoints] = useState<LocationPickerItem[]>([])
  const [error, setError] = useState<string | undefined>()
  const [shouldShowPointPicker, setShouldShowPointPicker] = useState(false)
  const [dateFromPicked, setDateFromPicked] = useState(false)
  const [dateToPicked, setDateToPicked] = useState(false)

  const sessionToken = useMemo(() => uuid.v4() as string, [])

  const addStop = useCallback(async () => {
    Keyboard.dismiss()

    if (!place || !dateFrom || !dateTo) {
      setError('Per favore, riempi tutti i campi')
      return
    }

    if (moment(dateFrom).isAfter(moment(dateTo))) {
      setError('La data di inizio deve essere precedente alla data di fine')
      return
    }

    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const addStopResponse = await fetch(
        `${Config.API_URL}/trips/${tripId}/stops`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            place_id: place.place_id,
            from: moment(dateFrom).format('YYYY-MM-DD'),
            to: moment(dateTo).format('YYYY-MM-DD'),
            points: map(points, point => point.place_id),
          }),
        },
      )

      if (addStopResponse.status === 200) {
        onTripStopAdded?.()
        goBack()
      }
    } catch (addStopError) {}
  }, [place, dateFrom, dateTo, tripId, points, onTripStopAdded])

  const onChangePlace = useCallback(
    (item: LocationPickerItem) => {
      setError(undefined)
      setPlace(item)
    },
    [setError, setPlace],
  )

  const onChangeDateFrom = useCallback(
    (_, date?: Date | undefined) => {
      if (date) {
        setDateFrom(date)
        setDateFromPicked(true)
      }
    },
    [setDateFrom, setDateFromPicked],
  )

  const onChangeDateTo = useCallback(
    (_, date?: Date | undefined) => {
      if (date) {
        setDateTo(date)
        setDateToPicked(true)
      }
    },
    [setDateTo, setDateToPicked],
  )

  const showPointPicker = useCallback(() => setShouldShowPointPicker(true), [
    setShouldShowPointPicker,
  ])

  const onPointPicked = useCallback(
    (point: LocationPickerItem) => {
      console.log('setPoints', point)
      setPoints(prev =>
        some(prev, p => p.place_id === point.place_id)
          ? prev
          : [...prev, point],
      )
      setShouldShowPointPicker(false)
    },
    [setPoints, setShouldShowPointPicker],
  )

  const removePoint = useCallback(
    (item: LocationPickerItem) => {
      setPoints(prev =>
        filter(prev, (i: LocationPickerItem) => i.place_id !== item.place_id),
      )
    },
    [setPoints],
  )

  const renderPoint = useCallback(
    (item: LocationPickerItem, index: number) => (
      <Box
        borderRadius={4}
        borderWidth={1}
        borderColor="primary.300"
        padding={3}
        marginBottom={2}
        key={`${item.place_id}_${index}`}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text flex={1} marginRight={2}>
            {item.description}
          </Text>
          <TouchableOpacity onPress={() => removePoint(item)}>
            <Icon name="close-circle" size={22} color="#ef4444" />
          </TouchableOpacity>
        </HStack>
      </Box>
    ),
    [removePoint],
  )

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <HeaderBackButton onPress={goBack} label="Indietro" />
      <Box height="100%" width="100%" bg="white" paddingX={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          Aggiungi una tappa!
        </Text>
        <Box marginBottom={4}>
          <PlacePicker
            sessionToken={sessionToken}
            onPlacePicked={onChangePlace}
            autoClean={false}
          />
        </Box>
        <Text marginBottom={2}>Data di inizio:</Text>
        <Box marginBottom={4}>
          <DateTimePicker
            value={dateFrom}
            mode="date"
            display="default"
            onChange={onChangeDateFrom}
            minimumDate={minimumDate}
            maximumDate={dateToPicked ? dateTo : maximumDate}
            style={{ flex: 1 }}
          />
        </Box>
        <Text marginBottom={2}>Data di fine:</Text>
        <Box marginBottom={8}>
          <DateTimePicker
            value={dateTo}
            mode="date"
            display="default"
            onChange={onChangeDateTo}
            minimumDate={dateFromPicked ? dateFrom : minimumDate}
            maximumDate={maximumDate}
            style={{ flex: 1 }}
          />
        </Box>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={4}
        >
          <Text fontSize="2xl" fontWeight={600}>
            Sottotappe
          </Text>
          <TouchableOpacity onPress={showPointPicker}>
            <Icon name="add-circle" size={32} color="#14b8a6" />
          </TouchableOpacity>
        </HStack>
        {shouldShowPointPicker && (
          <Box marginBottom={4}>
            <PlacePicker
              sessionToken={sessionToken}
              onPlacePicked={onPointPicked}
            />
          </Box>
        )}
        {map(points, (point, index) => renderPoint(point, index))}
        <Button marginBottom={4} onPress={addStop}>
          Aggiungi
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

export default AddTripStop
