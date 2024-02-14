import React, { useRef, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { nameInput, arnInput, funcParamsInput, powerValueInput, testVolInput, checksInput } from "../formData/infoSlice.ts";
import { runOptimizer } from "../formData/resultsSlice";
import * as ChakraUI from '@chakra-ui/react'
import LoadingBar from "./loadingBar.tsx"
import { Form, Field, useField, useForm } from "react-final-form";
import validate from "./validate";
import './style.css'

const ChakraForm: React.FC = () => {
    const resultsState = useSelector((state: RootState) => state.results);
    const formState = useSelector((state: RootState) => state.info);
    const dispatch = useDispatch();
    const arnRef = useRef<HTMLInputElement | null>(null);
    const funcParamsRef = useRef<HTMLInputElement | null>(null);
    const memoryRef = useRef<string[]>([]);
    const [show, setShow] = useState(false); //this is used to toggle whether the loading bar shows up
    const [checkedItems, setCheckedItems] = React.useState([true, false])
    // const toast = ChakraUI.useToast();

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
        dispatch(checksInput(checkedItems))
    };
    useEffect(() => {
        setShow(false)
    }, [resultsState])



    return (
        <ChakraUI.Center w="100%" top="10%" h="30%"  >
            <ChakraUI.Box position="relative" top="10%" h="30%" w="100%" borderBottomWidth="5px" borderColor='blue.100' padding="50px" overflow='hidden' bg='blue.100' margin='0px'>
                <ChakraUI.HStack spacing={4} direction='row' align='left' divider={<ChakraUI.StackDivider borderColor='gray.700' shouldWrapChildren='true' />}>
                    <ChakraUI.Stack spacing={4} direction='row' align='stretch'>
                        <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>ARN Details</ChakraUI.Text>
                        <ChakraUI.InputGroup borderRadius="lg">
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Name' bg='gray.200' borderLeftRadius="lg" />
                            <ChakraUI.Input type="text" onChange={onChangeName} placeholder='Input function name to save function for future use' borderRightRadius="lg" fontSize='18px' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='ARN' bg='gray.200' borderLeftRadius="lg" />
                            <ChakraUI.Input ref={arnRef} placeholder='arn:aws:iam::123456789012:user/johndoe' borderRightRadius="lg" fontSize='18px' />
                        </ChakraUI.InputGroup>
                    </ChakraUI.Stack>

                    <ChakraUI.Stack spacing={4} direction='row' align='stretch'>
                        <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Function Parameters</ChakraUI.Text>
                        <ChakraUI.InputGroup>
                            <ChakraUI.Textarea
                                ref={funcParamsRef}
                                placeholder='Please enter parameters and values in JSON format'
                                size='sm'
                                borderRadius="lg"
                            />
                        </ChakraUI.InputGroup>
                    </ChakraUI.Stack>

                    <ChakraUI.Stack spacing={4} direction='row' align='stretch'>
                        <ChakraUI.Text as='b' fontSize='24px' color='#4285F4'>Memory Allocation</ChakraUI.Text>
                        {/* <ChakraUI.FormLabel>Power Values</ChakraUI.FormLabel> */}

                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Minimum Allocation (MB)' bg='gray.200' borderLeftRadius="lg" />
                            <ChakraUI.Input type="text" onChange={onChangeMinVal} placeholder='128' borderRightRadius="lg" fontSize='18px' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Maximum Allocation (MB)' bg='gray.200' borderLeftRadius="lg" />
                            <ChakraUI.Input type="text" onChange={onChangeMaxVal} placeholder='4096' borderRightRadius="lg" fontSize='18px' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Memory Intervals' bg='gray.200' borderLeftRadius="lg" />
                            <ChakraUI.Input type="text" onChange={onChangeIncrements} placeholder='8' borderRightRadius="lg" fontSize='18px' />
                        </ChakraUI.InputGroup>
                        <ChakraUI.InputGroup>
                            <ChakraUI.InputLeftAddon padding="10px" as='b' fontSize='18px' children='Test Volume' bg='gray.200' borderLeftRadius="lg" />
                            <ChakraUI.Input type="text" onChange={onChangeTestVol} placeholder='10' borderRightRadius="lg" fontSize='18px' />
                        </ChakraUI.InputGroup>
                    </ChakraUI.Stack>
                    <ChakraUI.Stack spacing={4} direction='row' align='center'>
                        <ChakraUI.Button
                            mt={4}
                            colorScheme='blue'
                            type='submit'
                            size="lg"
                            onClick={onSubmit}
                        >
                            Submit
                        </ChakraUI.Button>
                        <ChakraUI.Tooltip hasArrow label='Runs a second set of tests using the two lowest cost results of the first test. Results are populated in second graph.' bg='gray.300' color='black' shouldWrapChildren fontSize='24px'>
                            <ChakraUI.Checkbox colorScheme='red' isChecked={checkedItems[0]} onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])} fontSize='18px'>Fine-tuned Search</ChakraUI.Checkbox>
                        </ChakraUI.Tooltip>
                        <ChakraUI.Tooltip hasArrow label='Tests all memory intervals concurrently. Recommended for more memory-intensive functions.' bg='gray.300' color='black' shouldWrapChildren fontSize='24px'>
                            <ChakraUI.Checkbox colorScheme='red' onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])} isChecked={checkedItems[1]} fontSize='18px'>Concurrent Search</ChakraUI.Checkbox>
                        </ChakraUI.Tooltip>
                    </ChakraUI.Stack>
                </ChakraUI.HStack>
            </ChakraUI.Box>
        </ChakraUI.Center>
    );
};

export default ChakraForm;