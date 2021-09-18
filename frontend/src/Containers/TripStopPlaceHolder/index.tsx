import React from 'react'
import { Box, HStack, Pressable, Text } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'
import TripStopConnector from '../TripStopConnector'

interface ITripStopPlaceHolderProps {
  onAddStop: () => void
}

const TripStopPlaceHolder = ({ onAddStop }: ITripStopPlaceHolderProps) => {
  return (
    <>
      <TripStopConnector />
      <Pressable onPress={onAddStop}>
        <Box width="100%" borderRadius={8} padding={2} bg="primary.500">
          <HStack alignItems="center">
            <Icon name="add" size={32} color="white" />
            <Text fontWeight={600} color="white">
              Aggiungi una tappa
            </Text>
          </HStack>
        </Box>
      </Pressable>
    </>
  )
}

export default TripStopPlaceHolder
