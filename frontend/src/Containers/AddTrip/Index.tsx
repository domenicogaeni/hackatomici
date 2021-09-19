import React, { useCallback, useState } from 'react'
import { goBack } from '@/Navigators/utils'
import { Box, Button, Input, Text } from 'native-base'
import auth from '@react-native-firebase/auth'
import {
  Keyboard,
  Platform,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from '@react-navigation/stack'
import moment from 'moment'
import { Config } from '@/Config'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler'

const Touchable = Platform.select({
  ios: GHTouchableOpacity,
  android: RNTouchableOpacity as any,
})

const AddTrip = ({ route }: any) => {
  const { onTripAdded } = route.params || {}

  const [name, setName] = useState<string | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<Date>(moment().toDate())
  const [dateTo, setDateTo] = useState<Date>(moment().toDate())
  const [error, setError] = useState<string | undefined>()
  const [dateFromPicked, setDateFromPicked] = useState(false)
  const [dateToPicked, setDateToPicked] = useState(false)

  const [showDatePickerFrom, setShowDatePickerFrom] = useState(false)
  const [showDatePickerTo, setShowDatePickerTo] = useState(false)

  const addTrip = useCallback(async () => {
    Keyboard.dismiss()

    if (!name || !dateFrom || !dateTo) {
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

      const addTripResponse = await fetch(Config.API_URL + '/trips', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          from: moment(dateFrom).format('YYYY-MM-DD'),
          to: moment(dateTo).format('YYYY-MM-DD'),
        }),
      })

      if (addTripResponse.status === 200) {
        onTripAdded?.()
        goBack()
      }
    } catch (addTripError) {}
  }, [name, dateFrom, dateTo, description, onTripAdded])

  const onChangeName = useCallback(
    (text: string) => {
      setError(undefined)
      setName(text)
    },
    [setName],
  )

  const onChangeDescription = useCallback(
    (text: string) => {
      setError(undefined)
      setDescription(text)
    },
    [setDescription],
  )

  const onChangeDateFrom = useCallback(
    (_, date?: Date | undefined) => {
      if (date) {
        setDateFrom(date)
        setDateFromPicked(true)
      }
      setShowDatePickerFrom(Platform.OS === 'ios')
    },
    [setDateFrom, setDateFromPicked],
  )

  const onChangeDateTo = useCallback(
    (_, date?: Date | undefined) => {
      if (date) {
        setDateTo(date)
        setDateToPicked(true)
      }
      setShowDatePickerTo(Platform.OS === 'ios')
    },
    [setDateTo, setDateToPicked],
  )

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <HeaderBackButton onPress={goBack} label="Indietro" />
      <Box height="100%" width="100%" bg="white" paddingX={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Crea un nuovo\nitinerario'}
        </Text>
        <Text marginBottom={2}>Nome:</Text>
        <Input
          marginBottom={4}
          placeholder="A spasso con Mario"
          isFullWidth={true}
          value={name}
          onChangeText={onChangeName}
        />
        <Text marginBottom={2}>Descrizione:</Text>
        <Input
          marginBottom={4}
          placeholder="Io che vado a fare un giretto con il cane"
          isFullWidth={true}
          value={description}
          onChangeText={onChangeDescription}
          multiline
        />
        <Text marginBottom={2}>Data di inizio:</Text>
        <Box marginBottom={4}>
          {(showDatePickerFrom || Platform.OS === 'ios') && (
            <DateTimePicker
              value={dateFrom}
              mode="date"
              display="default"
              onChange={onChangeDateFrom}
              maximumDate={dateToPicked ? dateTo : undefined}
              style={{ flex: 1 }}
            />
          )}
          {Platform.OS === 'android' && (
            <Touchable
              onPress={() => {
                setShowDatePickerFrom(true)
              }}
            >
              <Input
                marginBottom={4}
                isFullWidth={true}
                value={moment(dateFrom).format('DD/MM/YYYY')}
                editable={false}
              />
            </Touchable>
          )}
        </Box>
        <Text marginBottom={2}>Data di fine:</Text>
        <Box marginBottom={8}>
          {(showDatePickerTo || Platform.OS === 'ios') && (
            <DateTimePicker
              value={dateTo}
              mode="date"
              display="default"
              onChange={onChangeDateTo}
              minimumDate={dateFromPicked ? dateFrom : undefined}
              style={{ flex: 1 }}
            />
          )}
          {Platform.OS === 'android' && (
            <Touchable onPress={() => setShowDatePickerTo(true)}>
              <Input
                marginBottom={4}
                isFullWidth={true}
                value={moment(dateTo).format('DD/MM/YYYY')}
                editable={false}
              />
            </Touchable>
          )}
        </Box>
        <Button marginBottom={4} onPress={addTrip}>
          Crea itinerario
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

export default AddTrip
