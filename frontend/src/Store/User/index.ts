import { User } from '@/Models/User'
import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import SetUser from './SetUser'

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  user: {},
}

export default buildSlice('user', [SetUser], sliceInitialState).reducer

export interface UserState {
  user: User
  shouldShowOnboarding: boolean
}
