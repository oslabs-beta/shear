import React, {
	useRef,
	FormEvent,
	useEffect,
	useState,
	ChangeEvent,
} from "react";
import {
	nameInput,
	arnInput,
	funcParamsInput,
	powerValueInput,
	testVolInput,
	checksInput,
} from "../formData/infoSlice";
import { runOptimizer } from "../formData/resultsSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { z } from "zod";
import { Input } from "./ui/input";
import "./style.css";

const InputForm: React.FC = () => {
	const resultsState = useSelector((state: RootState) => state.results);
	const formState = useSelector((state: RootState) => state.info);
	const dispatch = useDispatch();
	const arnRef = useRef<HTMLInputElement | null>(null);
	const funcParamsRef = useRef<HTMLInputElement | null>(null);
	const memoryRef = useRef<string[]>([]);
	const [show, setShow] = useState(false); //this is used to toggle whether the loading bar shows up
	const [checkedItems, setCheckedItems] = React.useState([true, false]);
	// const toast = ChakraUI.useToast();
	const formSchema = z.object({
		nameInput: z.string(),
		memoryRef: z.array(z.string()),
	});

	const form = useForm();
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
	const onSubmit = (data) => {
		console.log("submitted", data);
		// setShow(true);
		// dispatch(nameInput(memoryRef.current[5]));
		// dispatch(arnInput(arnRef.current?.value || ""));
		// dispatch(funcParamsInput(funcParamsRef.current?.value || ""));
		// dispatch(powerValueInput(memoryRef.current));
		// dispatch(testVolInput(memoryRef.current[3]));
		// dispatch(checksInput(checkedItems));
	};
	useEffect(() => {
		setShow(false);
	}, [resultsState]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex">
				<FormField
					control={form.control}
					name="ARN"
					render={() => (
						<FormItem>
							<FormLabel className="text-lg md:font-bold">AWS inputs</FormLabel>
							<FormControl>
								<Input placeholder="ARN input" {...form.register("ARN")} />
							</FormControl>
							<FormControl>
								<textarea {...form.register("funcParams")}></textarea>
							</FormControl>
							<div>
								<FormControl>
									<Input
										placeholder="fuck you"
										{...form.register("Lowest mem val")}
									></Input>
								</FormControl>
								<FormControl>
									<Input
										placeholder="fuck you"
										{...form.register("Highest mem val")}
									></Input>
								</FormControl>
							</div>
							<FormMessage />
							<Input
								type="submit"
								className="text-center justify-center"
							></Input>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default InputForm;
