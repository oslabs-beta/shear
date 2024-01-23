import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice.js";



// Use this to make the baseURL of the fetch call so you can just add the string endpoint. - JK 
// for deployment, use port 443 || 80 so that you dont have to type the port into the baseURL
// EX axios.defaults.baseURL =  https://localhost:443/api || http://localhost:80/api  -- this way it listens to the HTTPS first and goes to http if HTTPS is not present.
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




