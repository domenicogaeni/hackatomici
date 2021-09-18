import { RootNavigator } from '@/Navigators'
import { persistor, store } from '@/Store'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { extendTheme, NativeBaseProvider } from 'native-base'
import React from 'react'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import './Translations'

GoogleSignin.configure()

const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
  },
})

const App = () => (
  <NativeBaseProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  </NativeBaseProvider>
)

export default App
