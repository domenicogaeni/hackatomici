import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '@/Theme'
import FetchOne from '@/Store/User/FetchOne'
import ChangeTheme from '@/Store/Theme/ChangeTheme'
import { useTranslation } from 'react-i18next'
import { UserState } from '@/Store/User'
import { ThemeState } from '@/Store/Theme'
import { Box, HStack, VStack, Text, Pressable, Image } from 'native-base'

const IndexExampleContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const user = useSelector((state: { user: UserState }) => state.user.item)
  const fetchOneUserLoading = useSelector(
    (state: { user: UserState }) => state.user.fetchOne.loading,
  )
  const fetchOneUserError = useSelector(
    (state: { user: UserState }) => state.user.fetchOne.error,
  )

  const [userId, setUserId] = useState('1')

  const fetch = (id: string) => {
    setUserId(id)
    if (id) {
      dispatch(FetchOne.action(id))
    }
  }

  const changeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(ChangeTheme.action({ theme, darkMode }))
  }

  return (
    <View style={[Layout.fill, Layout.colCenter, Gutters.smallHPadding]}>
      <View style={[[Gutters.smallHPadding]]}>
        <Box
          bg="primary.600"
          py={4}
          px={3}
          rounded="md"
          alignSelf="center"
          width={375}
          maxWidth="100%"
        >
          <HStack justifyContent="space-between">
            <Box justifyContent="space-between">
              <VStack space={2}>
                <Text fontSize="xxs" color="white">
                  20/03/2022 {'->'} 22/03/2022
                </Text>
                <Text color="white" fontSize="lg">
                  Barcellona
                </Text>
              </VStack>
              <Pressable
                rounded="sm"
                bg="primary.400"
                alignSelf="flex-start"
                py={2}
                px={3}
              >
                <Text
                  textTransform="uppercase"
                  fontSize={'sm'}
                  fontWeight="bold"
                  color="white"
                >
                  Visualizza
                </Text>
              </Pressable>
            </Box>
            <Image
              source={{
                uri:
                  'https://media.vanityfair.com/photos/5ba12e6d42b9d16f4545aa19/3:2/w_1998,h_1332,c_limit/t-Avatar-The-Last-Airbender-Live-Action.jpg',
              }}
              alt="Aang flying and surrounded by clouds"
              height={100}
              rounded="full"
              width={100}
            />
          </HStack>
        </Box>
        {/* {fetchOneUserLoading && <ActivityIndicator />}
        {fetchOneUserError ? (
          <Text style={Fonts.textRegular}>{fetchOneUserError.message}</Text>
        ) : (
          <Text style={Fonts.textRegular}>
            {t('example.helloUser', { name: user.name })}
          </Text>
        )} */}
      </View>
      {/* <View
        style={[
          Layout.row,
          Layout.rowHCenter,
          Gutters.smallHPadding,
          Gutters.largeVMargin,
          Common.backgroundPrimary,
        ]}
      >
        <Text style={[Layout.fill, Fonts.textCenter, Fonts.textSmall]}>
          {t('example.labels.userId')}
        </Text>
        <TextInput
          onChangeText={text => fetch(text)}
          editable={!fetchOneUserLoading}
          keyboardType={'number-pad'}
          maxLength={1}
          value={userId}
          selectTextOnFocus
          style={[Layout.fill, Common.textInput]}
        />
      </View> */}
      {/* <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>DarkMode :</Text>

      <TouchableOpacity
        style={[Common.button.rounded, Gutters.regularBMargin]}
        onPress={() => changeTheme({ darkMode: null })}
      >
        <Text style={Fonts.textRegular}>Auto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[Common.button.outlineRounded, Gutters.regularBMargin]}
        onPress={() => changeTheme({ darkMode: true })}
      >
        <Text style={Fonts.textRegular}>Dark</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[Common.button.outline, Gutters.regularBMargin]}
        onPress={() => changeTheme({ darkMode: false })}
      >
        <Text style={Fonts.textRegular}>Light</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default IndexExampleContainer
