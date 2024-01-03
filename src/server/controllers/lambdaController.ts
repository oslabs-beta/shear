import { CloudWatchLogs, DescribeLogStreamsCommand, DescribeLogGroupsCommand, GetLogEventsCommand, OrderBy} from "@aws-sdk/client-cloudwatch-logs";
import dotenv from 'dotenv'; 
import CustomError from "../types.js";
import {
  LambdaClient,
  InvokeCommand,
  PublishVersionCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";

dotenv.config();

import { fromUtf8 } from "@aws-sdk/util-utf8-node";



const TIMES = 100;
const lambdaController = {
  async shear(request, response, next) {
    if (!request.body.ARN) {
      const error : CustomError = new Error('Error reading ARN!');
      error.status = 403; 
      error.requestDetails = { body: request.body }; // Adding request details to the error object
      return next(error);
    }
    const memoryArray = request.body.memoryArray;
    response.locals.memoryArray = memoryArray;
    if (!memoryArray || !Array.isArray(memoryArray) || memoryArray.length === 0) {
      const error: CustomError = new Error('Error with memory array!');
      error.status = 403; 
      error.requestDetails = { body: request.body }; 
      return next(error);
    }
    const region2 = getRegionFromARN(request.body.ARN);
    
    const regionObj = {region: region2}
    //setup for all the AWS work we're going to do.
    response.locals.ARN = request.body.ARN
    const lambdaClient = new LambdaClient({
      credentials: { 
        accessKeyId: process.env.ACC_KEY, // Your access key ID
        secretAccessKey: process.env.SEC_KEY, // Your secret access key
      },
      region: process.env.REGION, // Your AWS region
    });

    const cloudwatchlogs = new CloudWatchLogs({
      credentials: { 
        accessKeyId: process.env.ACC_KEY, // Your access key ID
        secretAccessKey: process.env.SEC_KEY, // Your secret access key
      },
      region: process.env.REGION, // Your AWS region
    });
    
    const functionName = getFunctionARN(request.body.ARN);
    const functionARN = request.body.ARN;
    
    const functionPayload = request.body.functionPayload;

    
    const payloadBlob = fromUtf8(JSON.stringify(functionPayload));

    async function createNewVersionsFromMemoryArrayAndInvoke(inputArr, arn) {
      try {
        const publishVersionParams = {
          FunctionName: arn,
        };

        for (const element of inputArr) {
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
          await invokeSpecificVersion(updatedFunction.Version, payloadBlob);
          }
          await wait(2000);
        }
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
        };

        const data = await lambdaClient.send(new InvokeCommand(invokeParams));
        // console.log("data:");
        // console.log(data.$metadata.requestId);
        return data;
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

    await createNewVersionsFromMemoryArrayAndInvoke(memoryArray, functionARN);
    await wait(5000);

    async function getLogStreams(logGroupName) {
      //get the log streams via the log group name. we need to get 4 streams due to the phantom log issue. we actually might need to get more (since phantom logs can theoretically occur once per new configuration) but that's a problem for the future.
      const params = {
        logGroupName: logGroupName,
        orderBy: OrderBy.LastEventTime,
        limit: memoryArray.length+1,
        descending: true,
      };

      try {
        const command = new DescribeLogStreamsCommand(params)
        const logStreams = await cloudwatchlogs.send(command);
        //console.log('Log Streams:', logStreams.logStreams);
       
        return logStreams.logStreams;
        

      } catch (error) {
        const error1: CustomError = new Error('Error with fetching log streams.');
      error1.status = 512; 
      error1.requestDetails = { body: request.body }; 
      return next(error);
      }
    }

    async function getLogGroupsNew(funcName) {
      //get the Log Group via the function name
       try {
        const command = new DescribeLogGroupsCommand({
          logGroupNamePattern: funcName,
        });

        const logGroups = await cloudwatchlogs.send(command);
        
        
        if (logGroups && logGroups.logGroups) {
          return logGroups.logGroups[0].logGroupName;
        } else {
          console.log('No log groups found for the specified pattern.');
          return undefined; 
        }
      }
       catch (error) {
        const error1: CustomError = new Error('Error with describing log streams.');
      error1.status = 512; 
      error1.requestDetails = { body: request.body }; 
      return next(error);
      }
    }

    //in order to view the logs of a specific invocation, we need to get the Log Group, which is like the folder containing the logs, and the Log Streams, which are like the files in the folder
    const logGroupName = await getLogGroupsNew(functionName);
    
    const logStreams = await getLogStreams(logGroupName);

    async function getFunctionLogs(logGroupName: string, logStreamName: string) {
        
      
        const params = {
          logGroupName: logGroupName,
          logStreamName: logStreamName,
          startFromHead: true,
        };
      
        try {
          const command = new GetLogEventsCommand(params);
          const logEvents = await cloudwatchlogs.send(command);
      
          const logEventsEvents = logEvents.events;
          if (!logEventsEvents || logEventsEvents.length <= 1) {
            console.log('null log found')
            return null;
          }
      
          // memoryArray.length should be TIMES??
          const output = await seekReportsRecursively(logEventsEvents, TIMES, params)
          
      
          return output;
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      }
    async function seekReportsRecursively(
      events,
      soughtResults,
      params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resultsArr: any = [],
      attempts = 0
    ) {
      for (const element of events) {
        if (element.message.startsWith("REPORT")) {
          //console.log('Report found!')
          if (resultsArr.length == 0) {
            resultsArr.push(extractMemorySize(element.message));
            resultsArr.push([extractBilledDuration(element.message)]);
            // console.log('new mem value:')
            
          } else {
            resultsArr[1].push(extractBilledDuration(element.message));
            // console.log('no new memval')
            // console.log(resultsArr[1])
          }
        }
      }
      if (!resultsArr[1] && attempts < 5) {
        attempts++;
        const length = events.length - 1;
        await wait(5000);
        

        const command = new GetLogEventsCommand(params);
        const newEvents = await cloudwatchlogs.send(command);
        const newEventsEvents = newEvents.events;
        console.log("insufficient events! waiting 5sec");
        console.log("attempts: ", attempts);
        if (newEventsEvents) {
        resultsArr = await seekReportsRecursively(
          newEventsEvents.slice(length),
          soughtResults,
          params,
          resultsArr,
          attempts
        );
        }
        else {
            console.log('UHHHHHHH')
        }
        return resultsArr;
      } else if (!resultsArr[1] && attempts >= 5) {
        console.log("error! log file contained no valid end reports");
        console.log("resultsArr is: ");
        console.log(resultsArr);
        return resultsArr;
      } else if (resultsArr[1].length >= soughtResults) return resultsArr;
      else if (resultsArr[1].length < soughtResults && attempts < 5) {
        await wait(5000);
        attempts++;
        const length = events.length - 1;
       
        const command = new GetLogEventsCommand(params);
        const newEvents = await cloudwatchlogs.send(command);
        const newEventsEvents = newEvents.events;
        console.log("insufficient events! waiting 5sec");
        console.log("valid reports durations:");
        console.log(resultsArr[1]);
        console.log("attempts: ", attempts);
        if (newEventsEvents) {
        resultsArr = await seekReportsRecursively(
          newEventsEvents.slice(length),
          soughtResults,
          params,
          resultsArr,
          attempts
        );
        }
        else {
            console.log('Null log somehow started getting processed?')
        }
        return resultsArr;
      } else if (attempts >= 5) {
        console.log("Maximum attempts made. Proceeding to next memory value.");
        return resultsArr;
      }
    }


    const outputArr : Array<[number, number[]]> =  [];
    if (logStreams && logGroupName) {
    for (const element of logStreams) {
        if (element.logStreamName) {
      console.log("NEW LOG STREAM");
      console.log(element.logStreamName);
      outputArr.push(
        await getFunctionLogs(logGroupName, element.logStreamName)
      );
        }
        else {
          const error1: CustomError = new Error('Error with reading logStream Name. This should not happen.');
          error1.status = 512; 
          error1.requestDetails = { body: request.body }; 
          return next(error1);
        }
    }

    outputArr.forEach((element) => {
      if (Array.isArray(element)) {
        console.log(element[0]);
      }
    });
    const billedDurationOutput = calculateMedianObject(outputArr);
    const costOutput = calculateCosts(billedDurationOutput);
    const trueOutputObject = {
      billedDurationOutput,
      costOutput
    }
    response.locals.output = trueOutputObject;
}
else {
  const error1: CustomError = new Error('Error with reading logStream Name or logGroup name. This should not happen.');
  error1.status = 512; 
  error1.requestDetails = { body: request.body }; 
  return next(error1);
}

    return next();
  },

};

function getFunctionARN(arn) {
 // console.log('arn is ' + arn)
  const arnParts = arn.split(":");
  const functionName = arnParts[arnParts.length - 1];
  return functionName;
}

function extractBilledDuration(inputString) {
  const attributes = inputString.split("\t");

  for (const attr of attributes) {
    if (attr.startsWith("Billed Duration")) {
      const billedDuration = attr.split(": ")[1];
      const numericValue = parseFloat(billedDuration); // Extracting only the numeric part
      return numericValue; // Return the numeric value without the unit
    }
  }

  return null; // Return null if billed duration is not found
}

function extractMemorySize(message) {
  const segments = message.split("\t");
  let memorySize;

  segments.forEach((segment) => {
    const [key, value] = segment.split(": ");

    if (key.trim() === "Memory Size") {
      memorySize = value.replace(" MB", "").trim();
    }
  });

  return parseInt(memorySize);
}

function getRegionFromARN(arn) {
  const arnParts = arn.split(':');
  if (arnParts.length >= 4) {
      return arnParts[3];
  } else {
      return null;
  }
}
function calculateMedianObject(arr) {
  console.log(arr)
  const result = {};

  arr.forEach((item) => {
    if (!Array.isArray(item) || item === null) return;

    const [key, values] = item;
    if (!Array.isArray(values)) return;

    // Remove the first value (cold-start outlier)
    const filteredValues = values.slice(1);

    // Sort the values
    const sortedValues = filteredValues.sort((a, b) => a - b);

    let median;
    const length = sortedValues.length;
    if (length === 0) {
      median = null;
    } else if (length % 2 === 0) {
      median = (sortedValues[length / 2 - 1] + sortedValues[length / 2]) / 2;
    } else {
      median = sortedValues[Math.floor(length / 2)];
    }

    result[key] = median;
  });

  return result;
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
      const newValue = megabytesToGigabytes * millisecondsToSeconds * 0.0000166667*1000;
      newObj[Number(key)] = newValue;
    }
  }

  return newObj;
}



export default lambdaController;
