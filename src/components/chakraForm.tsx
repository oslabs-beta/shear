import React, { useRef, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { nameInput, arnInput, funcParamsInput, powerValueInput, testVolInput } from "../formData/infoSlice.ts";
import { runOptimizer } from "../formData/resultsSlice";
import * as ChakraUI from '@chakra-ui/react'
import LoadingBar from "./loadingBar.tsx"
import { Form, Field, useField, useForm } from "react-final-form";
import validate from "./validate";
import './style.css'

const ChakraForm: React.FC = () => {
    const resultsState = useSelector((state: RootState) => state.results)
    const formState = useSelector((state: RootState) => state.info)
    const dispatch = useDispatch();
    const arnRef = useRef<HTMLInputElement | null>(null);
    const funcParamsRef = useRef<HTMLInputElement | null>(null);
    const memoryRef = useRef<string[]>([])
    const [show, setShow] = useState(false); //this is used to toggle whether the loading bar shows up

    useEffect(() => {
        if (formState.ARN !== '') {
            dispatch(runOptimizer(formState))
        }
    }, [formState])

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        memoryRef.current[5] = e.target.value
    }
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
        setShow(true);
        dispatch(nameInput(memoryRef.current[5]))
        dispatch(arnInput(arnRef.current?.value || ''));
        dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
        dispatch(powerValueInput(memoryRef.current));
        dispatch(testVolInput(memoryRef.current[3]))
    };
    useEffect(() => {
        setShow(false)
    }, [resultsState])

    return (
        <ChakraUI.Center w="100%">
            <ChakraUI.Box position="relative" h="20%" w="100%" border="2px" padding="50px" overflow='hidden' bg='lightgrey' margin='0px'>
                <ChakraUI.HStack spacing={10} direction='row' align='stretch' divider={<ChakraUI.StackDivider borderColor='gray.200' />}>
                    <ChakraUI.Stack spacing={8} direction='row' align='stretch'>
                        <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>ARN Details</ChakraUI.Text>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Name' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeName} placeholder='Input function name to save function for future use' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='ARN' bg='gray.400' />
                            <ChakraUI.Input ref={arnRef} placeholder='arn:aws:iam::123456789012:user/johndoe' />
                        </ChakraUI.InputGroup>
                    </ChakraUI.Stack>

                    <ChakraUI.Stack spacing={8} direction='row' align='stretch'>
                        <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Function Parameters</ChakraUI.Text>
                        <ChakraUI.InputGroup>
                            <ChakraUI.Textarea
                                ref={funcParamsRef}
                                placeholder='Please enter parameters and values in JSON format'
                                size='sm'
                            />
                        </ChakraUI.InputGroup>
                    </ChakraUI.Stack>

                    <ChakraUI.Stack spacing={8} direction='row' align='stretch'>
                        <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Memory Allocation</ChakraUI.Text>
                        {/* <ChakraUI.FormLabel>Power Values</ChakraUI.FormLabel> */}

                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Minimum Allocation (MB)' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeMinVal} placeholder='128' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Maximum Allocation (MB)' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeMaxVal} placeholder='4096' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Memory Intervals' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeIncrements} placeholder='8' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Test Volume' bg='gray.400' />
                            <ChakraUI.Input type="text" onChange={onChangeTestVol} placeholder='10' />
                        </ChakraUI.InputGroup>
                    </ChakraUI.Stack>
                    <ChakraUI.Stack spacing={4} direction='row' align='center'>
                        <ChakraUI.Button
                            mt={4}
                            colorScheme='blue'
                            type='submit'
                            onClick={onSubmit}
                        >
                            Submit
                        </ChakraUI.Button>
                        <ChakraUI.Checkbox defaultChecked>Recursive Search</ChakraUI.Checkbox>
                    </ChakraUI.Stack>
                </ChakraUI.HStack>

            </ChakraUI.Box>
            <ChakraUI.Box h="40px" >
                {show ? <LoadingBar /> : null}
            </ChakraUI.Box>

        </ChakraUI.Center>
    );
};

export default ChakraForm;