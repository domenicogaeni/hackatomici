import { useTheme } from '@/Theme'
import { Box, Input } from 'native-base'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import MapView from 'react-native-maps'

const Map = () => {
  const { Layout } = useTheme()

  const [searchText, setSearchText] = useState<string>()

  useEffect(() => {
    // api ricerca
  }, [searchText])

  return (
    <View style={[Layout.fill, Layout.colCenter, { position: 'relative' }]}>
      <MapView
        initialRegion={{
          latitude: 45.7314,
          longitude: 9.63715,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{ flex: 1, width: '100%' }}
        provider="google"
        onPress={a => console.log('ao', a.nativeEvent.coordinate)}
      />
      <Box w="100%" position="absolute" top="8">
        <Input
          mx={3}
          placeholder="Cerca"
          _light={{
            placeholderTextColor: 'blueGray.400',
          }}
          bg="white"
          onChangeText={setSearchText}
          value={searchText}
        />
      </Box>
    </View>
  )
}

export default Map
