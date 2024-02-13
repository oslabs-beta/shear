import React from "react"
import ChakraForm from "./components/chakraForm.js"
import Graph from "./components/graph.js"
import GraphDetailed from "./components/graphDetailed.js"
import { Box, Text, Flex, Spacer, Stack, Grid, Center, ChakraProvider, extendBaseTheme, theme as chakraTheme, } from '@chakra-ui/react'
// import chakraTheme from '@chakra-ui/theme'
import './style.css'
import Results from "./components/results.js"

const { Button } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button,
  },
})

const App: React.FC = () => {


  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Box top="0%" left="0%" h="7vh" w="full" borderBottomWidth="5px" borderColor='purple.50' padding="50px" overflow='hidden' bg='purple.50' margin='0px'>
          <Text as='b' fontSize='24px' color='#4285F4'>Shear</Text>
        </Box>
        <ChakraForm />
        <Box top="0%" left="0%" h="75vh" w="full" borderBottomWidth="5px" borderColor='purple.50' padding="50px" overflow='hidden' bg='purple.50' margin='0px'>
          <Flex color='white' h="90%" gridGap={20} bg='purple.50' >
            <Box bg='cyan.100' w='50%' borderRadius='20'>
              <Graph />
            </Box>
            <Box bg='cyan.100' w='50%' borderRadius='20'>
              <GraphDetailed />
            </Box>
          </Flex>
        </Box>
        <Box top="0%" left="0%" h="9vh" w="full" borderBottomWidth="5px" borderColor='blue.50' padding="50px" overflow='hidden' bg='blue.50' margin='0px'></Box>
        {/* <div className="flex-container"></div> */}
      </Box >
      <Results />

    </ChakraProvider >
  )
}

export default App
