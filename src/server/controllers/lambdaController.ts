import { CloudWatchLogs, DescribeLogStreamsCommand, DescribeLogGroupsCommand, GetLogEventsCommand, OrderBy} from "@aws-sdk/client-cloudwatch-logs";

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

    //setup for all the AWS work we're going to do.
    const lambdaClient = new LambdaClient({ region: "us-east-1" });
    const cloudwatchlogs = new CloudWatchLogs({ region: "us-east-1"});
    
    const functionName = getFunctionARN(request.body.ARN);
    const functionARN = request.body.ARN;
    const memoryArray = request.body.memoryArray;
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
        console.error("Error invoking specific version:", error);
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
        limit: 4,
        descending: true,
      };

      try {
        const command = new DescribeLogStreamsCommand(params)
        const logStreams = await cloudwatchlogs.send(command);
        //console.log('Log Streams:', logStreams.logStreams);
       
        return logStreams.logStreams;
        

      } catch (error) {
        console.error("Error fetching log streams:", error);
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
        console.error("Error fetching log groups:", error);
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
            console.log('No Log Stream Name - some kind of data issue')
        }
    }

    outputArr.forEach((element) => {
      if (Array.isArray(element)) {
        console.log(element[0]);
      }
    });

    response.locals.output = outputArr;
}
else {
    console.log('No log streams found - check Function Name')
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
export default lambdaController;
