import { createAction } from '@reduxjs/toolkit'
import { DeviceIdState } from '.'

export default {
  initialState: {},
  action: createAction('deviceId/clearDeviceId'),
  reducers(state: DeviceIdState) {
    state.deviceId = undefined
  },
}
