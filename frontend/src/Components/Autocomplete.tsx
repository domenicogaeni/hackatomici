import {
  autocomplete,
  placeDetails,
} from '@/Services/GooglePlaces/googlePlacesApi'
import {
  LocationPickerItem,
  Point,
} from '@/Services/GooglePlaces/googlePlacesTypings'
import { Box, Divider, Input, Text } from 'native-base'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { debounce } from 'lodash'

interface Props {
  sessionToken: string
  setLocation: (location: Point) => void
}

const Autocomplete = ({ sessionToken, setLocation }: Props) => {
  const [query, setQuery] = useState<string>()
  const [items, setItems] = useState<LocationPickerItem[]>()
  const [showResults, setShowResults] = useState<boolean>(false)

  const autocompleteAsync = useCallback(
    async (text: string) => {
      const predictions = await autocomplete(text, sessionToken)
      if (predictions) {
        setItems(
          predictions.map(prediction =>
            LocationPickerItem.fromPrediction(prediction),
          ),
        )
      }
    },
    [sessionToken, setItems],
  )

  const debouncedAutocomplete = useRef(
    debounce((text: string) => autocompleteAsync(text), 400),
  )

  useEffect(() => {
    if (query) {
      debouncedAutocomplete.current(query)
    } else {
      setItems(undefined)
    }
  }, [query, autocompleteAsync, setItems])

  const onSearch = useCallback(text => setQuery(text), [setQuery])

  const placeDetailsAsync = useCallback(
    async (placeId: string) => {
      const placeDetail = await placeDetails(placeId, sessionToken)
      if (placeDetail) {
        setLocation({
          lat: placeDetail.geometry?.location.lat as number,
          lng: placeDetail.geometry?.location.lng as number,
        })
      }
    },
    [sessionToken, setLocation],
  )

  return (
    <Box bg="transparent">
      <Input
        mx={3}
        placeholder="Cerca"
        _light={{
          placeholderTextColor: 'blueGray.400',
        }}
        bg="white"
        onChangeText={onSearch}
        value={query}
        onFocus={() => setShowResults(true)}
      />
      {items && items.length > 0 && showResults && (
        <Box py={1} px={1} alignSelf="center" width={375} maxWidth="100%">
          {items.map((element, index) => (
            <SuggestedElement
              key={element.place_id + index}
              element={element}
              onPress={() => {
                setQuery(element.description)
                placeDetailsAsync(element.place_id)
                Keyboard.dismiss()
                setShowResults(false)
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

interface SuggestedElementProps {
  element: LocationPickerItem
  onPress: () => void
}

const SuggestedElement = ({ element, onPress }: SuggestedElementProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        bg="white"
        py={4}
        px={3}
        alignSelf="center"
        width={375}
        maxWidth="100%"
      >
        <Text>{element.description}</Text>
      </Box>
      <Divider />
    </TouchableOpacity>
  )
}

export default Autocomplete
