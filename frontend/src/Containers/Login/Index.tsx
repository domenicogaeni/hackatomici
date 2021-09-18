import React, { useCallback, useState } from 'react'
import { Box, Button, Input, Text } from 'native-base'
import { navigate } from '@/Navigators/utils'
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import { Config } from '@/Config'
import { useDispatch } from 'react-redux'
import SetUser from '@/Store/User/SetUser'
import { User as UserModel } from '@/Models/User'
import auth from '@react-native-firebase/auth'
import { Keyboard } from 'react-native'

const Login = () => {
  const dispatch = useDispatch()

  const [isSigningIn, setSigningIn] = useState(false)
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const login = useCallback(async () => {
    Keyboard.dismiss()
    if (!email || !password) {
      setError('Per favore, riempi tutti i campi')
      return
    }

    try {
      const signInResult = await auth().signInWithEmailAndPassword(
        email,
        password,
      )

      const idToken = await signInResult.user.getIdToken()

      const meResponse = await fetch(Config.API_URL + '/auth/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + idToken,
        },
      })

      if (meResponse.status === 200) {
        // User is logged in now
        const userData = (await meResponse.json()) as UserModel
        dispatch(SetUser.action({ user: userData }))
      }
      // eslint-disable-next-line no-catch-shadow
    } catch (signInError) {
      setError((signInError as any).message)
    }
  }, [dispatch, email, password])

  const registration = useCallback(() => {
    Keyboard.dismiss()
    navigate('Registration', {})
  }, [])

  const googleSignIn = useCallback(async () => {
    Keyboard.dismiss()
    setSigningIn(true)

    try {
      await GoogleSignin.hasPlayServices()
      const user = await GoogleSignin.signIn()

      try {
        const meResponse = await fetch(Config.API_URL + '/auth/me', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + user.idToken,
          },
        })

        if (meResponse.status === 200) {
          // User is logged in now
          const userData = (await meResponse.json()) as UserModel
          dispatch(SetUser.action({ user: userData }))
        }
      } catch (meError) {
        try {
          console.log('register', user.idToken, {
            firebase_uid: user.user.id,
            email: user.user.email,
            name: user.user.givenName,
            surname: user.user.familyName,
          })
          const registerResponse = await fetch(
            Config.API_URL + '/auth/register',
            {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + user.idToken,
              },
              body: JSON.stringify({
                firebase_uid: user.user.id,
                email: user.user.email,
                name: user.user.givenName,
                surname: user.user.familyName,
              }),
            },
          )

          console.log('registerResponse', registerResponse)

          if (registerResponse.status === 200) {
            // User is logged in now
            const userData = (await registerResponse.json()) as UserModel
            dispatch(SetUser.action({ user: userData }))
          }
        } catch (registerError) {
          setError((registerError as any).message)
        }
      }
    } catch (googleSignInError) {
      setError((googleSignInError as any).message)
    }

    setSigningIn(false)
  }, [dispatch])

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

  return (
    <Box justifyContent="center" alignItems="center" flex={1} bg="white">
      <Box borderRadius={8} width="100%" padding={8}>
        <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
          {'Benvenuto su\nSafeTravel!'}
        </Text>
        <Text marginBottom={2}>Email:</Text>
        <Input
          marginBottom={4}
          placeholder="bestemailever@example.com"
          isFullWidth={true}
          autoCapitalize="none"
          value={email}
          onChangeText={onChangeEmail}
        />
        <Text marginBottom={2}>Password:</Text>
        <Input
          marginBottom={8}
          secureTextEntry={true}
          placeholder="Password123!"
          isFullWidth={true}
          value={password}
          onChangeText={onChangePassword}
        />
        <Button marginBottom={4} onPress={login}>
          Accedi
        </Button>
        {error && (
          <Text color="red.500" marginBottom={4}>
            {error}
          </Text>
        )}
        <Button variant="link" onPress={registration}>
          Registrati
        </Button>
        <Box justifyContent="center" alignItems="center" marginTop={4}>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={googleSignIn}
            disabled={isSigningIn}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Login
