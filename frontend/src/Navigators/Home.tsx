import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Account, Community, Map, Trips } from '@/Containers'
import Icon from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

// @refresh reset
const HomeNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = (() => {
            switch (route.name) {
              case 'Map':
                return focused ? 'map' : 'map-outline'
              case 'Trips':
                return focused ? 'analytics' : 'analytics-outline'
              case 'Community':
                return focused ? 'chatbubbles' : 'chatbubbles-outline'
              case 'Account':
                return focused ? 'person' : 'person-outline'
              default:
                return ''
            }
          })()

          return <Icon name={iconName} size={size} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#14b8a6',
        inactiveTintColor: '#27272a',
      }}
    >
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Trips" component={Trips} />
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  )
}

export default HomeNavigator
