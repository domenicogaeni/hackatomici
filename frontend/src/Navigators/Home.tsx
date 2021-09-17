import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IndexExampleContainer, IndexMapContainer } from '@/Containers'
import Icon from 'react-native-vector-icons/Ionicons'
import { useTheme } from '@/Theme'

const Tab = createBottomTabNavigator()

// @refresh reset
const HomeNavigator = () => {
  const { Colors } = useTheme()
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
        activeTintColor: Colors.primary,
        inactiveTintColor: Colors.text,
      }}
    >
      <Tab.Screen name="Map" component={IndexMapContainer} />
      <Tab.Screen name="Trips" component={IndexExampleContainer} />
      <Tab.Screen name="Community" component={IndexExampleContainer} />
      <Tab.Screen name="Account" component={IndexExampleContainer} />
    </Tab.Navigator>
  )
}

export default HomeNavigator