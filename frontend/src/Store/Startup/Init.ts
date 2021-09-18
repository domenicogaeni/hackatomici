import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import SetUser from '../User/SetUser'
import { User } from '@/Models/User'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    const currentUser = auth().currentUser
    if (currentUser) {
      const idToken = await currentUser.getIdToken()
      const meResponse = await fetch(Config.API_URL + '/auth/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
      })
      if (meResponse.status === 200) {
        // User is logged in now
        const userData = (await meResponse.json()).data as User
        dispatch(SetUser.action({ user: userData }))
      }
    }
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
