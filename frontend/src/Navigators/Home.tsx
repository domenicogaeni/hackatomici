import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IndexExampleContainer, IndexMapContainer } from '@/Containers'

const Tab = createBottomTabNavigator()

// @refresh reset
const HomeNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" component={IndexMapContainer} />
      <Tab.Screen name="Trips" component={IndexExampleContainer} />
      <Tab.Screen name="Community" component={IndexExampleContainer} />
      <Tab.Screen name="Account" component={IndexExampleContainer} />
    </Tab.Navigator>
  )
}

export default HomeNavigator
