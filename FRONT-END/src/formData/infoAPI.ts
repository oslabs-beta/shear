import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice.ts";



// Use this to make the baseURL of the fetch call so you can just add the string endpoint. - JK
axios.defaults.baseURL = "http://localhost:3000/api";

export const optimizerAPI = {
  runOptimizerFunc: (form: FormValues): Promise<AxiosResponse> => {
  
    const stringifiedFormData = JSON.stringify(form)
    // console.log(stringifiedFormData)
    return axios.post('executeLambdaWorkflow', stringifiedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  }

  // runOptimizerFunc: (state: FormValues): Promise<AxiosResponse> => {
  //   state = {
  //     memoryArray: [128, 256, 512, 680],
  //     ARN: "arn:aws:lambda:us-east-1:424429271361:function:TESTFUNC",
  //     functionPayload: {
  //       startRange: 1,
  //       endRange: 200,
  //       xPrimes: 15,
  //     },
  //   };

  //   const stringifiedState = JSON.stringify(state);

  //   return axios.post('executeLambdaWorkflow', stringifiedState, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // },




