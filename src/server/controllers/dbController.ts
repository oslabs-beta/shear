import {
	PutItemCommand,
	GetItemCommand,
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import { Express, Request, Response, NextFunction } from "express";
import { marshall } from "@aws-sdk/util-dynamodb";
import { LambdaClient } from "@aws-sdk/client-lambda";

const DBClient = new DynamoDBClient();

export async function getLambdaLogs(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { ARN } = req.body;
	if (ARN.length == 0) {
		return next(new Error());
	}
	try {
		const query = {
			Key: {
				lambdaARN: {
					S: ARN,
				},
			},
			TableName: "AWSPowerTuning",
		};
		const command = new GetItemCommand(query);
		const response = await DBClient.send(command);
		console.log(response, "RESPONSE FROM GETLAMBDALOGS");
		res.locals.output = response.Item;
		return next();
	} catch (e) {
		console.log(e);
		return next(e);
	}
}

export async function addLambdaLog(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { ARN, memoryArray, output, payload } = res.locals;
	// Add name above ^ for changes and change testFunction10 to use the variable
	if (
		!ARN.length ||
		!memoryArray.length ||
		!Object.values(output).length ||
		!Object.values(payload).length
	) {
		return next("Error in providing addLambdaLog params");
	}
	try {
		const item = {
			lambdaARN: ARN,
			functionName: "testFunction10",
			memoryArr: memoryArray,
			result: output,
			payload: payload,
		};

		const q = {
			TableName: "AWSPowerTuning",
			Item: marshall(item),
		};

		const command = new PutItemCommand(q);
		const response = await DBClient.send(command);

		return next();
	} catch (e) {
		if (e.name === "ResourceNotFoundException") {
			//I think there's a region issue in addition to the 'what if there is not a table?' issue
			console.warn("DynamoDB table not found. Item not added.");
			return next();
		} else {
			console.error(e);
			return next();
		}
	}
}

/**
 * This code below is for getting the function body, still a WIP
 */

// const lambdaClient = new LambdaClient(config);
// const input = {
//   FunctionName: "arn:aws:lambda:us-west-1:066290895578:function:findPrime", // required
// };

// const getFuncDef = async (input) => {
//   const command = new GetFunctionCommand(input);
//   const response = await lambdaClient.send(command);
//   const presignedUrl = response.Code.Location;

//   https
//     .get(presignedUrl, (response) => {
//       const chunks = [];

//       response.on("data", (chunk) => {
//         console.log(chunk);
//         chunks.push(chunk);
//       });

//       response.on("end", () => {
//         const buffer = Buffer.concat(chunks);
//         const zip = new AdmZip(buffer);
//         const zipEntries = zip.getEntries();

//         zipEntries.forEach((zipEntry) => {
//           if (!zipEntry.isDirectory) {

//             const result = zipEntry.getData().toString("utf8")
//             return result
//           }
//         });
//       });
//     })
//     .on("error", (error) => {
//       console.error("Error: ", error);
//     });
// };
