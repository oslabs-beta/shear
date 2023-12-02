import { configureStore } from "@reduxjs/toolkit";
import infoReducer from "./formData/infoSlice";

// interface RootState {
//   info: InitialState,
// }

export const store = configureStore({
  reducer:  {
    info: infoReducer,
  }
})

export default store;