import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@/Theme'
import { Brand } from '@/Components'

const Splash = () => {
  const { Layout } = useTheme()

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
    </View>
  )
}

export default Splash
