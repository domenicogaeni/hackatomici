import { createAction } from '@reduxjs/toolkit'
import { UserState } from '@/Store/User/index'

export default {
  initialState: {},
  action: createAction('user/logout'),
  reducers(state: UserState) {
    state.user = undefined
  },
}
