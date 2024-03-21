import { configureStore } from "@reduxjs/toolkit";
import infoReducer, { FormValues } from "./formData/infoSlice";
import resultsReducer, { ResultValues } from "./formData/resultsSlice";

export interface RootState {
	info: FormValues;
	results: ResultValues;
}

export const store = configureStore({
	reducer: {
		info: infoReducer,
		results: resultsReducer,
	},
});

export default store;
