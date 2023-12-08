import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice";
import { RootState } from "../store";

// Use this to make the baseURL of the fetch call so you can just add the string endpoint. - JK
axios.defaults.baseURL = "http://localhost:3000/api";

export const optimizerAPI = {
  runOptimizerFunc: (form: any): Promise<AxiosResponse> => {
    console.log("Run optimizer form test")
    console.log(form)
    const shapedData = {
      memoryArray: form.memoryArray,
      ARN: form.ARN,
      functionPayload: form.functionPayload,
    };
    const stringifiedShapedData = JSON.stringify(shapedData)

    return axios.post('executeLambdaWorkflow', stringifiedShapedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
}

// Example usage:
