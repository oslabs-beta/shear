import { configureStore } from "@reduxjs/toolkit";
import infoReducer, {FormValues} from "./formData/infoSlice";
import resultsReducer, {ResultValues} from './formData/resultsSlice'
import sseReducer, {SseState} from "./formData/sseSlice";

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