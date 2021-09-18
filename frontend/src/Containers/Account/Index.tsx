import { Box, Button } from 'native-base'
import React, { useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useDispatch } from 'react-redux'
import Logout from '@/Store/User/Logout'

const Account = () => {
  const dispatch = useDispatch()
  const logout = useCallback(() => {
    auth().signOut()
    dispatch(Logout.action())
  }, [dispatch])

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      height="100%"
      flex={1}
      bg="white"
      padding={8}
    >
      <Button onPress={logout}>Logout</Button>
    </Box>
  )
}

export default Account
