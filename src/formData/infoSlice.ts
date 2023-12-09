import { createSlice, PayloadAction, createAsyncThunk, current } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI";

export interface FormValues {
  ARN: string;
  memoryArray: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functionPayload: Record<any, any>;
}


export const loadData = createAsyncThunk('data/data', async (formData: FormValues) => {
  const response = await optimizerAPI.runOptimizerFunc(formData);
  return response.data;
})

const formValues: FormValues = {
  ARN: '',
  memoryArray: [],
  functionPayload: {},
};

// `"startRange": 1000000, "endRange": 20000000, "xPrimes": 40"`

const infoSlice = createSlice({
  name: 'info',
  initialState: formValues,
  reducers: {
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


    // highestPowerValueInput(state, action: PayloadAction<string>) {
    //   state.memoryArray.push(action.payload);
    //   console.log(current(state));
    // },
    // lowestPowerValueInput(state, action: PayloadAction<string>) {
    //   state.memoryArray = [];
    //   state.memoryArray.push(action.payload)
    // },
    powerValueInput(state, action: PayloadAction<number[]>) {
      // state.memoryArray = [];
      state.memoryArray.splice(0, state.memoryArray.length, ...action.payload);
      // console.log(current(state))
    },
  },
});

// export const { arnInput, funcParamsInput, powerValueInput, lowestPowerValueInput, highestPowerValueInput } = infoSlice.actions;
export const { arnInput, funcParamsInput, powerValueInput } = infoSlice.actions;
export default infoSlice.reducer;
