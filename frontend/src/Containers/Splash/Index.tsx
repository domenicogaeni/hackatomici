import React from 'react'
import { Brand } from '@/Components'
import { Box } from 'native-base'

const Splash = () => (
  <Box
    justifyContent="center"
    alignItems="center"
    height="100%"
    width="100%"
    bg="white"
    padding={8}
  >
    <Brand />
  </Box>
)

export default Splash
