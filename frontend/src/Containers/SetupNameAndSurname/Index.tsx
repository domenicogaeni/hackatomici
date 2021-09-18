import React, { useCallback, useState } from 'react'
import { Box, Button, Input, Text } from 'native-base'
import { User } from '@react-native-google-signin/google-signin'
import { Config } from '@/Config'
import { useDispatch } from 'react-redux'
import SetUser from '@/Store/User/SetUser'
import { User as UserModel } from '@/Models/User'
import { goBack } from '@/Navigators/utils'

const SetupNameAndSurname = ({ user }: { user: User }) => {
  const dispatch = useDispatch()

  const [name, setName] = useState<string | undefined>()
  const [surname, setSurname] = useState<string | undefined>()

  const registration = useCallback(async () => {
    const registerResponse = await fetch(Config.API_URL + '/auth/register', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + user.idToken,
      },
      body: JSON.stringify({
        firebase_uid: user.user.id,
        email: user.user.email,
        name,
        surname,
      }),
    })

    console.log(registerResponse)

    if (registerResponse.status === 200) {
      // User is logged in now
      const userData = (await registerResponse.json()) as UserModel
      dispatch(SetUser.action({ user: userData }))
    }
  }, [dispatch, user, name, surname])

  const onChangeName = useCallback((text: string) => setName(text), [setName])
  const onChangeSurname = useCallback((text: string) => setSurname(text), [
    setSurname,
  ])

  const back = useCallback(() => {
    goBack()
  }, [])

  return (
    <Box justifyContent="center" alignItems="center" flex={1} bg="white">
      <Box borderRadius={8} width="100%" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Dicci di più su di te!'}
        </Text>
        <Text marginBottom={2}>Nome:</Text>
        <Input
          marginBottom={4}
          placeholder="Pinco"
          isFullWidth={true}
          value={name}
          onChangeText={onChangeName}
        />
        <Text marginBottom={2}>Cognome:</Text>
        <Input
          marginBottom={4}
          placeholder="Pallino"
          isFullWidth={true}
          value={surname}
          onChangeText={onChangeSurname}
        />
        <Button marginBottom={4} onPress={registration}>
          Continua
        </Button>
        <Button variant="link" onPress={back}>
          Indietro
        </Button>
      </Box>
    </Box>
  )
}

export default SetupNameAndSurname
