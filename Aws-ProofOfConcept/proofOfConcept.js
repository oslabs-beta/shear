//import { createInterface } from "readline/promises";
import {
    CloudWatchLogs,
  } from "@aws-sdk/client-cloudwatch-logs";

import { LambdaClient, InvokeCommand, PublishVersionCommand, UpdateFunctionConfigurationCommand} from "@aws-sdk/client-lambda";


const lambdaClient = new LambdaClient({region: 'us-east-2'})
const cloudwatchlogs = new CloudWatchLogs()

const functionName = 'createFuncTestFunc';
const functionARN = 'arn:aws:lambda:us-east-2:408324777629:function:createFuncTestFunc'
const memoryArray = [132, 133, 134]


async function createNewVersionsFromMemoryArrayAndInvoke(inputArr) {

    try {
        const publishVersionParams = {
            FunctionName: functionARN,
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
              await wait(5000);
              invokeSpecificVersion(updatedFunction.Version)
              await wait(5000);
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
      startFromHead: true
    };
  
    try {
      const logEvents = await cloudwatchlogs.getLogEvents(params);
      // Process and view log events
      console.log('Log Events:', logEvents.events);
      console.log('final event: ' )
      console.log(logEvents.events[logEvents.events.length-1])
      return (extractBilledDuration(logEvents.events[logEvents.events.length-1].message));
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }
  

  async function invokeSpecificVersion(version) {
    try {
      const invokeParams = {
        FunctionName: functionARN,
        Qualifier: version, 
       
      };
  
      const data = await lambdaClient.send(new InvokeCommand(invokeParams));
      return data;
    } catch (error) {
      console.error('Error invoking specific version:', error);
    }
  }

  
  
  async function getLogStreams(logGroupName) {
    const params = {
      logGroupName: logGroupName,
      orderBy: 'LastEventTime',
      limit: 3,
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
      console.log('Log Groups:', logGroups.logGroups);
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

await createNewVersionsFromMemoryArrayAndInvoke(memoryArray);
const logGroupName = await getLogGroupsNew(functionName);
const logStreams = await getLogStreams(logGroupName);
const outputArr = [];
for (const element of logStreams) {
    outputArr.push(await getFunctionLogs(logGroupName, element.logStreamName))
 }
 console.log(outputArr)