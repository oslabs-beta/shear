import React from "react"
import Form from "../components/form.ts"
import ChakraForm from "./chakraForm.tsx"
import Graph from "../components/graph.tsx"
import { ChakraProvider } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import './style.css'
import { Results } from "../components/results.tsx"
import { Grid } from "@chakra-ui/react"

const App: React.FC = () => {


  return (
    <ChakraProvider>
      <Grid templateColumns='repeat(2, 1fr)' gap={5}>
      {/* <Form /> */}
      <ChakraForm />
      <Graph />
      </Grid>
      {/* <Results /> */}
    </ChakraProvider>
    
  )
}

export default App
