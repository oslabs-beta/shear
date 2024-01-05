import React from "react";
import { useSelector } from "react-redux";
export const Results = () => {
    const billedState = useSelector((state) => state.results.billedDurationOutput);
    const costState = useSelector((state) => state.results.costOutput);
    const finalResults = Object.entries(billedState);
    const mappedFinalResults = finalResults.map(([memory, fastestAvg]) => {
        const costData = costState[memory];
        return React.createElement("p", { key: memory },
            "at this memory configuation ",
            memory,
            "MBS your billed duration output is ",
            fastestAvg,
            " MS with an average cost of  $",
            costData,
            " PER 1000 INVOCATIONS");
    });
    return (React.createElement("div", null, mappedFinalResults));
};
//# sourceMappingURL=results.js.map