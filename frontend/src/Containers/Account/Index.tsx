import { Box, Button, Text } from 'native-base'
import React, { useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import Logout from '@/Store/User/Logout'
import { UserState } from '@/Store/User'
import { navigate } from '@/Navigators/utils'

const Account = () => {
  const dispatch = useDispatch()

  const user = useSelector((state: { user: UserState }) => state.user.user)

  const favoritePlaces = useCallback(() => navigate('FavoritePlaces', {}), [])

  const logout = useCallback(() => {
    auth().signOut()
    dispatch(Logout.action())
  }, [dispatch])

  const displayName = `${user?.name} ${
    user?.surname ? `${user.surname.charAt(0)}.` : ''
  }`

  return (
    <Box height="100%" flex={1} bg="white" padding={8}>
      <Text fontSize="3xl" marginBottom={8} fontWeight={600}>
        {`Ciao ${displayName}`}
      </Text>
      <Button onPress={favoritePlaces} marginBottom={8}>
        Luoghi d'interesse
      </Button>
      <Button variant="outline" colorScheme="red" onPress={logout}>
        Logout
      </Button>
    </Box>
  )
}

export default Account
