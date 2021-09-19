import React, { useCallback } from 'react'
import { Box, HStack, Text, VStack } from 'native-base'
import { Stop, WarningLevel } from '@/Models/Trip'
import Icon from 'react-native-vector-icons/Ionicons'
import TripStopConnector from '../TripStopConnector'
import TripCircleIcon from '../TripCircleIcon'
import moment from 'moment'
import { map } from 'lodash'
import TripPoint from '../TripPoint'
import { TouchableOpacity } from 'react-native'

interface ITripStopProps {
  stop: Stop
  openPlaceDetail: (placeId: string) => void
}

function getBackgroundColor(level: WarningLevel) {
  switch (level) {
    case 'white':
      return undefined
    case 'yellow':
      return '#fde047'
    case 'orange':
      return '#fb923c'
    case 'red':
      return '#f87171'
  }
}

function getSoftBackgroundColor(level: WarningLevel) {
  switch (level) {
    case 'white':
      return '#f0fdfa'
    case 'yellow':
      return '#fef9c3'
    case 'orange':
      return '#ffedd5'
    case 'red':
      return '#fee2e2'
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

function getSecondaryTextColor(level: WarningLevel) {
  switch (level) {
    case 'white':
    case 'yellow':
      return 'gray.500'
    case 'orange':
      return 'orange.50'
    case 'red':
      return 'red.50'
  }
}

const TripStop = ({ stop, openPlaceDetail }: ITripStopProps) => {
  const formattedFromDate = stop.from
    ? moment(stop.from, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'Oggi'
  const formattedToDate = stop.to
    ? moment(stop.to, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'Oggi'

  const backgroundColor = getBackgroundColor(stop.level)
  const softBackgroundColor = getSoftBackgroundColor(stop.level)
  const borderWidth = getBorderWidth(stop.level)
  const borderColor = getBorderColor(stop.level)
  const textColor = getTextColor(stop.level)
  const secondaryTextColor = getSecondaryTextColor(stop.level)

  const open = useCallback(() => openPlaceDetail(stop.place_id), [
    openPlaceDetail,
    stop,
  ])

  if ((stop.points?.length || 0) > 0) {
    return (
      <>
        <TripStopConnector />
        <Box>
          <TouchableOpacity onPress={open}>
            <Box
              width="100%"
              marginTop={6}
              borderRadius={8}
              padding={4}
              paddingTop={8}
              backgroundColor={softBackgroundColor}
              borderWidth={2}
              borderColor={borderColor}
              borderStyle="dashed"
            >
              <Text fontSize="xs" color="gray.500">
                {`${formattedFromDate} -> ${formattedToDate}`}
              </Text>
              <Text fontSize="xl" color="#3f3f46" marginTop={1}>
                {stop.name}
              </Text>
              <Box marginTop={4}>
                {map(stop.points, (point, index) => (
                  <TripPoint
                    key={`${point.id}_${index}`}
                    isFirst={index === 0}
                    openPlaceDetail={openPlaceDetail}
                    point={point}
                  />
                ))}
              </Box>
            </Box>
          </TouchableOpacity>
          <Box position="absolute">
            <TripCircleIcon
              name="flag"
              color={backgroundColor || borderColor}
            />
          </Box>
        </Box>
      </>
    )
  } else {
    return (
      <>
        <TripStopConnector />
        <Box>
          <TouchableOpacity onPress={open}>
            <Box
              width="100%"
              marginTop={6}
              borderRadius={8}
              padding={4}
              paddingTop={8}
              bg={backgroundColor}
              borderWidth={borderWidth}
              borderColor={borderColor}
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                marginBottom={1}
              >
                <VStack flex={1}>
                  <Text fontSize="xs" color={secondaryTextColor}>
                    {`${formattedFromDate} -> ${formattedToDate}`}
                  </Text>
                  <Text fontSize="xl" color={textColor} marginTop={1}>
                    {stop.name}
                  </Text>
                </VStack>
                <Icon
                  name="chevron-forward-outline"
                  size={20}
                  color={textColor}
                />
              </HStack>
            </Box>
          </TouchableOpacity>
          <Box position="absolute">
            <TripCircleIcon
              name="flag"
              color={backgroundColor || borderColor}
            />
          </Box>
        </Box>
      </>
    )
  }
}

export default TripStop
