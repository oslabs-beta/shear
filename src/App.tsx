import React from "react"
import ChakraForm from "./components/chakraForm.js"
import Graph from "./components/graph.js"
import GraphDetailed from "./components/graphDetailed.js"
import { Box, Text, Flex, Spacer, Stack, HStack, Grid, Center, ChakraProvider, extendBaseTheme, theme as chakraTheme, } from '@chakra-ui/react'
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
        <Box top="0%" left="0%" h="10vh" w="full" borderBottomWidth="5px" borderColor='gray.200' padding="50px" overflow='hidden' bg='gray.200' margin='0px'>
          <HStack>
            <Text as='b' fontSize='100px' color='#4285F4'>Shear</Text>
            <Text as='b' fontSize='30px' color='#4285F4'>an AWS Lambda function optimizer</Text>
          </HStack>

        </Box>
        <ChakraForm />
        <Box top="0%" left="0%" h="75vh" w="full" borderBottomWidth="5px" borderColor='gray.200' padding="50px" overflow='hidden' bg='gray.200' margin='0px'>
          <Flex color='white' h="90%" gridGap={20} bg='gray.200' >
            <Box bg='blue.100' w='50%' borderRadius='20'>
              <Text as='b' fontSize='34px' color='#4285F4' padding="10px">Standard Test Results</Text>
              <Graph />
            </Box>
            <Box bg='blue.100' w='50%' borderRadius='20'>
              <Text as='b' fontSize='34px' color='#4285F4' padding="10px">Fine-Tuned Test Results</Text>
              <GraphDetailed />
            </Box>
          </Flex>
        </Box>
        <Box top="0%" left="0%" h="7vh" w="full" borderBottomWidth="5px" borderColor='blue.50' padding="50px" overflow='hidden' bg='blue.100' margin='0px'></Box>
        {/* <div className="flex-container"></div> */}
      </Box >
      <Results />

    </ChakraProvider >
  )
}

export default App
