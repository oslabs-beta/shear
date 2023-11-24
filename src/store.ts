import { configureStore } from "@reduxjs/toolkit";
import infoReducer, {InitialState} from "../src/slices/infoSlice";

interface RootState {
  info: InitialState,
}

export const store = configureStore({
  reducer:  {
    info: infoReducer,
  }
})

export default store;