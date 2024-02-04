import express, { Request, Response } from 'express';
export const router = express.Router();
import lambdaController from './controllers/lambdaController.js'
import {getLambdaLogs, addLambdaLog} from "./controllers/dbController.js"
import { EventEmitter } from 'events';

export const myEventEmitter = new EventEmitter();

router.get('/LambdaWorkflowSSE', (req: Request, res: Response): void => {
    
   
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify({ message: data })}\n\n`)
    }

   myEventEmitter.on('update', sendUpdate )
   
//    console.log(myEventEmitter.eventNames())
    req.on('close', () => {
        myEventEmitter.off('update', sendUpdate);
        console.log('Client connection closed');
    });
});

router.post('/getLambdaLogs', lambdaController.shear, (req: Request, res: Response): void => {
    res.status(200).json(res.locals.output)
})

// Executing "step function workflow"
router.post("/executeLambdaWorkflow", lambdaController.shear, addLambdaLog, (req: Request, res: Response): void => {
    console.log(req.body)
    res.status(200).json(res.locals.output)
})







