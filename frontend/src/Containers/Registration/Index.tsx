import React, { useCallback, useState } from 'react'
import { goBack, navigate } from '@/Navigators/utils'
import { Box, Button, Input, Text } from 'native-base'
import auth from '@react-native-firebase/auth'
import { Keyboard } from 'react-native'

const Registration = () => {
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [confirm, setConfirm] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const register = useCallback(async () => {
    Keyboard.dismiss()

    if (!email || !password || !confirm) {
      setError('Per favore, riempi tutti i campi')
      return
    }

    if (password !== confirm) {
      setError('Password e conferma non coincidono')
      return
    }

    try {
      const createUserResult = await auth().createUserWithEmailAndPassword(
        email,
        password,
      )

      navigate('SetupNameAndSurname', { user: createUserResult.user })
    } catch (createUserError) {
      setError((createUserError as any).message)
    }
  }, [confirm, email, password])

  const backToLogin = useCallback(() => {
    Keyboard.dismiss()
    goBack()
  }, [])

  const onChangeEmail = useCallback(
    (text: string) => {
      setError(undefined)
      setEmail(text)
    },
    [setEmail],
  )

  const onChangePassword = useCallback(
    (text: string) => {
      setError(undefined)
      setPassword(text)
    },
    [setPassword],
  )

  const onChangeConfirm = useCallback(
    (text: string) => {
      setError(undefined)
      setConfirm(text)
    },
    [setConfirm],
  )

  return (
    <Box justifyContent="center" alignItems="center" flex={1} bg="white">
      <Box borderRadius={8} width="100%" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          Registrazione
        </Text>
        <Text marginBottom={2}>Email:</Text>
        <Input
          marginBottom={4}
          placeholder="bestemailever@example.com"
          isFullWidth={true}
          value={email}
          onChangeText={onChangeEmail}
        />
        <Text marginBottom={2}>Password:</Text>
        <Input
          marginBottom={4}
          secureTextEntry={true}
          placeholder="Password123!"
          isFullWidth={true}
          value={password}
          onChangeText={onChangePassword}
        />
        <Text marginBottom={2}>Conferma password:</Text>
        <Input
          marginBottom={8}
          secureTextEntry={true}
          placeholder="Password123!"
          isFullWidth={true}
          value={confirm}
          onChangeText={onChangeConfirm}
        />
        <Button marginBottom={4} onPress={register}>
          Registrati
        </Button>
        {error && (
          <Text color="red.500" marginBottom={4}>
            {error}
          </Text>
        )}
        <Button variant="link" onPress={backToLogin}>
          Torna al login
        </Button>
      </Box>
    </Box>
  )
}

export default Registration
