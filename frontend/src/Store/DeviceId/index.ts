import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ClearDeviceId from './ClearDeviceId'
import SendDeviceId from './SendDeviceId'
import SetDeviceId from './SetDeviceId'

export default buildSlice('deviceId', [
  SendDeviceId,
  SetDeviceId,
  ClearDeviceId,
]).reducer

export interface DeviceIdState {
  send: {
    loading: boolean
    error: any
  }
  deviceId?: string
}
