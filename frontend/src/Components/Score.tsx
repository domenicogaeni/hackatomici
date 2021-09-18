import React, { useCallback } from 'react'
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

  const sendVote = useCallback(
    async value => {
      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          dispatch(SetUser.action({ shouldShowOnboarding: false }))
          return
        }

        const idToken = await currentUser.getIdToken()

        await fetch(`${Config.API_URL}/reports/${reportId}/vote`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vote: value,
          }),
        })
      } catch (signInError) {}
    },
    [dispatch, reportId],
  )

  const removeVote = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      await fetch(`${Config.API_URL}/reports/${reportId}/vote`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'Content-Type': 'application/json',
        },
      })
    } catch (signInError) {}
  }, [reportId])

  return (
    <VStack alignItems="center" paddingX="1" bg="rgba(255, 255, 255, 0.2)">
      <Pressable
        onPress={() => (vote === 'up' ? removeVote() : sendVote('up'))}
      >
        <Icon
          name="caret-up-outline"
          size={22}
          color={vote === 'up' ? 'black' : 'grey'}
        />
      </Pressable>
      <Text>{score}</Text>
      <Pressable
        onPress={() => (vote === 'down' ? removeVote() : sendVote('down'))}
      >
        <Icon
          name="caret-down-outline"
          size={22}
          color={vote === 'down' ? 'black' : 'grey'}
        />
      </Pressable>
    </VStack>
  )
}

export default Score
