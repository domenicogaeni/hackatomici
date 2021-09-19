import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import SendDeviceId from './SendDeviceId'
import SetDeviceId from './SetDeviceId'

export default buildSlice('deviceId', [SendDeviceId, SetDeviceId]).reducer

export interface DeviceIdState {
  send: {
    loading: boolean
    error: any
  }
  deviceId: string
}
