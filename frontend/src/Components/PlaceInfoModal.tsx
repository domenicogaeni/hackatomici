import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Box, Button, HStack, Text, View as RBView } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import Report from './Report'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { Place } from '@/Models/Place'
import { Report as ReportModel } from '@/Models/Report'
import Icon from 'react-native-vector-icons/Ionicons'
import { navigate } from '@/Navigators/utils'

interface IPlaceInfoModalProps {
  // eslint-disable-next-line react/require-default-props
  placeId?: string
}

const PlaceInfoModal = ({ placeId }: IPlaceInfoModalProps) => {
  const [currentInfo, setCurrentInfo] = useState<Place>()
  const [currentReports, setCurrentReports] = useState<ReportModel[]>()
  const [isLoading, setLoading] = useState(true)
  const [isTogglingFavourite, setTogglingFavourite] = useState(false)

  const fetchPlaceInfo = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const getInfoResponse = await fetch(
        `${Config.API_URL}/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        },
      )

      if (getInfoResponse.status === 200) {
        setCurrentInfo((await getInfoResponse.json()).data)
      }
    } catch (getInfoError) {}
  }, [placeId, setCurrentInfo])

  const fetchReports = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const getReportsResponse = await fetch(
        Config.API_URL + `/reports/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        },
      )

      if (getReportsResponse.status === 200) {
        setCurrentReports((await getReportsResponse.json()).data)
      }
    } catch (signInError) {}
  }, [placeId, setCurrentReports])

  useEffect(() => {
    if (placeId) {
      const fetchDataAsync = async () => {
        setLoading(true)
        await fetchPlaceInfo()
        await fetchReports()
        setLoading(false)
      }

      fetchDataAsync()
    }
  }, [setLoading, fetchPlaceInfo, fetchReports, placeId])

  const addReport = useCallback(
    () =>
      navigate('AddReport', {
        placeId,
        onReportAdded: () => placeId && fetchReports(),
      }),
    [placeId, fetchReports],
  )

  const toggleFavourite = useCallback(async () => {
    if (currentInfo) {
      setTogglingFavourite(true)

      try {
        const currentUser = await auth().currentUser
        if (!currentUser) {
          return
        }

        const idToken = await currentUser.getIdToken()

        // Remove favourite
        const result = await (currentInfo.favourite
          ? fetch(
              `${Config.API_URL}/users/favourite_places/${currentInfo.place_id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: 'Bearer ' + idToken,
                  'Content-Type': 'application/json',
                },
              },
            )
          : fetch(`${Config.API_URL}/users/favourite_places`, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + idToken,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                places_ids: [currentInfo.place_id],
              }),
            }))

        if (result.status === 200) {
          await fetchPlaceInfo()
        }
      } catch (deletePlaceError) {}
      setTogglingFavourite(false)
    }
  }, [currentInfo, fetchPlaceInfo, setTogglingFavourite])

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <>
      <Box padding={4}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={1}
        >
          <Text flex={1} fontSize="3xl" fontWeight={600} marginRight={2}>
            {currentInfo?.name}
          </Text>
          {isTogglingFavourite ? (
            <ActivityIndicator color="primary.500" />
          ) : (
            <TouchableOpacity onPress={toggleFavourite}>
              <Icon
                name={currentInfo?.favourite ? 'heart' : 'heart-outline'}
                size={24}
                color="#14b8a6"
              />
            </TouchableOpacity>
          )}
        </HStack>
        <Text color="gray.600" marginBottom={4}>
          {currentInfo
            ? `${
                currentInfo.administrative_area_level_2
                  ? currentInfo.administrative_area_level_2 + ', '
                  : ''
              }${
                currentInfo.administrative_area_level_1
                  ? currentInfo.administrative_area_level_1 + ', '
                  : ''
              }${currentInfo.country}`
            : ''}
        </Text>
      </Box>
      <BottomSheetScrollView>
        <View style={{ padding: 16 }}>
          {currentReports?.map((content, index) => (
            <Report
              key={index}
              title={content.title}
              description={content.description}
              color={content.level}
              dateFrom={content.from}
              dateTo={content.to}
              score={content.score}
              vote={content.vote}
              type={content.type}
              id={content.id}
            />
          ))}
        </View>
      </BottomSheetScrollView>
      <RBView p={4} bg="primary.50">
        <Button onPress={addReport}>+ Aggiungi segnalazione</Button>
      </RBView>
    </>
  )
}

export default PlaceInfoModal
