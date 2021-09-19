import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import uuid from 'react-native-uuid'
import SetDeviceId from './SetDeviceId'

export default {
  initialState: buildAsyncState('send'),
  action: buildAsyncActions(
    'deviceId/sendDeviceId',
    async (args, { dispatch, getState }) => {
      const currentUser = auth().currentUser

      if (currentUser) {
        const idToken = await currentUser.getIdToken()

        // Send deviceId to backend
        const deviceIdFromState: string | undefined = (getState() as any)
          .deviceId.deviceId
        const deviceId = deviceIdFromState || (uuid.v4() as string)

        const deviceIdResponse = await fetch(
          `${Config.API_URL}/auth/device_id`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + idToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_id: deviceId }),
          },
        )
        if (deviceIdResponse.status === 200) {
          // DeviceId was sent to backend
          dispatch(SetDeviceId.action(deviceId))
        }
      }
    },
  ),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
