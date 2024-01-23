import {
  LambdaClient,
  InvokeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";

import {wait, extractBilledDurationFrom64, reduceObjectToMedian, calculateCosts, createCustomError, getRegionFromARN} from "../utils/utils.js"

import { fromUtf8 } from "@aws-sdk/util-utf8-node";




const TIMES = 10;
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
    costOutput: calculateCosts(billedDurationArray)
  }
  response.locals.output = outputObject;
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



