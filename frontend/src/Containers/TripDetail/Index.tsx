import React, { useCallback } from 'react'
import { goBack, navigate } from '@/Navigators/utils'
import { Box, HStack, Pressable, Text } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { HeaderBackButton } from '@react-navigation/stack'

const TripDetail = ({ route }: any) => {
  const { trip } = route.params || {}
  const { id, name, description, from, to } = trip || {}

  const addTripPoint = useCallback(() => {
    navigate('AddTripPoint', {})
  }, [])

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
      <HeaderBackButton onPress={goBack} label="Indietro" />
      <Box height="100%" width="100%" bg="white" padding={8}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={1}
        >
          <Text fontSize="3xl" fontWeight={600}>
            {name}
          </Text>
          <Pressable onPress={addTripPoint}>
            <Icon name="add-circle" size={32} color="#14b8a6" />
          </Pressable>
        </HStack>
        {description && (
          <Text marginBottom={8} color="gray.500">
            {description}
          </Text>
        )}
      </Box>
    </KeyboardAwareScrollView>
  )
}

export default TripDetail
