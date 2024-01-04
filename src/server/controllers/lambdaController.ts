//import { CloudWatchLogs, DescribeLogStreamsCommand, DescribeLogGroupsCommand, GetLogEventsCommand, OrderBy } from "@aws-sdk/client-cloudwatch-logs";
import CustomError from "../types.js";
import {
  LambdaClient,
  InvokeCommand,
  PublishVersionCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";

import { fromUtf8 } from "@aws-sdk/util-utf8-node";



const TIMES = 10;
const lambdaController = {
  async shear(request, response, next) {
    if (!request.body.ARN) {
      const error: CustomError = new Error('Error reading ARN!');
      error.status = 403;
      error.requestDetails = { body: request.body }; // Adding request details to the error object
      return next(error);
    }
    const memoryArray = request.body.memoryArray;
    if (!memoryArray || !Array.isArray(memoryArray) || memoryArray.length === 0) {
      const error: CustomError = new Error('Error with memory array!');
      error.status = 403;
      error.requestDetails = { body: request.body };
      return next(error);
    }
    const region2 = getRegionFromARN(request.body.ARN);

    const regionObj = { region: region2 }
    // setup for all the AWS work we're going to do.
    const lambdaClient = new LambdaClient(regionObj);


    //const functionName = getFunctionARN(request.body.ARN);
    const functionARN = request.body.ARN;

    const functionPayload = request.body.functionPayload;
    const payloadBlob = fromUtf8(JSON.stringify(functionPayload));

    async function createNewVersionsFromMemoryArrayAndInvoke(inputArr, arn) {
      try {
        const publishVersionParams = {
          FunctionName: arn,
        };
        const outputObj = {}

        for (const element of inputArr) {
          const billedDurationArray = []
          //this publishes a new version
          const newVersion = await lambdaClient.send(
            new PublishVersionCommand(publishVersionParams)
          );
          //this updates the configuration of the new version
          const updateConfigParams = {
            FunctionName: functionARN,
            MemorySize: element,
            Description: "New version with " + element + " MB of memory",
            Qualifier: newVersion.Version,
          };
          const updatedFunction = await lambdaClient.send(
            new UpdateFunctionConfigurationCommand(updateConfigParams)
          );
          console.log("New version created:", updatedFunction.Version);
          await wait(2000);
          for (let i = 0; i < TIMES; i++) {
            //invoke new version X times. currectly a global constant, but probably something we should let the user configure.
            const value = await invokeSpecificVersion(updatedFunction.Version, payloadBlob);
            billedDurationArray.push(value)
          }
          outputObj[element] = billedDurationArray;
          await wait(2000);
        }
        //console.log(outputObj)
        return outputObj;
      } catch (error) {
        console.error(
          "Error creating new version and updating memory size from Array:",
          error
        );
        const error1: CustomError = new Error('Error creating new versions.');
        error1.status = 403;
        error1.requestDetails = { body: request.body };
        return next(error1);
      }
    }
    async function invokeSpecificVersion(version, payload) {
      try {
        const invokeParams = {
          FunctionName: functionARN,
          Qualifier: version,
          Payload: payload,
        
          LogType: "Tail"
        };
// @ts-expect-error - weird typing bug
        const data = await lambdaClient.send(new InvokeCommand(invokeParams));
        // console.log("data:");
        // console.log(data.$metadata.requestId);
        const billedDuration = extractBilledDurationFrom64(atob(data.LogResult))
        return billedDuration;
      } catch (error) {
        const error1: CustomError = new Error('Error with invoking specific version.');
        error1.status = 512;
        error1.requestDetails = { body: request.body };
        return next(error);
      }
    }
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

   const test = await createNewVersionsFromMemoryArrayAndInvoke(memoryArray, functionARN)
  const billedDurationArray = reduceObjectToMedian(test)
  
  const outputObject = {
    billedDurationOutput: billedDurationArray,
    costOutput: calculateCosts(billedDurationArray)
  }
  response.locals.output = outputObject;
    return next();
  },

};



function getRegionFromARN(arn) {
  const arnParts = arn.split(':');
  if (arnParts.length >= 4) {
    return arnParts[3];
  } else {
    return null;
  }
}
function calculateCosts(resultObj: { [key: number]: number }): { [key: number]: number } {
  const newObj: { [key: number]: number } = {};

  for (const key in resultObj) {
    if (Object.prototype.hasOwnProperty.call(resultObj, key)) {
      const originalValue = resultObj[key];

      const megabytesToGigabytes = Number(key) / 1024; // 1 GB = 1024 MB


      const millisecondsToSeconds = originalValue / 1000;

      // Calculate the new value in gigabyte-seconds
      //PER THOUSAND INVOCATIONS
      const newValue = megabytesToGigabytes * millisecondsToSeconds * 0.0000166667 * 1000;
      newObj[Number(key)] = newValue;
    }
  }

  return newObj;
}



export default lambdaController;



function extractBilledDurationFrom64(logText) {

  const billedDurationRegex = /Billed Duration: (\d+(\.\d+)?) ms/;
const match = logText.match(billedDurationRegex);


if (match) {
  
  return match[1]
} else {
  return 'error!'
}
}

function reduceObjectToMedian(inputObj) {
  const result = {};
  
  for (const key in inputObj) {
    if (inputObj.hasOwnProperty(key)) {
      const values = inputObj[key].map(Number); 
      values.sort((a, b) => a - b); //sort

      let median;
      const middle = Math.floor(values.length / 2);

      if (values.length % 2 === 0) {
        median = (values[middle - 1] + values[middle]) / 2;
      } else {
        median = values[middle];
      }

      result[key] = median;
    }
  }

  return result;
}