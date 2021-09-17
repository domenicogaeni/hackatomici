import React, { useCallback } from 'react'
import { Box, Button, Input, Text } from 'native-base'
import { navigate } from '@/Navigators/utils'

const Login = () => {
  const registration = useCallback(() => navigate('Registration', {}), [])

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
      </Box>
    </Box>
  )
}

export default Login
