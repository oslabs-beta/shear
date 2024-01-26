import React from "react"
import ChakraForm from "./components/chakraForm.js"
import Graph from "./components/graph.js"
import GraphDetailed from "./components/graphDetailed.js"
import { ChakraProvider, extendBaseTheme, theme as chakraTheme, } from '@chakra-ui/react'
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
      {/* <div className="flex-container"> */}
      {/* <Form /> */}
      <ChakraForm />
      <Graph />
      <GraphDetailed />

      <Results />
      {/* </div> */}
    </ChakraProvider>
  )
}

export default App
