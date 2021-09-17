import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@/Theme'

const Registration = () => {
  const { Gutters, Layout } = useTheme()

  return (
    <View style={[Layout.fill, Layout.colCenter, Gutters.smallHPadding]}>
      <View style={[[Gutters.smallHPadding]]} />
    </View>
  )
}

export default Registration
