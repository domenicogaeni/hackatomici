import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Splash } from '@/Containers'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@/Navigators/utils'
import { SafeAreaView, StatusBar } from 'react-native'
import { useTheme } from '@/Theme'
import HomeNavigator from './Home'
import LoginNavigator from './Login'
import { useDispatch, useSelector } from 'react-redux'
import { StartupState } from '@/Store/Startup'
import InitStartup from '@/Store/Startup/Init'
import { UserState } from '@/Store/User'

const Stack = createStackNavigator()

// @refresh reset
const RootNavigator = () => {
  const { Layout } = useTheme()
  const dispatch = useDispatch()

  const user = useSelector((state: { user: UserState }) => state.user.item)
  const applicationIsLoading = useSelector(
    (state: { startup: StartupState }) => state.startup.loading,
  )

  useEffect(() => {
    dispatch(InitStartup.action())
  }, [dispatch])

  return (
    <SafeAreaView style={Layout.fill}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle={'dark-content'} />
        <Stack.Navigator headerMode={'none'}>
          {applicationIsLoading ? (
            <Stack.Screen name="Startup" component={Splash} />
          ) : !user ? (
            <Stack.Screen
              name="LoginNavigator"
              component={LoginNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          ) : (
            <Stack.Screen
              name="MainNavigator"
              component={HomeNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default RootNavigator
