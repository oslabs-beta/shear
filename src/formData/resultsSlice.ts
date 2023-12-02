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

export const runOptimizer = createAsyncThunk<ResultValues[], FormValues>('data/data', async (formValues) => {
  const response = await optimizerAPI.runOptimizerFunc(formValues);
  return response.data;
});

export const getAllData = createAsyncThunk

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
