// SSEComponent.js
import React, { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sseConnection} from '../formData/sseSlice.js';
import { RootState } from '../store.js';


const Results: React.FC = () => {
 
  const source = new EventSource("http://localhost:3000/api/hello")
  source.addEventListener("message", function(message) {
    console.log(message.data)})
  // const dispatch = useDispatch();
  // const sseData = useSelector((state: RootState) => state.sse.data);
  // useEffect(() => {
  //   dispatch(sseConnection())
  // }, [])


  return (
    <div>
    </div>
  );
};

export default Results;
