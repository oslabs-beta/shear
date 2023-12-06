//import { createInterface } from "readline/promises";
import {
  CloudWatchLogs,
} from "@aws-sdk/client-cloudwatch-logs";

import { LambdaClient, InvokeCommand, PublishVersionCommand, UpdateFunctionConfigurationCommand} from "@aws-sdk/client-lambda";

import {fromUtf8} from '@aws-sdk/util-utf8-node'
const lambdaClient = new LambdaClient({region: 'us-east-2'})
const cloudwatchlogs = new CloudWatchLogs()

const functionName = 'calculateClassicalPrimes';
const functionARN = 'arn:aws:lambda:us-east-2:408324777629:function:calculateClassicalPrimes'
const memoryArray = [128, 256, 512]
const now2 = new Date();
const now = now2.getTime();
const payloadObj = {
startRange: 1,
endRange: 2000,
xPrimes: 168
}
const payloadBlob = fromUtf8(JSON.stringify(payloadObj))

async function createNewVersionsFromMemoryArrayAndInvoke(inputArr, arn) {

  try {
      const publishVersionParams = {
          FunctionName: arn,
        };

       for (const element of inputArr){

          const newVersion = await lambdaClient.send(new PublishVersionCommand(publishVersionParams));
          //console.log('new version created')
          const updateConfigParams = {
              FunctionName: functionARN,
              MemorySize: element,
              Description: 'New version with ' + element + ' MB of memory',
              Qualifier: newVersion.Version 
            };
            const updatedFunction = await lambdaClient.send(new UpdateFunctionConfigurationCommand(updateConfigParams));
            console.log('New version created:', updatedFunction.Version);
            await wait(2000);
            await invokeSpecificVersion(updatedFunction.Version)
            await invokeSpecificVersion(updatedFunction.Version)
            await invokeSpecificVersion(updatedFunction.Version)
            await wait(2000);
        }

  } catch (error) {
      console.error('Error creating new version and updating memory size from Array:', error);
  }

}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function getFunctionLogs(logGroupName, logStreamName) {
  const params = {
    logGroupName: logGroupName,
    logStreamName: logStreamName,
    startFromHead: true,
    startTime: now

  };

  try {
    const logEvents = await cloudwatchlogs.getLogEvents(params);
    // Process and view log events
    //console.log('Log Events:', logEvents.events);
    //console.log('final event: ' )

    //OK instead, we need to look over EVERY event, looking for ones whose message field starts with REPORT
    //OK actually.... due to the time delay before log events become readable.... we might need to do this a little differently.
    //solution:
    //start with a log stream. look through it, looking for enough REPORT events. if there aren't enough, wait for 5 seconds, then resume the search starting from the index we ended at. if this takes more than 30 secs, bail and put null in the array.

    // const results = outputObj;
    // for (const element of logEvents.events) {
    //   // console.log(element)
    //   // console.log('is element')
    //   if (element.message.startsWith('REPORT')) {
    //     console.log(element.message)
        
    //     const memVal = extractMemorySize(element.message)
    //     if (!results[memVal]) {
    //       results[memVal] = [extractBilledDuration(element.message)]
    //     }
    //     else {
    //       results[memVal].push(extractBilledDuration(element.message))
    //     }
    //   }
    // }
    // return results;
    // // }
    // // console.log(logEvents.events[logEvents.events.length-1])
    // // return ([ extractMemorySize(logEvents.events[logEvents.events.length-1].message), extractBilledDuration(logEvents.events[logEvents.events.length-1].message)]);

    // const results = outputObj;
    // const numOfReportsDesired = memoryArray.length;
    // let attempts = 0;
    // let numOfReports = 0;
     let logEventsEvents = logEvents.events;
    if (logEventsEvents.length == 1) return null;
    // while (numOfReports < numOfReportsDesired && attempts < 5) {
    //   for (const element of logEvents.events) {
    //       // console.log(element)
    //       // console.log('is element')
    //       if (element.message.startsWith('REPORT')) {
    //         console.log(element.message)
    //         numOfReports++;
    //         const memVal = extractMemorySize(element.message)
    //         if (!results[memVal]) {
    //           results[memVal] = [extractBilledDuration(element.message)]
    //         }
    //         else {
    //           results[memVal].push(extractBilledDuration(element.message))
    //         }
    //       }
    //     }
    //   if (numOfReports < numOfReportsDesired) {
    //     wait(5000)
    //     console.log('insufficient events! waited 5')
    //     logEventsEvents = logEventsEvents.slice(logEventsEvents.length)
    //   }
    //   attempts++;
    // }


  
    //   for (const element of logEventsEvents) {
    //       // console.log(element)
    //       // console.log('is element')
    //       if (element.message.startsWith('REPORT')) {
    //         console.log(element.message)
    //         numOfReports++;
    //         const memVal = extractMemorySize(element.message)
    //         if (!results[memVal]) {
    //           results[memVal] = [extractBilledDuration(element.message)]
    //         }
    //         else {
    //           results[memVal].push(extractBilledDuration(element.message))
    //         }
    //       }
    //     }
    //   if (numOfReports < numOfReportsDesired) {
    //     wait(5000)
    //     console.log('insufficient events! waited 5')
    //     logEventsEvents = logEventsEvents.slice(logEventsEvents.length)
    //   }
    //   attempts++;
    
    // return results;
    const outputArr = []
    outputArr.push (await seekReportsRecursively(logEventsEvents, memoryArray.length, params))
    return outputArr
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
}

async function seekReportsRecursively(events, soughtResults, params, resultsArr = [], attempts = 0) {
  for (const element of events) {
    if (element.message.startsWith('REPORT')) {
      //console.log('Report found!')
      if (resultsArr.length == 0) {
        resultsArr.push(extractMemorySize(element.message))
        resultsArr.push([extractBilledDuration(element.message)])
        // console.log('new mem value:') 
        // console.log(resultsArr[0])
        // console.log(resultsArr[1])
      }
      else {
        resultsArr[1].push(extractBilledDuration(element.message))
        // console.log('no new memval')
        // console.log(resultsArr[1])
      }

    }
  }
if (!resultsArr[1]&& attempts < 5) {
  attempts++
  const length = events.length-1;
  const newEvents = await cloudwatchlogs.getLogEvents(params);
  const newEventsEvents = newEvents.events;
  console.log('insufficient events! waiting 5sec')
  console.log('attempts: ', attempts)
  await wait(5000)
  resultsArr = await seekReportsRecursively(newEventsEvents.slice(length), soughtResults, params, resultsArr, attempts)
  return resultsArr
}
else if (!resultsArr[1] && attempts >= 5) {
  console.log('error!')
  console.log('resultsArr is: ' )
  console.log(resultsArr)
  return resultsArr;
}
else if (resultsArr[1].length >= soughtResults) return resultsArr
else if (resultsArr[1].length < soughtResults && attempts < 5) {
  attempts++
  const length = events.length-1;
  const newEvents = await cloudwatchlogs.getLogEvents(params);
  const newEventsEvents = newEvents.events;
  console.log('insufficient events! waiting 5sec')
  console.log('valid reports durations:')
  console.log(resultsArr[1])
  console.log('attempts: ', attempts)
  await wait(5000)
  resultsArr = await seekReportsRecursively(newEventsEvents.slice(length), soughtResults, params, resultsArr, attempts)
  return resultsArr
}
else if(attempts >= 5) {
  console.log('max attempts reached! qq!')
  return resultsArr
}
}

async function invokeSpecificVersion(version) {
  try {
    const invokeParams = {
      FunctionName: functionARN,
      Qualifier: version, 
      Payload: payloadBlob
    };

    const data = await lambdaClient.send(new InvokeCommand(invokeParams));
    console.log('data:')
    console.log(data.$metadata.requestId)
    return data;
  } catch (error) {
    console.error('Error invoking specific version:', error);
  }
}



async function getLogStreams(logGroupName) {
  const params = {
    logGroupName: logGroupName,
    orderBy: 'LastEventTime',
    limit: 4,
    descending: true,
  };

  try {
    const logStreams = await cloudwatchlogs.describeLogStreams(params);
    //console.log('Log Streams:', logStreams.logStreams);
    return logStreams.logStreams;
  } catch (error) {
    console.error('Error fetching log streams:', error);
  }
}


async function getLogGroupsNew(funcName) {
  try {
    const logGroups = await cloudwatchlogs.describeLogGroups({logGroupNamePattern: funcName});
    //console.log('Log Groups:', logGroups.logGroups);
    return logGroups.logGroups[0].logGroupName;
  } catch (error) {
    console.error('Error fetching log groups:', error);
  }
}

function extractBilledDuration(inputString) {
  const attributes = inputString.split('\t');

  for (let attr of attributes) {
      if (attr.startsWith('Billed Duration')) {
          const billedDuration = attr.split(': ')[1];
          const numericValue = parseFloat(billedDuration); // Extracting only the numeric part
          return numericValue; // Return the numeric value without the unit
      }
  }
  
  return null; // Return null if billed duration is not found
}

function extractMemorySize(message) {
const segments = message.split('\t');
let memorySize = null;

segments.forEach(segment => {
  const [key, value] = segment.split(': ');

  if (key.trim() === 'Memory Size') {
    memorySize = value.replace(' MB', '').trim();
  }
});

return parseInt(memorySize);
}



await createNewVersionsFromMemoryArrayAndInvoke(memoryArray, functionARN);
await wait(5000)
const logGroupName = await getLogGroupsNew(functionName);
const logStreams = await getLogStreams(logGroupName);

const outputArr = []
for (const element of logStreams) {
console.log('NEW LOG STREAM')
console.log(element.logStreamName)
outputArr.push(await getFunctionLogs(logGroupName, element.logStreamName))

}

outputArr.forEach((element) => {
if (Array.isArray(element)) {
console.log(element[0])
}
})
//  console.log(outputArr.sort())

//  const testArr = [ [ 256, 33 ], [ 128, 94 ], [ 512, 10 ] ];
//  console.log(testArr.sort((a, b) => a[0] - b[0]))

