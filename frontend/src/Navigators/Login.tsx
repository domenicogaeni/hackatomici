import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Login, Onboarding, Registration } from '@/Containers'

const Stack = createStackNavigator()

const LoginNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  )
}

export default LoginNavigator
