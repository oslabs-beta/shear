import axios, {AxiosResponse} from "axios";
import { FormValues } from "./infoSlice";

export const optimizerAPI = {
  runOptimizerFunc: (formValues: FormValues): Promise<AxiosResponse> => axios.post(/*/ put in end point here/*/)
}