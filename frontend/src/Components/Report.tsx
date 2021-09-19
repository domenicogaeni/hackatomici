import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Box, HStack, Text, VStack } from 'native-base'
import Score from './Score'

interface ReportProps {
  title: string
  description: string
  color: string
  dateFrom: string
  dateTo: string | null
  score: number
  vote: 'up' | 'down' | null
  id: number
  type: 'community' | 'verified'
}

const Report = ({
  title,
  description,
  color,
  dateFrom,
  dateTo,
  score,
  vote,
  id,
  type,
}: ReportProps) => {
  return (
    <Box
      bg={color !== 'white' ? `${color}.400` : 'white'}
      py={4}
      px={3}
      mb={4}
      rounded="md"
      alignSelf="center"
      width={375}
      maxWidth="100%"
      borderColor="gray.100"
      borderWidth={color === 'white' ? 1 : 0}
    >
      <HStack justifyContent="space-between">
        <Box flex={1} justifyContent="space-between">
          <VStack space={2}>
            <Text
              fontSize="xxs"
              color={
                color !== 'white' && color !== 'yellow' ? 'white' : 'gray.600'
              }
            >
              {dateFrom || ''} {'->'} {dateTo || 'In vigore'}
            </Text>
            <Text
              color={
                color !== 'white' && color !== 'yellow' ? 'white' : 'black'
              }
              fontSize="xl"
            >
              {title}
            </Text>
            <Text
              color={
                color !== 'white' && color !== 'yellow' ? 'white' : 'black'
              }
              fontSize="sm"
            >
              {description}
            </Text>
          </VStack>
        </Box>
        {type === 'community' ? (
          <Score score={score} vote={vote} reportId={id} />
        ) : (
          <Icon name="shield-checkmark" size={22} color={'black'} />
        )}
      </HStack>
    </Box>
  )
}

export default Report
