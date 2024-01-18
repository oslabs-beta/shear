import { PayloadAction, createSlice, current, createAsyncThunk, Dispatch } from "@reduxjs/toolkit";





export const sseConnection = createAsyncThunk<void, void, { dispatch: Dispatch }>('sse/startSSE', async () => {
  const sseConnect = new EventSource('http://localhost:3000/api/hello');
  console.log(sseConnect);

  return Promise.resolve(); // You can return a Promise if needed
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