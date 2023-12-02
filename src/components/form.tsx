import React, { useRef, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { arnInput, funcParamsInput, lowestPowerValueInput, highestPowerValueInput } from "../formData/infoSlice";



const Form: React.FC = () => {
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const arnRef = useRef<HTMLInputElement | null>(null);
  const funcParamsRef = useRef<HTMLInputElement | null>(null);
  const lowestPowerValRef = useRef<HTMLInputElement | null>(null);
  const highestPowerValRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
    dispatch(arnInput(arnRef.current?.value || ''));
    dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
    dispatch(lowestPowerValueInput(lowestPowerValRef.current?.value || ''));
    dispatch(highestPowerValueInput(highestPowerValRef.current?.value || ''));
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit}>
        <label><strong>Paste ARN here</strong></label><br/>
        <input type="password" ref={arnRef} placeholder="Paste Arn Here"/><br/>
        <label><strong>Separate your function parameters by commas</strong></label><br/>
        <input type="text" ref={funcParamsRef} placeholder="Input Function Parameters"/><br />
        <label><strong>Power Values</strong></label><br></br>
        <input type="text" ref={lowestPowerValRef} placeholder="lowest"></input><br></br>
        <input type="text" ref={highestPowerValRef} placeholder="highest"></input><br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
