import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	current,
} from "@reduxjs/toolkit";
import { optimizerAPI } from "./infoAPI";

export interface FormValues {
	name: string;
	ARN: string;
	memoryArray: (string | number)[];
	functionPayload: Record<any, any>;
	volume: number;
	recursiveSearch: boolean;
	concurrent: boolean;
}

export const loadData = createAsyncThunk(
	"data/data",
	async (formData: FormValues) => {
		const response = await optimizerAPI.runOptimizerFunc(formData);
		return response.data;
	}
);

const formValues: FormValues = {
	name: "",
	ARN: "",
	memoryArray: [],
	functionPayload: {},
	volume: 10,
	recursiveSearch: true,
	concurrent: true,
};

const infoSlice = createSlice({
	name: "info",
	initialState: formValues,
	reducers: {
		nameInput(state, action: PayloadAction<string>) {
			state.name = action.payload;
		},
		arnInput(state, action: PayloadAction<string>) {
			state.ARN = action.payload;
		},
		funcParamsInput(state, action: PayloadAction<string>) {
			const parsedPayLoad = JSON.parse(action.payload);
			state.functionPayload = parsedPayLoad;
		},

		powerValueInput(state, action: PayloadAction<(string | number)[]>) {
			state.memoryArray = getMedians(action.payload);
		},

		testVolInput(state, action: PayloadAction<number>) {
			state.volume = action.payload;
		},

		checksInput(state, action: PayloadAction<boolean[]>) {
			state.recursiveSearch = action.payload[0];
			state.concurrent = action.payload[1];
		},
	},
});

function getMedians(array: string[]): number[] {
	const arrayOfVals: number[] = array.map(Number);
	const min = arrayOfVals[0];
	const max = arrayOfVals[1];
	const incrementVals = [];
	const increments = (max - min) / (arrayOfVals[2] + 1);
	for (let i = 1; i <= arrayOfVals[2]; i++) {
		incrementVals.push(Math.floor(min + i * increments));
	}
	const median = Math.ceil((min + max) / 2);
	const lowerMedian = Math.ceil((min + median) / 2);
	const upperMedian = Math.ceil((median + max) / 2);
	const result: number[] = [arrayOfVals[0], arrayOfVals[1], ...incrementVals];
	return result.sort((a, b) => a - b);
}

export const {
	nameInput,
	arnInput,
	funcParamsInput,
	powerValueInput,
	testVolInput,
	checksInput,
} = infoSlice.actions;
export default infoSlice.reducer;
