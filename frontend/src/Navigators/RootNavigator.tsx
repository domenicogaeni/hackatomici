import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Onboarding, Splash } from '@/Containers'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@/Navigators/utils'
import { SafeAreaView, StatusBar } from 'react-native'
import { useTheme } from '@/Theme'
import LoginNavigator from './LoginNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { StartupState } from '@/Store/Startup'
import InitStartup from '@/Store/Startup/Init'
import { UserState } from '@/Store/User'
import HomeNavigator from './HomeNavigator'

const Stack = createStackNavigator()

// @refresh reset
const RootNavigator = () => {
  const { Layout } = useTheme()
  const dispatch = useDispatch()

  const user = useSelector((state: { user: UserState }) => state.user.user)
  const shouldShowOnboarding = useSelector(
    (state: { user: UserState }) => state.user.shouldShowOnboarding,
  )
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
            <Stack.Screen name="Splash" component={Splash} />
          ) : !user ? (
            <Stack.Screen name="LoginNavigator" component={LoginNavigator} />
          ) : shouldShowOnboarding ? (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          ) : (
            <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default RootNavigator
