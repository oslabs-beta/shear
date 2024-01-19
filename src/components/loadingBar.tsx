// SSEComponent.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { sseConnection} from '../formData/sseSlice.js';
import { RootState } from '../store.js';
import * as ChakraUI from '@chakra-ui/react'

const LoadingBar: React.FC = () => {
    const dispatch = useDispatch();
    // const sseData = useSelector((state: RootState) => state.sse.data);



    return (
        <div>
            <ChakraUI.Box w='60%' p={4} color='red' margin='0 auto'>
                <ChakraUI.Progress w='100%' size='sm' isIndeterminate />
            </ChakraUI.Box>
        </div>)
};

export default LoadingBar;
