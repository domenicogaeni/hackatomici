import { useTheme } from '@/Theme'
import { Box, HStack, Image, Pressable, Text, VStack } from 'native-base'
import React from 'react'
import { View } from 'react-native'

const Trips = () => {
  const { Layout, Gutters } = useTheme()

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <View style={[[Gutters.smallHPadding]]}>
        <Box
          bg="primary.600"
          py={4}
          px={3}
          rounded="md"
          alignSelf="center"
          width={375}
          maxWidth="100%"
        >
          <HStack justifyContent="space-between">
            <Box justifyContent="space-between">
              <VStack space={2}>
                <Text fontSize="xxs" color="white">
                  20/03/2022 {'->'} 22/03/2022
                </Text>
                <Text color="white" fontSize="lg">
                  Barcellona
                </Text>
              </VStack>
              <Pressable
                rounded="sm"
                bg="primary.400"
                alignSelf="flex-start"
                py={2}
                px={3}
              >
                <Text
                  textTransform="uppercase"
                  fontSize={'sm'}
                  fontWeight="bold"
                  color="white"
                >
                  Visualizza
                </Text>
              </Pressable>
            </Box>
            <Image
              source={{
                uri:
                  'https://media.vanityfair.com/photos/5ba12e6d42b9d16f4545aa19/3:2/w_1998,h_1332,c_limit/t-Avatar-The-Last-Airbender-Live-Action.jpg',
              }}
              alt="Aang flying and surrounded by clouds"
              height={100}
              rounded="full"
              width={100}
            />
          </HStack>
        </Box>
      </View>
    </View>
  )
}

export default Trips
