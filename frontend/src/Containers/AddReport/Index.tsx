import React, { useCallback, useState } from 'react'
import { goBack } from '@/Navigators/utils'
import { Box, Button, Checkbox, HStack, Input, Text, View } from 'native-base'
import auth from '@react-native-firebase/auth'
import { Keyboard, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from '@react-navigation/stack'
import moment from 'moment'
import { Config } from '@/Config'
import DateTimePicker from '@react-native-community/datetimepicker'

const AddReport = ({ route }: any) => {
  const { placeId } = route.params || {}
  const [title, setTitle] = useState<string | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<Date>(moment().toDate())
  const [useDateTo, setUseDateTo] = useState<boolean>(false)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [level, setLevel] = useState<any>('white')
  const [error, setError] = useState<string | undefined>()
  const [dateFromPicked, setDateFromPicked] = useState(false)
  const [dateToPicked, setDateToPicked] = useState(false)

  const addReport = useCallback(async () => {
    Keyboard.dismiss()

    if (!title || !dateFrom || !level) {
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

      const addReportResponse = await fetch(
        Config.API_URL + `/reports/places/${placeId}`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            from: moment(dateFrom).format('YYYY-MM-DD'),
            to: dateTo ? moment(dateTo).format('YYYY-MM-DD') : null,
            level,
          }),
        },
      )

      if (addReportResponse.status === 200) {
        goBack()
      }
    } catch (addTripError) {}
  }, [title, description, dateFrom, dateTo, placeId, level])

  const onChangeTitle = useCallback(
    (text: string) => {
      setError(undefined)
      setTitle(text)
    },
    [setTitle],
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

  const onChangeUseDateTo = useCallback(
    (checked?: boolean) => {
      setUseDateTo(!!checked)
      if (!checked) {
        setDateTo(null)
      } else {
        setDateTo(moment().toDate())
      }
    },
    [setUseDateTo],
  )

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <HeaderBackButton onPress={goBack} label="Indietro" />
      <Box height="100%" width="100%" bg="white" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Crea una nuova\nsegnalazione'}
        </Text>
        <Text marginBottom={2}>Titolo:</Text>
        <Input
          marginBottom={4}
          placeholder="Mascherina obbligatoria"
          isFullWidth={true}
          value={title}
          onChangeText={onChangeTitle}
        />
        <Text marginBottom={2}>Descrizione:</Text>
        <Input
          marginBottom={4}
          placeholder="L'utilizzo della mascherina protettiva è obbligatorio..."
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
            maximumDate={dateToPicked ? (dateTo as Date) : undefined}
            style={{ flex: 1 }}
          />
        </Box>
        <HStack>
          <Checkbox
            marginRight={2}
            isChecked={useDateTo}
            value="boh"
            onChange={onChangeUseDateTo}
          />
          <Text marginBottom={useDateTo ? 2 : 4}>Data di fine:</Text>
        </HStack>
        {useDateTo && (
          <Box marginBottom={4}>
            <DateTimePicker
              value={dateTo as Date}
              mode="date"
              display="default"
              onChange={onChangeDateTo}
              minimumDate={dateFromPicked ? dateFrom : undefined}
              style={{ flex: 1 }}
            />
          </Box>
        )}
        <Text marginBottom={2}>Livello di rischio:</Text>
        <Box marginBottom={8}>
          <HStack>
            <TouchableOpacity onPress={() => setLevel('white')}>
              <View
                h={12}
                w={12}
                mr={2}
                borderRadius={100}
                bg="gray.100"
                borderColor="primary.500"
                borderWidth={level === 'white' ? 3 : 0}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLevel('yellow')}>
              <View
                h={12}
                w={12}
                mr={2}
                borderRadius={100}
                bg="yellow.300"
                borderColor="primary.500"
                borderWidth={level === 'yellow' ? 3 : 0}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLevel('orange')}>
              <View
                h={12}
                w={12}
                mr={2}
                borderRadius={100}
                bg="orange.300"
                borderColor="primary.500"
                borderWidth={level === 'orange' ? 3 : 0}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLevel('red')}>
              <View
                h={12}
                w={12}
                borderRadius={100}
                bg="red.300"
                borderColor="primary.500"
                borderWidth={level === 'red' ? 3 : 0}
              />
            </TouchableOpacity>
          </HStack>
        </Box>
        <Button marginY={4} onPress={addReport}>
          Crea segnalazione
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

export default AddReport
