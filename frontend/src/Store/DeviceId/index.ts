import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import SendDeviceId from './SendDeviceId'

export default buildSlice('deviceId', [SendDeviceId]).reducer

export interface DeviceIdState {
  send: {
    loading: boolean
    error: any
  }
}
