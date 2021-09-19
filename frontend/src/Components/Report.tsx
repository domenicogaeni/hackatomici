import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Box, HStack, Text, VStack } from 'native-base'
import Score from './Score'
import moment from 'moment'
import { WarningLevel } from '@/Models/Trip'

interface ReportProps {
  title: string
  description: string
  level: WarningLevel
  dateFrom: string
  dateTo: string | null
  score: number
  vote: 'up' | 'down' | null
  id: number
  type: 'community' | 'verified'
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

function getBorderWidth(level: WarningLevel) {
  switch (level) {
    case 'white':
      return 1
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
      return '#3f3f46'
    case 'orange':
    case 'red':
      return 'white'
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

const Report = ({
  title,
  description,
  level,
  dateFrom,
  dateTo,
  score,
  vote,
  id,
  type,
}: ReportProps) => {
  const formattedFromDate = moment(dateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')
  const formattedToDate = dateTo
    ? moment(dateTo, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : 'In vigore'

  const backgroundColor = getBackgroundColor(level)
  const borderWidth = getBorderWidth(level)
  const borderColor = getBorderColor(level)
  const textColor = getTextColor(level)
  const secondaryTextColor = getSecondaryTextColor(level)

  return (
    <Box
      bg={backgroundColor}
      py={4}
      px={3}
      mb={4}
      rounded="md"
      alignSelf="center"
      width={375}
      maxWidth="100%"
      borderColor={borderColor}
      borderWidth={borderWidth}
    >
      <HStack justifyContent="space-between">
        <Box flex={1} justifyContent="space-between">
          <VStack space={2}>
            <Text fontSize="xxs" color={secondaryTextColor}>
              {`${formattedFromDate} -> ${formattedToDate}`}
            </Text>
            <Text color={textColor} fontSize="xl">
              {title}
            </Text>
            <Text color={textColor} fontSize="sm">
              {description}
            </Text>
          </VStack>
        </Box>
        {type === 'community' ? (
          <Score score={score} vote={vote} reportId={id} />
        ) : (
          <Icon name="shield-checkmark" size={22} color={borderColor} />
        )}
      </HStack>
    </Box>
  )
}

export default Report
