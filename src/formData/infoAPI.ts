import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice.js";

axios.defaults.baseURL = "http://localhost:3000/api"

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





