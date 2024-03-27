import React, {
	useRef,
	FormEvent,
	useEffect,
	useState,
	ChangeEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
	nameInput,
	arnInput,
	funcParamsInput,
	powerValueInput,
	testVolInput,
	checksInput,
} from "../formData/infoSlice";
import { runOptimizer } from "../formData/resultsSlice";
import * as ChakraUI from "@chakra-ui/react";
import "./style.css";


const Form: React.FC = () => {
	const resultsState = useSelector((state: RootState) => state.results);
	const formState = useSelector((state: RootState) => state.info);
	const dispatch = useDispatch();
	const arnRef = useRef<HTMLInputElement | null>(null);
	const funcParamsRef = useRef<HTMLInputElement | null>(null);
	const memoryRef = useRef<string[]>([]);
	const [show, setShow] = useState(false); //this is used to toggle whether the loading bar shows up
	const [checkedItems, setCheckedItems] = React.useState([true, false]);
	// const toast = ChakraUI.useToast();

	useEffect(() => {
		if (formState.ARN !== "") {
			dispatch(runOptimizer(formState));
		}
	}, [formState]);

	const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		memoryRef.current[5] = e.target.value;
	};
	const onChangeMinVal = (e: ChangeEvent<HTMLInputElement>) => {
		memoryRef.current[0] = e.target.value;
	};
	const onChangeMaxVal = (e: ChangeEvent<HTMLInputElement>) => {
		memoryRef.current[1] = e.target.value;
	};

	const onChangeIncrements = (e: ChangeEvent<HTMLInputElement>) => {
		memoryRef.current[2] = e.target.value;
	};

	const onChangeTestVol = (e: ChangeEvent<HTMLInputElement>) => {
		memoryRef.current[3] = e.target.value;
	};

	//onSubmit changes the form state then invokes post request to backend -JK
	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submitted");
		setShow(true);
		dispatch(nameInput(memoryRef.current[5]));
		dispatch(arnInput(arnRef.current?.value || ""));
		dispatch(funcParamsInput(funcParamsRef.current?.value || ""));
		dispatch(powerValueInput(memoryRef.current));
		dispatch(testVolInput(memoryRef.current[3]));
		dispatch(checksInput(checkedItems));
	};
	useEffect(() => {
		setShow(false);
	}, [resultsState]);

	return <></>;
};
export default Form;
