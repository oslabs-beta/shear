import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI";
import { FormValues } from "./infoSlice";


export interface ResultValues {
  arn: string;
  x: (string | number)[];
  y: (string | number)[];
  bestRunTimeCost: number | string;
  fastestInvocationTime: number;
  optimalTime: (string | number)[];
}

//function sends form data to backend to get spun up. Back end will need to send back the data from spinning the algo. -JK
export const runOptimizer = createAsyncThunk<ResultValues[], FormValues>('results/data', async (formValues) => {
  const response = await optimizerAPI.runOptimizerFunc(formValues);
  return response.data;
});

export const getAllData = createAsyncThunk


//current state of return data, Double check what we are expecting(discuss with backend)- JK
const initialState: ResultValues[] = [

];

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runOptimizer.fulfilled, (state, action) => {

        return action.payload;
      })
      .addCase(runOptimizer.pending, (state) => {

      })
      .addCase(runOptimizer.rejected, (state) => {

      });
  },
});

export default resultsSlice.reducer;
