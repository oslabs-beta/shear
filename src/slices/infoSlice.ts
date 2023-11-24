import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  arn: string,
  funcParams: (string | number)[],
  powerValues: (number)[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputJson: Record<string, any>;

}
const initialState: InitialState = {
  arn: '',
  funcParams: [],
  powerValues: [],
  inputJson: {

  },
}

const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    arnInput(state, action) {
      state.arn = action.payload;
      console.log(state.arn)
    },
    funcParamsInput(state, action) {
     const funcParams = action.payload.replace(/\s/g, '');
     const splitFuncParams = funcParams.split(',')
     console.log(splitFuncParams)
    //  state.funcParams = 
    //  console.log(state.funcParams)
    },
    // highestPowerValueInput(state, action) {
    //   state.
    // },
    // lowestPowerValueInput(state, action) {

    // }
    
    }
  }
)



export const { arnInput, funcParamsInput } = infoSlice.actions;
export default infoSlice.reducer;