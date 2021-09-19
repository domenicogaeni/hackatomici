import React, { useCallback, useState } from 'react'
import { Config } from '@/Config'
import { Pressable, Text, VStack } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'
import SetUser from '@/Store/User/SetUser'

interface ScoreProps {
  score: number
  vote: 'up' | 'down' | null
  reportId: number
}

const Score = ({ score, vote, reportId }: ScoreProps) => {
  const dispatch = useDispatch()

  const [optScore, setOptScore] = useState<number>(score)
  const [optVote, setOptVote] = useState<'up' | 'down' | null>(vote)

  const sendVote = useCallback(
    async (value, double?: boolean) => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          dispatch(SetUser.action({ shouldShowOnboarding: false }))
          return
        }

        const idToken = await currentUser.getIdToken()

        const { status } = await fetch(
          `${Config.API_URL}/reports/${reportId}/vote`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + idToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              vote: value,
            }),
          },
        )
        if (status === 200) {
          setOptScore(
            value === 'up'
              ? optScore + 1 + (double ? 1 : 0)
              : optScore - 1 - (double ? 1 : 0),
          )
          setOptVote(value === 'up' ? 'up' : 'down')
        }
      } catch (signInError) {}
    },
    [dispatch, reportId, optScore],
  )

  const removeVote = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const { status } = await fetch(
        `${Config.API_URL}/reports/${reportId}/vote`,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        },
      )
      if (status === 200) {
        setOptScore(optScore - (optVote === 'up' ? 1 : -1))
        setOptVote(null)
      }
    } catch (signInError) {}
  }, [reportId, optScore, optVote])

  return (
    <VStack
      justifyContent="center"
      alignItems="center"
      paddingX="1"
      bg="rgba(255, 255, 255, 0.2)"
    >
      <Pressable
        onPress={() =>
          optVote === 'up' ? removeVote() : sendVote('up', optVote === 'down')
        }
      >
        <Icon
          name="caret-up-outline"
          size={22}
          color={optVote === 'up' ? 'black' : 'grey'}
        />
      </Pressable>
      <Text>{optScore}</Text>
      <Pressable
        onPress={() =>
          optVote === 'down' ? removeVote() : sendVote('down', optVote === 'up')
        }
      >
        <Icon
          name="caret-down-outline"
          size={22}
          color={optVote === 'down' ? 'black' : 'grey'}
        />
      </Pressable>
    </VStack>
  )
}

export default Score
