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
      {/**
       * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
       * and saved to redux.
       * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
       * for example `loading={<SplashScreen />}`.
       * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
       */}
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
      </PersistGate>
    </Provider>
  </NativeBaseProvider>
)

export default App
