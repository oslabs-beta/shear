import React, { useRef, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { arnInput, funcParamsInput, lowestPowerValueInput, highestPowerValueInput } from "../formData/infoSlice";
import { runOptimizer } from "../formData/resultsSlice";
import './style.css'


const Form: React.FC = () => {
  const resultsState = useSelector((state: RootState) => state.results)
  const formState = useSelector((state: RootState) => state.info)
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const arnRef = useRef<HTMLInputElement | null>(null);
  const funcParamsRef = useRef<HTMLInputElement | null>(null);
  const lowestPowerValRef = useRef<HTMLInputElement | null>(null);
  const highestPowerValRef = useRef<HTMLInputElement | null>(null);
  

  //onSubmit changes the form state then invokes post request to backend -JK
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
    dispatch(arnInput(arnRef.current?.value || ''));
    dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
    dispatch(lowestPowerValueInput(lowestPowerValRef.current?.value || ''));
    dispatch(highestPowerValueInput(highestPowerValRef.current?.value || ''));
    dispatch(runOptimizer(formState))

    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // console.log(resultsState)

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit}>
        <label><strong>Paste ARN here</strong></label><br />
        <input type="text" ref={arnRef} placeholder="Paste Arn Here" /><br />
        <label><strong>Separate your function parameters by commas</strong></label><br />
        <input type="text" ref={funcParamsRef} placeholder="Input Function Parameters" /><br />
        <label><strong>Power Values</strong></label><br></br>
        <input type="text" ref={lowestPowerValRef} placeholder="lowest"></input><br></br>
        <input type="text" ref={highestPowerValRef} placeholder="highest"></input><br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
