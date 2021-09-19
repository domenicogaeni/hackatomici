import { autocomplete } from '@/Services/GooglePlaces/googlePlacesApi'
import { LocationPickerItem } from '@/Services/GooglePlaces/googlePlacesTypings'
import { Box, Divider, Input, Text } from 'native-base'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { debounce } from 'lodash'

interface Props {
  sessionToken: string
  // eslint-disable-next-line react/require-default-props
  autoClean?: boolean
  onPlacePicked: (item: LocationPickerItem) => void
}

const PlacePicker = ({
  sessionToken,
  autoClean = true,
  onPlacePicked,
}: Props) => {
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

  return (
    <Box bg="transparent">
      <Input
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
                if (autoClean) {
                  setQuery(undefined)
                } else {
                  setQuery(element.description)
                }
                onPlacePicked(element)
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

export default PlacePicker
