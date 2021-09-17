import { User } from '@/Models/User'
import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  item: {},
}

export default buildSlice('user', [FetchOne], sliceInitialState).reducer

export interface UserState {
  item: User
  shouldShowOnboarding: boolean
  fetchOne: {
    loading: boolean
    error: any
  }
}
