import { PayloadAction, createSlice, current, createAsyncThunk, Dispatch } from "@reduxjs/toolkit";





export interface SseState  {
  data: string[]
}

const sseState: SseState = {
 data: [],
}



const sseSlice = createSlice({
  name: 'sse',
  initialState: sseState,
  reducers: {
    addData(state, action: PayloadAction<string>) {
      state.data.push(action.payload)
      console.log(current(state.data))
    },
  },

})




export const {addData} = sseSlice.actions;

export default sseSlice.reducer;