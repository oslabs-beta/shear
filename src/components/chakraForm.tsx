import React, { useRef, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { arnInput, funcParamsInput, powerValueInput } from "../formData/infoSlice.ts";
import { runOptimizer } from "../formData/resultsSlice";
import * as ChakraUI from '@chakra-ui/react'
import './style.css'


const ChakraForm: React.FC = () => {
    const resultsState = useSelector((state: RootState) => state.results)
    const formState = useSelector((state: RootState) => state.info)
    const dispatch = useDispatch();
    const arnRef = useRef<HTMLInputElement | null>(null);
    const funcParamsRef = useRef<HTMLInputElement | null>(null);
    const memoryRef = useRef<string[]>([])
    useEffect(() => {
        if (formState.ARN !== '') {
            dispatch(runOptimizer(formState))
        }
    }, [formState])

    const onChangeMinVal = (e: ChangeEvent<HTMLInputElement>) => {
        memoryRef.current[0] = e.target.value
    }
    const onChangeMaxVal = (e: ChangeEvent<HTMLInputElement>) => {
        memoryRef.current[1] = e.target.value
    }

    const onChangeIncrements = (e: ChangeEvent<HTMLInputElement>) => {
        memoryRef.current[2] = e.target.value
    }

    const onChangeTestVol = (e: ChangeEvent<HTMLInputElement>) => {
        memoryRef.current[3] = e.target.value
    }

    //onSubmit changes the form state then invokes post request to backend -JK
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted');
        dispatch(arnInput(arnRef.current?.value || ''));
        dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
        dispatch(powerValueInput(memoryRef.current));



    };


    return (
        <div>
            <ChakraUI.Box position="relative" h="20%" w="60%" border="2px" padding="50px" borderRadius='lg' overflow='hidden' bg='lightgrey' margin='0 auto'>
                <ChakraUI.Stack spacing={4}>
                    <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Amazon stuff</ChakraUI.Text>
                    <ChakraUI.InputGroup>
                        <ChakraUI.InputLeftAddon children='ARN' bg='gray.400' />
                        <ChakraUI.Input ref={arnRef} placeholder='arn:aws:iam::123456789012:user/johndoe' />
                    </ChakraUI.InputGroup>
                    <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Function Parameters</ChakraUI.Text>
                    <ChakraUI.Textarea
                        ref={funcParamsRef}
                        placeholder='Please enter parameters and values in JSON format'
                        size='sm'
                    />
                    <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Memory Allocation</ChakraUI.Text>
                    {/* <ChakraUI.FormLabel>Power Values</ChakraUI.FormLabel> */}
                    <ChakraUI.HStack>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon children='Min' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeMinVal} placeholder='128' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon children='Max' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeMaxVal} placeholder='4096' />
                        </ChakraUI.InputGroup>
                    </ChakraUI.HStack>
                    <ChakraUI.HStack>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon children='Memory Intervals' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeIncrements} placeholder='8' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon children='Test Volume' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeTestVol} placeholder='10' />
                        </ChakraUI.InputGroup>
                    </ChakraUI.HStack>
                </ChakraUI.Stack>

                <ChakraUI.Button
                    mt={4}
                    colorScheme='blue'
                    type='submit'
                    onClick={onSubmit}
                >
                    Submit
                </ChakraUI.Button>
            </ChakraUI.Box>
        </div>
    );
};

export default ChakraForm;