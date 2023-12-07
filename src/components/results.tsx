import React, {useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";


export const Results: React.FC = () => {

  const finalOutputResultsState = useSelector((state: RootState) => state.results.finalOutput)

  useEffect(() => {

  }, [finalOutputResultsState])

  return (
    <div>

    </div>
  )

}