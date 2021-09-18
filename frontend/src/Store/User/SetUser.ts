import { createAction } from '@reduxjs/toolkit'
import { UserState } from '@/Store/User/index'

interface PayloadInterface {
  payload: Partial<UserState>
}

export default {
  initialState: {},
  action: createAction<Partial<UserState>>('user/setUser'),
  reducers(state: UserState, { payload }: PayloadInterface) {
    if (typeof payload.user !== 'undefined') {
      state.user = payload.user
    }
    if (typeof payload.shouldShowOnboarding !== 'undefined') {
      state.shouldShowOnboarding = payload.shouldShowOnboarding
    }
  },
}
