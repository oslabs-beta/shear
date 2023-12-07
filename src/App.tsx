import React from "react"
import Form from "./components/form.js"
import Graph from "./components/graph.js"
import { ChakraProvider } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import './style.css'

const App: React.FC = () => {


  return (
    <ChakraProvider>
      {/* <div className="flex-container"> */}
      <Form />
      <Graph />
      {/* </div> */}
    </ChakraProvider>
  )
}

export default App
