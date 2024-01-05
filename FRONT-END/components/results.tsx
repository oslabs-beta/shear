import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../src/store.ts";


interface ResultsProps {}

export const Results: React.FC<ResultsProps> = () => {
  const billedState = useSelector((state: RootState) => state.results.billedDurationOutput);
  const costState = useSelector((state: RootState) => state.results.costOutput)

  const finalResults = Object.entries(billedState)

  const mappedFinalResults = finalResults.map(([memory, fastestAvg]) => {
    const costData = costState[memory]
    return <p key={memory}>at this memory configuation {memory}MBS your billed duration output is {fastestAvg} MS with an average cost of  ${costData} PER 1000 INVOCATIONS</p>
  })
   
    
  

  return (
    <div>
      {mappedFinalResults}
    </div>
  );
};
