import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Login, Registration } from '@/Containers'
import SetupNameAndSurname from '@/Containers/SetupNameAndSurname/Index'

const Stack = createStackNavigator()

const LoginNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="SetupNameAndSurname"
        component={SetupNameAndSurname}
      />
      <Stack.Screen name="Registration" component={Registration} />
    </Stack.Navigator>
  )
}

export default LoginNavigator
