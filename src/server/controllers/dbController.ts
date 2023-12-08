import {PutItemCommand,GetItemCommand,DynamoDBClient} from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv'; 
import {Express, Request, Response, NextFunction} from 'express';
import { marshall } from "@aws-sdk/util-dynamodb";

dotenv.config(); 

  const client = new DynamoDBClient({
    credentials: { 
      accessKeyId: process.env.ACC_KEY, // Your access key ID
      secretAccessKey: process.env.SEC_KEY, // Your secret access key
    },
    region: process.env.REGION, // Your AWS region
  });
  

export async function getLambdaLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  
  const { ARN } = req.body;
  try
  {
    const query = {
      "Key": {
        "funcName": {
          "S": ARN
        },
      },
      "TableName": "lambdaLogs"
    };
    const command = new GetItemCommand(query);
    const response = await client.send(command);
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
    const {ARN, memoryArray, output, cost } = res.locals;
    try
    { 
    
      const item = {
        funcName: ARN,
        memoryArr: memoryArray,
        result: output,
        constPerThousand: cost
    };

      const q = {
          TableName: "lambdaLogs",
          Item: marshall(item)
      };

      const command = new PutItemCommand(q);
      const response = await client.send(command);
      return next()
    }
      catch(e){
        console.log(e)
        return next(e)
      }

}

  

  
