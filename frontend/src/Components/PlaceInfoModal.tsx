import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Button, Text, View as RBView } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Report from './Report'
import auth from '@react-native-firebase/auth'
import { Config } from '@/Config'
import { Place } from '@/Models/Place'
import { Report as ReportModel } from '@/Models/Report'
import { navigate } from '@/Navigators/utils'

interface IPlaceInfoModalProps {
  // eslint-disable-next-line react/require-default-props
  placeId?: string
}

const PlaceInfoModal = ({ placeId }: IPlaceInfoModalProps) => {
  const [currentInfo, setCurrentInfo] = useState<Place>()
  const [currentReports, setCurrentReports] = useState<ReportModel[]>()
  const [isLoading, setIsLoading] = useState(true)

  const fetchPlaceInfo = useCallback(async () => {
    try {
      const currentUser = await auth().currentUser
      if (!currentUser) {
        return
      }

      const idToken = await currentUser.getIdToken()

      const getReportsResponse = await fetch(
        `${Config.API_URL}/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + idToken,
            'Content-Type': 'application/json',
          },
        },
      )

      if (getReportsResponse.status === 200) {
        setCurrentInfo((await getReportsResponse.json()).data)
      }
    } catch (signInError) {}
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
        setIsLoading(true)
        await fetchPlaceInfo()
        await fetchReports()
        setIsLoading(false)
      }

      fetchDataAsync()
    }
  }, [setIsLoading, fetchPlaceInfo, fetchReports, placeId])

  const addReport = useCallback(
    () =>
      navigate('AddReport', {
        placeId,
        onReportAdded: () => placeId && fetchReports(),
      }),
    [placeId, fetchReports],
  )

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <>
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Text fontSize="3xl" marginBottom={4} fontWeight={600}>
          {currentInfo?.name}
        </Text>
        <Text color="gray.600">
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
      </View>
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
