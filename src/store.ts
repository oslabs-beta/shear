import { configureStore } from "@reduxjs/toolkit";
import infoReducer, {FormValues} from "./formData/infoSlice.js";
import resultsReducer, {ResultValues} from './formData/resultsSlice.js'
import sseReducer, {SseState} from "./formData/sseSlice.js";

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