import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Account, Map, Trips } from '@/Containers'
import Icon from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

// @refresh reset
const TabNavigator = () => {
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
      <Tab.Screen name="Map" options={{ title: 'Mappa' }} component={Map} />
      <Tab.Screen
        name="Trips"
        options={{ title: 'Itinerari' }}
        component={Trips}
      />
      <Tab.Screen
        name="Account"
        options={{ title: 'Profilo' }}
        component={Account}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
