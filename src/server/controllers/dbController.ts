import {PutItemCommand,GetItemCommand,DynamoDBClient} from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv'; 
import {Express, Request, Response, NextFunction} from 'express';

dotenv.config(); 

  const client = new DynamoDBClient({
    credentials: { 
      accessKeyId: "AKIAQ63Z6ZLNPV5PLQIJ", // Your access key ID
      secretAccessKey: "tcKZkISwecdAIppkN9x24ZSHfpiSWmnfcqoUtLEd", // Your secret access key
    },
    region: "us-west-1", // Your AWS region
  });
  

export async function getLambdaLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { ARN } = req.body;
  try
  {
      const query = {
        "Key": {
          "funcName": {
            "S": "func1"
          },
        },
        "TableName": "lambdaLogs"
      };
    const command = new GetItemCommand(query);
    const response = await client.send(command);
    console.log(response,'response from getLambdaLog')
    return next()
  }
    catch(e){
        console.log(e)
        return next(e)
    }
}

export async function addLambdaLog (req: Request, res: Response, next: NextFunction): Promise<void> {
    const {ARN, memoryArray, lambdaFlowResult } = res.locals;
    try
    { 
        const query = {
        "Item": {
          "funcName": {
            "S": `${ARN}`
          },
          "memoryArr":{
            "NS":`${memoryArray}`
          },
          "result":{

          },

          "TableName": "lambdaLogs"
          
        }
      } 
      const command = new PutItemCommand(query);
      const response = await client.send(command);
      console.log(response,'response from addLambdaLog')
      return next()
    }
      catch(e){
        console.log(e)
        return next(e)
      }

}

  

  
