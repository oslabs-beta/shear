// SSEComponent.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { sseConnection} from '../formData/sseSlice.js';
import { RootState } from '../store.js';
import { Box, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

const LoadingBar: React.FC = () => {
    return (
        <Box w='20%' p={4} bg='gray.100' margin='0 auto'>
            <CircularProgress value={40} color='blue.400' size='100px' thickness='8px' >
                <CircularProgressLabel>Let's Go</CircularProgressLabel>
            </CircularProgress>
        </Box>
    )
};

export default LoadingBar;
