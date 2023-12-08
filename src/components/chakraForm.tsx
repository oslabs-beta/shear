import React, { useRef, FormEvent } from "react";
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
    const formRef = useRef<HTMLFormElement>(null);
    const arnRef = useRef<HTMLInputElement | null>(null);
    const funcParamsRef = useRef<HTMLInputElement | null>(null);
    const memoryConfig: number[] = [];

    //onSubmit changes the form state then invokes post request to backend -JK
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(arnRef.current?.value)
        console.log('submitted');
        // dispatch(arnInput(arnRef.current?.value || ''));
        // dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
        // dispatch(powerValueInput(memoryConfig));
        dispatch(runOptimizer(formState))

        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const memorySelect = (num: number) => {
        console.log('memory selection');
        memoryConfig.push(num);
        console.log(memoryConfig)
    };


    return (
        <div>
            {/* This is just design for now (no functionality) */}
            <ChakraUI.Box position="relative" h="20%" w="60%" border="2px" padding="50px" borderRadius='lg' overflow='hidden' bg='yellow.100'>

                <ChakraUI.Stack spacing={4}>

                    <ChakraUI.Text as='b' fontSize='24px' color='tomato'>Amazon stuff</ChakraUI.Text>

                    <ChakraUI.InputGroup>
                        <ChakraUI.InputLeftAddon children='ARN' bg='gray.400' />
                        <ChakraUI.Input ref={arnRef} placeholder='arn:aws:iam::123456789012:user/johndoe' />
                    </ChakraUI.InputGroup>

                    {/* <ChakraUI.InputGroup >
                        <ChakraUI.InputLeftAddon children='Function Parameters Keys' bg='gray.400' />
                        <ChakraUI.Input ref={funcParamsRef} placeholder='Separate entries by commas' />
                    </ChakraUI.InputGroup> */}
                    <ChakraUI.Text as='b' fontSize='24px' color='tomato'>Function Parameters</ChakraUI.Text>
                    <ChakraUI.Textarea
                        ref={funcParamsRef}
                        placeholder='Please enter parameters and values in JSON format'
                        size='sm'
                    />

                    <ChakraUI.Text as='b' fontSize='24px' color='tomato'>Memory Allocation</ChakraUI.Text>
                    {/* <ChakraUI.FormLabel>Power Values</ChakraUI.FormLabel> */}
                    <ChakraUI.Stack direction='row' spacing={4} align='center'>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(64)}>
                            64 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(128)}>
                            128 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(256)}>
                            256 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(512)}>
                            512 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(768)}>
                            768 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(1024)}>
                            1024 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(1280)}>
                            1280 MB
                        </ChakraUI.Button>
                        <ChakraUI.Button colorScheme='teal' variant='outline' onClick={() => memorySelect(1536)}>
                            1536 MB
                        </ChakraUI.Button>
                    </ChakraUI.Stack>
                </ChakraUI.Stack>
                <ChakraUI.Button
                    mt={4}
                    colorScheme='teal'
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