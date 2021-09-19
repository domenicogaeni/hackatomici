import React, { useCallback, useState } from 'react'
import { goBack } from '@/Navigators/utils'
import { Box, Button, Checkbox, HStack, Input, Text, View } from 'native-base'
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

const AddReport = ({ route }: any) => {
  const { placeId, onReportAdded } = route.params || {}
  const [title, setTitle] = useState<string | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState<Date>(moment().toDate())
  const [useDateTo, setUseDateTo] = useState<boolean>(false)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [level, setLevel] = useState<any>('white')
  const [error, setError] = useState<string | undefined>()
  const [dateFromPicked, setDateFromPicked] = useState(false)
  const [dateToPicked, setDateToPicked] = useState(false)

  const [showDatePickerFrom, setShowDatePickerFrom] = useState(false)
  const [showDatePickerTo, setShowDatePickerTo] = useState(false)

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
        onReportAdded && onReportAdded()
      }
    } catch (addTripError) {}
  }, [title, description, dateFrom, dateTo, placeId, level, onReportAdded])

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
              maximumDate={dateToPicked ? (dateTo as Date) : undefined}
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
            {(showDatePickerTo || Platform.OS === 'ios') && (
              <DateTimePicker
                value={dateTo as Date}
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
        )}
        <Text marginBottom={2}>Livello di rischio:</Text>
        <Box marginBottom={8}>
          <HStack>
            <Touchable onPress={() => setLevel('white')}>
              <View
                h={12}
                w={12}
                mr={2}
                borderRadius={100}
                bg="gray.100"
                borderColor="primary.500"
                borderWidth={level === 'white' ? 3 : 0}
              />
            </Touchable>
            <Touchable onPress={() => setLevel('yellow')}>
              <View
                h={12}
                w={12}
                mr={2}
                borderRadius={100}
                bg="yellow.300"
                borderColor="primary.500"
                borderWidth={level === 'yellow' ? 3 : 0}
              />
            </Touchable>
            <Touchable onPress={() => setLevel('orange')}>
              <View
                h={12}
                w={12}
                mr={2}
                borderRadius={100}
                bg="orange.300"
                borderColor="primary.500"
                borderWidth={level === 'orange' ? 3 : 0}
              />
            </Touchable>
            <Touchable onPress={() => setLevel('red')}>
              <View
                h={12}
                w={12}
                borderRadius={100}
                bg="red.300"
                borderColor="primary.500"
                borderWidth={level === 'red' ? 3 : 0}
              />
            </Touchable>
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
