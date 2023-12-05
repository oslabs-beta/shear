import React, { useRef, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { arnInput, funcParamsInput, lowestPowerValueInput, highestPowerValueInput } from "../formData/infoSlice";
import { runOptimizer } from "../formData/resultsSlice";
import * as ChakraUI from '@chakra-ui/react'
import './style.css'


const Form: React.FC = () => {
  const resultsState = useSelector((state: RootState) => state.results)
  const formState = useSelector((state: RootState) => state.info)
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const arnRef = useRef<HTMLInputElement | null>(null);
  const funcParamsRef = useRef<HTMLInputElement | null>(null);
  const lowestPowerValRef = useRef<HTMLInputElement | null>(null);
  const highestPowerValRef = useRef<HTMLInputElement | null>(null);

  //onSubmit changes the form state then invokes post request to backend -JK
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
    dispatch(arnInput(arnRef.current?.value || ''));
    dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
    dispatch(lowestPowerValueInput(lowestPowerValRef.current?.value || ''));
    dispatch(highestPowerValueInput(highestPowerValRef.current?.value || ''));
    dispatch(runOptimizer(formState))

    if (formRef.current) {
      formRef.current.reset();
    }
  };




  return (
    <div>
      {/* <form ref={formRef} onSubmit={onSubmit}>
        <label><strong>Paste ARN here</strong></label><br />
        <input type="text" ref={arnRef} placeholder="Paste Arn Here" /><br />
        <label><strong>Separate your function parameters by commas</strong></label><br />
        <input type="text" ref={funcParamsRef} placeholder="Input Function Parameters" /><br />
        <label><strong>Power Values</strong></label><br></br>
        <input type="text" ref={lowestPowerValRef} placeholder="lowest"></input><br></br>
        <input type="text" ref={highestPowerValRef} placeholder="highest"></input><br></br>
        <button type="submit">Submit</button>
      </form> */}

      {/* This is just design for now (no functionality) */}
      <ChakraUI.Box position="relative" h="20%" w="60%" border="2px" padding="50px" borderRadius='lg' overflow='hidden' bg='yellow.100'>

        <ChakraUI.Stack spacing={4}>

          <ChakraUI.Text as='b' fontSize='24px' color='tomato'>Amazon stuff</ChakraUI.Text>

          <ChakraUI.InputGroup>
            <ChakraUI.InputLeftAddon children='ARN' bg='gray.400' />
            <ChakraUI.Input placeholder='arn:aws:iam::123456789012:user/johndoe' />
          </ChakraUI.InputGroup>

          {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
          <ChakraUI.InputGroup >
            <ChakraUI.InputLeftAddon children='Function Parameters' bg='gray.400' />
            <ChakraUI.Input placeholder='Separate your function parameters by commas' />
          </ChakraUI.InputGroup>

          <ChakraUI.Text as='b' fontSize='24px' color='tomato'>Power Values</ChakraUI.Text>
          {/* <ChakraUI.FormLabel>Power Values</ChakraUI.FormLabel> */}
          <ChakraUI.InputGroup>
            <ChakraUI.InputLeftAddon children='Lowest' bg='gray.400' />
            <ChakraUI.Input placeholder='128' />
            <ChakraUI.InputRightAddon children='MB' bg='gray.400' />
          </ChakraUI.InputGroup>
          <ChakraUI.InputGroup >
            <ChakraUI.InputLeftAddon children='Highest' bg='gray.400' />
            <ChakraUI.Input placeholder='1024' />
            <ChakraUI.InputRightAddon children='MB' bg='gray.400' />
          </ChakraUI.InputGroup>
        </ChakraUI.Stack>
        <ChakraUI.Button
          mt={4}
          colorScheme='teal'
          type='submit'
        // needs an onclick
        >
          Submit
        </ChakraUI.Button>
      </ChakraUI.Box>
    </div>
  );
};

export default Form;
