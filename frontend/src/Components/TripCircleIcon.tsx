import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Box } from 'native-base'

interface ITripCircleIconProps {
  name: string
  // eslint-disable-next-line react/require-default-props
  color?: string
}

const TripCircleIcon = ({ name, color = '#14b8a6' }: ITripCircleIconProps) => {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      backgroundColor="white"
      height={12}
      width={12}
      borderRadius={100}
      borderWidth={2}
      borderColor={color}
      marginLeft={4}
      marginRight={4}
    >
      <Icon name={name} size={22} color={color} />
    </Box>
  )
}

export default TripCircleIcon
