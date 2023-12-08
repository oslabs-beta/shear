import { createSlice, PayloadAction, createAsyncThunk, current } from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI";

export interface FormValues {
  arn: string;
  funcParams: (string | number)[];
  powerValues: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputJson: Record<any, any>;
}

export const loadData = createAsyncThunk('data/data', async (formData: FormValues) => {
  const response = await optimizerAPI.runOptimizerFunc(formData);
  return response.data;
})

const formValues: FormValues = {
  arn: '',
  funcParams: [],
  powerValues: [],
  inputJson: {},
};


const infoSlice = createSlice({
  name: 'info',
  initialState: formValues,
  reducers: {
    arnInput(state, action: PayloadAction<string>) {
      state.arn = action.payload;
      // console.log(state.arn);
    },
    funcParamsInput(state, action: PayloadAction<string>) {
      const funcParams = action.payload.replace(/\s/g, '');
      const splitFuncParams = funcParams.split(',');
      state.funcParams = splitFuncParams;
      // console.log(state.funcParams);
    },
    // highestPowerValueInput(state, action: PayloadAction<string>) {
    //   // console.log(action.payload);
    //   state.powerValues.push(action.payload);
    //   console.log(current(state));
    // },
    // lowestPowerValueInput(state, action: PayloadAction<string>) {
    //   // Clear the power values before inputting a new power value
    //   state.powerValues = [];
    //   state.powerValues.push(action.payload)
    // },
    powerValueInput(state, action: PayloadAction<number[]>) {
      state.powerValues = [];
      state.powerValues.splice(0, state.powerValues.length, ...action.payload);
    },
  },
});

export const { arnInput, funcParamsInput, powerValueInput } = infoSlice.actions;
export default infoSlice.reducer;
