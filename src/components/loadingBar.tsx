import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ChakraUI from '@chakra-ui/react'

const LoadingBar: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <ChakraUI.Box w='60%' p={4} color='red' margin='0 auto'>
                <ChakraUI.Progress w='100%' size='sm' isIndeterminate />
            </ChakraUI.Box>
        </div>)
};
export default LoadingBar;
