import React, { useCallback, useState } from 'react'
import { Box, Button, Input, Text } from 'native-base'
import { navigate } from '@/Navigators/utils'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { Config } from '@/Config'

const Login = () => {
  const [isSigningIn, setSigningIn] = useState(false)

  const registration = useCallback(() => navigate('Registration', {}), [])

  const signIn = useCallback(async () => {
    setSigningIn(true)
    try {
      await GoogleSignin.hasPlayServices()
      const user = await GoogleSignin.signIn()
      await fetch(Config.API_URL + '/auth/google', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + user.idToken,
        },
      })
    } catch (error) {
      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if ((error as any).code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (
        (error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
    setSigningIn(false)
  }, [setSigningIn])

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
        />
        <Text marginBottom={2}>Password:</Text>
        <Input
          marginBottom={8}
          secureTextEntry={true}
          placeholder="Password123!"
          isFullWidth={true}
        />
        <Button marginBottom={4}>Accedi</Button>
        <Button variant="link" onPress={registration}>
          Registrati
        </Button>
        <Box justifyContent="center" alignItems="center" marginTop={4}>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
            disabled={isSigningIn}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Login
