import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI.js";
import { FormValues } from "./infoSlice.js";


export interface ResultValues {
  billedDurationOutput: Record<string, number>;
  costOutput: Record<string, number>;
  CostData: (string | number)[];
  TimeData: (string | number)[];
  MemoryData: (string | number)[];
  DetailedCostData: (string | number)[];
  DetailedTimeData: (string | number)[];
  DetailedMemoryData: (string | number)[];
}

//function sends form data to backend to get spun up. Back end will need to send back the data from spinning the algo. -JK
export const runOptimizer = createAsyncThunk<ResultValues, FormValues>('results/data', async (Formdata) => {
  const response = await optimizerAPI.runOptimizerFunc(Formdata);
  // console.log(response)
  // console.log(response.data)
  return response.data;
});



export const getAllData = createAsyncThunk

//current state of return data, Double check what we are expecting(discuss with backend)- JK
const initialState: ResultValues = {
  billedDurationOutput: {},
  costOutput: {},
  CostData: [190, 180, 215, 170, 160, 195, 220, 230, 185, 190, 210],
  TimeData: [500, 420, 350, 290, 240, 200, 170, 150, 135, 125, 120],
  MemoryData: [128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 2048],
  DetailedCostData: [170, 168, 163, 164, 161, 156, 162, 160, 160],
  DetailedTimeData: [290, 286, 278, 274, 266, 248, 250, 244, 240],
  DetailedMemoryData: [512, 528, 544, 560, 576, 592, 608, 624, 640],
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runOptimizer.fulfilled, (state, action) => {
        // console.log("Result incoming")

        const rawResults = action.payload;
        const rawMemory = Object.keys(rawResults.billedDurationOutput).map((x) => parseInt(x));
        state.MemoryData.splice(0, state.MemoryData.length, ...rawMemory);
        state.CostData.splice(0, state.CostData.length, ...Object.values(rawResults.costOutput));
        state.TimeData.splice(0, state.TimeData.length, ...Object.values(rawResults.billedDurationOutput));
        if (rawResults.bonusData) {
          const detailedMemory = Object.keys(rawResults.bonusData.billedDurationOutput).map((x) => parseInt(x));
          state.DetailedMemoryData.splice(0, state.MemoryData.length, ...detailedMemory);
          state.DetailedCostData.splice(0, state.CostData.length, ...Object.values(rawResults.bonusData.costOutput));
          state.DetailedTimeData.splice(0, state.TimeData.length, ...Object.values(rawResults.bonusData.billedDurationOutput));
        }
        console.log(state)
        // return action.payload;
      })
      .addCase(runOptimizer.pending, (state, action) => {
        // console.log(action.payload)
      })
      .addCase(runOptimizer.rejected, (state) => {

      });
  },
});

export default resultsSlice.reducer;
