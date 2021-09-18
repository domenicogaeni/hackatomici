import React, { useEffect, useState } from 'react'
import { Input, Box } from 'native-base'

const Autocomplete = () => {
  const [searchText, setSearchText] = useState<string>()

  useEffect(() => {
    // api ricerca
  }, [searchText])

  return (
    <Box bg="transparent">
      <Input
        mx={3}
        placeholder="Cerca"
        _light={{
          placeholderTextColor: 'blueGray.400',
        }}
        bg="white"
        onChangeText={setSearchText}
        value={searchText}
      />
    </Box>
  )
}

export default Autocomplete
