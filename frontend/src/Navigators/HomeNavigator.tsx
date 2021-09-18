import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TabNavigator from './TabNavigator'
import FavoritePlaces from '@/Containers/FavoritePlaces/Index'
import AddTrip from '@/Containers/AddTrip/Index'
import TripDetail from '@/Containers/TripDetail/Index'

const Stack = createStackNavigator()

// @refresh reset
const HomeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="AddTrip" component={AddTrip} />
      <Stack.Screen name="TripDetail" component={TripDetail} />
      <Stack.Screen name="FavoritePlaces" component={FavoritePlaces} />
    </Stack.Navigator>
  )
}

export default HomeNavigator
