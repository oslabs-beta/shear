import { myEventEmitter } from "../routes.js";
import {
  LambdaClient,
  InvokeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";

import {wait, extractBilledDurationFrom64, reduceObjectToMedian, calculateCosts, createCustomError, getRegionFromARN} from "../utils/utils.js"

import { fromUtf8 } from "@aws-sdk/util-utf8-node";


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
    const TIMES = request.body.volume || 20



    const functionARN = request.body.ARN;

    const functionPayload = request.body.functionPayload;
    response.locals.payload = functionPayload
    const payloadBlob = fromUtf8(JSON.stringify(functionPayload));
    
    async function createNewVersionsFromMemoryArrayAndInvoke(inputArr, arn) {
      try {
        let count = 0;
        if (request.body.concurrent) {
          const outputObj = {};
          for (const element of inputArr) {
              const billedDurationArray = [];
              const invocations = [];
              myEventEmitter.emit('update', `currently on ${++count} memory value`)
              
  
              const input = {
                  FunctionName: arn,
                  MemorySize: Number(element),
                  Description: "New version with " + element + " MB of RAM"
              };
  
              const command = new UpdateFunctionConfigurationCommand(input);
              await lambdaClient.send(command);
              await wait(2000);
  
              for (let i = 0; i < TIMES; i++) {
                  // Push all invocations into an array
                  invocations.push(invokeSpecificVersion('$LATEST', payloadBlob));
              }
                await Promise.all(invocations)
  
              // Execute all invocations concurrently using Promise.all() await Promise.all(invocations);
              
              const invocations2 = [];
              for (let i = 0; i < TIMES; i++) {
                // Push all invocations into an array
                invocations2.push(invokeSpecificVersion('$LATEST', payloadBlob));
            }
              await Promise.all(invocations2)
              const invocations3 = [];
              
              for (let i = 0; i < TIMES; i++) {
                // Push all invocations into an array
                invocations3.push(invokeSpecificVersion('$LATEST', payloadBlob));
            }
            const results3 = await Promise.all(invocations3)
            billedDurationArray.push(...results3);
            outputObj[element] = billedDurationArray;
            console.log('concurrently invoked!')
            count = 0;
          }
          
          return outputObj;
        }
        else {

          const outputObj = {}

          for (const element of inputArr) {
             const billedDurationArray = []
             myEventEmitter.emit('update', `currently on ${++count} memory value`)
  
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
          console.log('sequentially invoked!')
          count = 0;
          return outputObj;

        }
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
    let first;
    let last;
if (minEntryIndex === 0) {
  // Case where the first data point is the best cost/invocation
  first = 0;
  last = 2;
  for (let i = 1; i <= 7; i++) {
    const midpoint = Math.round((memoryArray[0] * (7 - i) + memoryArray[1] * i) / 7);
    midpoints.push(midpoint);
  }
} else if (minEntryIndex === memoryArray.length - 1) {
  // Case where the last data point is the best cost/invocation
  first = minEntryIndex-1;
  last = minEntryIndex;
  for (let i = 1; i <= 7; i++) {
    const midpoint = Math.round((memoryArray[memoryArray.length - 2] * (7 - i) + memoryArray[memoryArray.length - 1] * i) / 7);
    midpoints.push(midpoint);
  }
} else {
  // Normal case
  first = minEntryIndex - 1;
  last = minEntryIndex +1;
  for (let i = 1; i <= 7; i++) {
    const midpoint = Math.round((memoryArray[minEntryIndex - 1] * (7 - i) + memoryArray[minEntryIndex + 1] * i) / 7);
    midpoints.push(midpoint);
  }
}
midpoints.pop()
  
    const test2 = await createNewVersionsFromMemoryArrayAndInvoke(midpoints, functionARN)

  const billedDurationArray2 = reduceObjectToMedian(test2)
//add first
//add last
billedDurationArray2[memoryArray[first]] = billedDurationArray[memoryArray[first]]
billedDurationArray2[memoryArray[last]]= billedDurationArray[memoryArray[last]]

  const outputObject2 = {
    billedDurationOutput: billedDurationArray2,
    costOutput: calculateCosts(billedDurationArray2)
  }
  //console.log(outputObject2)
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



