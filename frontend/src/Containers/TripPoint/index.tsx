import React, { useCallback } from 'react'
import { Box, HStack, Pressable, Text } from 'native-base'
import { Point, WarningLevel } from '@/Models/Trip'
import Icon from 'react-native-vector-icons/Ionicons'
import TripStopConnector from '../TripStopConnector'

interface ITripPointProps {
  point: Point
  isFirst: boolean
  openPlaceDetail: (placeId: string) => void
}

function getBackgroundColor(level: WarningLevel) {
  switch (level) {
    case 'white':
      return 'white'
    case 'yellow':
      return '#fde047'
    case 'orange':
      return '#fb923c'
    case 'red':
      return '#f87171'
  }
}

function getBorderWidth(level: WarningLevel) {
  switch (level) {
    case 'white':
      return 2
    case 'yellow':
    case 'orange':
    case 'red':
      return 0
  }
}

function getBorderColor(level: WarningLevel) {
  switch (level) {
    case 'white':
      return '#14b8a6'
    case 'yellow':
      return '#fde047'
    case 'orange':
      return '#fb923c'
    case 'red':
      return '#f87171'
  }
}

function getTextColor(level: WarningLevel) {
  switch (level) {
    case 'white':
    case 'yellow':
      return '#3f3f46'
    case 'orange':
    case 'red':
      return 'white'
  }
}

const TripPoint = ({ point, isFirst, openPlaceDetail }: ITripPointProps) => {
  const backgroundColor = getBackgroundColor(point.level)
  const borderWidth = getBorderWidth(point.level)
  const borderColor = getBorderColor(point.level)
  const textColor = getTextColor(point.level)

  const open = useCallback(() => openPlaceDetail(point.place_id), [
    openPlaceDetail,
    point,
  ])

  return (
    <>
      {!isFirst && <TripStopConnector />}
      <Pressable onPress={open}>
        <Box
          width="100%"
          borderRadius={8}
          padding={4}
          bg={backgroundColor}
          borderWidth={borderWidth}
          borderColor={borderColor}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <Text flex={1} color={textColor}>
              {point.name}
            </Text>
            <Icon name="chevron-forward-outline" size={20} color={textColor} />
          </HStack>
        </Box>
      </Pressable>
    </>
  )
}

export default TripPoint
