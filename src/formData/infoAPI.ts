import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice.js";


// Use this to make the baseURL of the fetch call so you can just add the string endpoint. - JK
axios.defaults.baseURL = "http://localhost:3000/api";  //"/api"

export const optimizerAPI = {
  
  runOptimizerFunc: (form: FormValues): Promise<AxiosResponse> => {

    const stringifiedFormData = JSON.stringify(form)
    console.log(stringifiedFormData)
    return axios.post('executeLambdaWorkflow', stringifiedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  },
}

// function PromiseBasedToastExample() {
  
//   return (
//     <Button
//           onClick= {() => {
//     // Create an example promise that resolves in 5s
//     const examplePromise = new Promise((resolve, reject) => {
//       setTimeout(() => resolve(200), 5000)
//     })

//     // Will display the loading toast until the promise is either resolved
//     // or rejected.
//     toast.promise(examplePromise, {
//       success: { title: 'Promise resolved', description: 'Looks great' },
//       error: { title: 'Promise rejected', description: 'Something wrong' },
//       loading: { title: 'Promise pending', description: 'Please wait' },
//     })
//   }
// }
//       >
//   Show Toast
//     < /Button>
//   )
// }










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




