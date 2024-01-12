import { configureStore } from "@reduxjs/toolkit";
import infoReducer, {FormValues} from "./formData/infoSlice.ts";
import resultsReducer, {ResultValues} from './formData/resultsSlice.ts'
import sseReducer, {SseState} from "./formData/sseSlice.ts";

export interface RootState {
  info: FormValues
  results: ResultValues
  sse: SseState
}

export const store = configureStore({
  reducer:  {
    info: infoReducer,
    results: resultsReducer,
    sse: sseReducer
  }
})

export default store;