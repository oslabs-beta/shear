//import { createInterface } from "readline/promises";
import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";

import {
  LambdaClient,
  InvokeCommand,
  PublishVersionCommand,
  DeleteFunctionCommand,
  UpdateFunctionConfigurationCommand,
  ListVersionsByFunctionCommand,
} from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({
  credentials: {
    accessKeyId: "AKIAQ63Z6ZLNPV5PLQIJ", // Your access key ID
    secretAccessKey: "tcKZkISwecdAIppkN9x24ZSHfpiSWmnfcqoUtLEd", // Your secret access key
  },
  region: "us-west-1", // Your AWS region
});

const cloudwatchlogs = new CloudWatchLogs({
  credentials: {
    accessKeyId: "AKIAQ63Z6ZLNPV5PLQIJ", // Your access key ID
    secretAccessKey: "tcKZkISwecdAIppkN9x24ZSHfpiSWmnfcqoUtLEd", // Your secret access key
  },
  region: "us-west-1", // Your AWS region
});

const functionName = "fibSequence";
const functionARN =
  "arn:aws:lambda:us-west-1:066290895578:function:fibSequence";
const memoryArray = [132, 133, 134];

async function createNewVersionsFromMemoryArrayAndInvoke(inputArr) {
  try {
    const publishVersionParams = {
      FunctionName: functionARN,
    };

    for (const element of inputArr) {
      const newVersion = await lambdaClient.send(
        new PublishVersionCommand(publishVersionParams)
      );
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
      console.log(updatedFunction);
      await wait(5000);
      invokeSpecificVersion(updatedFunction.Version);
      await wait(5000);
      // deleteFunctionVersion(updatedFunction.Version);
      // await wait(5000);
    }
  } catch (error) {
    console.error(
      "Error creating new version and updating memory size from Array:",
      error
    );
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFunctionLogs(logGroupName, logStreamName) {
  const params = {
    logGroupName: logGroupName,
    logStreamName: logStreamName,
    startFromHead: true,
  };

  try {
    const logEvents = await cloudwatchlogs.getLogEvents(params);
    // Process and view log events
    console.log("Log Events:", logEvents.events);
    console.log("final event: ");
    console.log(logEvents.events[logEvents.events.length - 1]);
    return extractBilledDuration(
      logEvents.events[logEvents.events.length - 1].message
    );
  } catch (error) {
    console.error("Error fetching logs:", error);
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
    console.error("Error invoking specific version:", error);
  }
}
/**
 * Function to delete ALL versions associated with a Lambda function EXCEPT the latest version
 * Cannot delete the $LATEST version because it is still in use (You would need to delete the function itself)
 * @param {String} version
 */
async function deleteFunctionVersion(versionArr) {
  let i = 0;
  for (const v of versionArr) {
    if (i == 0) {
      i += 1;
      continue;
    }
    const invokeParams = {
      FunctionName: v,
      // Qualifier: version,
    };
    const command = new DeleteFunctionCommand(invokeParams);
    await lambdaClient.send(command);
    i += 1;
  }
}

/**
 * Returns an array of versions associated with a function
 * @param {string} arn
 * @returns {DataType[]}
 */
async function getFunctionVersions(arn) {
  const input = {
    FunctionName: arn,
  };
  const command = new ListVersionsByFunctionCommand(input);
  const response = await lambdaClient.send(command);
  const res = response.Versions;
  const versionArr = [];
  for (const v of res) {
    versionArr.push(v.FunctionArn);
  }
  return versionArr;
}

async function getLogStreams(logGroupName) {
  const params = {
    logGroupName: logGroupName,
    orderBy: "LastEventTime",
    limit: 3,
    descending: true,
  };

  try {
    const logStreams = await cloudwatchlogs.describeLogStreams(params);
    //console.log('Log Streams:', logStreams.logStreams);
    return logStreams.logStreams;
  } catch (error) {
    console.error("Error fetching log streams:", error);
  }
}

async function getLogGroupsNew(funcName) {
  try {
    const logGroups = await cloudwatchlogs.describeLogGroups({
      logGroupNamePattern: funcName,
    });
    console.log("Log Groups:", logGroups.logGroups);
    return logGroups.logGroups[0].logGroupName;
  } catch (error) {
    console.error("Error fetching log groups:", error);
  }
}

function extractBilledDuration(inputString) {
  const attributes = inputString.split("\t");

  for (let attr of attributes) {
    if (attr.startsWith("Billed Duration")) {
      const billedDuration = attr.split(": ")[1];
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
  outputArr.push(await getFunctionLogs(logGroupName, element.logStreamName));
}
console.log(outputArr);
