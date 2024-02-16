
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sseConnection } from '../formData/sseSlice.js';
import { Box, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { RootState } from '../store.js';
import { FormValues } from '..formData/infoSlice.js';
import axios from 'axios';

// switch to /api before each PR
axios.defaults.baseURL = "http://localhost:3000/api"
// axios.defaults.baseURL = "/api"

const Results: React.FC = () => {
  let source;
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const rawData = useSelector((state: RootState) => state.info)

  // const ugh = async () => {
  //   const stringifiedRawData = await JSON.stringify(rawData)
  //   console.log('Here is the set', stringifiedRawData)
  //   console.log('Here is the datapoint', stringifiedRawData["volume"])
  // }
  const total = 18;
  // const total = stringifiedRawData.recursiveSearch ? stringifiedRawData.volume + 8 : stringifiedRawData.volume + 2;

  useEffect(() => {
    const startSSE = () => {
      source = new EventSource('http://localhost:3000/api/LambdaWorkflowSSE')
      if (source) {
        console.log('source connected', source)
      }
      source.onmessage = (message) => {

        // if (progress <= 0) setShow(true)

        setProgress(progress => progress + 1);
        // if (progress === total) setTimeout(() => { setShow(false) }, 200);

      }
    }
    startSSE();

  }, [])

  useEffect(() => {
    if (progress === total) setTimeout(() => { setProgress(progress => progress + 1) }, 3000);
  }, [progress])


  return (
    <Box margin='0px' w="54%">
      {progress > 0 && progress <= total ? <CircularProgress value={(progress / total) * 100} color='blue.400' size='120px' thickness='8px' >
        {/* <CircularProgressLabel>{`${Math.floor(100 * (progress / total))}%`}</CircularProgressLabel> */}
        {progress < total ? <CircularProgressLabel fontSize='18px'>Testing...</CircularProgressLabel> : <CircularProgressLabel fontSize='18px'>Done!</CircularProgressLabel>}
      </CircularProgress> : null
      }
      {/* {show ? <CircularProgress value={(progress / total) * 100} color='blue.400' size='100px' thickness='8px' >
        <CircularProgressLabel>{`${Math.floor(100 * (progress / total))}%`}</CircularProgressLabel>
      </CircularProgress> : null} */}
    </Box >
  );
};

export default Results;
