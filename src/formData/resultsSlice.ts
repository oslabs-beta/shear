import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI";
import { FormValues } from "./infoSlice";


export interface ResultValues {
  billedDurationOutput: Record<string, number>;
  costOutput: Record<string, number>;
  CostData: (string | number)[];
  TimeData: (string | number)[];
  MemoryData: (string | number)[];
  DetailedCostData: (string | number)[];
  DetailedTimeData: (string | number)[];
  DetailedMemoryData: (string | number)[];
  error: boolean;
}

export const runOptimizer = createAsyncThunk<ResultValues, FormValues>('results/data', async (Formdata) => {
  const response = await optimizerAPI.runOptimizerFunc(Formdata);
  return response.data;
});

const initialState: ResultValues = {
  billedDurationOutput: {},
  costOutput: {},
  CostData: [190, 180, 215, 170, 160, 195, 220, 230, 185, 190, 210],
  TimeData: [500, 420, 350, 290, 240, 200, 170, 150, 135, 125, 120],
  MemoryData: [128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 2048],
  DetailedCostData: [170, 168, 163, 164, 161, 156, 162, 160, 160],
  DetailedTimeData: [290, 286, 278, 274, 266, 248, 250, 244, 240],
  DetailedMemoryData: [512, 528, 544, 560, 576, 592, 608, 624, 640],
  error: false
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runOptimizer.fulfilled, (state, action) => {
        const rawResults = action.payload;
        const rawMemory = Object.keys(rawResults.billedDurationOutput).map((x) => parseInt(x));
        const detailedMemory = Object.keys(rawResults.bonusData.billedDurationOutput).map((x) => parseInt(x));
        state.MemoryData.splice(0, state.MemoryData.length, ...rawMemory);
        state.CostData.splice(0, state.CostData.length, ...Object.values(rawResults.costOutput));
        state.TimeData.splice(0, state.TimeData.length, ...Object.values(rawResults.billedDurationOutput));
        state.DetailedMemoryData.splice(0, state.MemoryData.length, ...detailedMemory);
        state.DetailedCostData.splice(0, state.CostData.length, ...Object.values(rawResults.bonusData.costOutput));
        state.DetailedTimeData.splice(0, state.TimeData.length, ...Object.values(rawResults.bonusData.billedDurationOutput));
      })
      .addCase(runOptimizer.rejected, (state) => {
        state.error = true;
      });
  },
});

export default resultsSlice.reducer;
