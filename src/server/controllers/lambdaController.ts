import {
  LambdaClient,
  InvokeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";

import {wait, extractBilledDurationFrom64, reduceObjectToMedian, calculateCosts, createCustomError, getRegionFromARN} from "../utils/utils.js"

import { fromUtf8 } from "@aws-sdk/util-utf8-node";




const TIMES = 25;
const lambdaController = {
  async shear(request, response, next) {
  
    if (!request.body.ARN) {
      
      const error = createCustomError('Error reading ARN!', 403, {body: request.body})
      return next(error);
    }
    if (!validateLambdaARN(request.body.ARN)) {
      console.log(request.body.ARN)
      const error = createCustomError('Invalid ARN!', 403, {body: request.body})
      return next(error);
    }
    const memoryArray = request.body.memoryArray;
    if (!memoryArray || !Array.isArray(memoryArray) || memoryArray.length === 0) {
      const error = createCustomError('Error with memory array!', 403, { body: request.body });
      return next(error);
    }
    const region2 = getRegionFromARN(request.body.ARN);
    const regionObj = { region: region2 }
     // setup for all the AWS work we're going to do.
     const lambdaClient = new LambdaClient(regionObj);
    response.locals.ARN = request.body.ARN
    response.locals.memoryArray = memoryArray;




    const functionARN = request.body.ARN;

    const functionPayload = request.body.functionPayload;
    response.locals.payload = functionPayload
    const payloadBlob = fromUtf8(JSON.stringify(functionPayload));
    
    async function createNewVersionsFromMemoryArrayAndInvoke(inputArr, arn) {
      try {

        const outputObj = {}

        for (const element of inputArr) {
           const billedDurationArray = []

          const input = {
            FunctionName: arn,
            MemorySize:Number(element),
            Description: "New version with " + element +" MB of RAM" 
          }
          const command = new UpdateFunctionConfigurationCommand(input)
          await lambdaClient.send(command)
          
          await wait(2000)
          outputObj[element] = billedDurationArray;
          for (let i = 0; i < TIMES; i++) {
               //invoke new version X times. currectly a global constant, but probably something we should let the user configure.
               const value = await invokeSpecificVersion('$LATEST', payloadBlob);
               billedDurationArray.push(value)
             }
          
          //await wait(2000);
        }
        
        return outputObj;
      } catch (error) {
        const customError = createCustomError('Error creating new versions.', 403, { body: request.body });
        return next(customError);
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

        const billedDuration = extractBilledDurationFrom64(atob(data.LogResult))
        return billedDuration;
      } catch (error) {
        const customError = createCustomError('Error with invoking specific version.', 512, { body: request.body });
        return next(customError);
      }
    }
try {
   const test = await createNewVersionsFromMemoryArrayAndInvoke(memoryArray, functionARN)
  const billedDurationArray = reduceObjectToMedian(test)
  
  const outputObject = {
    billedDurationOutput: billedDurationArray,
    costOutput: calculateCosts(billedDurationArray),
    bonusData: null
  }
  response.locals.output = outputObject;
  if (request.body.recursiveSearch) {
    //look through the best left and right...
    const entries = Object.entries(outputObject.costOutput)
    const minEntry = entries.reduce((min, entry) => (entry[1] < min[1] ? entry : min), entries[0]);
    const minEntryIndex = memoryArray.indexOf(Number(minEntry[0]))

const midpoints: number[] = [];
    if (minEntryIndex == 0) {
      //case where first data point is best cost/invocation
      for (let i = 1; i <= 7; i++) {
        const midpoint = Math.round((memoryArray[minEntryIndex] * (7 - i) + memoryArray[minEntryIndex+1] * i) / 7);
        midpoints.push(midpoint);
      }
    }
    else if (minEntryIndex >= memoryArray.length-1) {
      //case where last data point is best cost/invocation
      for (let i = 1; i <= 7; i++) {
        const midpoint = Math.round((memoryArray[minEntryIndex-1] * (7 - i) + memoryArray[minEntryIndex] * i) / 7);
        midpoints.push(midpoint);
      }
    }
    else {
      //normal case...

  for (let i = 1; i <= 7; i++) {
    const midpoint = Math.round((memoryArray[minEntryIndex-1] * (7 - i) + memoryArray[minEntryIndex+1] * i) / 7);
    midpoints.push(midpoint);
  }
    }
    midpoints.pop()
    console.log('midpoints:')
    console.log(midpoints)
    const test2 = await createNewVersionsFromMemoryArrayAndInvoke(midpoints, functionARN)
  const billedDurationArray2 = reduceObjectToMedian(test2)

  const outputObject2 = {
    billedDurationOutput: billedDurationArray2,
    costOutput: calculateCosts(billedDurationArray2)
  }
  console.log(outputObject2)
  outputObject.bonusData = outputObject2;
  }
    return next();
}
catch (error) {
  const customError = createCustomError('Unhandled error occurred.', 500, { body: request.body });
      return next(customError);
}
  },

};

const lambdaArnRegex = /^arn:aws:lambda:[a-z\d-]+:\d{12}:function:[a-zA-Z0-9-_]+$/;
function validateLambdaARN(arn) {
  return lambdaArnRegex.test(arn);
}




export default lambdaController;



