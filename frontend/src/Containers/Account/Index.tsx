import { useTheme } from '@/Theme'
import React from 'react'
import { View } from 'react-native'

const Account = () => {
  const { Layout } = useTheme()

  return <View style={[Layout.fill, Layout.colCenter]} />
}

export default Account
