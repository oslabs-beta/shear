import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI";
import { FormValues } from "./infoSlice";


export interface ResultValues {
  billedDurationOutput: Record<string, number>;
  costOutput: Record<string, number>;
}

//function sends form data to backend to get spun up. Back end will need to send back the data from spinning the algo. -JK
export const runOptimizer = createAsyncThunk<ResultValues, FormValues>('results/data', async () => {
  const response = await optimizerAPI.runOptimizerFunc();
  // console.log(response)
  console.log(response.data)
  return response.data; 
});


export const getAllData = createAsyncThunk


//current state of return data, Double check what we are expecting(discuss with backend)- JK
const initialState: ResultValues = {
  billedDurationOutput: {},
  costOutput: {},
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runOptimizer.fulfilled, (state, action) => {
        console.log(action.payload)
        return action.payload;
      })
      .addCase(runOptimizer.pending, (state, action) => {
        // console.log(action.payload)
      })
      .addCase(runOptimizer.rejected, (state) => {

      });
  },
});

export default resultsSlice.reducer;
