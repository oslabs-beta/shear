import {PutItemCommand,GetItemCommand,DynamoDBClient} from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv'; 
import {Express, Request, Response, NextFunction} from 'express';
import { marshall } from "@aws-sdk/util-dynamodb";
import https from "https";
import AdmZip from "adm-zip"
import { LambdaClient, GetFunctionCommand }  from "@aws-sdk/client-lambda"

  const input = {
    FunctionName: "arn:aws:lambda:us-west-1:066290895578:function:findPrime", // required
  };

  dotenv.config(); 
  const config = {
    credentials: { 
      accessKeyId: process.env.ACC_KEY, // Your access key ID
      secretAccessKey: process.env.SEC_KEY, // Your secret access key
    },
    region: process.env.REGION, // Your AWS region
  }
  const DBClient = new DynamoDBClient(config);
  const lambdaClient = new LambdaClient(config);

export async function getLambdaLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  
  const { ARN } = req.body;
  if (ARN.length == 0){
    return next(new Error)
  }
  try
  {
    const query = {
      "Key": {
        "lambdaARN": {
          "S": ARN
        },
      },
      "TableName": "AWSPowerTuning"
    };
    const command = new GetItemCommand(query);
    const response = await DBClient.send(command);
    console.log(response,"RESPONSE FROM GETLAMBDALOGS")
    res.locals.output = response.Item
    return next()
  }
    catch(e){
        console.log(e)
        return next(e)
    }
}

export async function addLambdaLog (req: Request, res: Response, next: NextFunction): Promise<void> {
    const {ARN, memoryArray, output,payload } = res.locals;
  
    // error handling for res.locals
    console.log(ARN)
    console.log(memoryArray)
    console.log(output,'OUTPUT FROM LAMBDA')
    console.log(payload)
    try
    { 
      const item = {
        lambdaARN: ARN,
        functionName: "testFunction2",
        memoryArr: memoryArray,
        result: output,
        payload: payload
        // functionDefinition: getFuncDef(input)
      };

      const q = {
          TableName: "AWSPowerTuning",
          Item: marshall(item)
      };

      const command = new PutItemCommand(q);
      const response = await DBClient.send(command);

      return next()
    }
      catch(e){
        console.log(e)
        return next(e)
      }

}


const getFuncDef = async (input) => {
  const command = new GetFunctionCommand(input);
  const response = await lambdaClient.send(command);
  const presignedUrl = response.Code.Location;

  https
    .get(presignedUrl, (response) => {
      const chunks = [];

      response.on("data", (chunk) => {
        console.log(chunk);
        chunks.push(chunk);
      });

      response.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries(); 

        zipEntries.forEach((zipEntry) => {
          if (!zipEntry.isDirectory) {
           
            const result = zipEntry.getData().toString("utf8")
            return result
          }
        });
      });
    })
    .on("error", (error) => {
      console.error("Error: ", error);
    });
};






  

  
