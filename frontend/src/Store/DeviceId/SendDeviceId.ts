import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import messaging from '@react-native-firebase/messaging'

export default {
  initialState: buildAsyncState('send'),
  action: buildAsyncActions('deviceId/sendDeviceId', async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      const currentUser = auth().currentUser

      if (currentUser) {
        const idToken = await currentUser.getIdToken()

        // Send deviceId to backend
        const deviceId = await messaging().getToken()

        await fetch(`${Config.API_URL}/auth/device_id`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ device_id: deviceId }),
        })
      }
    }
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
