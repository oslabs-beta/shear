import axios, { AxiosResponse } from "axios";
import { FormValues } from "./infoSlice";

//Use this to make the baseURL of the fetch call so you can just add the string end point. - JK
axios.defaults.baseURL = "http://localhost:3000/api";

export const optimizerAPI = {
  runOptimizerFunc: (formValues: FormValues): Promise<AxiosResponse> => axios.post('getLambdaLogs', formValues),
};
