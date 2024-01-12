import { PayloadAction, createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";



const sseConnection = createAsyncThunk("sse/Start", async () => {
  
});

export interface SseState  {
  connection: EventSource | null,
  data: string[]

}

const sseState: SseState = {
 connection: null,
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