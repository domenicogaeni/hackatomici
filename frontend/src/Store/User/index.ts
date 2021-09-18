import { User } from '@/Models/User'
import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Logout from './Logout'
import SetUser from './SetUser'

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  user: undefined,
  shouldShowOnboarding: false,
}

export default buildSlice('user', [SetUser, Logout], sliceInitialState).reducer

export interface UserState {
  user: User | undefined
  shouldShowOnboarding: boolean
}
