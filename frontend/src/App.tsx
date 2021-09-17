import { ApplicationNavigator } from '@/Navigators'
import { persistor, store } from '@/Store'
import { NativeBaseProvider } from 'native-base'
import React from 'react'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import './Translations'

const App = () => (
  <NativeBaseProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
      </PersistGate>
    </Provider>
  </NativeBaseProvider>
)

export default App
