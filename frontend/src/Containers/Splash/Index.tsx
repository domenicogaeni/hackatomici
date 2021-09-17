import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useTheme } from '@/Theme'
import { Brand } from '@/Components'

const Splash = () => {
  const { Layout, Gutters } = useTheme()

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
    </View>
  )
}

export default Splash
