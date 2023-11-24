import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { arnInput, funcParamsInput } from "../slices/infoSlice";

export default function Form() {
  const dispatch = useDispatch();
  const arnRef = useRef<HTMLInputElement | null>(null);
  const funcParamsRef = useRef<HTMLInputElement | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('submitted');
    dispatch(arnInput(arnRef.current?.value || ''));
    dispatch(funcParamsInput(funcParamsRef.current?.value || ''));
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label><strong>Paste ARN here</strong></label><br/>
        <input type="password" ref={arnRef} placeholder="Paste Arn Here"/><br/>
        <label><strong>Separate your function parameters by commas</strong></label><br/>
        <input type="text" ref={funcParamsRef} placeholder="Input Function Parameters"/><br />
        <label><strong>Power Values</strong></label>
        <input type="radio"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
