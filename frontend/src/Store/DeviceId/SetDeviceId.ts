import { createAction } from '@reduxjs/toolkit'
import { DeviceIdState } from '.'

interface PayloadInterface {
  payload: string
}

export default {
  initialState: {},
  action: createAction<string>('deviceId/setDeviceId'),
  reducers(state: DeviceIdState, { payload }: PayloadInterface) {
    state.deviceId = payload
  },
}
