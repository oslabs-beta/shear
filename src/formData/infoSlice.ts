import { createSlice, PayloadAction, createAsyncThunk, current } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI.js";

export interface FormValues {
  name: string;
  ARN: string;
  memoryArray: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functionPayload: Record<any, any>;
  volume: (number);
  recursiveSearch: (boolean);
  concurrent: (boolean);
}


export const loadData = createAsyncThunk('data/data', async (formData: FormValues) => {
  const response = await optimizerAPI.runOptimizerFunc(formData);
  return response.data;
})

const formValues: FormValues = {
  name: 'Bob',
  ARN: '',
  memoryArray: [],
  functionPayload: {},
  volume: 10,
  recursiveSearch: true,
  concurrent: true,
};



// `"startRange": 1000000, "endRange": 20000000, "xPrimes": 40"`

const infoSlice = createSlice({
  name: 'info',
  initialState: formValues,
  reducers: {
    nameInput(state, action: PayloadAction<string>) {
      state.name = action.payload;
      // console.log(state.arn);
    },
    arnInput(state, action: PayloadAction<string>) {
      state.ARN = action.payload;
      // console.log(state.arn);
    },
    funcParamsInput(state, action: PayloadAction<string>) {
      // const stringifiedPayLoad = JSON.stringify(action.payload)
      // const parsedObj = {};
      const parsedPayLoad = JSON.parse(action.payload)
      // console.log(stringifiedPayLoad)
      state.functionPayload = parsedPayLoad;
    },

    powerValueInput(state, action: PayloadAction<string[]>) {
      // state.memoryArray = [];

      state.memoryArray = getMedians(action.payload)
      // console.log(state.memoryArray)

    },
    testVolInput(state, action: PayloadAction<number>) {
      state.volume = action.payload;
      // console.log(state.arn);
    },

    checksInput(state, action: PayloadAction<boolean[]>) {
      state.recursiveSearch = action.payload[0];
      state.concurrent = action.payload[1];
      // console.log(state.recursiveSearch, state.concurrent);
    },
  },
});

//function for getting 5 settings from the lower, med, upper median from the inputted values. - jk
function getMedians(array: string[]): number[] {
  const arrayOfVals: number[] = array.map(Number)
  const min = arrayOfVals[0]
  const max = arrayOfVals[1]
  const incrementVals = []
  const increments = (max - min) / (arrayOfVals[2] + 1)
  for (let i = 1; i <= arrayOfVals[2]; i++) {
    incrementVals.push(Math.floor(min + (i * increments)))
  }
  const median = Math.ceil((min + max) / 2)
  const lowerMedian = Math.ceil((min + median) / 2)
  const upperMedian = Math.ceil((median + max) / 2)
  const result: number[] = [arrayOfVals[0], arrayOfVals[1], ...incrementVals]
  return result.sort((a, b) => a - b)
}

// export const { arnInput, funcParamsInput, powerValueInput, lowestPowerValueInput, highestPowerValueInput } = infoSlice.actions;
export const { nameInput, arnInput, funcParamsInput, powerValueInput, testVolInput, checksInput } = infoSlice.actions;
export default infoSlice.reducer;
