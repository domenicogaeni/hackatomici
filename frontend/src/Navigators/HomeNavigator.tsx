import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TabNavigator from './TabNavigator'
import FavoritePlaces from '@/Containers/FavoritePlaces/Index'

const Stack = createStackNavigator()

// @refresh reset
const HomeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="FavoritePlaces" component={FavoritePlaces} />
    </Stack.Navigator>
  )
}

export default HomeNavigator
