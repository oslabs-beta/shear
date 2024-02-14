
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sseConnection} from '../formData/sseSlice.js';

import { RootState } from '../store.js';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:3000/api"

const Results: React.FC = () => {
  let source;
  useEffect(() => {
    const startSSE = () => {
      source = new EventSource('http://localhost:3000/api/LambdaWorkflowSSE')
      if (source) {
        console.log('source connected', source)
      }
      source.onmessage = (message) => {
        console.log('this is msg',message.data)
      }
    }
    startSSE();
   
  }, [])
 
 
  
 
 
  // source.addEventListener("message", function(message) {
  //   console.log(message.data)})
  // const dispatch = useDispatch();
  // const sseData = useSelector((state: RootState) => state.sse.data);
  // useEffect(() => {
  //   dispatch(sseConnection())
  // }, [])


  return (
    <div>
      {/* <h2>SSE Data:</h2> */}
      <ul>
        {/* {sseData.map((data, index) => (
          <li key={index}>{JSON.stringify(data)}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default Results;
