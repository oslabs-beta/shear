import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice";

//Use this to make the baseURL of the fetch call so you can just add the string end point. - JK
axios.defaults.baseURL = "http://localhost:3000/api";

// export const optimizerAPI = {
//   runOptimizerFunc: (formData: FormValues): Promise<AxiosResponse> => axios.post('executeLambdaWorkflow', formData),
// };

export const optimizerAPI = {
  runOptimizerFunc: (): Promise<AxiosResponse> => axios.post('executeLambdaWorkflow', {
    "memoryArray" : [128, 256, 512, 680],
    "ARN" : "arn:aws:lambda:us-east-1:424429271361:function:TESTFUNC",
    "functionPayload": {
      "startRange": 1,
      "endRange": 200,
      "xPrimes": 15
    }
    }),
};
