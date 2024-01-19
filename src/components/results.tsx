// SSEComponent.js
import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { sseConnection} from '../formData/sseSlice.js';
import { RootState } from '../store.js';

const Results: React.FC = () => {
  const dispatch = useDispatch();
  const sseData = useSelector((state: RootState) => state.sse.data);



  return (
    <div>
      <h2>SSE Data:</h2>
      <ul>
        {sseData.map((data, index) => (
          <li key={index}>{JSON.stringify(data)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
