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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'

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
          'Content-Type': 'application/json',
        },
      })

      if (meResponse.status === 200) {
        // User is logged in now
        const userData = (await meResponse.json()).data as UserModel
        dispatch(SetUser.action({ user: userData }))
      } else {
        // There is the firebase user but not the user in the API
        navigate('SetupNameAndSurname', { user: signInResult.user })
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

      const {
        idToken: signInToken,
        user: { givenName, familyName },
      } = await GoogleSignin.signIn()

      const googleCredential = auth.GoogleAuthProvider.credential(signInToken)
      const user = await auth().signInWithCredential(googleCredential)

      const idToken = await user.user.getIdToken()

      try {
        const meResponse = await fetch(Config.API_URL + '/auth/me', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        })

        if (meResponse.status === 200) {
          // User is logged in now
          const userData = (await meResponse.json()).data as UserModel
          dispatch(SetUser.action({ user: userData }))
        } else {
          try {
            const registerResponse = await fetch(
              Config.API_URL + '/auth/register',
              {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + idToken,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  firebase_uid: user.user.uid,
                  email: user.user.email,
                  name: givenName,
                  surname: familyName,
                }),
              },
            )

            if (registerResponse.status === 200) {
              // User is logged in now
              const userData = (await registerResponse.json()).data as UserModel
              dispatch(
                SetUser.action({ user: userData, shouldShowOnboarding: true }),
              )
            } else {
              setError('Errore durante la registrazione')
            }
          } catch (registerError) {
            setError((registerError as any).message)
          }
        }
      } catch (meError) {
        setError((meError as any).message)
      }
    } catch (googleSignInError) {
      // setError((googleSignInError as any).message)
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
        <Box height="100%" width="100%" bg="white" padding={8}>
          <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
            {'Benvenuto su\nSafeTravel!'}
          </Text>
          <Text marginBottom={2}>Email:</Text>
          <Input
            marginBottom={4}
            placeholder="bestemailever@example.com"
            autoCapitalize="none"
            isFullWidth={true}
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default Login
