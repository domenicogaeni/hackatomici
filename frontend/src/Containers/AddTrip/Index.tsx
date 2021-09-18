import React, { useCallback, useState } from 'react'
import { goBack } from '@/Navigators/utils'
import { Box, Button, Input, Text } from 'native-base'
import auth from '@react-native-firebase/auth'
import { Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from '@react-navigation/stack'
import moment from 'moment'
import { Config } from '@/Config'
import DateTimePicker from '@react-native-community/datetimepicker'

const AddTrip = () => {
  const [name, setName] = useState<string | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<Date>(moment().toDate())
  const [dateTo, setDateTo] = useState<Date>(moment().toDate())
  const [error, setError] = useState<string | undefined>()
  const [dateFromPicked, setDateFromPicked] = useState(false)
  const [dateToPicked, setDateToPicked] = useState(false)

  const addTrip = useCallback(async () => {
    Keyboard.dismiss()

    if (!name || !description || !dateFrom || !dateTo) {
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
          from_date: moment(dateFrom).format('YYYY-MM-DD'),
          to_date: moment(dateTo).format('YYYY-MM-DD'),
        }),
      })

      if (addTripResponse.status === 200) {
        goBack()
      }
    } catch (addTripError) {}
  }, [name, description, dateFrom, dateTo])

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

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <HeaderBackButton onPress={goBack} label="Indietro" />
      <Box height="100%" width="100%" bg="white" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Crea un nuovo\nitinerario'}
        </Text>
        <Text marginBottom={2}>Nome:</Text>
        <Input
          marginBottom={4}
          placeholder="A spasso con Lolli"
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
        />
        <Text marginBottom={2}>Data di inizio:</Text>
        <Box marginBottom={4}>
          <DateTimePicker
            value={dateFrom}
            mode="date"
            display="default"
            onChange={onChangeDateFrom}
            maximumDate={dateToPicked ? dateTo : undefined}
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
            minimumDate={dateFromPicked ? dateFrom : undefined}
            style={{ flex: 1 }}
          />
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
